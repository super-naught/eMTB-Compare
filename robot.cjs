require('dotenv').config({ path: '.env.local' });
const { chromium } = require('playwright');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// ❌ SUPABASE IS GONE. 
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

// ✅ NEW: Point directly to your God File
const BIKE_DATA_PATH = path.join(__dirname, 'src', 'bikeData.ts');

// 1. The Sleep Timer to protect your Free Tier API limits
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 2. The Master List of Brands (Keep your existing array here)
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

// --- NEW FILE SYSTEM UPDATER FUNCTION ---
function updatePriceInGodFile(brandName, modelName, buildName, newPrice) {
  try {
    // 1. Read the current file
    let fileContent = fs.readFileSync(BIKE_DATA_PATH, 'utf-8');

    // 2. We use a regex trick to find the exact model and build block, then replace the price.
    // This looks for the model name, then the build name, then the price line.
    const searchPattern = new RegExp(
      `(name:\\s*["']${modelName}["'][\\s\\S]*?name:\\s*["']${buildName}["'][\\s\\S]*?price:\\s*)(\\d+)`,
      'i'
    );

    const match = fileContent.match(searchPattern);

    if (match) {
      const oldPrice = parseInt(match[2]);
      
      if (oldPrice !== newPrice) {
        // Replace the old price with the new price
        fileContent = fileContent.replace(searchPattern, `$1${newPrice}`);
        
        // 3. Save the file back!
        fs.writeFileSync(BIKE_DATA_PATH, fileContent, 'utf-8');
        
        if (newPrice < oldPrice) {
          console.log(`      🚨 PRICE DROP SAVED: ${modelName} [${buildName}] -> Was $${oldPrice}, Now $${newPrice}!`);
        } else {
          console.log(`      📈 PRICE INCREASE SAVED: ${modelName} [${buildName}] -> Was $${oldPrice}, Now $${newPrice}`);
        }
      } else {
        console.log(`      ✅ VERIFIED (No Change): ${modelName} [${buildName}] -> $${newPrice}`);
      }
    } else {
      console.log(`      ⚠️ COULD NOT FIND IN FILE: ${modelName} [${buildName}]. Check spelling in bikeData.ts.`);
    }
  } catch (error) {
    console.error(`      ❌ FILE SYSTEM ERROR: Could not update bikeData.ts`, error.message);
  }
}

// --- MAIN SCRAPER FUNCTION ---
async function runScraper() {
  console.log("🤖 Starting eMTB Price Scraper...");
  const browser = await chromium.launch({ headless: true });

  for (const brand of BRANDS_TO_SCRAPE) {
    console.log(`\n🔍 Checking ${brand.name}...`);

    for (const url of brand.urls) {
      const page = await browser.newPage();
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        // Get page text for Gemini
        const pageText = await page.evaluate(() => document.body.innerText);
        
        // Your existing Gemini Prompt Logic
        const prompt = `Analyze this webpage text for an e-bike manufacturer. 
        Find the exact current prices for the following models: ${brand.models.join(', ')} 
        and these specific builds: ${brand.builds.join(', ')}.
        Return a strict JSON array like: [{ "model": "Timp Peak", "build": "Pro", "price": 6500 }]. 
        Only return the JSON. No other text.
        
        Webpage text: ${pageText.substring(0, 15000)}`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim();
        
        // Clean up markdown block if Gemini adds it
        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        const scrapedData = JSON.parse(responseText);

        // Loop through Gemini's results and update the file
        for (const item of scrapedData) {
          updatePriceInGodFile(brand.name, item.model, item.build, item.price);
        }

      } catch (err) {
        console.error(`   ❌ Error scraping ${url}:`, err.message);
      } finally {
        await page.close();
      }
      
      console.log(`   🛑 Sleeping 10 seconds to keep Gemini API happy...`);
      await delay(10000);
    }
  }

  await browser.close();
  console.log("\n🏁 SCRAPE COMPLETE! Check your bikeData.ts file for updates.");
}

runScraper();