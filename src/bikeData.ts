const RAW_EMTB = [
  {
    brand: "Orbea",
    logo: "https://placehold.co/200x100/ffffff/000000?text=ORBEA",
    models: [
      {
        name: "Wild",
        image: '/bikes/Orbea Wild.png',
        builds: [
          { name: "M-LTD", price: 11999, material: "Carbon", motor: "Bosch CX Race", battery: "600Wh", fork: "Fox 38 Float Factory 170mm", shock: "Fox Float X2 Factory - 160mm", drivetrain: "SRAM XX Eagle AXS", brakes: "Shimano XTR M9120", wheelset: "OQUO MC32LTD Carbon", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "M-Team", price: 9499, material: "Carbon", motor: "Bosch CX", battery: "750Wh", fork: "Fox 38 Float Factory 170mm", shock: "Fox Float X2 Factory - 160mm", drivetrain: "Shimano XT Di2", brakes: "Shimano XT M8120", wheelset: "OQUO MC32TEAM", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "M10", price: 8499, material: "Carbon", motor: "Bosch CX", battery: "750Wh", fork: "Fox 38 Float Performance 170mm", shock: "Fox Float X Performance - 160mm", drivetrain: "Shimano XT M8100", brakes: "Shimano XT M8120", wheelset: "OQUO MC32TEAM", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "H10", price: 7299, material: "Hydroformed Alloy", motor: "Bosch CX", battery: "750Wh", fork: "Fox 38 Float Performance 170mm", shock: "Fox Float X Performance - 160mm", drivetrain: "Shimano XT M8100", brakes: "Shimano Deore M6120", wheelset: "OQUO MC32TEAM", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "H20", price: 6499, material: "Hydroformed Alloy", motor: "Bosch CX", battery: "750Wh", fork: "RockShox ZEB Base 170mm", shock: "Fox Float X Performance - 160mm", drivetrain: "Shimano Deore M6100", brakes: "SRAM DB8", wheelset: "Race Face AR 30c", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" }
        ]
      },
      {
        name: "Rise LT",
        image: '/bikes/Orbea Rise.png',
        builds: [
         { name: "M10", price: 8599, material: "Carbon", motor: "Shimano EP801", battery: "420Wh", fork: "Fox 36 Float Factory 160mm", shock: "Fox Float X Factory - 160mm", drivetrain: "Shimano XT M8100", brakes: "Shimano XT M8120", wheelset: "OQUO MC32TEAM", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "H10", price: 6599, material: "Hydroformed Alloy", motor: "Shimano EP801", battery: "630Wh", fork: "Fox 36 Float Performance 160mm", shock: "Fox Float X Performance - 160mm", drivetrain: "Shimano SLX M7100", brakes: "Shimano Deore M6120", wheelset: "Race Face AR 30c", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" }
        ]
      }
    ]
  },
  {
      brand: "Evil",
      logo: "/logos/Evil.png",
      models: [
        {
          name: "Epocalypse",
          image: "/bikes/Evil Epocalypse.png",
          builds: [
            { name: "X0 AXS", price: 11999, material: "Carbon", motor: "Shimano EP801", battery: "630Wh", fork: "Fox 38 Factory Grip2 E-Bike 170mm", shock: "Fox Float X2 Factory - 166mm", drivetrain: "SRAM X0 Eagle Transmission", brakes: "SRAM Code RSC", wheelset: "Industry Nine Hydra Enduro S", tires: "Maxxis Assegai / Minion DHR II 2.5", wheels: "29\"" },
            { name: "GX Transmission", price: 9499, material: "Carbon", motor: "Shimano EP801", battery: "630Wh", fork: "Fox 38 Factory Grip2 E-Bike 170mm", shock: "Fox Float X2 Factory - 166mm", drivetrain: "SRAM GX Eagle Transmission", brakes: "SRAM Code RSC", wheelset: "Industry Nine Hydra Enduro S", tires: "Maxxis Assegai / Minion DHR II 2.5", wheels: "29\"" },
            { name: "XT", price: 8699, material: "Carbon", motor: "Shimano EP8", battery: "630Wh", fork: "RockShox ZEB Ultimate 170mm", shock: "RockShox Super Deluxe Coil Ultimate - 166mm", drivetrain: "Shimano XT 12-Speed", brakes: "Shimano XT 4-Piston", wheelset: "Industry Nine Enduro S", tires: "Maxxis Minion DHF 2.5", wheels: "29\"" }
          ]
        }
      ]
    },
  {
    brand: "Giant",
    logo: "https://placehold.co/200x100/ffffff/000000?text=Giant",
     models: [
      {
        name: "Reign E+",
        image: "/bikes/Giant Reign E.png",
        builds: [
          { name: "Advanced 1", price: 8499, material: "Carbon", motor: "SyncDrive Pro 85Nm", battery: "800Wh", fork: "Fox 38 Performance Elite 170mm", shock: "Fox Float X2 Performance Elite - 160mm", drivetrain: "SRAM GX Eagle Transmission", brakes: "Shimano Deore XT 4-Piston", wheelset: "Giant TRX 2 Carbon", tires: "Maxxis Minion DHF / High Roller II", wheels: "Mullet" },
          { name: "2", price: 6500, material: "Alloy", motor: "SyncDrive Pro 85Nm", battery: "800Wh", fork: "Fox 38 Rhythm 170mm", shock: "Fox Float X Performance - 160mm", drivetrain: "Shimano SLX 12-Speed", brakes: "Shimano SLX 4-Piston", wheelset: "Giant AM 30", tires: "Maxxis Minion DHF / High Roller II", wheels: "Mullet" }
        ]
      },
      {
        name: "Trance X E+",
        image: "/bikes/Giant Trance X E.png",
        builds: [
          { name: "Advanced Elite 1", price: 10000, material: "Carbon", motor: "SyncDrive Pro 85Nm", battery: "400Wh", fork: "Fox 36 Factory 150mm", shock: "Fox Float X Factory - 140mm", drivetrain: "SRAM GX Eagle Transmission", brakes: "SRAM Code R", wheelset: "Giant TRX 2 Carbon", tires: "Maxxis Minion DHF / Dissector 2.6", wheels: "29\"" },
          { name: "2", price: 6999, material: "Alloy", motor: "SyncDrive Pro 85Nm", battery: "800Wh", fork: "Fox 36 Rhythm 150mm", shock: "Fox Float DPS Performance - 140mm", drivetrain: "Shimano SLX 12-Speed", brakes: "Shimano Deore 4-Piston", wheelset: "Giant AM 30", tires: "Maxxis Minion DHF / Dissector 2.6", wheels: "29\"" }
        ]
      }
    ]
  },
  {
    brand: "Specialized",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq7y5HugM-0SCcOCYDD_0U16bMLTW8ZMpNxQ&s",
    models: [
      {
        name: "Turbo Levo",
        image: '/bikes/Specialized Levo 4.png',
        builds: [
          { name: "S-Works", price: 15399, material: "Carbon", motor: "Specialized 3.1", battery: "840Wh", fork: "Fox Factory 36 160mm", shock: "Fox Float X Factory GENIE - 150mm", drivetrain: "SRAM XX Transmission", brakes: "SRAM Maven Ultimate", wheelset: "Roval Traverse SL 29/27.5", tires: "Specialized Butcher 2.4 / Eliminator 2.4" },
          { name: "Pro", price: 12299, material: "Carbon", motor: "Specialized 3.1", battery: "840Wh", fork: "Fox Factory 36 160mm", shock: "Fox Float X Factory GENIE - 150mm", drivetrain: "SRAM X0 Transmission", brakes: "SRAM Maven Silver", wheelset: "Roval Traverse 29/27.5", tires: "Specialized Butcher 2.4 / Eliminator 2.4" },
          { name: "Expert", price: 10799, material: "Carbon", motor: "Specialized 3.1", battery: "840Wh", fork: "FOX 38 Performance Elite GRIPX2 160mm", shock: "Fox Float X Performance Elite GENIE - 150mm", drivetrain: "SRAM GX Transmission", brakes: "SRAM Maven Silver", wheelset: "Roval Traverse 29/27.5", tires: "Specialized Butcher 2.4 / Eliminator 2.4" },
          { name: "Comp", price: 9199, material: "Carbon", motor: "Specialized 3.1", battery: "840Wh", fork: "Fox 36 Rhythm 160mm", shock: "Fox Float X Performance GENIE - 150mm", drivetrain: "SRAM GX Eagle", brakes: "SRAM Maven Bronze", wheelset: "Specialized Alloy 29/27.5", tires: "Specialized Butcher 2.4 / Eliminator 2.4" },
          { name: "Comp Alloy", price: 7699, material: "Alloy", motor: "Specialized 3.1", battery: "840Wh", fork: "FOX FLOAT 36 Rhythm GRIP 160mm", shock: "Fox Float X Performance GENIE - 150mm", drivetrain: "SRAM GX Eagle", brakes: "SRAM Maven Bronze", wheelset: "Specialized Alloy 29/27.5", tires: "Specialized Butcher 2.4 / Eliminator 2.4" },
          { name: "Alloy", price: 6099, material: "Alloy", motor: "Specialized 3.1", battery: "840Wh", fork: "Marzocchi Bomber Z1 160mm", shock: "Marzocchi Bomber Inline - 150mm", drivetrain: "SRAM NX Eagle", brakes: "SRAM DB8 Stealth", wheelset: "Specialized Alloy 29/27.5", tires: "Specialized Butcher 2.4 / Eliminator 2.4" }
        ]
      },
      {
        name: "Turbo Kenevo",
        image: "/bikes/Specialized Turbo Kenevo.png",
        builds: [
          { name: "Comp", price: 7499, material: "Alloy", motor: "Specialized 2.2", battery: "500Wh", fork: "Marzocchi Bomber Z1 180mm", shock: "Marzocchi Bomber CR Coil - 180mm", drivetrain: "SRAM GX Eagle", brakes: "SRAM Code R", wheelset: "Specialized Alloy 27.5", tires: "Specialized Butcher 2.6" }
        ]
      }
    ]
  },
  {
    brand: "Trek",
    logo: "https://placehold.co/200x100/ffffff/000000?text=TREK",
    models: [
      {
        name: "Rail+ Gen 5",
        image: '/bikes/Trek Rail 5.png',
        builds: [
         { name: "9.9", price: 12500, material: "Carbon", motor: "Bosch CX", battery: "800Wh", fork: "RockShox ZEB Ultimate 160mm", shock: "RockShox Super Deluxe Ultimate - 160mm", drivetrain: "SRAM XX Transmission", brakes: "SRAM Code Stealth Ultimate", wheelset: "Bontrager Line Pro 30 Carbon", tires: "Bontrager SE6 / SE5 2.5" },
          { name: "9.7", price: 8699, material: "Carbon", motor: "Bosch CX", battery: "800Wh", fork: "RockShox ZEB Select+ 160mm", shock: "RockShox Super Deluxe Select+ - 160mm", drivetrain: "SRAM GX Transmission", brakes: "SRAM Code Bronze", wheelset: "Bontrager Line Comp 30", tires: "Bontrager SE6 / SE5 2.5" },
          { name: "8", price: 7699, material: "Alpha Platinum Aluminum", motor: "Bosch CX", battery: "800Wh", fork: "RockShox ZEB Select 160mm", shock: "RockShox Super Deluxe Select - 160mm", drivetrain: "Shimano XT M8100", brakes: "Shimano M6120 4-piston", wheelset: "Bontrager Line Comp 30", tires: "Bontrager SE6 / SE5 2.5" }
        ]
      },
      {
        name: "Fuel EXe",
        image: "/bikes/Trek Fuel EXe.png",
        builds: [
          { name: "9.9 X0 AXS", price: 8500, material: "Carbon", motor: "TQ-HPR50", battery: "360Wh", fork: "RockShox Lyrik Ultimate 150mm", shock: "RockShox Super Deluxe Ultimate - 140mm", drivetrain: "SRAM X0 Eagle AXS", brakes: "SRAM Code Silver", wheelset: "Bontrager Line Pro 30 Carbon", tires: "Bontrager SE5 Team Issue", wheels: "29\"" },
          { name: "9.8 GX AXS", price: 7500, material: "Carbon", motor: "TQ-HPR50", battery: "360Wh", fork: "RockShox Lyrik Select+ 150mm", shock: "RockShox Super Deluxe Select+ - 140mm", drivetrain: "SRAM GX AXS", brakes: "SRAM Code Bronze", wheelset: "Bontrager Line Elite 30 Carbon", tires: "Bontrager SE5 Team Issue", wheels: "29\"" },
          { name: "8 XT", price: 6999, material: "Alloy", motor: "TQ-HPR50", battery: "360Wh", fork: "Fox 36 Rhythm 150mm", shock: "Fox Float X Performance - 140mm", drivetrain: "Shimano XT 12-Speed", brakes: "Shimano Deore 4-Piston", wheelset: "Bontrager Line Comp 30", tires: "Bontrager XR5 Team Issue", wheels: "29\"" }
        ]
      }
    ]
  },
  {
    brand: "Cube",
    logo: "https://placehold.co/200x100/ffffff/000000?text=CUBE",
    models: [
      {
        name: "Stereo Hybrid ONE77",
        image: "/bikes/Cube Stereo Hybrid.png",
        builds: [
          { name: "HPC TM 800", price: 6500, material: "Carbon/Alloy", motor: "Bosch CX", battery: "800Wh", fork: "Fox 38 Float GRIP 170mm", shock: "Fox Float X2 Performance - 170mm", drivetrain: "SRAM GX Eagle AXS", brakes: "Magura MT7 4-Piston", wheelset: "Newmen Beskar 30", tires: "Schwalbe Magic Mary / Tacky Chan", wheels: "Mullet" },
          { name: "HPC SLX 800", price: 5500, material: "Carbon/Alloy", motor: "Bosch CX", battery: "800Wh", fork: "Fox 38 Rhythm 170mm", shock: "Fox Float X Performance - 170mm", drivetrain: "Shimano XT 12-Speed", brakes: "Shimano XT 4-Piston", wheelset: "Newmen Performance 30", tires: "Schwalbe Magic Mary / Big Betty", wheels: "Mullet" }
        ]
      }
    ]
  },
  {
    brand: "Focus",
    logo: "https://placehold.co/200x100/ffffff/000000?text=FOCUS",
    models: [
      {
        name: "JAM2",
        image: "/bikes/Focus JAM2.png",
        builds: [
          { name: "6.8", price: 7999, material: "Alloy", motor: "Bosch CX", battery: "800Wh", fork: "Fox 36 Rhythm 160mm", shock: "Fox Float DPS - 150mm", drivetrain: "Shimano XT 12-Speed", brakes: "Magura MT5", wheelset: "RaceFace AR30", tires: "Maxxis Minion DHF / DHR II", wheels: "29\"" },
          { name: "6.7", price: 6499, material: "Alloy", motor: "Bosch CX", battery: "800Wh", fork: "SR Suntour Zeron 36 150mm", shock: "RockShox Deluxe Select - 150mm", drivetrain: "Shimano CUES 10-Speed", brakes: "Tektro Gemini SL", wheelset: "WTB ST i30", tires: "Maxxis Minion DHF / DHR II", wheels: "29\"" }
        ]
      }
    ]
  },
  {
    brand: "Santa Cruz",
    logo: "https://placehold.co/200x100/ffffff/000000?text=SANTA+CRUZ",
    models: [
      {
        name: "Vala",
        image: "/bikes/Santa Cruz Vala.png",
        builds: [
          { name: "X0 AXS", price: 9499, material: "Carbon CC", motor: "Bosch CX", battery: "600Wh", fork: "Fox 38 Factory 160mm", shock: "Fox Float X Factory - 150mm", drivetrain: "SRAM X0 Transmission", brakes: "SRAM Maven Silver", wheelset: "Reserve 30|HD Carbon", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" }
        ]
      },
      {
        name: "Bullit",
        image: "/bikes/Santa Cruz Bullit.png",
        builds: [
          { name: "S", price: 8899, material: "Carbon CC", motor: "Shimano EP801", battery: "630Wh", fork: "Fox 38 Float Performance 170mm", shock: "RockShox Super Deluxe Select+ - 170mm", drivetrain: "SRAM GX Eagle", brakes: "SRAM Code R", wheelset: "RaceFace AR Offset 30", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "R", price: 7649, material: "Carbon C", motor: "Shimano EP801", battery: "630Wh", fork: "RockShox ZEB Base 170mm", shock: "RockShox Super Deluxe Select - 170mm", drivetrain: "SRAM NX Eagle", brakes: "SRAM Guide RE", wheelset: "WTB ST i30 TCS", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" }
        ]
      },
      {
        name: "Heckler",
        image: "/bikes/Santa Cruz Heckler.png",
        builds: [
          { name: "R", price: 6999, material: "Carbon C", motor: "Shimano EP801", battery: "720Wh", fork: "RockShox Lyrik Base 160mm", shock: "RockShox Super Deluxe Select - 150mm", drivetrain: "SRAM NX Eagle", brakes: "SRAM DB8", wheelset: "WTB ST i30 TCS", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" }
        ]
      },
      {
        name: "Heckler SL",
        image: "/bikes/Santa Cruz Heckler.png",
        builds: [
          { name: "90", price: 8699, material: "Carbon C", motor: "Fazua Ride 60", battery: "430Wh", fork: "Fox 36 Performance 160mm", shock: "Fox Float X Performance - 150mm", drivetrain: "SRAM X0 Transmission", brakes: "SRAM Code Bronze", wheelset: "Reserve 30|SL AL", tires: "Maxxis Minion DHF 2.5 / Minion DHR II 2.4" },
          { name: "70", price: 7299, material: "Carbon C", motor: "Fazua Ride 60", battery: "430Wh", fork: "RockShox Lyrik Base 160mm", shock: "Fox Float X Performance - 150mm", drivetrain: "SRAM GX Eagle", brakes: "SRAM DB8", wheelset: "WTB ST i30 TCS", tires: "Maxxis Minion DHF 2.5 / Minion DHR II 2.4" }
        ]
      }
    ]
  },
  {
    brand: "Commencal",
    logo: "https://placehold.co/200x100/ffffff/000000?text=COMMENCAL",
    models: [
      {
        name: "Meta Power SX 400",
        image: "/bikes/Commencal MetaPowerSX.png",
        builds: [
          { name: "Signature AXS", price: 8500, material: "Alloy", motor: "Bosch SX", battery: "400Wh", fork: "Fox 38 Factory 170mm", shock: "Fox Float X Factory - 165mm", drivetrain: "SRAM GX Eagle Transmission", brakes: "SRAM Maven Silver", wheelset: "DT Swiss HFR1700", tires: "Schwalbe Magic Mary / Tacky Chan 2.4" },
          { name: "Essential", price: 6500, material: "Alloy", motor: "Bosch SX", battery: "400Wh", fork: "Fox 38 Performance 170mm", shock: "Fox Float X Performance - 165mm", drivetrain: "SRAM GX Eagle", brakes: "TRP DH-R EVO", wheelset: "DT Swiss HF1900", tires: "Schwalbe Magic Mary / Tacky Chan 2.4" }
        ]
      },
      {
        name: "Meta Power SX Avinox",
        image: "/bikes/Commencal MetaPowerSX Avinox.png",
        builds: [
          { name: "Podium", price: 12000, material: "Alloy", motor: "DJI Avinox", battery: "800Wh", fork: "Fox Podium Factory 160mm", shock: "Fox Float X2 Factory - 160mm", drivetrain: "SRAM X0 Eagle Transmission", brakes: "Shimano XT 4-Piston", wheelset: "DT Swiss HX 1700", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "Signature", price: 10800, material: "Alloy", motor: "DJI Avinox", battery: "800Wh", fork: "Fox 36 Factory 160mm", shock: "Fox Float X Factory - 160mm", drivetrain: "SRAM GX Eagle Transmission", brakes: "Shimano XT 4-Piston", wheelset: "DT Swiss HX 1700", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "RockShox", price: 9200, material: "Alloy", motor: "DJI Avinox", battery: "800Wh", fork: "RockShox ZEB Ultimate 170mm", shock: "RockShox Super Deluxe Select - 160mm", drivetrain: "SRAM Eagle 90 Transmission", brakes: "SRAM Maven Base", wheelset: "DT Swiss H 1900", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "Essential", price: 8800, material: "Alloy", motor: "DJI Avinox", battery: "800Wh", fork: "Fox 36 Performance 160mm", shock: "Fox Float X Performance - 160mm", drivetrain: "SRAM Eagle 90 Transmission", brakes: "TRP DH-R EVO PRO", wheelset: "DT Swiss H 1900", tires: "Maxxis Minion DHR II 2.5 / Minion DHR II 2.4" },
          { name: "Ride", price: 7800, material: "Alloy", motor: "DJI Avinox", battery: "800Wh", fork: "RockShox Domain Gold R 170mm", shock: "RockShox Deluxe Select - 160mm", drivetrain: "Shimano XT LinkGlide", brakes: "TRP DH-R EVO", wheelset: "DT Swiss H 1900", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" }
        ]
      },
      {
        name: "Meta Power SX 800",
        image: "/bikes/Commencal MetaPowerSX 800.png",
        builds: [
          { name: "Signature", price: 10800, material: "Alloy", motor: "Bosch CX", battery: "800Wh", fork: "Fox 38 Factory 180mm", shock: "Fox Float X2 Factory - 180mm", drivetrain: "SRAM X0 Eagle Transmission", brakes: "TRP DH-R EVO PRO", wheelset: "DT Swiss HX 1700", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "RockShox", price: 9500, material: "Alloy", motor: "Bosch CX", battery: "800Wh", fork: "RockShox ZEB Ultimate 180mm", shock: "RockShox Super Deluxe Select - 180mm", drivetrain: "SRAM X0 Eagle Transmission", brakes: "TRP DH-R EVO PRO", wheelset: "DT Swiss H 1900", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" }
        ]
      }
    ]
  },
  {
    brand: "Forbidden",
    logo: "https://placehold.co/200x100/ffffff/000000?text=FORBIDDEN",
    models: [
      {
        name: "Druid CorE",
        image: "/bikes/Forbidden Druid.png",
        builds: [
          { name: "CorE 3 MX", price: 9299, material: "Carbon", motor: "DJI Avinox", battery: "800Wh", fork: "RockShox ZEB Select+ 160mm", shock: "RockShox Vivid Select+ - 130mm", drivetrain: "SRAM GX Eagle Transmission", brakes: "SRAM Maven 4-Piston", wheelset: "Race Face ARC Offset", tires: "Maxxis High Roller / Minion DHR II 2.4" }
        ]
      }
    ]
  },
  {
    brand: "Ari",
    logo: "https://placehold.co/200x100/ffffff/000000?text=ARI",
    models: [
      {
        name: "Timp Peak",
        image: "/bikes/ARI Timp.png",
        builds: [
          { name: "Team", price: 12999, material: "Carbon", motor: "Shimano EP801", battery: "635Wh", fork: "RockShox ZEB Ultimate 170mm", shock: "RockShox Vivid Ultimate - 170mm", drivetrain: "SRAM XX Eagle Transmission", brakes: "SRAM Maven Ultimate", wheelset: "Crankbrothers Synthesis Carbon", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "Pro", price: 10499, material: "Carbon", motor: "Shimano EP801", battery: "635Wh", fork: "RockShox ZEB Ultimate 170mm", shock: "RockShox Vivid Ultimate - 170mm", drivetrain: "SRAM X0 Eagle Transmission", brakes: "SRAM Maven Silver", wheelset: "Crankbrothers Synthesis Alloy", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "Elite", price: 9499, material: "Carbon", motor: "Shimano EP801", battery: "635Wh", fork: "RockShox ZEB Ultimate 170mm", shock: "RockShox Vivid Ultimate - 170mm", drivetrain: "SRAM GX Eagle Transmission", brakes: "TRP DH-R EVO PRO", wheelset: "Crankbrothers Synthesis Alloy", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "Comp", price: 7799, material: "Carbon", motor: "Shimano EP801", battery: "635Wh", fork: "RockShox ZEB Rush RC 170mm", shock: "RockShox Super Deluxe - 170mm", drivetrain: "Shimano Deore M6100", brakes: "TRP Trail EVO", wheelset: "DT Swiss H1900 Spline", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" }
        ]
      }
    ]
  },
  {
    brand: "Ibis",
    logo: "https://placehold.co/200x100/ffffff/000000?text=Ibis",
    models: [
      {
        name: "Oso",
        image: "/bikes/Ibis Oso.png",
        builds: [
          { name: "GX Transmission", price: 7999, material: "Carbon", motor: "Bosch CX", battery: "750Wh", fork: "Fox 38 Performance 170mm", shock: "Fox Float X2 Performance Elite - 155mm", drivetrain: "SRAM GX Eagle Transmission", brakes: "Shimano XT 4-Piston", wheelset: "Blackbird Send Alloy", tires: "Maxxis Assegai / Minion DHR II", wheels: "Mullet" }
        ]
      }
    ]
  },
  {
    brand: "Canyon",
    logo: "https://www.logo.wine/a/logo/Canyon_Bicycles/Canyon_Bicycles-Logo.wine.svg",
    models: [
      {
        name: "Torque:ON",
        image: '/bikes/Canyon Torque ON.png',
        builds: [
         { name: "CF 9", price: 8999, material: "Carbon", motor: "Shimano EP801", battery: "720Wh", fork: "Fox 38 Factory 180mm", shock: "Fox Float X2 Factory - 175mm", drivetrain: "Shimano XT M8100", brakes: "Shimano XT M8120", wheelset: "DT Swiss HX1700", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "CF 8", price: 5999, material: "Carbon", motor: "Shimano EP8", battery: "720Wh", fork: "Fox 38 Performance 180mm", shock: "Fox Float X2 Performance - 175mm", drivetrain: "Shimano SLX M7100", brakes: "Shimano SLX M7120", wheelset: "SunRingle Duroc SD37", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" }
        ]
      },
      {
        name: "Spectral:ON",
        image: '/bikes/Canyon Spectral ON.png',
        builds: [
          { name: "CF 8", price: 5999, material: "Carbon", motor: "Shimano EP801", battery: "900Wh", fork: "Fox 36 Rhythm 160mm", shock: "Fox Float X Performance - 155mm", drivetrain: "Shimano XT M8100", brakes: "Shimano SLX M7120", wheelset: "DT Swiss HLN350 29/27.5", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "CF 7", price: 5249, material: "Carbon", motor: "Shimano EP801", battery: "720Wh", fork: "RockShox Lyrik Base 160mm", shock: "RockShox Deluxe Select+ - 155mm", drivetrain: "Shimano Deore M6100", brakes: "SRAM DB8", wheelset: "SunRingle Duroc SD37", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" }
        ]
      },
      {
        name: "Strive:ON",
        image: '/bikes/Canyon Strive ON.png',
        builds: [
          { name: "CFR Underdog", price: 5499, material: "Carbon", motor: "Bosch CX", battery: "625Wh", fork: "Fox 38 Rhythm 170mm", shock: "Fox Float X Performance - 160mm", drivetrain: "Shimano Deore M6100", brakes: "SRAM DB8", wheelset: "DT Swiss HX1700", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" }
        ]
      }
    ]
  },
  {
    brand: "Transition",
    logo: "https://placehold.co/200x100/ffffff/000000?text=TRANSITION",
    models: [
      {
        name: "Regulator CX",
          image: "/bikes/Transition Regulator CX.png",
          builds: [
            { name: "Carbon XT", price: 8999, material: "Carbon", motor: "Bosch CX", battery: "600Wh", fork: "RockShox ZEB Ultimate 160mm", shock: "RockShox SuperDeluxe Ultimate - 150mm", drivetrain: "Shimano XT 12-Speed", brakes: "TRP EVO PRO", wheelset: "DT Swiss H 1900 Spline 30", tires: "Schwalbe Albert Trail Evo 2.5", wheels: "Mullet" },
            { name: "Carbon Deore", price: 7299, material: "Carbon", motor: "Bosch CX", battery: "600Wh", fork: "RockShox Domain Gold RC 160mm", shock: "RockShox SuperDeluxe Base - 150mm", drivetrain: "Shimano Deore 12-Speed", brakes: "Shimano Deore 4-Piston", wheelset: "WTB ST i30", tires: "Maxxis Assegai / Minion DHR II 2.4", wheels: "Mullet" }
          ]
        },
        {
          name: "Regulator SX",
          image: "/bikes/Transition Regulator SX.png",
          builds: [
            { name: "Carbon XT", price: 8999, material: "Carbon", motor: "Bosch SX", battery: "400Wh", fork: "RockShox Lyrik Ultimate 160mm", shock: "RockShox SuperDeluxe Ultimate - 150mm", drivetrain: "Shimano XT 12-Speed", brakes: "TRP EVO PRO", wheelset: "DT Swiss XM 481", tires: "Maxxis Assegai / Minion DHR II 2.4", wheels: "Mullet" },
            { name: "Carbon Deore", price: 6999, material: "Carbon", motor: "Bosch SX", battery: "400Wh", fork: "RockShox Lyrik Base 160mm", shock: "RockShox SuperDeluxe Select - 150mm", drivetrain: "Shimano Deore 12-Speed", brakes: "Shimano Deore 4-Piston", wheelset: "WTB ST i30", tires: "Maxxis Assegai / Minion DHR II 2.4", wheels: "Mullet" }
          ]
        },
        {
          name: "Relay",
          image: "/bikes/Transition Relay.png",
          builds: [
            { name: "Carbon X0 AXS", price: 10499, material: "Carbon", motor: "Fazua Ride 60", battery: "430Wh", fork: "Fox 36 Factory 160mm", shock: "Fox Float X Factory - 160mm", drivetrain: "SRAM X0 Eagle Transmission", brakes: "SRAM Code Silver", wheelset: "RaceFace Aeffect R", tires: "Maxxis Assegai / Minion DHR II", wheels: "29\"" },
            { name: "Carbon GX AXS", price: 7499, material: "Carbon", motor: "Fazua Ride 60", battery: "430Wh", fork: "Fox 36 Performance 160mm", shock: "Fox Float X Performance - 160mm", drivetrain: "SRAM GX Eagle Transmission", brakes: "SRAM Code Bronze", wheelset: "RaceFace Aeffect R", tires: "Maxxis Assegai / Minion DHR II", wheels: "29\"" },
            { name: "Alloy Deore", price: 5999, material: "Alloy", motor: "Fazua Ride 60", battery: "430Wh", fork: "Fox 36 Rhythm 160mm", shock: "Fox Float X Performance - 160mm", drivetrain: "Shimano Deore 12-Speed", brakes: "Shimano Deore 4-Piston", wheelset: "WTB ST i30", tires: "Maxxis Assegai / Minion DHR II", wheels: "29\"" }
          ]
        },
        {
          name: "Repeater PT",
          image: "/bikes/Transition Repeater.png",
          builds: [
            { name: "Carbon X0 AXS", price: 10499, material: "Carbon", motor: "SRAM Powertrain", battery: "720Wh", fork: "RockShox ZEB Ultimate 170mm", shock: "RockShox Vivid Ultimate - 170mm", drivetrain: "SRAM X0 Eagle Transmission", brakes: "SRAM Code Silver", wheelset: "Crankbrothers Synthesis Alloy", tires: "Maxxis Assegai / Minion DHR II", wheels: "29\"" },
            { name: "Carbon GX AXS", price: 8499, material: "Carbon", motor: "SRAM Powertrain", battery: "720Wh", fork: "RockShox ZEB Select 170mm", shock: "RockShox Vivid Air - 170mm", drivetrain: "SRAM GX Eagle Transmission", brakes: "SRAM Code Bronze", wheelset: "Novatec/WTB ST i30", tires: "Maxxis Assegai / Minion DHR II", wheels: "29\"" }
          ]
        }
      ]
    },
  {
    brand: "YT Industries",
    logo: "https://placehold.co/200x100/ffffff/000000?text=YT+INDUSTRIES",
    models: [
      {
        name: "Decoy SN",
        image: "/bikes/YT DECOY.png",
        builds: [
          { name: "Core 4", price: 8499, material: "Carbon", motor: "Fazua Ride 60", battery: "430Wh", fork: "Fox 38 Factory 170mm", shock: "Fox DHX2 Factory Coil - 160mm", drivetrain: "SRAM GX Eagle Transmission", brakes: "SRAM Maven Silver", wheelset: "Crankbrothers Synthesis Alloy", tires: "Continental Kryptotal 2.4" },
          { name: "Core 3", price: 7499, material: "Carbon", motor: "Fazua Ride 60", battery: "430Wh", fork: "RockShox ZEB Ultimate 170mm", shock: "RockShox Vivid Ultimate - 160mm", drivetrain: "SRAM GX Eagle Transmission", brakes: "TRP DH-R Evo", wheelset: "Crankbrothers Synthesis Alloy", tires: "Continental Kryptotal 2.4" },
          { name: "Core 2", price: 6499, material: "Carbon", motor: "Fazua Ride 60", battery: "430Wh", fork: "RockShox ZEB Select 170mm", shock: "RockShox Vivid Select - 160mm", drivetrain: "Shimano SLX", brakes: "TRP DH-R Evo", wheelset: "DT Swiss H1900", tires: "Continental Kryptotal 2.4" }
        ]
      }
    ]
  },
  {
    brand: "Yeti",
    logo: "https://placehold.co/200x100/ffffff/000000?text=YETI",
    models: [
      {
        name: "160E",
        image: "/bikes/Yeti.png",
        builds: [
          { name: "C3 GX Transmission", price: 10500, material: "Carbon", motor: "Shimano EP801", battery: "630Wh", fork: "Fox 38 Performance 170mm", shock: "Fox Float X Performance - 160mm", drivetrain: "SRAM GX Eagle Transmission", brakes: "SRAM Code R", wheelset: "DT Swiss HX 1700", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "C1 Factory", price: 10100, material: "Carbon", motor: "Shimano EP801", battery: "630Wh", fork: "Fox 38 Factory 170mm", shock: "Fox Float X2 Factory - 160mm", drivetrain: "Shimano SLX", brakes: "SRAM Code R", wheelset: "DT Swiss H1900", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" }
        ]
      },
      {
        name: "LTe",
        image: "/bikes/Yeti LTe.png",
        builds: [
          { name: "T4 XX", price: 14900, material: "Carbon", motor: "Bosch CX Race", battery: "800Wh", fork: "Fox Podium Factory 38 170mm", shock: "Fox Float X2 Factory - 160mm", drivetrain: "SRAM XX Eagle Transmission", brakes: "SRAM Maven Ultimate", wheelset: "DT Swiss HXC1700 Carbon", tires: "Schwalbe Magic Mary / Albert 2.5" },
          { name: "T3 X0", price: 12900, material: "Carbon", motor: "Bosch CX", battery: "800Wh", fork: "Fox 38 Factory Grip X2 170mm", shock: "Fox Float X2 Factory - 160mm", drivetrain: "SRAM X0 Eagle Transmission", brakes: "SRAM Maven Silver", wheelset: "DT Swiss HXC1700 Carbon", tires: "Schwalbe Magic Mary / Albert 2.5" },
          { name: "C2 Transmission", price: 10300, material: "Carbon", motor: "Bosch CX", battery: "800Wh", fork: "Fox 38 Performance 170mm", shock: "Fox Float X Performance - 160mm", drivetrain: "SRAM Eagle 90 Transmission", brakes: "SRAM Maven Bronze", wheelset: "DT Swiss H 1900", tires: "Schwalbe Magic Mary / Albert 2.5" }
        ]
      },
      {
        name: "MTe",
        image: "/bikes/Yeti MTe.png",
        builds: [
          { name: "T4 XX", price: 14300, material: "Carbon", motor: "TQ-HPR50", battery: "290Wh", fork: "Fox 36 Factory 160mm", shock: "Fox Float X Factory - 145mm", drivetrain: "SRAM XX Eagle Transmission", brakes: "SRAM Maven Ultimate", wheelset: "DT Swiss EXC1501 Carbon", tires: "Schwalbe Magic Mary / Albert 2.5" },
          { name: "T3 X0", price: 12650, material: "Carbon", motor: "TQ-HPR50", battery: "580Wh", fork: "Fox 36 Factory 160mm", shock: "Fox Float X Factory - 145mm", drivetrain: "SRAM X0 Eagle Transmission", brakes: "SRAM Maven Silver", wheelset: "DT Swiss EXC1700 Carbon", tires: "Schwalbe Magic Mary / Albert 2.5" },
          { name: "C2 90", price: 9850, material: "Carbon", motor: "TQ-HPR50", battery: "580Wh", fork: "Fox 36 Performance 160mm", shock: "Fox Float X Performance - 145mm", drivetrain: "SRAM Eagle 90 Transmission", brakes: "SRAM Maven Bronze", wheelset: "DT Swiss E1900", tires: "Schwalbe Magic Mary / Albert 2.5" }
        ]
      }
    ]
  },
  {
    brand: "Pivot",
    logo: "https://placehold.co/200x100/ffffff/000000?text=PIVOT",
    models: [
      {
        name: "Shuttle AM v2",
        image: "/bikes/Pivot Shuttle AM.png",
        builds: [
          { name: "Team XX Transmission", price: 14499, material: "Carbon", motor: "Bosch CX Race", battery: "800Wh", fork: "Fox 36 Factory 160mm", shock: "Fox Float X Factory - 148mm", drivetrain: "SRAM XX Eagle Transmission", brakes: "SRAM Maven Ultimate", wheelset: "DT Swiss HXC1501 Carbon", tires: "Maxxis Minion DHF 2.5 / DHR II 2.4" },
          { name: "Pro X0 Transmission", price: 11999, material: "Carbon", motor: "Bosch CX Race", battery: "800Wh", fork: "RockShox ZEB Ultimate 160mm", shock: "RockShox Super Deluxe Ultimate - 148mm", drivetrain: "SRAM X0 Eagle Transmission", brakes: "SRAM Maven Silver", wheelset: "DT Swiss HX1501", tires: "Maxxis Minion DHF 2.5 / DHR II 2.4" },
          { name: "Ride", price: 8499, material: "Carbon", motor: "Bosch CX", battery: "800Wh", fork: "RockShox Lyrik Select+ 160mm", shock: "RockShox Super Deluxe Select - 148mm", drivetrain: "SRAM Eagle Mechanical", brakes: "SRAM DB8", wheelset: "DT Swiss E532", tires: "Maxxis Minion DHF 2.5 / DHR II 2.4" }
        ]
      },
      {
        name: "Shuttle LT",
        image: "/bikes/Pivot Shuttle LT.png",
        builds: [
          { name: "Team XX Transmission", price: 14999, material: "Carbon", motor: "Bosch CX Race", battery: "750Wh", fork: "Fox 38 Factory 170mm", shock: "Fox Float X2 Factory - 160mm", drivetrain: "SRAM XX Eagle Transmission", brakes: "Shimano XTR 4-Piston", wheelset: "DT Swiss Hybrid HX1501", tires: "Continental Kryptotal 2.4", wheels: "Mullet" },
          { name: "Pro X0 Transmission", price: 12599, material: "Carbon", motor: "Bosch CX Race", battery: "750Wh", fork: "Fox 38 Factory 170mm", shock: "Fox Float X2 Factory - 160mm", drivetrain: "SRAM X0 Eagle Transmission", brakes: "Shimano XT 4-Piston", wheelset: "DT Swiss Hybrid HX1501", tires: "Maxxis Assegai 2.5", wheels: "Mullet" },
          { name: "Ride SLX/XT", price: 8999, material: "Carbon", motor: "Bosch CX", battery: "750Wh", fork: "Fox 38 Performance 170mm", shock: "Fox Float X Performance - 160mm", drivetrain: "Shimano SLX/XT 12-Speed", brakes: "Shimano SLX 4-Piston", wheelset: "DT Swiss Hybrid H1900", tires: "Maxxis Assegai 2.5", wheels: "Mullet" }
        ]
      }
    ]
  },
  {
    brand: "Cannondale",
    logo: "https://placehold.co/200x100/ffffff/000000?text=CANNONDALE",
    models: [
      {
        name: "Moterra SL",
        image: "/bikes/Cannondale Moterra.png",
        builds: [
          { name: "LAB71", price: 14000, material: "Carbon", motor: "Shimano EP801", battery: "601Wh", fork: "Fox 36 Factory 160mm", shock: "Fox Float X Factory - 150mm", drivetrain: "SRAM XX Eagle AXS", brakes: "SRAM Code Ultimate Stealth", wheelset: "DT Swiss XMC 1501 Carbon", tires: "Maxxis DHF 2.5 / Dissector 2.4" },
          { name: "SL 1", price: 11549, material: "Carbon", motor: "Shimano EP801", battery: "601Wh", fork: "Fox 36 Factory 160mm", shock: "Fox Float X Factory - 150mm", drivetrain: "SRAM X0 Eagle AXS", brakes: "SRAM Code Silver Stealth", wheelset: "DT Swiss XM 1700", tires: "Maxxis DHF 2.5 / Dissector 2.4" },
          { name: "SL 2", price: 7699, material: "Carbon", motor: "Shimano EP801", battery: "601Wh", fork: "Fox 36 Performance 160mm", shock: "Fox Float X Performance - 150mm", drivetrain: "Shimano Deore XT", brakes: "Shimano Deore 6120", wheelset: "WTB KOM Tough i30", tires: "Maxxis DHF 2.5 / Dissector 2.4" }
        ]
      }
    ]
  },
  {
    brand: "Norco",
    logo: "https://placehold.co/200x100/ffffff/000000?text=NORCO",
    models: [
      {
        name: "Sight VLT CX",
        image: "/bikes/Norco Sight.png",
        builds: [
          { name: "C1", price: 9999, material: "Carbon", motor: "Bosch CX", battery: "800Wh", fork: "RockShox Lyrik Ultimate 160mm", shock: "RockShox Super Deluxe Ultimate - 150mm", drivetrain: "SRAM X0 Eagle Transmission", brakes: "SRAM Code RSC", wheelset: "Race Face Era Carbon", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "C2", price: 7999, material: "Carbon", motor: "Bosch CX", battery: "800Wh", fork: "RockShox Lyrik Select+ 160mm", shock: "RockShox Super Deluxe Select+ - 150mm", drivetrain: "SRAM GX Eagle Transmission", brakes: "SRAM Code Bronze", wheelset: "Stan's Flow", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "C3", price: 6699, material: "Carbon", motor: "Bosch CX", battery: "800Wh", fork: "RockShox Lyrik Select 160mm", shock: "RockShox Super Deluxe Select - 150mm", drivetrain: "Shimano Deore", brakes: "Shimano MT520 4-Piston", wheelset: "WTB ST i30", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" }
        ]
      },
      {
        name: "Range VLT CX",
        image: "/bikes/Norco Range.png",
        builds: [
          { name: "C1", price: 8999, material: "Carbon", motor: "Bosch CX", battery: "800Wh", fork: "RockShox ZEB Ultimate 170mm", shock: "RockShox Vivid Ultimate - 170mm", drivetrain: "SRAM X0 Transmission", brakes: "SRAM Maven Silver", wheelset: "Race Face Era Carbon", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "C2", price: 7299, material: "Carbon", motor: "Bosch CX", battery: "800Wh", fork: "RockShox ZEB Select+ 170mm", shock: "RockShox Vivid Select+ - 170mm", drivetrain: "SRAM GX Transmission", brakes: "SRAM Code Bronze", wheelset: "Stan's Flow", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" }
        ]
      }
    ]
  },
  {
    brand: "Amflow",
    logo: "https://placehold.co/200x100/ffffff/000000?text=AMFLOW",
    models: [
      {
        name: "PL Carbon",
        image: "/bikes/Amflow PL Carbon.png",
        builds: [
          { name: "Pro", price: 8599, material: "Carbon", motor: "DJI Avinox", battery: "800Wh", fork: "Fox 36 Factory 160mm", shock: "Fox Float X Factory - 150mm", drivetrain: "SRAM X0 Transmission", brakes: "Magura MT7 Pro", wheelset: "Amflow Carbon 30mm", tires: "Maxxis Assegai 2.5 / Dissector 2.4" },
          { name: "Standard", price: 6499, material: "Carbon", motor: "DJI Avinox", battery: "800Wh", fork: "Fox 36 Performance 160mm", shock: "Fox Float X Performance - 150mm", drivetrain: "SRAM GX Eagle", brakes: "Magura MT5", wheelset: "Amflow Alloy 30mm", tires: "Maxxis Assegai 2.5 / Dissector 2.4" }
        ]
      }
    ]
  },
  {
    brand: "Unno",
    logo: "https://placehold.co/200x100/ffffff/000000?text=UNNO",
    models: [
      {
        name: "Mith",
        image: "/bikes/Unno Mith.png",
        builds: [
          { name: "Factory", price: 13895, material: "Carbon", motor: "DJI Avinox", battery: "800Wh", fork: "Fox 38 Factory 170mm", shock: "Fox Float X2 Factory - 160mm", drivetrain: "SRAM XX Eagle AXS T-Type", brakes: "Formula Cura 4", wheelset: "NEWMEN Phase 30 Carbon", tires: "Schwalbe Magic Mary 2.5" },
          { name: "Pro", price: 11500, material: "Carbon", motor: "DJI Avinox", battery: "800Wh", fork: "Fox 38 Factory 170mm", shock: "Fox Float X2 Factory - 160mm", drivetrain: "SRAM X0 Eagle AXS T-Type", brakes: "Formula Cura 4", wheelset: "NEWMEN Phase 30 Carbon", tires: "Schwalbe Magic Mary 2.5" }
        ]
      }
    ]
  },
  {
    brand: "Crestline",
    logo: "https://placehold.co/200x100/ffffff/000000?text=CRESTLINE",
    models: [
      {
        name: "RS 181",
        image: "/bikes/Crestline rs181.png",
        builds: [
          { name: "Spectre Edition", price: 10500, material: "Carbon", motor: "DJI Avinox", battery: "800Wh", fork: "Fox 40 Factory 180mm", shock: "Fox Float X2 Factory - 180mm", drivetrain: "SRAM GX T-Type", brakes: "TRP Evo Pro", wheelset: "WAO Carbon", tires: "Continental Kryptotal 2.4" }
        ]
      }
    ]
  },
  {
    brand: "Salsa",
    logo: "https://placehold.co/200x100/ffffff/000000?text=SALSA",
    models: [
      {
        name: "Moraine",
        image: "/bikes/Salsa Moraine.png",
        builds: [
          { name: "Deore 12", price: 4999, material: "Aluminum", motor: "Fazua Ride 60", battery: "430Wh", fork: "RockShox Psylo Gold RC 160mm", shock: "Fox Float X Performance - 160mm", drivetrain: "Shimano Deore 12-Speed", brakes: "Shimano Deore M6120", wheelset: "WTB ST i30", tires: "Teravail Kessel 2.6 / Warwick 2.5" },
          { name: "CUES 10", price: 4199, material: "Aluminum", motor: "Fazua Ride 60", battery: "430Wh", fork: "RockShox Psylo Gold RC 160mm", shock: "Fox Float X Performance - 160mm", drivetrain: "Shimano CUES 10-Speed", brakes: "Shimano MT420", wheelset: "WTB ST i30", tires: "Teravail Kessel 2.6 / Warwick 2.5" }
        ]
      },
      {
        name: "Notch",
        image: "/bikes/Salsa Notch.png",
        builds: [
          { name: "Carbon Deore 12", price: 6999, material: "Carbon", motor: "Bosch CX", battery: "625Wh", fork: "Fox 38 Performance 170mm", shock: "Fox Float X Performance - 160mm", drivetrain: "Shimano Deore 12", brakes: "Shimano Deore 4-Piston", wheelset: "WTB KOM Tough i30", tires: "Teravail Kessel 2.5" },
          { name: "Alloy Deore 12", price: 5999, material: "Alloy", motor: "Bosch CX", battery: "500Wh", fork: "RockShox Domain Gold RC 170mm", shock: "Fox Float X Performance - 160mm", drivetrain: "Shimano Deore 12", brakes: "Shimano Deore 4-Piston", wheelset: "WTB ST i30 Tough", tires: "Teravail Kessel / Warwick 2.6" },
          { name: "Alloy Cues 10", price: 4999, material: "Alloy", motor: "Bosch CX", battery: "500Wh", fork: "SR Suntour ZERON36 160mm", shock: "RockShox Deluxe Select - 160mm", drivetrain: "Shimano CUES 10", brakes: "Shimano 4-Piston", wheelset: "WTB ST i30 Tough", tires: "Teravail Kessel / Warwick 2.6" }
        ]
      }
    ]
  },
  {
    brand: "Propain",
    logo: "https://placehold.co/200x100/ffffff/000000?text=PROPAIN",
    models: [
      {
        name: "Ekano 2 CF",
        image: "/bikes/PROPAIN Ekano.png",
        builds: [
          { name: "Factory", price: 11299, material: "Carbon", motor: "SRAM Powertrain", battery: "630Wh", fork: "Fox 38 Factory 180mm", shock: "Fox DHX2 Factory Coil - 170mm", drivetrain: "SRAM XX Transmission", brakes: "Magura MT7 Pro", wheelset: "Crankbrothers Synthesis Carbon", tires: "Schwalbe Magic Mary / Big Betty 2.4" },
          { name: "Ultimate", price: 9999, material: "Carbon", motor: "SRAM Powertrain", battery: "630Wh", fork: "RockShox ZEB Ultimate 180mm", shock: "RockShox Super Deluxe Ultimate Coil - 170mm", drivetrain: "SRAM X0 Transmission", brakes: "SRAM Code RSC", wheelset: "Newmen Evolution EG 30", tires: "Schwalbe Magic Mary / Big Betty 2.4" },
          { name: "Base", price: 7794, material: "Carbon", motor: "SRAM Powertrain", battery: "630Wh", fork: "RockShox ZEB Base 180mm", shock: "RockShox Super Deluxe Coil Select - 170mm", drivetrain: "SRAM GX Eagle", brakes: "SRAM DB8", wheelset: "Newmen Performance 30", tires: "Schwalbe Magic Mary / Big Betty 2.4" }
        ]
      }
    ]
  },
  {
    brand: "Mondraker",
    logo: "https://placehold.co/200x100/ffffff/000000?text=MONDRAKER",
    models: [
      {
        name: "Scree",
        image: "/bikes/Mondraker Scree.png",
        builds: [
          { name: "RR", price: 8199, material: "Alloy", motor: "Bosch CX", battery: "800Wh", fork: "Fox 36 Float Factory 160mm", shock: "Fox Float X Factory - 150mm", drivetrain: "SRAM GX Eagle", brakes: "SRAM Code Bronze", wheelset: "Mavic E-CrossRide 29", tires: "Maxxis Minion DHF 2.5 / DHR II 2.4" },
          { name: "S 600", price: 5999, material: "Alloy", motor: "Bosch CX", battery: "600Wh", fork: "RockShox Psylo Gold 160mm", shock: "RockShox Deluxe Select - 150mm", drivetrain: "SRAM NX Eagle", brakes: "SRAM DB8", wheelset: "Mavic E-CrossRide 29", tires: "Maxxis Minion DHF 2.5 / DHR II 2.4" }
        ]
      },
      {
        name: "Level",
        image: "/bikes/Mondraker Level.png",
        builds: [
          { name: "XR", price: 9999, material: "Alloy", motor: "Bosch CX", battery: "800Wh", fork: "Öhlins RXF38 M.2 180mm", shock: "Öhlins TTX22M Coil - 170mm", drivetrain: "SRAM X0 Transmission", brakes: "SRAM Code Silver", wheelset: "Mavic E-Deemax 29", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "R", price: 7699, material: "Alloy", motor: "Bosch CX", battery: "800Wh", fork: "RockShox ZEB Base 180mm", shock: "RockShox Super Deluxe Coil Select - 170mm", drivetrain: "SRAM GX Eagle", brakes: "SRAM DB8", wheelset: "Mavic E-Deemax 29", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" }
        ]
      },
      {
        name: "Crafty",
        image: "/bikes/Mondraker Crafty.png",
        builds: [
          { name: "Carbon RR", price: 9499, material: "Carbon", motor: "Bosch CX", battery: "750Wh", fork: "Fox 38 Factory 160mm", shock: "Fox Float X Factory - 150mm", drivetrain: "SRAM GX Eagle", brakes: "SRAM Code Bronze", wheelset: "Mavic E-Deemax 29", tires: "Maxxis Minion DHF 2.5 / DHR II 2.4" },
          { name: "R", price: 6599, material: "Alloy", motor: "Bosch CX", battery: "750Wh", fork: "Fox 38 Performance 160mm", shock: "Fox Float X Performance - 150mm", drivetrain: "SRAM NX Eagle", brakes: "SRAM DB8", wheelset: "Mavic E-Deemax 29", tires: "Maxxis Minion DHF 2.5 / DHR II 2.4" }
        ]
      },
      {
        name: "Dune",
        image: "/bikes/Mondraker Dune.png",
        builds: [
          { name: "XR", price: 12499, material: "Carbon", motor: "Bosch SX", battery: "400Wh", fork: "Öhlins RXF38 M.2 170mm", shock: "Öhlins TTX22M Coil - 165mm", drivetrain: "SRAM X0 Transmission", brakes: "SRAM Code Silver", wheelset: "E*thirteen Grappler Carbon", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" },
          { name: "RR", price: 8999, material: "Carbon", motor: "Bosch SX", battery: "400Wh", fork: "Fox 38 Factory 170mm", shock: "Fox Float X2 Factory - 165mm", drivetrain: "SRAM GX Eagle AXS", brakes: "SRAM Code Bronze", wheelset: "E*thirteen Grappler Alloy", tires: "Maxxis Assegai 2.5 / Minion DHR II 2.4" }
        ]
      },
      {
        name: "Neat",
        image: "/bikes/Mondraker Neat R.png",
        builds: [
          { name: "RR", price: 10499, material: "Carbon", motor: "TQ-HPR50", battery: "360Wh", fork: "Fox 36 Factory 160mm", shock: "Fox Float X Factory - 150mm", drivetrain: "SRAM GX Eagle AXS", brakes: "SRAM Code Bronze", wheelset: "Mavic E-Crossmax Carbon", tires: "Maxxis Minion DHF 2.5 / DHR II 2.4" },
          { name: "R", price: 7499, material: "Carbon", motor: "TQ-HPR50", battery: "360Wh", fork: "Fox 36 Performance 160mm", shock: "Fox Float X Performance - 150mm", drivetrain: "SRAM GX Eagle", brakes: "SRAM G2 R", wheelset: "Mavic E-Crossmax Alloy", tires: "Maxxis Minion DHF 2.5 / DHR II 2.4" }
        ]
      }
    ]
  }
];

function inferWheelsFromWheelset(ws?: string): string | undefined {
  if (!ws) return undefined;
  const s = ws.toLowerCase();
  if (s.includes('29/27') || s.includes('29/27.5') || s.includes('29/27') || s.includes('29/27.5') || s.includes('29/27.5')) return 'Mullet';
  if (s.includes('29')) return '29"';
  if (s.includes('27.5') || s.includes('27.5"') || s.includes('27.5')) return '27.5"';
  return undefined;
}

export const eMTBData = RAW_EMTB.map(brand => ({
  ...brand,
  models: brand.models.map(model => ({
    ...model,
    builds: model.builds.map(build => ({
      ...build,
      wheels: (build as any).wheels ?? inferWheelsFromWheelset(build.wheelset)
    }))
  }))
}));

