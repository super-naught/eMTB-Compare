require('dotenv').config({ path: '.env.local' });
const { chromium } = require('playwright');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

async function runRobot() {
  console.log("🤖 Robot starting... Visiting Specialized.com");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://www.specialized.com/us/en/shop/bikes/electric-bikes/electric-mountain-bikes", { 
    waitUntil: 'domcontentloaded', 
    timeout: 60000 
  });
  
  await page.waitForTimeout(5000); 

  const pageText = await page.evaluate(() => document.body.innerText);

  console.log("🧠 AI is analyzing the page for ALL Specialized models...");
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    I am giving you text from the Specialized E-MTB category page. 
    Find the current sale prices for the following models and their builds.

    Match the models to these EXACT names:
    - "Turbo Levo 4"
    - "Turbo Levo SL"
    - "Turbo Kenevo SL"
    - "Turbo Kenevo"

    Match the builds to these EXACT names:
    - "S-Works"
    - "Pro"
    - "Expert"
    - "Comp"
    - "Comp Alloy"
    - "Alloy"
    
    CRITICAL RULES:
    1. Return WHOLE NUMBERS ONLY for the price (e.g., 15399, NOT 15399.99).
    2. If there are multiple listings for the same model and build, only return the LOWEST price. Do not return duplicate combinations.
    
    Return a JSON array of objects with "model", "build", and "price".
    Example: [{"model": "Turbo Levo 4", "build": "S-Works", "price": 13999}]
    
    Text: ${pageText.substring(0, 25000)}
  `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  let priceData;
  try {
    const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const rawData = JSON.parse(jsonString);
    
    // --- THE DATA CLEANER: Round numbers and remove duplicates ---
    const uniqueMap = {};
    for (const item of rawData) {
      const roundedPrice = Math.round(item.price); // Force whole number
      const key = `${item.model}-${item.build}`;
      
      // Keep it if it's the first time seeing it, OR if it's cheaper than the previous one
      if (!uniqueMap[key] || roundedPrice < uniqueMap[key].price) {
        uniqueMap[key] = { ...item, price: roundedPrice };
      }
    }
    priceData = Object.values(uniqueMap);
    console.log("🧹 Cleaned & Deduplicated Prices:\n", priceData);

  } catch (e) {
    console.error("❌ Failed to parse JSON from AI. Raw output:", responseText);
    await browser.close();
    return;
  }

  console.log("🚀 Starting universal database sync...");

  const { data: models, error: modelsError } = await supabase
    .from('models')
    .select('id, name');

  if (modelsError || !models) {
    console.error("❌ Could not fetch models from database.");
    await browser.close();
    return;
  }

  const modelMap = {};
  models.forEach(m => { modelMap[m.name] = m.id; });

  for (const item of priceData) {
    const modelId = modelMap[item.model];

    if (!modelId) {
      console.log(`⚠️  SKIPPED: Model "${item.model}" not found in database.`);
      continue;
    }

    const { data, error } = await supabase
      .from('builds')
      .update({ price: item.price })
      .match({ 
        name: item.build, 
        model_id: modelId 
      })
      .select();

    if (error) {
      console.error(`❌ Error updating ${item.model} ${item.build}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`✅ SUCCESS: Updated ${item.model} [${item.build}] to $${item.price}`);
    } else {
      console.log(`⚠️  SKIPPED: No build named "${item.build}" found for ${item.model}.`);
    }
  }

  await browser.close();
  console.log("🤖 Universal Robot finished!");
}

runRobot();