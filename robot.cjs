require('dotenv').config({ path: '.env.local' });
const { chromium } = require('playwright');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

// 1. The Sleep Timer to protect your Free Tier API limits
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 2. The Master List of Brands
const BRANDS_TO_SCRAPE = [
  // --- AMFLOW ---
  {
    name: "Amflow",
    urls: [
      "https://www.amflowbikes.com/product/amflow-pl-carbon?vid=169321"
    ],
    models: ["PL Carbon"],
    builds: ["Pro", "Standard"]
  },
  // --- ARI ---
  {
    name: "ARI",
    urls: [
      "https://aribikes.com/products/timp-peak",
      "https://aribikes.com/products/wire-peak",
      "https://aribikes.com/products/nebo-peak"
    ],
    models: ["Timp Peak", "Wire Peak", "Nebo Peak"],
    builds: ["Team", "Pro", "Elite", "Comp"]
  },
  // --- AVENTON ---
  {
    name: "Aventon",
    urls: [
      "https://www.aventon.com/products/ramblas-adv-ebike?variant=45003275239619"
    ],
    models: ["Ramblas ADV"],
    builds: ["Standard"]
  },
  // --- BULLS ---
  {
    name: "BULLS",
    urls: [
      "https://bullsbikesusa.com/collections/e-bikes?filter.v.price.gte=&filter.v.price.lte=&filter.p.m.custom.bike_type=E-MTB+FULL+SUSPENSION"
    ],
    models: ["Copperhead EVO AM"],
    builds: ["4 750", "3 750", "1 750"]
  },
  // --- CANNONDALE ---
  {
    name: "Cannondale",
    urls: [
      "https://www.cannondale.com/en-us/bikes/electric/e-mountain/moterra-neo",
      "https://www.cannondale.com/en-us/bikes/electric/e-mountain/moterra-sl",
      "https://www.cannondale.com/en-us/bikes/electric/e-mountain/moterra-neo-lt"
    ],
    models: ["Moterra Neo", "Moterra SL", "Moterra Neo LT"],
    builds: ["LAB71", "1", "2", "Carbon 2", "3", "4", "4+"]
  },
  // --- CANYON ---
  {
    name: "Canyon",
    urls: [
      "https://www.canyon.com/en-us/electric-bikes/electric-mountain-bikes/"
    ],
    models: ["Torque:ON", "Spectral:ON", "Spectral:ONfly", "Strive:ON"],
    builds: ["CF 9", "CF 8", "CF 7", "CF CLLCTV", "CFR", "CFR Underdog"]
  },
  // --- COMMENCAL ---
  {
    name: "Commencal",
    urls: [
      "https://www.commencal.com/us/en/search?cgid=bike-ebikes&cmnclredirect=true&lang=en_US"
    ],
    models: ["Meta Power SX 400", "Meta Power SX Avinox", "Meta Power SX 800"],
    builds: ["Signature AXS", "Essential", "Podium", "Signature", "RockShox", "Ride"]
  },
  // --- CRESTLINE ---
  {
    name: "Crestline",
    urls: [
      "https://crestlinebikes.com/current-bikes/"
    ],
    models: ["RS 181"],
    builds: ["Spectre Edition"]
  },
  // --- DEVINCI ---
  {
    name: "Devinci",
    urls: [
      "https://www.devinci.com/en/bikes/e-mountain/e-spartan-lite-gx-axs-12s-deep-olive/",
      "https://www.devinci.com/en/bikes/e-mountain/e-troylite-gx-axs-12s-night-crow/"
    ],
    models: ["E-Spartan Lite", "E-Troy Lite"],
    builds: ["GX AXS 12s", "Eagle 90 12s", "S1000 AXS 12s", "Eagle 70 12s"] 
  },
  // --- EVIL ---
  {
    name: "Evil",
    urls: [
      "https://evil-bikes.com/products/epocalypse"
    ],
    models: ["Epocalypse"],
    builds: ["X0 Eagle Transmission", "Eagle 90 Transmission"]
  },
  // --- FORBIDDEN ---
  {
    name: "Forbidden",
    urls: [
      "https://forbiddenbike.com/bikes/druid-lite/",
      "https://forbiddenbike.com/bikes/druid-core/",
    ],
    models: ["Druid CorE", "Druid LitE"],
    builds: ["CorE 1", "CorE 2", "CorE 3", "LitE 1", "LitE 2", "LitE 3"]
  },
  // --- GIANT ---
  {
    name: "Giant",
    urls: [
      "https://www.giant-bicycles.com/us/bikes-reign-advanced-eplus",
      "https://www.giant-bicycles.com/us/reign-eplus-2-2024",
      "https://www.giant-bicycles.com/us/talon-eplus",
      "https://www.giant-bicycles.com/us/bikes-stance-eplus-2027",
      "https://www.giant-bicycles.com/us/trance-x-advanced-eplus-el-0-20mph-2023"
    ],
    models: ["Reign Advanced E+", "Reign E+", "Talon E+", "Stance E+", "Trance X Advanced E+ Elite"],
    builds: ["0", "1", "2", "3"]
  },
  // --- MARIN ---
  {
    name: "Marin",
    urls: [
      "https://marinbikes.com/collections/emtb"
    ],
    models: ["Alpine Trail E", "Rift Zone E"],
    builds: ["E", "E1", "E2", "EL XR"]
  },
  // --- MONDRAKER ---
  {
    name: "Mondraker",
    urls: [
      "https://mondraker.com/us/en/light-e-mtb-mondraker",
      "https://mondraker.com/us/en/enduro-ebike",
      "https://mondraker.com/us/en/scree-all-you-need"
    ],
    models: ["Crafty", "Level", "Dune", "Chaser", "Crusher", "Sly", "Scree"],
    builds: ["Standard", "R", "RR", "RR SL", "XR", "Carbon", "Carbon R", "Carbon RR", "S", "S600"]
  },
  // --- NORCO ---
  {
    name: "Norco",
    urls: [
      "https://www.norco.com/bikes/e-mountain/e-trail/",
      "https://www.norco.com/bikes/e-mountain/e-all-mountain/",
      "https://www.norco.com/bikes/e-mountain/e-enduro/"
    ],
    models: ["Range VLT", "Range VLT CX", "Fluid VLT", "Sight VLT", "Sight VLT CX", "Sight VLT TQ"],
    builds: ["C1", "C2", "C3", "A1", "A2", "C1 130", "C1 140", "C2 140 Lyrik", "C2 140 Rhythm", "C2 140 Performance", "C3 140"]
  },
  // --- ORBEA ---
  {
    name: "Orbea",
    urls: [
      "https://www.orbea.com/us-en/ebikes/mountain/wild/cat",
      "https://www.orbea.com/us-en/ebikes/mountain/rise/cat",
      "https://www.orbea.com/us-en/ebikes/mountain/urrun/cat",
      "https://www.orbea.com/us-en/ebikes/mountain/keram-mtb/cat"
    ],
    models: ["Wild", "Rise", "Rise SL", "Urrun", "Keram"], 
    builds: ["M-LTD", "M-Team", "M10", "M20", "H10", "H20", "ST H20", "ST H30", "10", "20", "30", "40"]
  },
  // --- PIVOT ---
  {
    name: "Pivot",
    urls: [
      "https://www.pivotcycles.com/en-us/collections/electric?sortKey=PRICE&reverse=true&model=shuttle-sl",
      "https://www.pivotcycles.com/en-us/collections/shuttle-sl?sortKey=PRICE&reverse=true",
      "https://www.pivotcycles.com/en-us/collections/electric?sortKey=PRICE&reverse=true&model=shuttle-lt",
      "https://www.pivotcycles.com/en-us/collections/electric?sortKey=PRICE&reverse=true&model=shuttle-am"
    ],
    models: ["Shuttle SL", "Shuttle SL/AM", "Shuttle LT", "Shuttle AM"],
    builds: ["Ride", "Pro", "Team", "Pro NEO", "Team NEO"]
  },
  // --- POLYGON ---
  {
    name: "Polygon",
    urls: [
      "https://www.polygonbikes.com/us/collosus-ne-us/",
      "https://www.polygonbikes.com/us/collosus-te-us/",
      "https://www.polygonbikes.com/us/siskiu-te-us/"
    ],
    models: ["Collosus NE", "Collosus TE", "Siskiu TE"],
    builds: ["N9E", "N8E", "T9E", "T8E", "T7E", "T6E"]
  },
  // --- PROPAIN ---
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
  // --- REVEL ---
  {
    name: "Revel",
    urls: [
      "https://revelbikes.com/products/rerun-sram-eagle-90"
    ],
    models: ["Rerun"],
    builds: ["Treeline", "Summit"]
  },
  // --- RIDE1UP ---
  {
    name: "Ride1Up",
    urls: [
      "https://ride1up.com/product/trailrush/"
    ],
    models: ["Trailrush"],
    builds: ["Standard"]
  },
  // --- SALSA ---
  {
    name: "Salsa",
    urls: [
      "https://www.salsacycles.com/collections/ebikes"
    ],
    models: ["Notch", "Moraine"],
    builds: ["CUES 10", "Deore 12", "C Deore 12", "C GX Eagle Transmission"]
  },
  // --- SANTA CRUZ ---
  {
    name: "Santa Cruz",
    urls: [
      "https://www.santacruzbicycles.com/collections/heckler-sl",
      "https://www.santacruzbicycles.com/collections/bullit",
      "https://www.santacruzbicycles.com/collections/vala"
    ],
    models: ["Vala", "Bullit", "Heckler SL"], 
    builds: [
      "CC XX AXS RSV", "CC X0 AXS RSV", "C XT Di2", "C GX AXS", "C S", "C R", 
      "AL 70", "AL Deore", "Podium", "C 90", "C 70", "C Stout"
    ]
  },
  // --- SCOTT ---
  {
    name: "Scott",
    urls: [
      "https://www.scott-sports.com/us/en/products/bike-ebikes-mtb-trail-voltage-eride",
      "https://www.scott-sports.com/us/en/products/bike-ebikes-mtb-down-country-lumen-eride"
    ],
    models: ["Voltage eRIDE", "Lumen eRIDE"],
    builds: ["900 TR", "905", "900 SL", "900 Tuned", "910", "920"]
  },
  // --- SPECIALIZED ---
  {
    name: "Specialized",
    urls: [
      "https://www.specialized.com/us/en/shop/bikes/electric-bikes/electric-mountain-bikes"
    ],
    models: ["Turbo Levo 4", "Turbo Levo SL", "Turbo Kenevo SL", "Turbo Kenevo"],
    builds: ["S-Works", "Pro", "Expert", "Comp Carbon", "Comp Alloy", "Alloy"]
  },
  // --- TRANSITION ---
  {
    name: "Transition",
    urls: [
      "https://www.transitionbikes.com/Bikes/RegulatorCX",
      "https://www.transitionbikes.com/Bikes/RegulatorSX",
      "https://www.transitionbikes.com/Bikes/RepeaterPT",
      "https://www.transitionbikes.com/Bikes/Relay"
    ],
    models: ["Regulator CX", "Regulator SX", "Repeater PT", "Relay"],
    builds: ["XX AXS", "X0 AXS", "XT", "GX AXS", "PNW GX AXS", "NX", "Deore"]
  },
  // --- TREK ---
  {
    name: "Trek",
    urls: [
      "https://www.trekbikes.com/us/en_US/bikes/mountain-bikes/electric-mountain-bikes/c/B512/"
    ],
    models: ["Rail+", "Slash+", "Fuel EXe", "Powerfly FS", "Powerfly", "Marlin+"],
    builds: ["9.9 XX AXS", "9.9 X0 AXS", "9.8 GX AXS", "9.8 XT", "9.7", "8", "7", "6", "5", "4"]
  },
  // --- YETI ---
  {
    name: "Yeti",
    urls: [
      "https://yeticycles.com/en-us/bikes/lte/buy",
      "https://yeticycles.com/en-us/bikes/mte/buy",
      "https://yeticycles.com/en-us/bikes/160e-archive/buy"
    ],
    models: ["LTe", "MTe", "160E"],
    builds: ["T4 XX AXS Transmission", "T3 X0 AXS Transmission", "C2 90 Transmission", "C3", "C2", "T1"]
  },
];

async function runRobot() {
  console.log("🤖 Universal Robot starting...");
  const browser = await chromium.launch({ headless: true });
  
  // Give our robot a fake mustache so firewalls think it's a real human
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
  
  // Create Lookup Map from Database ONCE at the very beginning
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

  // 3. The Master Loop
  for (const brand of BRANDS_TO_SCRAPE) {
    console.log(`\n⚙️ Starting scrape for: ${brand.name}`);
    
    // The "Double Loop" to handle brands with multiple URLs
    for (const url of brand.urls) {
      console.log(`   📍 Visiting: ${url}`);
      
      const page = await context.newPage();
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        // --- 🇺🇸 THE REGION SELECTOR BYPASS ---
        // If there's a region pop-up (like on Forbidden or Transition), try to click "US" or "USA ($)"
        try {
          // Look for common US region buttons
          const usButton = await page.$('text="US"');
          const usaButton = await page.$('text="USA ($)"');
          
          if (usButton) {
            await usButton.click();
            console.log("   🇺🇸 Clicked 'US' Region Button!");
            await page.waitForTimeout(3000); // Wait for the USD prices to load
          } else if (usaButton) {
            await usaButton.click();
            console.log("   🇺🇸 Clicked 'USA ($)' Region Button!");
            await page.waitForTimeout(3000);
          }
        } catch (e) {
          // If there is no pop-up, just silently keep going!
        }

        // Mimic a human scrolling to trigger lazy-loaded bikes (Crucial for Orbea/Scott)
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
            }, 250); // Scroll down every 250ms
          });
        });
        
        await page.waitForTimeout(2000); // Wait 2 seconds for the final prices to pop in
        const pageText = await page.evaluate(() => document.body.innerText);
        
        // Let's peek at the text to ensure it's not just a giant Cookie Banner!
        console.log(`   📄 Page Text Snippet: ${pageText.substring(0, 150).replace(/\n/g, ' ')}...`);
        
        // Dynamically build the AI Prompt for this specific brand
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
          // Clean the JSON output
          const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
          const rawData = JSON.parse(jsonString);
          
          // Data Cleaner: Force whole numbers and keep lowest price
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
          
        } catch (e) {
          console.error("   ❌ Failed to parse JSON from AI for this page.");
          continue; // Skip the DB update and move to the next URL
        }

        // Surgical Database Sync
        for (const item of priceData) {
          const modelId = modelMap[item.model];
          if (!modelId) {
             console.log(`      ⚠️ SKIPPED: Model "${item.model}" not in DB.`);
             continue;
          }
          
          // 1. Fetch the current build from the database to check the old price
          const { data: currentBuilds, error: fetchError } = await supabase
            .from('builds')
            .select('id, price')
            .match({ name: item.build, model_id: modelId });
            
          if (fetchError) {
            console.error(`      ❌ Error fetching ${item.model} ${item.build}:`, fetchError.message);
            continue;
          }
          
          if (!currentBuilds || currentBuilds.length === 0) {
            console.log(`      ⚠️ SKIPPED: Build "${item.build}" for "${item.model}" not found in DB.`);
            continue;
          }
          
          const dbBuild = currentBuilds[0];
          const newPrice = item.price;
          
          // 2. Compare the prices and update if necessary
          if (dbBuild.price !== newPrice) {
            const { error: updateError } = await supabase
              .from('builds')
              .update({ price: newPrice })
              .eq('id', dbBuild.id);
              
            if (updateError) {
              console.error(`      ❌ DB ERROR: Failed to update ${item.model} [${item.build}]:`, updateError.message);
            } else {
              if (newPrice < dbBuild.price) {
                 console.log(`      🚨 PRICE DROP: ${item.model} [${item.build}] -> Was $${dbBuild.price}, Now $${newPrice}!`);
              } else {
                 console.log(`      📈 PRICE INCREASE: ${item.model} [${item.build}] -> Was $${dbBuild.price}, Now $${newPrice}`);
              }
            }
          } else {
            console.log(`      ✅ VERIFIED (No Change): ${item.model} [${item.build}] -> $${newPrice}`);
          }
        } 
        
      } catch (err) {
        console.error(`   ❌ Error scraping ${url}:`, err instanceof Error ? err.message : String(err));
      } finally {
        await page.close(); // Always close the tab when done
      }
      
      // The crucial rate-limit cooler!
      console.log(`   🛑 Sleeping 10 seconds to keep the AI API happy...`);
      await delay(10000);
    }
  }

  await browser.close();
  console.log("\n🤖 Universal Robot finished!");
}

runRobot();