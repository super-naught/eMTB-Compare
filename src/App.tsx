import { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronDown, ArrowRight, Scale, Calculator, Filter, X, Star } from 'lucide-react';
import { eMTBData } from './bikeData';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import { supabase } from './supabaseClient';

const BIKES = eMTBData.flatMap(brand => 
  brand.models.map(model => ({
    id: `${brand.brand}-${model.name}`.toLowerCase().replace(/\s+/g, '-'),
    brand: brand.brand,
    model: model.name,
      suspension: (model as any).suspension || 'TBD',
    startingPrice: Math.min(...model.builds.map(b => b.price)),
    image: model.image,
    builds: model.builds.map(build => ({
      ...build,
      id: `${brand.brand}-${model.name}-${build.name}`.toLowerCase().replace(/\s+/g, '-'),
    }))
  }))
);

const ALL_BUILDS = eMTBData.flatMap(brand => 
  brand.models.flatMap(model => 
    model.builds.map(build => ({
      ...build,
      id: `${brand.brand}-${model.name}-${build.name}`.toLowerCase().replace(/\s+/g, '-'),
      brand: brand.brand,
      model: model.name,
      fullName: `${brand.brand} ${model.name} ${build.name}`,
      image: model.image
    }))
  )
);

export default function App() {
  const [view, setView] = useState('showroom');
  const [selectedBikeId, setSelectedBikeId] = useState<string | null>(null);
  const [selectedBuildId, setSelectedBuildId] = useState<string | null>(null);
  const [selectedBrandFilters, setSelectedBrandFilters] = useState<string[]>([]);
  const [selectedMotorFilters, setSelectedMotorFilters] = useState<string[]>([]);
  const [selectedWheelFilters, setSelectedWheelFilters] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedTorqueFilters, setSelectedTorqueFilters] = useState<string[]>([]);

// --- SUPABASE GARAGE LOGIC ---
  const { userId } = useAuth(); // Grabs the logged-in user's ID from Clerk
  const [favorites, setFavorites] = useState<string[]>([]);

  // 1. Fetch the user's saved bikes from Supabase whenever they log in
  useEffect(() => {
    const fetchGarage = async () => {
      if (!userId) {
        setFavorites([]); // Clear garage if they log out
        return;
      }
      
      const { data, error } = await supabase
        .from('user_garage')
        .select('build_id')
        .eq('user_id', userId);
        
      if (!error && data) {
        setFavorites(data.map((row: any) => row.build_id));
      } else if (error) {
        console.error("Error fetching garage:", error.message);
      }
    };

    fetchGarage();
  }, [userId]);
  // -----------------------------

  const [showGarage, setShowGarage] = useState(false);
const absoluteMaxPrice = useMemo(() => {
    const allPrices = ALL_BUILDS.map(b => b.price);
    const max = Math.max(...allPrices, 0);
    return Math.ceil(max / 1000) * 1000;
  }, []);

  const [priceFilter, setPriceFilter] = useState<number>(absoluteMaxPrice);

  // Accordion open state for filter categories (default closed)
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isMotorOpen, setIsMotorOpen] = useState(false);
  const [isTorqueOpen, setIsTorqueOpen] = useState(false);
  const [isWheelsOpen, setIsWheelsOpen] = useState(false);

  const [rigAId, setRigAId] = useState(ALL_BUILDS[0].id);
  const [rigBId, setRigBId] = useState(ALL_BUILDS[1].id);

  // --- NEW SCROLL PRESERVATION CODE ---
  const showroomScrollRef = useRef(0);

  // --- CAROUSEL LOGIC ---
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const heroImages = [
    "/hero-emtb.jpg",
    // Add your new dream rig action shots here!
    "/hero-2.jpg", 
    "/hero-3.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Changes image every 4 seconds
    return () => clearInterval(interval);
  }, []);
  // ----------------------

  useEffect(() => {
    if (view === 'showroom') {
      // Teleport back to the exact saved scroll position
      setTimeout(() => {
        window.scrollTo(0, showroomScrollRef.current);
      }, 10);
    } else {
      // If going to ANY other page (Builds, Compare, etc), snap to the top
      window.scrollTo(0, 0);
    }
  }, [view]);
  // ------------------------------------

  const selectedBike = BIKES.find(b => b.id === selectedBikeId);
  const selectedBuild = selectedBike?.builds.find(b => b.id === selectedBuildId);

  const rigA = ALL_BUILDS.find(b => b.id === rigAId);
  const rigB = ALL_BUILDS.find(b => b.id === rigBId);

  const brands = eMTBData.map(b => b.brand).sort((a, b) => a.localeCompare(b));
  
  const motors = useMemo(() => {
    const allMotors = new Set<string>();
    BIKES.forEach(bike => {
      bike.builds.forEach(build => {
        allMotors.add(build.motor);
      });
    });
    return Array.from(allMotors).sort((a, b) => a.localeCompare(b));
  }, []);

  const torques = useMemo(() => {
    return ['50Nm','55Nm','60Nm','65Nm','85Nm','90Nm','105Nm','108Nm','TBD'];
  }, []);

  // Stats for hero
  const totalBrands = eMTBData.length;
  const totalModels = eMTBData.reduce((acc, b) => acc + b.models.length, 0);
  const totalBuilds = eMTBData.reduce(
    (acc, b) => acc + b.models.reduce((macc, m) => macc + m.builds.length, 0),
    0
  );

  const filteredBikes = useMemo(() => {
    return BIKES.filter(bike => {
      if (showGarage) {
        return bike.builds.some(build => favorites.includes(build.id));
      }
      const matchesBrand = selectedBrandFilters.length === 0 || selectedBrandFilters.includes(bike.brand);
      const matchesMotor = selectedMotorFilters.length === 0 || bike.builds.some(build => selectedMotorFilters.includes(build.motor));
      const matchesWheels = selectedWheelFilters.length === 0 || bike.builds.some(build => (build as any).wheels && selectedWheelFilters.includes((build as any).wheels));
      const matchesTorque = selectedTorqueFilters.length === 0 || bike.builds.some(build => selectedTorqueFilters.includes(((build as any).torque) || 'TBD'));
      const matchesPrice = bike.startingPrice <= priceFilter;
      return matchesBrand && matchesMotor && matchesWheels && matchesTorque && matchesPrice;
    }).sort((a, b) => a.brand.localeCompare(b.brand));
  }, [selectedBrandFilters, selectedMotorFilters, selectedWheelFilters, selectedTorqueFilters, showGarage, favorites, priceFilter]);

  const groupedBikes = useMemo(() => {
    const map = new Map<string, typeof BIKES>();
    filteredBikes.forEach(bike => {
      if (!map.has(bike.brand)) map.set(bike.brand, [] as typeof BIKES);
      map.get(bike.brand)!.push(bike);
    });
    return Array.from(map.entries()).map(([brand, bikes]) => ({ brand, bikes })).sort((a, b) => a.brand.localeCompare(b.brand));
  }, [filteredBikes]);

  const toggleFavorite = async (buildId: string) => {
    // 1. Check if they are logged in first!
    if (!userId) {
      alert("Sign in to save rigs to your Dream Garage!");
      return;
    }

    const isFavorited = favorites.includes(buildId);

    // 2. Optimistic UI Update (Makes the button feel instant)
    setFavorites(prev => 
      isFavorited ? prev.filter(id => id !== buildId) : [...prev, buildId]
    );

    // 3. Background Database Sync
    if (isFavorited) {
      // If it was already favorited, delete it from Supabase
      const { error } = await supabase
        .from('user_garage')
        .delete()
        .match({ user_id: userId, build_id: buildId });
        
      if (error) console.error("Error removing bike:", error.message);
    } else {
      // If it wasn't favorited, insert it into Supabase
      const { error } = await supabase
        .from('user_garage')
        .insert({ user_id: userId, build_id: buildId });
        
      if (error) console.error("Error saving bike:", error.message);
    }
  };

  const clearFilters = () => {
    setSelectedBrandFilters([]);
    setSelectedMotorFilters([]);
    setSelectedWheelFilters([]);
    setSelectedTorqueFilters([]);
    setPriceFilter(absoluteMaxPrice);
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

  const randomizedBrands = useMemo(() => [...eMTBData].sort(() => Math.random() - 0.5), []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
<div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              showroomScrollRef.current = 0; // Reset bookmark
              setView('showroom');
            }}
          >
            <img src="/trail-math-logo-color-horizontal.svg" alt="Trail Math" className="h-10 w-auto" />
          </div>
          
          {view === 'showroom' && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setShowGarage(!showGarage);
                  if (!showGarage) {
                    clearFilters();
                  }
                }}
                className={`flex items-center gap-1.5 sm:gap-2 text-xs md:text-sm font-bold px-2 md:px-4 py-1.5 md:py-2 rounded-full transition-all ${showGarage ? 'bg-slate-100 text-slate-900' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
              >
                <Star size={16} className={showGarage ? 'fill-blue-600 text-blue-600' : 'text-slate-600'} />
                <span className="hidden sm:inline">{showGarage ? 'Exit Garage' : 'My Garage'}</span>
                <span className="sm:hidden">{showGarage ? 'Exit' : 'Garage'}</span>
              </button>
              <button 
                onClick={() => {
                  // Save the bookmark before leaving!
                  showroomScrollRef.current = window.scrollY;
                  setShowGarage(false);
                  setView('compare');
                }}
                className="flex items-center gap-1.5 sm:gap-2 text-xs md:text-sm font-bold px-2 md:px-4 py-1.5 md:py-2 rounded-full transition-all bg-slate-100 text-slate-900 hover:bg-slate-200"
              >
                <Scale size={16} className="text-slate-600" />
                <span className="hidden sm:inline">Compare Rigs</span>
                <span className="sm:hidden">Compare</span>
              </button>
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
            </div>
          )}
          {view !== 'showroom' && (
            <button 
              onClick={() => setView('showroom')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Back to Showroom
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {view === 'showroom' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {showGarage ? (
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                  Your <span className="text-blue-600">Dream Garage</span>
                </h1>
                <p className="text-lg text-slate-600">
                  The rigs you have saved for later.
                </p>
              </div>
            ) : (
              <>
{/* --- PREMIUM FLOATING DARK HERO --- */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
                    <div className="relative w-full bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800">
                      
                      {/* Subtle Background Glow Effect */}
                      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[40rem] h-[40rem] rounded-full bg-blue-600/10 blur-[80px] pointer-events-none"></div>
                      
                      <div className="relative flex flex-col md:flex-row items-center gap-8 lg:gap-12 p-8 sm:p-12 lg:p-16">
                        
                        {/* Left Side: Copy & Metrics */}
                        <div className="md:w-1/2 space-y-8 z-10">
                          <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-blue-400 text-xs font-bold uppercase tracking-wider">
                              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                              The eMTB Database
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-[1.05]">
                              FIND YOUR NEXT <br />
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">DREAM RIG</span>
                            </h1>
                          </div>
                          
                          <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                            TRAIL MATH is the world's first and largest definitive catalog & comparison tool for current gen eMTBs.
                          </p>
                          
                          {/* Stripped-back premium metric layout */}
                          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80">
                            <div>
                              <div className="text-3xl lg:text-5xl font-black text-white">{totalBrands}</div>
                              <div className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Brands</div>
                            </div>
                            <div>
                              <div className="text-3xl lg:text-5xl font-black text-white">{totalModels}</div>
                              <div className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Models</div>
                            </div>
                            <div>
                              <div className="text-3xl lg:text-5xl font-black text-white">{totalBuilds}</div>
                              <div className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Builds</div>
                            </div>
                          </div>
                        </div>

                        {/* Right Side: Endless Carousel */}
                        <div className="md:w-1/2 w-full mt-8 md:mt-0 relative z-10 aspect-[4/3] sm:aspect-video md:aspect-[4/3] lg:aspect-video rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-700/50 transform md:-rotate-2 hover:rotate-0 transition-all duration-500 overflow-hidden">
                          {heroImages.map((src, index) => (
                            <img 
                              key={src}
                              src={src} 
                              alt={`Dream Rig ${index + 1}`} 
                              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                                index === heroImageIndex ? 'opacity-100' : 'opacity-0'
                              }`} 
                              crossOrigin="anonymous"
                            />
                          ))}
                        </div>
                        
                      </div>
                    </div>
                  </div>

                  {/* light logo strip with fade edges */}
                  <div className="w-full mb-20 [mask-image:_linear-gradient(to_right,transparent_0,_black_10%,_black_90%,transparent_100%)]">
                    <div className="w-full bg-white border-y border-slate-200 py-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      <div className="flex items-center space-x-8 px-4 w-max animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused]">
                        {randomizedBrands.map(b => (
                          b.logo && (
                            <img
                              key={`${b.brand}-1`}
                              src={b.logo}
                              alt={b.brand}
                              className="h-6 md:h-8 max-w-[120px] md:max-w-[140px] w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                            />
                          )
                        ))}
                        {randomizedBrands.map(b => (
                          b.logo && (
                            <img
                              key={`${b.brand}-2`}
                              src={b.logo}
                              alt={b.brand}
                              className="h-6 md:h-8 max-w-[120px] md:max-w-[140px] w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                            />
                          )
                        ))}
                      </div>
                    </div>
                  </div>
              </>
            )}

            {!showGarage && (
              <>
<div className="sticky top-16 z-20 bg-slate-50/90 backdrop-blur-md py-4 border-b border-slate-200 -mx-4 px-4 sm:mx-0 sm:px-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    
                    {/* Top/Left Side: Filters & Badge */}
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => setIsFilterModalOpen(true)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-300 py-2.5 px-6 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                      >
                        <Filter size={16} className="text-blue-600" />
                        Filter Rigs {(selectedBrandFilters.length > 0 || selectedMotorFilters.length > 0 || selectedWheelFilters.length > 0 || selectedTorqueFilters.length > 0) && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{selectedBrandFilters.length + selectedMotorFilters.length + selectedWheelFilters.length + selectedTorqueFilters.length}</span>}
                      </button>

                      <span className="flex-1 sm:flex-none text-center text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-2.5 rounded-xl">
                        {filteredBikes.length} {filteredBikes.length === 1 ? 'Match' : 'Matches'}
                      </span>

                      {(selectedBrandFilters.length > 0 || selectedMotorFilters.length > 0 || selectedWheelFilters.length > 0 || selectedTorqueFilters.length > 0 || priceFilter !== absoluteMaxPrice) && (
                        <button onClick={clearFilters} className="text-sm text-slate-500 hover:text-slate-800 font-medium whitespace-nowrap px-2">
                          Clear All
                        </button>
                      )}
                    </div>

                    {/* Bottom/Right Side: Budget Slider */}
                    <div className="w-full sm:w-auto flex flex-col min-w-[100%] sm:min-w-[240px] bg-white sm:bg-transparent p-4 sm:p-0 rounded-xl border sm:border-0 border-slate-200 shadow-sm sm:shadow-none">
                      <div className="flex justify-between items-center w-full text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 sm:mb-2">
                        <span>Budget</span>
                        <span className="text-blue-600 bg-blue-50 sm:bg-transparent px-2 py-0.5 sm:p-0 rounded">Under ${priceFilter.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={absoluteMaxPrice}
                        step="500"
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
                      />
                    </div>
                    
                  </div>
                </div>
                {isFilterModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFilterModalOpen(false)} />
                    <div className="bg-white rounded-xl shadow-xl w-[90vw] max-w-md max-h-[80vh] flex flex-col relative z-10 overflow-hidden">
                      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 shrink-0">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">Filters</h2>
                        <button onClick={() => setIsFilterModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                          <X size={20} className="text-slate-500" />
                        </button>
                      </div>

                      <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
                        {/* Brand Accordion */}
                        <div>
                          <button
                            onClick={() => setIsBrandOpen(v => !v)}
                            className="w-full flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-md"
                            aria-expanded={isBrandOpen}
                          >
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-900">Brand</span>
                            <ChevronDown className={`transition-transform ${isBrandOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isBrandOpen && (
                            <div className="mt-3 space-y-2">
                              {brands.map(brand => {
                                const isSelected = selectedBrandFilters.includes(brand);
                                return (
                                  <label key={brand} className="flex items-center gap-3 cursor-pointer">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                                      {isSelected && <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={isSelected} onChange={() => setSelectedBrandFilters(prev => isSelected ? prev.filter(b => b !== brand) : [...prev, brand])} />
                                    <span className="text-sm text-slate-700">{brand}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Motor Accordion */}
                        <div>
                          <button
                            onClick={() => setIsMotorOpen(v => !v)}
                            className="w-full flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-md"
                            aria-expanded={isMotorOpen}
                          >
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-900">Motor</span>
                            <ChevronDown className={`transition-transform ${isMotorOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isMotorOpen && (
                            <div className="mt-3 space-y-2">
                              {motors.map(motor => {
                                const isSelected = selectedMotorFilters.includes(motor);
                                return (
                                  <label key={motor} className="flex items-center gap-3 cursor-pointer">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                                      {isSelected && <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={isSelected} onChange={() => setSelectedMotorFilters(prev => isSelected ? prev.filter(m => m !== motor) : [...prev, motor])} />
                                    <span className="text-sm text-slate-700">{motor}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Torque Accordion */}
                        <div>
                          <button
                            onClick={() => setIsTorqueOpen(v => !v)}
                            className="w-full flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-md"
                            aria-expanded={isTorqueOpen}
                          >
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-900">Torque</span>
                            <ChevronDown className={`transition-transform ${isTorqueOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isTorqueOpen && (
                            <div className="mt-3 space-y-2">
                              {torques.map(tq => {
                                const isSelected = selectedTorqueFilters.includes(tq);
                                return (
                                  <label key={tq} className="flex items-center gap-3 cursor-pointer">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                                      {isSelected && <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={isSelected} onChange={() => setSelectedTorqueFilters(prev => isSelected ? prev.filter(x => x !== tq) : [...prev, tq])} />
                                    <span className="text-sm text-slate-700">{tq}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Wheels Accordion */}
                        <div>
                          <button
                            onClick={() => setIsWheelsOpen(v => !v)}
                            className="w-full flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-md"
                            aria-expanded={isWheelsOpen}
                          >
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-900">Wheels</span>
                            <ChevronDown className={`transition-transform ${isWheelsOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isWheelsOpen && (
                            <div className="mt-3 space-y-2">
                              {['29"', '27.5"', 'Mullet'].map(w => {
                                const isSelected = selectedWheelFilters.includes(w);
                                return (
                                  <label key={w} className="flex items-center gap-3 cursor-pointer">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                                      {isSelected && <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={isSelected} onChange={() => setSelectedWheelFilters(prev => isSelected ? prev.filter(x => x !== w) : [...prev, w])} />
                                    <span className="text-sm text-slate-700">{w}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex gap-4">
                        <button onClick={clearFilters} className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors">Clear Filters</button>
                        <button onClick={() => setIsFilterModalOpen(false)} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl shadow-sm shadow-blue-200 hover:bg-blue-700 transition-colors">
                          Show {filteredBikes.length} {filteredBikes.length === 1 ? 'Match' : 'Matches'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {groupedBikes.map(group => (
              <section key={group.brand} className="w-full">
                <div className="w-full">
                  <h2 className="text-6xl md:text-8xl font-bold italic uppercase tracking-tight text-black/5 select-none border-b-2 border-gray-200 pb-2 mb-6 md:mb-8">{group.brand}</h2>
                </div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.bikes.map(bike => (
                    <div 
                      key={bike.id} 
                      onClick={() => {
                        // Save the bookmark before leaving!
                        showroomScrollRef.current = window.scrollY;
                        setSelectedBikeId(bike.id);
                        setView('builds');
                      }}
                      className="bg-[slate-50] rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md hover:scale-[1.02] hover:border-blue-600 transition-all duration-300 cursor-pointer group flex flex-col"
                    >
                      <div className="w-full p-0 h-100 overflow-hidden relative shrink-0">
                        <img 
                          src={bike.image} 
                          alt={bike.model} 
                          // Removed group-hover:scale-125 and transition classes so the image stays still
                          className="w-full h-full object-contain scale-110"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-center min-w-0">
                        <div className="flex justify-between items-center text-xs uppercase mb-1">
                          <div className="text-xs font-bold text-slate-900 tracking-wide truncate">{bike.brand}</div>
                          <span className="text-gray-400 font-medium">{(bike as any).suspension || 'TBD'}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4 truncate">{bike.model}</h3>
                        <div className="mt-auto flex items-center justify-between">
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Starting at</div>
                            <div className="text-lg font-bold text-slate-900">{formatPrice(bike.startingPrice)}</div>
                          </div>
                          <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
                            <ArrowRight size={20} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

{view === 'builds' && selectedBike && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
            <button 
              onClick={() => setView('showroom')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold transition-colors"
            >
              <ChevronLeft size={20} />
              Back to Showroom
            </button>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* --- LEFT COLUMN: Bike Summary --- */}
              <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 flex flex-col">
                  {/* Edge-to-edge image matching the Calculator view */}
                  <div className="w-full h-64 sm:h-72 bg-[#F3F3F3] relative m-0 p-0 overflow-hidden flex items-center justify-center">
                    <img 
                      src={selectedBike.image} 
                      alt={selectedBike.model} 
                      className="absolute inset-0 w-full h-full object-contain scale-110"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="p-8 text-center flex flex-col items-center">
                    {eMTBData.find(b => b.brand === selectedBike.brand)?.logo && (
                      <img 
                        src={eMTBData.find(b => b.brand === selectedBike.brand)?.logo} 
                        alt={selectedBike.brand} 
                        className="h-10 w-auto object-contain mx-auto mb-4" 
                        crossOrigin="anonymous" 
                      />
                    )}
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{selectedBike.model}</h2>
                    <p className="text-slate-500 font-medium">
                      Select a build below to review specs and calculate payments.
                    </p>
                  </div>
                </div>
              </div>

              {/* --- RIGHT COLUMN: Builds List --- */}
              <div className="w-full lg:w-2/3 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {showGarage ? 'Favorited Builds' : 'Available Builds'}
                  </h3>
                  <span className="text-sm font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
                    {selectedBike.builds.filter(b => showGarage ? favorites.includes(b.id) : true).length} Options
                  </span>
                </div>
                
{selectedBike.builds.filter(b => showGarage ? favorites.includes(b.id) : true).map(build => (
                  <div 
                    key={build.id}
                    onClick={() => {
                      setSelectedBuildId(build.id);
                      setView('calculator');
                    }}
                    className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-600 hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col gap-4 sm:gap-5"
                  >
                    {/* --- HEADER ROW: Title, Price & Buttons --- */}
                    <div className="flex items-start sm:items-center justify-between gap-4">
                      
                      {/* Left: Info Stack */}
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                        <h4 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {build.name}
                        </h4>
                        <span className="text-lg sm:text-xl font-extrabold text-slate-900 bg-slate-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg border border-slate-100 inline-block w-fit">
                          {formatPrice(build.price)}
                        </span>
                      </div>
                      
                      {/* Right: Action Buttons */}
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(build.id);
                          }}
                          className="p-2 sm:p-3 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors"
                          title="Save to Garage"
                        >
                          <Star size={20} className={favorites.includes(build.id) ? 'fill-blue-500 text-blue-500' : 'text-slate-400'} />
                        </button>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </div>
                    
                    {/* --- BOTTOM ROW: Mini Spec Grid --- */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-slate-100">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Motor</div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-700 truncate">{build.motor}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Battery</div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-700 truncate">{build.battery}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Material</div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-700 truncate">{build.material}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Torque</div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-700 truncate">{(build as any).torque || 'TBD'}</div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
            </div>
          </div>
        )}

        {view === 'calculator' && selectedBuild && selectedBike && (
          <CalculatorView 
            bike={selectedBike} 
            build={selectedBuild} 
            onBack={() => setView('builds')}
            isFavorite={favorites.includes(selectedBuild.id)}
            onToggleFavorite={() => toggleFavorite(selectedBuild.id)}
          />
        )}

{view === 'compare' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center justify-between mb-2 sm:mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Head-to-Head</h2>
                <p className="text-slate-600 mt-2">Compare specs side-by-side to find your perfect match.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
              
              {/* --- TOP HEADERS: Dropdowns & Images --- */}
              <div className="grid grid-cols-2 divide-x divide-slate-200">
                
                {/* RIG A */}
                <div className="flex flex-col">
                  <div className="p-3 sm:p-6 bg-white border-b border-slate-100 z-10">
                    <label className="block text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Rig A</label>
                    <select 
                      value={rigAId}
                      onChange={(e) => setRigAId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2 sm:p-3 truncate"
                    >
                      {ALL_BUILDS.map(b => (
                        <option key={b.id} value={b.id}>{b.brand} {b.model} {b.name}</option>
                      ))}
                    </select>
                  </div>
                  {rigA && (
                    <>
                      <div className="w-full aspect-[4/3] sm:aspect-video bg-[#F3F3F3] relative overflow-hidden flex items-center justify-center">
                        <img src={rigA.image} alt={rigA.fullName} className="absolute inset-0 w-full h-full object-contain scale-110 sm:scale-125" crossOrigin="anonymous" />
                      </div>
                      <div className="p-4 sm:p-8 text-center bg-white border-b border-slate-200 flex-1 flex flex-col justify-center">
                        <h3 className="text-sm sm:text-2xl font-extrabold text-slate-900 leading-tight mb-1 sm:mb-2">{rigA.model} <br className="sm:hidden" />{rigA.name}</h3>
                        <div className="text-sm sm:text-xl font-bold text-blue-600">{formatPrice(rigA.price)}</div>
                      </div>
                    </>
                  )}
                </div>

                {/* RIG B */}
                <div className="flex flex-col">
                  <div className="p-3 sm:p-6 bg-white border-b border-slate-100 z-10">
                    <label className="block text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Rig B</label>
                    <select 
                      value={rigBId}
                      onChange={(e) => setRigBId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-2 sm:p-3 truncate"
                    >
                      {ALL_BUILDS.map(b => (
                        <option key={b.id} value={b.id}>{b.brand} {b.model} {b.name}</option>
                      ))}
                    </select>
                  </div>
                  {rigB && (
                    <>
                      <div className="w-full aspect-[4/3] sm:aspect-video bg-[#F3F3F3] relative overflow-hidden flex items-center justify-center">
                        <img src={rigB.image} alt={rigB.fullName} className="absolute inset-0 w-full h-full object-contain scale-110 sm:scale-125" crossOrigin="anonymous" />
                      </div>
                      <div className="p-4 sm:p-8 text-center bg-white border-b border-slate-200 flex-1 flex flex-col justify-center">
                        <h3 className="text-sm sm:text-2xl font-extrabold text-slate-900 leading-tight mb-1 sm:mb-2">{rigB.model} <br className="sm:hidden" />{rigB.name}</h3>
                        <div className="text-sm sm:text-xl font-bold text-emerald-600">{formatPrice(rigB.price)}</div>
                      </div>
                    </>
                  )}
                </div>

              </div>

              {/* --- BOTTOM SPECS: Strict Row Grid --- */}
              {rigA && rigB && (
                <div className="bg-slate-50 divide-y divide-slate-200">
                  {[
                    { label: 'Material', a: rigA.material, b: rigB.material },
                    { label: 'Motor', a: rigA.motor, b: rigB.motor },
                    { label: 'Torque', a: (rigA as any).torque || 'TBD', b: (rigB as any).torque || 'TBD' },
                    { label: 'Battery', a: rigA.battery, b: rigB.battery },
                    { label: 'Drivetrain', a: rigA.drivetrain || 'TBD', b: rigB.drivetrain || 'TBD' },
                    { label: 'Fork', a: rigA.fork || 'TBD', b: rigB.fork || 'TBD' },
                    { label: 'Shock', a: rigA.shock || 'TBD', b: rigB.shock || 'TBD' },
                    { label: 'Brakes', a: rigA.brakes || 'TBD', b: rigB.brakes || 'TBD' },
                    { label: 'Wheelset', a: rigA.wheelset || 'TBD', b: rigB.wheelset || 'TBD' },
                    { label: 'Tires', a: (rigA as any).tires || 'TBD', b: (rigB as any).tires || 'TBD' },
                  ].map((spec, idx) => (
                    <div key={idx} className="hover:bg-white transition-colors">
                      {/* Desktop/Tablet Row Layout */}
                      <div className="hidden sm:grid grid-cols-3 items-center py-4 px-6">
                        <div className="text-right pr-6 font-semibold text-slate-900 text-sm">{spec.a}</div>
                        <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 py-1 rounded-md">{spec.label}</div>
                        <div className="text-left pl-6 font-semibold text-slate-900 text-sm">{spec.b}</div>
                      </div>
                      
                      {/* Mobile Row Layout */}
                      <div className="sm:hidden flex flex-col py-3 px-4">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-1">{spec.label}</div>
                        <div className="grid grid-cols-2 gap-4 divide-x divide-slate-200">
                          <div className="text-center text-xs font-semibold text-slate-900 pr-2">{spec.a}</div>
                          <div className="text-center text-xs font-semibold text-slate-900 pl-2">{spec.b}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}      </main>
    </div>
  );
}

function CalculatorView({ bike, build, onBack, isFavorite, onToggleFavorite }: { bike: any, build: any, onBack: () => void, isFavorite: boolean, onToggleFavorite: () => void }) {
  const [downPayment, setDownPayment] = useState<number | string>('');
  const [promo, setPromo] = useState('none');
  const [standardTerm, setStandardTerm] = useState(36);
  const [standardApr, setStandardApr] = useState(7.99);
  const [taxRate, setTaxRate] = useState<number>(0);

useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const price = build.price;
  
    const { monthlyPayment, totalInterest, totalCost, principal, activeTerm, taxAmount, totalFinanced } = useMemo(() => {
    const taxAmount = build.price * (taxRate / 100);

    // 1. Safely convert the downPayment to a real number (or 0 if it's blank)
    const downPaymentValue = Number(downPayment) || 0;
    
    // 2. Calculate the true financed amount (Price + Tax - Down Payment)
    const totalFinanced = build.price + taxAmount - downPaymentValue;
    
    // 3. The principal is just the totalFinanced, no need to subtract twice!
    const p = Math.max(0, totalFinanced);
    
    if (promo === '6mo' || promo === '12mo') {
      const t = promo === '6mo' ? 6 : 12;
      return {
        principal: p,
        activeTerm: t,
        monthlyPayment: p / t,
        totalInterest: 0,
        totalCost: totalFinanced, // Notice totalCost and totalFinanced are now perfectly accurate
        taxAmount,
        totalFinanced
      };
    }

    const r = standardApr / 100 / 12;
    const t = standardTerm;
    
    let m = 0;
    let interest = 0;

    if (r === 0) {
      m = p / t;
      interest = 0;
    } else if (p > 0) {
      m = (p * r) / (1 - Math.pow(1 + r, -t));
      interest = (m * t) - p;
    }

    return {
      principal: p,
      activeTerm: t,
      monthlyPayment: m,
      totalInterest: interest,
      totalCost: totalFinanced + interest,
      taxAmount,
      totalFinanced
    };
  }, [price, downPayment, promo, standardTerm, standardApr, taxRate]);

  const formatMoney = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="flex justify-between items-center w-full">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Builds
        </button>
        
        <button 
          onClick={onToggleFavorite}
          className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold transition-all shadow-sm ${
            isFavorite 
              ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-blue-300'
          }`}
        >
          <Star size={18} className={isFavorite ? 'fill-blue-600 text-blue-600' : 'text-slate-400'} />
          <span className="hidden sm:inline">{isFavorite ? 'Saved to Garage' : 'Save to Garage'}</span>
          <span className="sm:hidden">{isFavorite ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="w-full space-y-6">
          {/* --- SELECTED BIKE SUMMARY CARD --- */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col w-full border border-gray-100">
            
            {/* 1. TRUE EDGE-TO-EDGE IMAGE (Zero Padding, Absolute Fill) */}
            <div className="w-full h-64 sm:h-72 bg-[#F3F3F3] relative m-0 p-0 overflow-hidden flex items-center justify-center">
              <img 
                src={bike.image} 
                alt={bike.model} 
                className="absolute inset-0 w-full h-full object-contain scale-110"
              />
            </div>

            {/* 2. TEXT CONTENT (Generous Padding applied ONLY here) */}
            <div className="p-8 flex flex-col">
              
              {/* Header: Logo, Name, Price */}
              <div className="flex flex-col items-center pb-6 border-b border-gray-100 gap-1">
                <img 
                  src={eMTBData.find(b => b.brand === bike.brand)?.logo} 
                  alt={bike.brand} 
                  className="h-10 object-contain mb-2" 
                />
                <h2 className="text-lg font-bold text-slate-900 text-center leading-snug">
                  {bike.model} - {build.name} build
                </h2>
                <p className="text-2xl font-medium text-blue-600">
                  {formatMoney(price)}
                </p>
              </div>

              {/* 3. Specs Grid (Perfect 2-Column Layout) */}
    <div className="grid grid-cols-2 gap-x-8 gap-y-6 pt-6">
      
      {/* Row 1: Frame & Travel */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Material</span>
        <span className="text-sm font-medium text-slate-800">{build.material || bike.material || 'TBD'}</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Suspension</span>
        <span className="text-sm font-medium text-slate-800">{bike.suspension}</span>
      </div>

      {/* Row 2: Suspension Details */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Fork</span>
        <span className="text-sm font-medium text-slate-800">{build.fork || bike.fork || 'TBD'}</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Shock</span>
        <span className="text-sm font-medium text-slate-800">{build.shock || bike.shock || 'TBD'}</span>
      </div>

      {/* Row 3: E-Bike System */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Motor</span>
        <span className="text-sm font-medium text-slate-800">{build.motor || bike.motor || 'TBD'}</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Battery</span>
        <span className="text-sm font-medium text-slate-800">{build.battery || bike.battery || 'TBD'}</span>
      </div>

      {/* Row 4: Drivetrain & Brakes */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Drivetrain</span>
        <span className="text-sm font-medium text-slate-800">{build.drivetrain || bike.drivetrain || 'TBD'}</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Brakes</span>
        <span className="text-sm font-medium text-slate-800">{build.brakes || bike.brakes || 'TBD'}</span>
      </div>

    </div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-8">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="text-xl font-bold text-slate-300 mb-8">What's the Damage?</h3>
            
            <div className="space-y-8">
              <div>
                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-2">Estimated Monthly</div>
                <div className="text-6xl font-extrabold text-white tracking-tight">
                  {formatMoney(monthlyPayment)}<span className="text-2xl text-slate-500 font-medium">/mo</span>
                </div>
                <div className="text-blue-400 text-sm font-medium mt-2">
                  For {activeTerm} months
                </div>
              </div>

              <div className="h-px bg-slate-800 w-full"></div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Rig Price</span>
                  <span className="font-semibold">{formatMoney(price)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Estimated Tax</span>
                  <span className="font-semibold">{formatMoney(taxAmount || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Down Payment</span>
                  <span className="font-semibold text-blue-400">-{formatMoney(Number(downPayment) || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Interest</span>
                  <span className="font-semibold text-rose-400">+{formatMoney(totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Financed</span>
                  <span className="font-semibold">{formatMoney(totalFinanced || price)}</span>
                </div>
              </div>

              <div className="h-px bg-slate-800 w-full"></div>

              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-slate-300">Total Out of Pocket</span>
                <span className="font-bold text-white">{formatMoney(totalCost)}</span>
              </div>
            </div>

{/* --- NEW AFFILIATE CTA (INACTIVE) --- */}
            <div className="mt-8 pt-8 border-t border-slate-800">
              <button 
                onClick={(e) => e.preventDefault()}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 text-slate-400 font-extrabold text-lg py-4 px-6 rounded-xl cursor-not-allowed"
              >
                Local Dealer Search (Coming Soon)
              </button>
              <p className="text-center text-[10px] text-slate-500 mt-3 uppercase tracking-wider font-semibold">
                Direct retailer connections launching soon
              </p>
            </div>
            {/* ------------------------- */}
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
              <Calculator size={24} className="text-blue-600" />
              Trail Math
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Down Payment ($)</label>
                  <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none">
                    $
                  </span>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={downPayment}
                    placeholder="0"
                    onChange={(e) => {
                      const raw = String(e.target.value).replace(/\D/g, '');
                      const sanitized = raw.replace(/^0+/, '');
                      setDownPayment(sanitized === '' ? '' : Number(sanitized));
                    }}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-lg rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 pl-9 transition-colors placeholder:text-slate-400"
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                  <span>Financing: {formatMoney(principal)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">0% Promos</label>
                <div className="grid grid-cols-3 gap-3">
                  {['none', '6mo', '12mo'].map(p => (
                    <button
                      key={p}
                      onClick={() => setPromo(p)}
                      className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border ${
                        promo === p 
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {p === 'none' ? 'N/A' : p === '6mo' ? '0% for 6 Mo' : '0% for 12 Mo'}
                    </button>
                  ))}
                </div>
              </div>

{/* --- TAX INPUT --- */}
              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Estimated Sales Tax (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-lg font-bold rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-4 shadow-sm"
                    placeholder="e.g. 9.5"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-bold">%</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 font-medium uppercase tracking-wider">
                  Include state, county, and city taxes for accurate math
                </p>
              </div>

{/* 2. THE DISABLED WRAPPER (For standard terms/APR that should fade out) */}
<div className={`space-y-6 transition-opacity duration-300 ${promo !== 'none' ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
               
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Standard Term (Months)</label>
                  <input 
                    type="range" 
                    min="12" 
                    max="72" 
                    step="12"
                    value={standardTerm}
                    onChange={(e) => setStandardTerm(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="text-center font-bold text-slate-700 mt-2">{standardTerm} Months</div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Standard APR (%)</label>
                  <input 
                    type="number" 
                    min="0"
                    step="0.1"
                    value={standardApr}
                    onChange={(e) => setStandardApr(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-lg rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
