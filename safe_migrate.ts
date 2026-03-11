import { createClient } from '@supabase/supabase-js'
import { eMTBData } from './src/bikeData' // Node + tsx will handle the extension

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

    console.log(`✅ Brand: ${brand.name}`)

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

      // 3. Insert Builds
      const buildsToInsert = modelData.builds.map((build: any) => ({
        model_id: model.id,
        name: build.name,
        price: build.price,
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
      })) as any[]

      const { error: buildError } = await supabase.from('builds').insert(buildsToInsert)

      if (buildError) {
        console.error(`    ❌ Build Error for ${model.name}:`, buildError.message)
      } else {
        console.log(`    📦 Inserted ${buildsToInsert.length} builds.`)
      }
    }
  }

  console.log("🏁 Migration Complete!")
}

migrate()