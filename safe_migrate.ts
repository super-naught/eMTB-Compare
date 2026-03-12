import { createClient } from '@supabase/supabase-js'
import { eMTBData } from './src/bikeData'

// DOUBLE CHECK THESE VALUES FROM YOUR SUPABASE DASHBOARD
const SUPABASE_URL = 'https://vttixosswbxtreaobckz.supabase.co' 
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0dGl4b3Nzd2J4dHJlYW9iY2t6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQwMzI3MywiZXhwIjoyMDg3OTc5MjczfQ.BAOCn9Bt9dSC_Wl_6xNURS1mlxae5uJW0zgcrqn8sCk'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function migrate() {
  console.log("🚀 Starting Safe Migration...")

  for (const brandData of eMTBData) {
    // 1. Insert/Get Brand
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .upsert({ 
        name: brandData.brand, 
        logo_url: brandData.logo 
      }, { onConflict: 'name' })
      .select()
      .single()

    if (brandError) {
      console.error(`❌ Brand Error (${brandData.brand}):`, brandError.message)
      continue
    }

    console.log(`\n✅ Brand: ${brand.name}`)

    for (const modelData of brandData.models || []) {
      // 2. Insert/Get Model
      const { data: model, error: modelError } = await supabase
        .from('models')
        .upsert({
          brand_id: brand.id,
          name: modelData.name,
          image_url: modelData.image,
          suspension: modelData.suspension
        }, { onConflict: 'brand_id, name' })
        .select()
        .single()

      if (modelError) {
        console.error(`  ❌ Model Error (${modelData.name}):`, modelError.message)
        continue
      }

      console.log(`  🚲 Model: ${model.name}`)

      // --- THE FIX: Fetch existing builds FIRST so we don't overwrite live prices ---
      const { data: existingBuilds } = await supabase
        .from('builds')
        .select('id, name, price')
        .eq('model_id', model.id);

      // 3. Upsert Builds (Update specs, but PRESERVE live prices)
      const buildsToInsert = modelData.builds.map((build: any) => {
        // Look to see if this build already lives in the database
        const existingDbBuild = existingBuilds?.find(eb => eb.name === build.name);

        return {
          model_id: model.id,
          name: build.name,
          // THE MAGIC TRICK: Keep the DB price if it exists, otherwise use the God File price
          price: existingDbBuild ? existingDbBuild.price : build.price,
          msrp: build.msrp || build.price,
          material: build.material,
          motor: build.motor,
          torque: build.torque,
          battery: build.battery,
          fork: build.fork,
          shock: build.shock,
          drivetrain: build.drivetrain,
          brakes: build.brakes,
          wheelset: build.wheelset,
          hubs: build.hubs,
          tires: build.tires,
          wheels: build.wheels,
          limited_stock: build.limitedStock || false
        };
      }) as any[]

      // Use upsert instead of insert to prevent duplication errors!
      const { error: buildError } = await supabase
        .from('builds')
        .upsert(buildsToInsert, { onConflict: 'model_id, name' })

      if (buildError) {
        console.error(`    ❌ Build Error for ${model.name}:`, buildError.message)
      } else {
        console.log(`    📦 Upserted ${buildsToInsert.length} builds (Live prices preserved).`)
      }

      // 4. THE PURGE: Delete obsolete builds from Supabase
      const validBuildNames = modelData.builds.map((b: any) => b.name);

      if (existingBuilds) {
        // Find which builds in Supabase are NO LONGER in your God File
        const buildsToDelete = existingBuilds.filter(eb => !validBuildNames.includes(eb.name));
        
        if (buildsToDelete.length > 0) {
          const idsToDelete = buildsToDelete.map(b => b.id);
          
          // Nuke them
          const { error: deleteError } = await supabase
            .from('builds')
            .delete()
            .in('id', idsToDelete);
            
          if (deleteError) {
            console.error(`    ❌ Failed to purge obsolete builds:`, deleteError.message);
          } else {
            console.log(`    🗑️ Purged ${buildsToDelete.length} obsolete build(s) from Supabase.`);
          }
        }
      }
    }
  }

  console.log("\n🏁 Migration Complete!")
}

migrate()