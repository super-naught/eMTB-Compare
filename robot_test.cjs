require('dotenv').config({ path: '.env.local' });
const { chromium } = require('playwright');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 🎯 THE HIT LIST: Only the problematic brands
const BRANDS_TO_SCRAPE = [
{
    name: "Propain",
    urls: [
      "https://www.propain-bikes.com/us/products/config/sresh-sl/",
      "https://www.propain-bikes.com/us/product/bikes/trail/sresh-cf/",
      "https://www.propain-bikes.com/us/product/bikes/enduro/ekano-2-al/"
    ],
    models: ["Sresh SL", "Sresh CF", "Ekano 2 AL"],
    builds: ["Base", "Ultimate Enduro", "Factory", "Price2Ride", "Shred²", "Goldrush", "Signature Spec 1", "Signature Spec 2"] 
  },

];

async function runRobot() {
  console.log("🎯 Sniper Robot starting...");
  const browser = await chromium.launch({ headless: true });
  
  // Give our robot a fake mustache so firewalls think it's a real human on a Windows PC
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1'
    }
  });
  
  console.log("🚀 Fetching universal models from the database...");
  const { data: dbModels, error: modelsError } = await supabase.from('models').select('id, name');
  
  if (modelsError || !dbModels) {
    console.error("❌ Could not fetch models from database. Stopping.");
    await browser.close();
    return;
  }
  
  const modelMap = {};
  dbModels.forEach(m => { modelMap[m.name] = m.id; });

  const aiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  for (const brand of BRANDS_TO_SCRAPE) {
    console.log(`\n⚙️ Starting scrape for: ${brand.name}`);
    
    for (const url of brand.urls) {
      console.log(`   📍 Visiting: ${url}`);
      
      const page = await context.newPage(); // Use the stealthy context!
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        // Mimic a human scrolling to trigger lazy-loaded bikes
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 600;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              if (totalHeight >= scrollHeight - 300) {
                clearInterval(timer);
                resolve();
              }
            }, 250);
          });
        });
        
        await page.waitForTimeout(2000);
        const pageText = await page.evaluate(() => document.body.innerText);
        
        // Let's peek at the text to ensure it's not just a giant Cookie Banner!
        console.log(`   📄 Page Text Snippet: ${pageText.substring(0, 150).replace(/\n/g, ' ')}...`);
        
        const prompt = `
          I am giving you text from the ${brand.name} e-MTB page. 
          Find the current sale prices for the following models and their builds.

          MODELS TO FIND: ${brand.models.join(', ')}
          BUILDS TO FIND: ${brand.builds.join(', ')}
          
          CRITICAL RULES:
          1. Return WHOLE NUMBERS ONLY for the price (e.g., 15399).
          2. The website might combine the model and build names into one long string (e.g., "Orbea Wild M-LTD" or "SCOTT Voltage eRIDE 900 Tuned Bike"). You must figure out the price and separate them back into the exact "model" and "build" strings I provided above.
          3. If there are multiple listings for the same model and build, only return the LOWEST price.
          4. ONLY return a valid JSON array of objects with keys: "model", "build", "price".
          5. DO NOT include markdown formatting like \`\`\`json.
          6. DO NOT include any conversational text.
          7. If you cannot find any prices, return exactly this: []
          
          Example: [{"model": "${brand.models[0] || 'Model'}", "build": "${brand.builds[0] || 'Build'}", "price": 9999}]
          
          Text: ${pageText.substring(0, 25000)}
        `;

        const result = await aiModel.generateContent(prompt);
        const responseText = result.response.text();

        let priceData;
        try {
          const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
          const rawData = JSON.parse(jsonString);
          
          const uniqueMap = {};
          for (const item of rawData) {
            const roundedPrice = Math.round(item.price);
            const key = `${item.model}-${item.build}`;
            if (!uniqueMap[key] || roundedPrice < uniqueMap[key].price) {
              uniqueMap[key] = { ...item, price: roundedPrice };
            }
          }
          priceData = Object.values(uniqueMap);
          console.log(`   🔍 AI found ${priceData.length} prices.`);
          
          // Print them out so we can see what it found!
          if (priceData.length > 0) {
            priceData.forEach(p => console.log(`      Found: ${p.model} [${p.build}] -> $${p.price}`));
          } else {
             console.log(`      ⚠️ AI returned an empty array. No prices found matching your config.`);
          }
          
        } catch (e) {
          console.error("   ❌ Failed to parse JSON from AI for this page.");
          console.error("      Raw AI Output:", responseText.substring(0, 200) + "..."); // Peek at the error
          continue; 
        }

      } catch (err) {
        console.error(`   ❌ Error scraping ${url}:`, err instanceof Error ? err.message : String(err));
      } finally {
        await page.close();
      }
      
      console.log(`   🛑 Sleeping 5 seconds...`);
      await delay(5000); // Shorter delay for testing
    }
  }

  await browser.close();
  console.log("\n🎯 Sniper Robot finished!");
}

runRobot();