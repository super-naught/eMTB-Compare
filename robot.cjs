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
  // --- EVIL ---
  {
    name: "Evil",
    urls: [
      "https://evil-bikes.com/products/epocalypse"
    ],
    models: ["Epocalypse"],
    builds: ["X0 Eagle Transmission", "Eagle 90 Transmission"]
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
    builds: ["M-LTD", "M-Team", "M10", "M20", "H10", "H20", "H30", "10", "20", "30", "40"]
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
      "https://www.propain-bikes.com/us/products/bikes/?filter_ebikes=yes&query_type_ebikes=or"
    ],
    models: ["Sresh CF", "Ekano 2 AL", "Ekano 2 CF"],
    builds: ["Base", "Performance", "Pro", "Ultimate", "Factory", "Ultimate Enduro"]
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
    builds: ["900 SL", "900 Tuned", "900", "910", "920"]
  },
  // --- SPECIALIZED ---
  {
    name: "Specialized",
    urls: [
      "https://www.specialized.com/us/en/shop/bikes/electric-bikes/electric-mountain-bikes"
    ],
    models: ["Turbo Levo 4", "Turbo Levo SL", "Turbo Kenevo SL", "Turbo Kenevo"],
    builds: ["S-Works", "Pro", "Expert", "Comp", "Comp Alloy", "Alloy"]
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
      
      const page = await browser.newPage();
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(5000); 
        const pageText = await page.evaluate(() => document.body.innerText);
        
        // Dynamically build the AI Prompt for this specific brand
        const prompt = `
          I am giving you text from the ${brand.name} e-MTB page. 
          Find the current sale prices for the following models and their builds.

          Match the models EXACTLY to these names:
          ${brand.models.map(m => `- "${m}"`).join('\n')}

          Match the builds EXACTLY to these names:
          ${brand.builds.map(b => `- "${b}"`).join('\n')}
          
          CRITICAL RULES:
          1. Return WHOLE NUMBERS ONLY for the price (e.g., 15399).
          2. If there are multiple listings for the same model and build, only return the LOWEST price. Do not return duplicate combinations.
          
          Return a JSON array of objects with "model", "build", and "price".
          Example: [{"model": "${brand.models}", "build": "${brand.builds}", "price": 9999}]
          
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