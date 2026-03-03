import { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronDown, ArrowRight, Scale, Calculator, Filter, X, Star, Plus, Minus, MapPin, ShoppingCart } from 'lucide-react';
import { eMTBData } from './bikeData';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import { supabase } from './supabaseClient';

// --- STRICT TYPES ---
interface BuildType {
  name: string;
  price: number;
  material: string;
  motor: string;
  torque?: string;
  battery: string;
  fork: string;
  shock: string;
  drivetrain: string;
  brakes: string;
  wheelset: string;
  tires?: string;
  wheels?: string;
}

interface ModelType {
  name: string;
  image: string;
  suspension?: string;
  builds: BuildType[];
}

interface BrandType {
  brand: string;
  logo?: string;
  models: ModelType[];
}

const typedData = eMTBData as unknown as BrandType[];

const BIKES = typedData.flatMap(brand => 
  brand.models.map(model => ({
    id: `${brand.brand}-${model.name}`.toLowerCase().replace(/\s+/g, '-'),
    brand: brand.brand,
    model: model.name,
    suspension: model.suspension || 'TBD',
    startingPrice: Math.min(...model.builds.map(b => b.price)),
    image: model.image,
    builds: model.builds.map(build => ({
      ...build,
      id: `${brand.brand}-${model.name}-${build.name}`.toLowerCase().replace(/\s+/g, '-'),
    }))
  }))
);

const ALL_BUILDS = typedData.flatMap(brand => 
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

// --- CUSTOM BRANDED STEPPER COMPONENT ---
function BrandedStepper({ label, value, onChange, step = 1, suffix = "" }: { label: string, value: number, onChange: (val: number) => void, step?: number, suffix?: string }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
      <div className="relative flex items-center bg-[#0B1121] border border-slate-700 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
        <button 
          type="button"
          onClick={() => onChange(Math.max(0, Number((value - step).toFixed(2))))}
          className="p-3 text-blue-500 hover:bg-slate-800 transition-colors shrink-0"
        >
          <Minus size={18} strokeWidth={3} />
        </button>
        
        <input 
          type="number" 
          value={value || ''} 
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)} 
          className="w-full bg-transparent border-none text-white text-center text-lg font-bold focus:ring-0 p-3 placeholder:text-slate-600 outline-none" 
          placeholder="0.0"
        />
        {suffix && <span className="absolute right-14 text-slate-600 font-black pointer-events-none">{suffix}</span>}

        <button 
          type="button"
          onClick={() => onChange(Number((value + step).toFixed(2)))}
          className="p-3 text-blue-500 hover:bg-slate-800 transition-colors shrink-0"
        >
          <Plus size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<string>('showroom');
  const [selectedBikeId, setSelectedBikeId] = useState<string | null>(null);
  const [selectedBuildId, setSelectedBuildId] = useState<string | null>(null);
  
  const [selectedBrandFilters, setSelectedBrandFilters] = useState<string[]>([]);
  const [selectedMotorFilters, setSelectedMotorFilters] = useState<string[]>([]);
  const [selectedWheelFilters, setSelectedWheelFilters] = useState<string[]>([]);
  const [selectedTorqueFilters, setSelectedTorqueFilters] = useState<string[]>([]);
  const [selectedTravelFilters, setSelectedTravelFilters] = useState<string[]>([]);
  const [selectedDrivetrainFilters, setSelectedDrivetrainFilters] = useState<string[]>([]); 
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isMotorOpen, setIsMotorOpen] = useState(false);
  const [isTorqueOpen, setIsTorqueOpen] = useState(false);
  const [isWheelsOpen, setIsWheelsOpen] = useState(false);
  const [isTravelOpen, setIsTravelOpen] = useState(false);
  const [isDrivetrainOpen, setIsDrivetrainOpen] = useState(false); 

  const [selectingRig, setSelectingRig] = useState<'A' | 'B' | null>(null);
  const [selectorBrand, setSelectorBrand] = useState<string | null>(null);
  const [selectorGarageOnly, setSelectorGarageOnly] = useState(false);
  const [rigAId, setRigAId] = useState(ALL_BUILDS[0].id);
  const [rigBId, setRigBId] = useState(ALL_BUILDS[1].id);

  const { userId } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showGarage, setShowGarage] = useState(false);

  useEffect(() => {
    const fetchGarage = async () => {
      if (!userId) {
        setFavorites([]);
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

  const absoluteMaxPrice = useMemo(() => {
    const allPrices = ALL_BUILDS.map(b => b.price);
    const max = Math.max(...allPrices, 0);
    return Math.ceil(max / 1000) * 1000;
  }, []);
  const [priceFilter, setPriceFilter] = useState<number>(absoluteMaxPrice);

  const showroomScrollRef = useRef(0);

  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const heroImages = ["/hero-emtb.jpg", "/hero-2.jpg", "/hero-3.jpg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    if (view === 'showroom') {
      setTimeout(() => window.scrollTo(0, showroomScrollRef.current), 10);
    } else {
      window.scrollTo(0, 0);
    }
  }, [view]);

  const selectedBike = BIKES.find(b => b.id === selectedBikeId);
  const selectedBuild = selectedBike?.builds.find(b => b.id === selectedBuildId);
  const rigA = ALL_BUILDS.find(b => b.id === rigAId);
  const rigB = ALL_BUILDS.find(b => b.id === rigBId);

  const brands = eMTBData.map(b => b.brand).sort((a, b) => a.localeCompare(b));
  
  const motors = useMemo(() => {
    const allMotors = new Set<string>();
    BIKES.forEach(bike => bike.builds.forEach(build => allMotors.add(build.motor)));
    return Array.from(allMotors).sort((a, b) => a.localeCompare(b));
  }, []);

  const torques = useMemo(() => ['50Nm','55Nm','60Nm','65Nm','85Nm','90Nm','105Nm','108Nm','TBD'], []);

  const travels = useMemo(() => {
    const allTravels = new Set<string>();
    BIKES.forEach(bike => {
      if (bike.suspension && bike.suspension !== 'TBD') allTravels.add(bike.suspension);
    });
    return Array.from(allTravels).sort((a, b) => b.localeCompare(a)); 
  }, []);  
 
  const totalBrands = eMTBData.length;
  const totalModels = eMTBData.reduce((acc, b) => acc + b.models.length, 0);
  const totalBuilds = eMTBData.reduce((acc, b) => acc + b.models.reduce((macc, m) => macc + m.builds.length, 0), 0);

  const filteredBikes = useMemo(() => {
    return BIKES.filter(bike => {
      if (showGarage) return bike.builds.some(build => favorites.includes(build.id));
      const matchesBrand = selectedBrandFilters.length === 0 || selectedBrandFilters.includes(bike.brand);
      const matchesTravel = selectedTravelFilters.length === 0 || selectedTravelFilters.includes(bike.suspension || 'TBD');
      
      const hasMatchingBuild = bike.builds.some(build => {
        const buildMatchesPrice = build.price <= priceFilter;
        const buildMatchesMotor = selectedMotorFilters.length === 0 || selectedMotorFilters.includes(build.motor);
        const buildMatchesWheels = selectedWheelFilters.length === 0 || (build.wheels && selectedWheelFilters.includes(build.wheels));
        const buildMatchesTorque = selectedTorqueFilters.length === 0 || selectedTorqueFilters.includes(build.torque || 'TBD');
        const buildMatchesDrivetrain = selectedDrivetrainFilters.length === 0 || selectedDrivetrainFilters.some(dt => (build.drivetrain || '').toLowerCase().includes(dt.toLowerCase()));
        
        return buildMatchesPrice && buildMatchesMotor && buildMatchesWheels && buildMatchesTorque && buildMatchesDrivetrain;
      });
      
      return matchesBrand && matchesTravel && hasMatchingBuild;
    }).sort((a, b) => a.brand.localeCompare(b.brand));
  }, [selectedBrandFilters, selectedMotorFilters, selectedWheelFilters, selectedTorqueFilters, selectedTravelFilters, selectedDrivetrainFilters, showGarage, favorites, priceFilter]);

  const groupedBikes = useMemo(() => {
    const map = new Map<string, typeof BIKES>();
    filteredBikes.forEach(bike => {
      if (!map.has(bike.brand)) map.set(bike.brand, [] as typeof BIKES);
      map.get(bike.brand)!.push(bike);
    });
    return Array.from(map.entries()).map(([brand, bikes]) => ({ brand, bikes })).sort((a, b) => a.brand.localeCompare(b.brand));
  }, [filteredBikes]);

  const toggleFavorite = async (buildId: string) => {
    if (!userId) {
      alert("Sign in to save rigs to your Dream Garage!");
      return;
    }
    const isFavorited = favorites.includes(buildId);
    setFavorites(prev => isFavorited ? prev.filter(id => id !== buildId) : [...prev, buildId]);

    if (isFavorited) {
      const { error } = await supabase.from('user_garage').delete().match({ user_id: userId, build_id: buildId });
      if (error) console.error("Error removing bike:", error.message);
    } else {
      const { error } = await supabase.from('user_garage').insert({ user_id: userId, build_id: buildId });
      if (error) console.error("Error saving bike:", error.message);
    }
  };

  const clearFilters = () => {
    setSelectedBrandFilters([]);
    setSelectedMotorFilters([]);
    setSelectedWheelFilters([]);
    setSelectedTorqueFilters([]);
    setSelectedTravelFilters([]);
    setSelectedDrivetrainFilters([]);
    setPriceFilter(absoluteMaxPrice);
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  const randomizedBrands = useMemo(() => [...eMTBData].sort(() => Math.random() - 0.5), []);
  const totalActiveFilters = selectedBrandFilters.length + selectedMotorFilters.length + selectedWheelFilters.length + selectedTorqueFilters.length + selectedTravelFilters.length + selectedDrivetrainFilters.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col relative">
      <header className="bg-slate-50/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => { 
              showroomScrollRef.current = 0; 
              setView('showroom'); 
              setShowGarage(false); 
            }}
          >
            <img src="/trail_math_logo_emtb.png" alt="Trail Math" className="h-8 sm:h-10 w-auto max-w-[40vw] sm:max-w-none object-contain" />
          </div>
          
          {view === 'showroom' && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setShowGarage(!showGarage);
                  if (!showGarage) clearFilters();
                }}
                className={`flex items-center gap-1.5 sm:gap-2 text-xs md:text-sm font-bold px-2 md:px-4 py-1.5 md:py-2 rounded-full transition-all ${showGarage ? 'bg-slate-200 text-slate-900' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
              >
                <Star size={16} className={showGarage ? 'fill-blue-600 text-blue-600' : 'text-slate-600'} />
                <span className="hidden sm:inline">{showGarage ? 'Exit Garage' : 'My Garage'}</span>
                <span className="sm:hidden">{showGarage ? 'Exit' : 'Garage'}</span>
              </button>
              <button 
                onClick={() => { showroomScrollRef.current = window.scrollY; setShowGarage(false); setView('compare'); }}
                className="flex items-center gap-1.5 sm:gap-2 text-xs md:text-sm font-bold px-2 md:px-4 py-1.5 md:py-2 rounded-full transition-all bg-slate-100 text-slate-900 hover:bg-slate-200"
              >
                <Scale size={16} className="text-slate-600" />
                <span className="hidden sm:inline">Compare Rigs</span>
                <span className="sm:hidden">Compare</span>
              </button>
              <div className="flex items-center gap-2 sm:gap-4 ml-2 pl-2 sm:ml-4 sm:pl-4 border-l border-slate-200">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">Sign In</button>
                  </SignInButton>
                </SignedOut>
                <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
              </div>            </div>
          )}
          {view === 'builds' && (
            <button onClick={() => setView('showroom')} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              <ChevronLeft size={16} /> Back to Showroom
            </button>
          )}
          {view === 'calculator' && (
            <button onClick={() => setView('builds')} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              <ChevronLeft size={16} /> Back to Builds
            </button>
          )}
          {view === 'compare' && (
            <button onClick={() => setView('showroom')} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              <ChevronLeft size={16} /> Back to Showroom
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-8 sm:pb-12 relative z-10">        
        {/* --- SHOWROOM VIEW --- */}
        {view === 'showroom' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {showGarage ? (
              <div className="w-full pb-2 sm:pb-4">
                <div className="relative w-full bg-[#0B1121] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800 p-8 sm:p-12 lg:p-16 flex flex-col items-center justify-center text-center">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwVjB6bTEgMWgxOHYxOEgxdjE4eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-50"></div>
                  <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[40rem] h-[40rem] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[30rem] h-[30rem] rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none"></div>
                  <div className="relative z-10 max-w-2xl">
                    <Star size={40} className="mx-auto text-blue-500 mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] fill-blue-500/20" />
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-[1.05]">
                      YOUR <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-200">DREAM GARAGE</span>
                    </h1>
                    <p className="text-base sm:text-lg text-slate-400 font-medium mt-6">
                      The specific builds you've saved for later. Click a rig to calculate your exact out-of-pocket costs, or hit compare to stack them head-to-head.
                    </p>
                    {favorites.length > 1 && (
                       <button onClick={() => { showroomScrollRef.current = window.scrollY; setShowGarage(false); setView('compare'); }} className="mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-blue-900/50 inline-flex items-center gap-2">
                         <Scale size={18} /> Compare Garage
                       </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                  <div className="w-full pb-2 sm:pb-4">
                    <div className="relative w-full bg-[#0B1121] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwVjB6bTEgMWgxOHYxOEgxdjE4eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-50"></div>
                      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[40rem] h-[40rem] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[30rem] h-[30rem] rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none"></div>
                      <div className="relative flex flex-col md:flex-row items-center gap-8 lg:gap-12 p-8 sm:p-12 lg:p-16">
                        <div className="md:w-1/2 space-y-8 z-10">
                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="h-[2px] w-8 sm:w-12 bg-blue-500"></div>
                              <span className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">The Definitive Database</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-[1.05]">
                              FIND YOUR <br />
                              <span className="text-blue-500 mt-1 sm:mt-2 inline-block">DREAM BIKE</span>
                            </h1>
                          </div>
                          <p className="text-base sm:text-lg text-slate-400 max-w-lg leading-relaxed font-medium">
                            TRAIL MATH is the world's first and largest comparison tool for current gen eMTBs. Compare builds, specs, and calculate exact out-of-pocket costs.
                          </p>
                          <div className="flex flex-wrap gap-4 pt-2">
                             <button onClick={() => setIsFilterModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 w-full sm:w-auto"><Filter size={18} />Start Filtering</button>
                             <button onClick={() => setView('compare')} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2 w-full sm:w-auto"><Scale size={18} />Head-to-Head</button>
                          </div>
                          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800/80">
                            <div><div className="text-3xl lg:text-5xl font-black text-white">{totalBrands}</div><div className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Brands</div></div>
                            <div><div className="text-3xl lg:text-5xl font-black text-white">{totalModels}</div><div className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Models</div></div>
                            <div><div className="text-3xl lg:text-5xl font-black text-white">{totalBuilds}</div><div className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Builds</div></div>
                          </div>
                        </div>
                        <div className="md:w-1/2 w-full mt-8 md:mt-0 relative z-10 aspect-[4/3] sm:aspect-video md:aspect-[4/3] lg:aspect-[4/3] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-700/50 transform md:-rotate-2 hover:rotate-0 transition-transform duration-500 overflow-hidden ring-1 ring-white/10">
                          {heroImages.map((src, index) => (
                            <img key={src} src={src} alt={`Dream Rig ${index + 1}`} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === heroImageIndex ? 'opacity-100' : 'opacity-0'}`} crossOrigin="anonymous" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full mb-8 sm:mb-12 [mask-image:_linear-gradient(to_right,transparent_0,_black_10%,_black_90%,transparent_100%)]">
                    <div className="w-full bg-slate-50 border-y border-slate-200 py-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      <div className="flex items-center space-x-8 px-4 w-max animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused]">
                        {randomizedBrands.map(b => b.logo && <img key={`${b.brand}-1`} src={b.logo} alt={b.brand} className="h-6 md:h-8 max-w-[120px] md:max-w-[140px] w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />)}
                        {randomizedBrands.map(b => b.logo && <img key={`${b.brand}-2`} src={b.logo} alt={b.brand} className="h-6 md:h-8 max-w-[120px] md:max-w-[140px] w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />)}
                      </div>
                    </div>
                  </div>

                  <div className="w-full mb-12 sm:mb-16">
                    <div className="flex items-center justify-between mb-4 sm:mb-6 px-2">
                      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Trending Rigs</h3>
            
                      <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Swipe to explore &rarr;</div>
                    </div>
                    <div className="flex overflow-x-auto gap-4 sm:gap-6 pt-4 pb-6 px-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {['Vala', 'Levo', 'Wild', 'Meta Power SX Avinox', 'Sight VLT CX'].map(m => BIKES.find(b => b.model.includes(m))).filter(Boolean).map(bike => bike && (
                        <div key={`hot-${bike.id}`} onClick={() => { showroomScrollRef.current = window.scrollY; setSelectedBikeId(bike.id); setView('builds'); }} className="min-w-[75vw] sm:min-w-[320px] md:min-w-[360px] snap-center bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col">
                          
                          <div className="w-full h-48 bg-[#F3F3F3] rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center p-4">
                            <img src={bike.image} alt={bike.model} className="w-full h-full object-contain scale-95 group-hover:scale-105 transition-transform duration-500" crossOrigin="anonymous" />
                          </div>
                          
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">{bike.brand}</span>
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md">{bike.suspension}</span>
                          </div>
                          <h4 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-tight">{bike.model}</h4>
                          <div className="text-sm font-bold text-slate-500 mb-4">Starting at {formatPrice(bike.startingPrice)}</div>
                          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-900 group-hover:text-blue-600">
                            View Builds <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-blue-600" />
                          </div>
                        </div>
                      ))}
                    </div>                  </div>
              </>
            )}

            {showGarage ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-8">
                {ALL_BUILDS.filter(b => favorites.includes(b.id)).map(build => (
                  <div key={`garage-${build.id}`} onClick={() => { showroomScrollRef.current = window.scrollY; const parentBike = BIKES.find(bike => bike.builds.some(bb => bb.id === build.id)); if (parentBike) { setSelectedBikeId(parentBike.id); setSelectedBuildId(build.id); setView('calculator'); } }} className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col relative">
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(build.id); }} className="absolute top-4 right-4 z-20 p-2 bg-slate-50 rounded-full hover:bg-red-50 text-blue-500 hover:text-red-500 transition-colors" title="Remove from Garage"><Star size={16} className="fill-current" /></button>
                    <div className="w-full h-40 sm:h-48 bg-[#F3F3F3] rounded-2xl mb-5 relative overflow-hidden flex items-center justify-center">
                      <img src={build.image} alt={build.fullName} className="absolute inset-0 w-full h-full object-contain scale-110 group-hover:scale-125 transition-transform duration-500" crossOrigin="anonymous" />
                    </div>
                    <div className="flex items-center justify-between mb-2"><span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">{build.brand}</span></div>
                    <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-1">{build.model}</h4>
                    <div className="text-xs sm:text-sm font-bold text-slate-500 mb-4">{build.name}</div>
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-base sm:text-lg font-extrabold text-slate-900">{formatPrice(build.price)}</div>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-blue-600" />
                    </div>
                  </div>
                ))}
                {favorites.length === 0 && (
                  <div className="col-span-full py-20 sm:py-32 text-center">
                    <Star size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-2xl font-bold text-slate-500">Your Garage is Empty</h3>
                    <p className="text-slate-400 mt-2 font-medium">Click the star icon on any build to save it here.</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mt-8 sm:mt-12 mb-4 px-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">The Complete Catalog</h3>
                  <div className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider hidden sm:block">{totalBuilds} Total Builds</div>
                </div>

                <div className="sticky top-16 sm:top-20 z-30 bg-slate-50/90 backdrop-blur-md py-4 border-b border-slate-200 -mx-4 px-4 sm:mx-0 sm:px-0 transition-all">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                      <button onClick={() => setIsFilterModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-300 py-2.5 px-6 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                        <Filter size={16} className="text-blue-600" /> Filter Rigs {totalActiveFilters > 0 && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{totalActiveFilters}</span>}                      
                      </button>
                      <span className="flex-1 sm:flex-none text-center text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-2.5 rounded-xl">{filteredBikes.length} {filteredBikes.length === 1 ? 'Match' : 'Matches'}</span>
                      {(totalActiveFilters > 0 || priceFilter !== absoluteMaxPrice) && (
                        <button onClick={clearFilters} className="text-sm text-slate-500 hover:text-slate-800 font-medium whitespace-nowrap px-2">Clear All</button>
                      )}                   
                    </div>
                    <div className="w-full sm:w-auto flex flex-col min-w-[100%] sm:min-w-[240px] bg-white sm:bg-transparent p-4 sm:p-0 rounded-xl border sm:border-0 border-slate-200 shadow-sm sm:shadow-none">
                      <div className="flex justify-between items-center w-full text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 sm:mb-2">
                        <span>Budget</span><span className="text-blue-600 bg-blue-50 sm:bg-transparent px-2 py-0.5 sm:p-0 rounded">Under ${priceFilter.toLocaleString()}</span>
                      </div>
                      <input type="range" min="0" max={absoluteMaxPrice} step="500" value={priceFilter} onChange={(e) => setPriceFilter(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all" />
                    </div>
                  </div>
                </div>

                {groupedBikes.map(group => (
                  <section key={group.brand} className="w-full">
                    <div className="w-full"><h2 className="text-6xl md:text-8xl font-bold italic uppercase tracking-tight text-black/5 select-none border-b-2 border-slate-200 pb-2 mb-6 md:mb-8">{group.brand}</h2></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {group.bikes.map(bike => (
                        <div key={bike.id} onClick={() => { showroomScrollRef.current = window.scrollY; setSelectedBikeId(bike.id); setView('builds'); }} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md hover:scale-[1.02] hover:border-blue-600 transition-all duration-300 cursor-pointer group flex flex-col">
                          <div className="w-full p-0 h-100 overflow-hidden relative shrink-0"><img src={bike.image} alt={bike.model} className="w-full h-full object-contain scale-110" crossOrigin="anonymous" /></div>
                          <div className="p-6 flex-1 flex flex-col justify-center min-w-0">
                            <div className="flex justify-between items-center text-xs uppercase mb-1">
                              <div className="text-xs font-bold text-slate-900 tracking-wide truncate">{bike.brand}</div><span className="text-slate-400 font-medium">{bike.suspension}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4 truncate">{bike.model}</h3>
                            <div className="mt-auto flex items-center justify-between">
                              <div><div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Starting at</div><div className="text-lg font-bold text-slate-900">{formatPrice(bike.startingPrice)}</div></div>
                              <div className="text-slate-400 group-hover:text-blue-600 transition-colors"><ArrowRight size={20} /></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </>
            )}
          </div>
        )}

        {/* --- BUILDS VIEW --- */}
        {view === 'builds' && selectedBike && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="flex flex-col lg:flex-row gap-8 items-start mt-4">
              <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 flex flex-col relative">
                  
                  {/* --- NEW: STAR TOGGLE ON IMAGE CARD --- */}
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                    }} 
                    className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-slate-100 text-slate-300 hover:text-blue-500 transition-all opacity-0 pointer-events-none"
                  >
                    <Star size={20} />
                  </button>

                  <div className="w-full h-64 sm:h-72 bg-[#F3F3F3] relative m-0 p-0 overflow-hidden flex items-center justify-center">
                    <img src={selectedBike.image} alt={selectedBike.model} className="absolute inset-0 w-full h-full object-contain scale-110" crossOrigin="anonymous" />
                  </div>
                  <div className="p-8 text-center flex flex-col items-center">
                    {eMTBData.find(b => b.brand === selectedBike.brand)?.logo && <img src={eMTBData.find(b => b.brand === selectedBike.brand)?.logo} alt={selectedBike.brand} className="h-10 w-auto object-contain mx-auto mb-4" crossOrigin="anonymous" />}
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{selectedBike.model}</h2>
                    <p className="text-slate-500 font-medium text-sm">Select a build below to review specs and calculate payments.</p>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-2/3 space-y-4">
                <div className="bg-[#0B1121] rounded-2xl p-6 relative overflow-hidden shadow-lg border border-slate-800 flex items-center justify-between mb-6">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwVjB6bTEgMWgxOHYxOEgxdjE4eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-50 pointer-events-none"></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[60px] pointer-events-none"></div>
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <h3 className="text-2xl font-extrabold text-white tracking-tight">{showGarage ? 'Favorited Builds' : 'Available Builds'}</h3>
                    <span className="text-sm font-bold text-blue-400 bg-blue-900/30 border border-blue-800/50 px-3 py-1 rounded-full">{selectedBike.builds.filter(b => showGarage ? favorites.includes(b.id) : true).length} Options</span>
                  </div>
                </div>
                
                {selectedBike.builds.filter(b => showGarage ? favorites.includes(b.id) : true).map(build => (
                  <div key={build.id} onClick={() => { setSelectedBuildId(build.id); setView('calculator'); }} className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-600 hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col gap-4 sm:gap-5">
                    <div className="flex items-start sm:items-center justify-between gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                        <h4 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{build.name}</h4>
                        <span className="text-lg sm:text-xl font-extrabold text-slate-900 bg-slate-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg border border-slate-200 inline-block w-fit">{formatPrice(build.price)}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(build.id); }} className="p-2 sm:p-3 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors" title="Save to Garage">
                          <Star size={20} className={favorites.includes(build.id) ? 'fill-blue-500 text-blue-500' : 'text-slate-400'} />
                        </button>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-slate-100">
                      <div><div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Motor</div><div className="text-xs sm:text-sm font-semibold text-slate-700 truncate">{build.motor}</div></div>
                      <div><div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Battery</div><div className="text-xs sm:text-sm font-semibold text-slate-700 truncate">{build.battery}</div></div>
                      <div><div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Material</div><div className="text-xs sm:text-sm font-semibold text-slate-700 truncate">{build.material}</div></div>
                      <div><div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Torque</div><div className="text-xs sm:text-sm font-semibold text-slate-700 truncate">{build.torque || 'TBD'}</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- CALCULATOR VIEW --- */}
        {view === 'calculator' && selectedBuild && selectedBike && (
          <CalculatorView bike={selectedBike} build={selectedBuild} isFavorite={favorites.includes(selectedBuild.id)} onToggleFavorite={() => toggleFavorite(selectedBuild.id)} />
        )}

        {/* --- COMPARE VIEW --- */}
        {view === 'compare' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 pb-12 w-full">
            <div className="bg-[#0B1121] rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden flex flex-col w-full relative mt-4">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwVjB6bTEgMWgxOHYxOEgxdjE4eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-50 pointer-events-none z-0"></div>
              
              <div className="p-8 sm:p-12 lg:p-16 relative flex items-center justify-between border-b border-slate-800 shrink-0 z-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[80px] -mt-20 -mr-20 pointer-events-none"></div>
                <div className="relative z-10 w-full">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="h-[2px] w-8 sm:w-12 bg-blue-500"></div><span className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">Spec Check</span>
                  </div>
                  <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-[1.05]">HEAD-<span className="text-blue-500">TO</span>-HEAD</h2>
                  <p className="text-slate-400 mt-4 sm:mt-6 font-medium max-w-xl text-sm sm:text-lg leading-relaxed">Stack two rigs side-by-side to compare geometry, motors, and components before you calculate the damage.</p>
                </div>
                <div className="hidden lg:flex items-center justify-center relative z-10 opacity-20 pr-8"><Scale size={160} className="text-blue-500" /></div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-slate-800 relative shrink-0 z-10">
                <div className="flex flex-col relative w-full">
                  <div className="p-4 sm:p-8 border-b border-slate-800">
                    <label className="block text-[10px] sm:text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Rig A</label>
                    <button onClick={() => { setSelectingRig('A'); setSelectorBrand(rigA ? String(rigA.brand) : brands[0]); }} className="w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl p-3 sm:p-4 text-left flex justify-between items-center transition-all shadow-sm">
                    <span className="truncate pr-2">{rigA ? `${rigA.brand} ${rigA.model} ${rigA.name}` : 'Select Rig A'}</span>
                    <ChevronDown size={18} className="text-blue-500 shrink-0 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                  {rigA && (
                    <>
                      <div className="w-full aspect-[4/3] sm:aspect-video relative overflow-hidden flex items-center justify-center p-4">
                        <img src={rigA.image} alt={rigA.fullName} className="w-full h-full object-contain scale-110 drop-shadow-2xl" crossOrigin="anonymous" />
                      </div>
                      <div className="p-6 sm:p-10 text-center flex flex-col justify-center">
                        <h3 className="text-xl sm:text-3xl font-black text-white leading-tight mb-2 sm:mb-3">{rigA.model} <br className="sm:hidden" />{rigA.name}</h3>
                        <div className="text-lg sm:text-2xl font-bold text-blue-400">{formatPrice(rigA.price)}</div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col relative w-full">
                  <div className="p-4 sm:p-8 border-b border-slate-800">
                    <label className="block text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Rig B</label>
                  <button onClick={() => { setSelectingRig('B'); setSelectorBrand(rigB ? String(rigB.brand) : brands[0]); }} className="w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl p-3 sm:p-4 text-left flex justify-between items-center transition-all shadow-sm">
                  <span className="truncate pr-2">{rigB ? `${rigB.brand} ${rigB.model} ${rigB.name}` : 'Select Rig B'}</span>
                  <ChevronDown size={18} className="text-blue-500 shrink-0 group-hover:scale-110 transition-transform" />
                  </button>                  </div>
                  {rigB && (
                    <>
                      <div className="w-full aspect-[4/3] sm:aspect-video relative overflow-hidden flex items-center justify-center p-4">
                        <img src={rigB.image} alt={rigB.fullName} className="w-full h-full object-contain scale-110 drop-shadow-2xl" crossOrigin="anonymous" />
                      </div>
                      <div className="p-6 sm:p-10 text-center flex flex-col justify-center">
                        <h3 className="text-xl sm:text-3xl font-black text-white leading-tight mb-2 sm:mb-3">{rigB.model} <br className="sm:hidden" />{rigB.name}</h3>
                        <div className="text-lg sm:text-2xl font-bold text-emerald-400">{formatPrice(rigB.price)}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {rigA && rigB && (
                <div className="bg-slate-50 divide-y divide-slate-200 relative z-10 w-full">
                  {[
                    { label: 'Material', a: rigA.material, b: rigB.material },
                    { label: 'Motor', a: rigA.motor, b: rigB.motor },
                    { label: 'Torque', a: rigA.torque || 'TBD', b: rigB.torque || 'TBD' },
                    { label: 'Battery', a: rigA.battery, b: rigB.battery },
                    { label: 'Drivetrain', a: rigA.drivetrain || 'TBD', b: rigB.drivetrain || 'TBD' },
                    { label: 'Fork', a: rigA.fork || 'TBD', b: rigB.fork || 'TBD' },
                    { label: 'Shock', a: rigA.shock || 'TBD', b: rigB.shock || 'TBD' },
                    { label: 'Brakes', a: rigA.brakes || 'TBD', b: rigB.brakes || 'TBD' },
                    { label: 'Wheelset', a: rigA.wheelset || 'TBD', b: rigB.wheelset || 'TBD' },
                    { label: 'Tires', a: rigA.tires || 'TBD', b: rigB.tires || 'TBD' },
                  ].map((spec, idx) => (
                    <div key={idx} className="hover:bg-white transition-colors w-full">
                      <div className="hidden sm:grid grid-cols-3 items-center py-5 px-8">
                        <div className="text-right pr-8 font-semibold text-slate-900 text-sm">{spec.a}</div>
                        <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-200/50 py-1.5 rounded-lg">{spec.label}</div>
                        <div className="text-left pl-8 font-semibold text-slate-900 text-sm">{spec.b}</div>
                      </div>
                      <div className="sm:hidden flex flex-col py-4 px-5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-2">{spec.label}</div>
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
        )}
      </main>

      {/* --- BULLETPROOF FILTER MODAL --- */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center p-4" style={{ zIndex: 9998 }}>
          <div className="absolute inset-0 bg-[#0B1121]/80 backdrop-blur-md" onClick={() => setIsFilterModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] w-[90vw] max-w-md max-h-[80vh] flex flex-col relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Filters</h2>
              <button onClick={() => setIsFilterModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-500" /></button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <button onClick={() => setIsBrandOpen(v => !v)} className="w-full flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors" aria-expanded={isBrandOpen}>
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-900">Brand</span><ChevronDown size={18} className={`text-blue-500 transition-transform duration-300 ${isBrandOpen ? 'rotate-180' : ''}`} />
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
                          <span className="text-sm font-medium text-slate-700">{brand}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <button onClick={() => setIsMotorOpen(v => !v)} className="w-full flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors" aria-expanded={isMotorOpen}>
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-900">Motor</span><ChevronDown className={`transition-transform ${isMotorOpen ? 'rotate-180' : ''}`} />
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
                          <span className="text-sm font-medium text-slate-700">{motor}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <button onClick={() => setIsTorqueOpen(v => !v)} className="w-full flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors" aria-expanded={isTorqueOpen}>
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-900">Torque</span><ChevronDown className={`transition-transform ${isTorqueOpen ? 'rotate-180' : ''}`} />
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
                          <span className="text-sm font-medium text-slate-700">{tq}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <button onClick={() => setIsDrivetrainOpen(v => !v)} className="w-full flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors" aria-expanded={isDrivetrainOpen}>
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-900">Drivetrain</span><ChevronDown className={`transition-transform ${isDrivetrainOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDrivetrainOpen && (
                  <div className="mt-3 space-y-2">
                    {['SRAM', 'Shimano', 'TRP', 'Pinion'].map(dt => {
                      const isSelected = selectedDrivetrainFilters.includes(dt);
                      return (
                        <label key={dt} className="flex items-center gap-3 cursor-pointer">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                            {isSelected && <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <input type="checkbox" className="hidden" checked={isSelected} onChange={() => setSelectedDrivetrainFilters(prev => isSelected ? prev.filter(x => x !== dt) : [...prev, dt])} />
                          <span className="text-sm font-medium text-slate-700">{dt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <button onClick={() => setIsWheelsOpen(v => !v)} className="w-full flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors" aria-expanded={isWheelsOpen}>
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-900">Wheels</span><ChevronDown className={`transition-transform ${isWheelsOpen ? 'rotate-180' : ''}`} />
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
                          <span className="text-sm font-medium text-slate-700">{w}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <button onClick={() => setIsTravelOpen(v => !v)} className="w-full flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors" aria-expanded={isTravelOpen}>
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-900">Travel</span><ChevronDown className={`transition-transform ${isTravelOpen ? 'rotate-180' : ''}`} />
                </button>
                {isTravelOpen && (
                  <div className="mt-3 space-y-2">
                    {travels.map(tvl => {
                      const isSelected = selectedTravelFilters.includes(tvl);
                      return (
                        <label key={tvl} className="flex items-center gap-3 cursor-pointer">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                            {isSelected && <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <input type="checkbox" className="hidden" checked={isSelected} onChange={() => setSelectedTravelFilters(prev => isSelected ? prev.filter(x => x !== tvl) : [...prev, tvl])} />
                          <span className="text-sm font-medium text-slate-700">{tvl} mm</span>
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

      {/* --- BULLETPROOF RIG SELECTION MODAL --- */}
      {selectingRig && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="absolute inset-0 bg-[#0B1121]/80 backdrop-blur-md" onClick={() => setSelectingRig(null)} />
          <div className="bg-white rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] w-[90vw] max-w-4xl max-h-[85vh] flex flex-col relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 shrink-0">
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900">Select Rig {selectingRig}</h2>
              <div className="flex items-center gap-2 sm:gap-4">
                <button onClick={() => setSelectorGarageOnly(!selectorGarageOnly)} className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full transition-all ${selectorGarageOnly ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  <Star size={16} className={selectorGarageOnly ? 'fill-blue-600 text-blue-600' : 'text-slate-400'} /><span className="hidden sm:inline">My Garage</span><span className="sm:hidden">Garage</span>
                </button>
                <button onClick={() => setSelectingRig(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-500" /></button>
              </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <div className="w-1/3 sm:w-1/4 bg-slate-50 border-r border-slate-100 overflow-y-auto">
                {brands.map(brand => {
                  const brandBuilds = ALL_BUILDS.filter(b => b.brand === brand && (!selectorGarageOnly || favorites.includes(b.id)));
                  if (selectorGarageOnly && brandBuilds.length === 0) return null;
                  return (
                    <button key={brand} onClick={() => setSelectorBrand(brand)} className={`w-full text-left px-3 sm:px-4 py-4 text-xs sm:text-sm font-bold border-l-4 transition-colors ${selectorBrand === brand ? 'bg-white border-blue-600 text-blue-700 shadow-sm' : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                      {brand} <span className="text-[10px] sm:text-xs font-normal text-slate-400 ml-1 block sm:inline">({brandBuilds.length})</span>
                    </button>
                  );
                })}
              </div>
              <div className="w-2/3 sm:w-3/4 p-4 sm:p-6 overflow-y-auto bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ALL_BUILDS.filter(b => b.brand === selectorBrand).filter(b => !selectorGarageOnly || favorites.includes(b.id)).map(build => (
                    <button key={build.id} onClick={() => { if (selectingRig === 'A') setRigAId(build.id); if (selectingRig === 'B') setRigBId(build.id); setSelectingRig(null); }} className="group flex items-center justify-between text-left p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all bg-white gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{build.model}</div>
                        <div className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-blue-600 mb-1 leading-tight truncate">{build.name}</div>
                        <div className="text-sm font-bold text-blue-600">{formatPrice(build.price)}</div>
                      </div>
                      <div className="w-16 h-12 sm:w-20 sm:h-16 bg-slate-50 rounded-lg shrink-0 flex items-center justify-center p-1 border border-slate-100 group-hover:border-blue-200 transition-colors">
                        <img src={build.image} alt={build.model} className="w-full h-full object-contain mix-blend-multiply" crossOrigin="anonymous" />
                      </div>
                    </button>
                  ))}
                  {ALL_BUILDS.filter(b => b.brand === selectorBrand && (!selectorGarageOnly || favorites.includes(b.id))).length === 0 && (
                     <div className="col-span-full py-12 text-center text-slate-500 font-medium">No favorited builds for this brand.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="w-full bg-slate-900 border-t border-slate-800 py-8 sm:py-12 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <img src="/trail_math_logo_footer.png" alt="Trail Math" className="h-8 sm:h-7 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
            <p className="text-xs text-slate-500 font-medium">&copy; {new Date().getFullYear()} Trail Math. An Infernal Speed LLC project.</p>
          </div>
          <div className="max-w-md text-center md:text-right text-[10px] text-slate-500 font-medium leading-relaxed">
            *Monthly payments, interest rates, and tax calculations are estimates provided for educational purposes only. Final prices, specs, and availability are subject to change by the manufacturer. Estimates exclude dealer fees, setup, and destination charges.
          </div>
        </div>
      </footer>
    </div>
  );
}

function CalculatorView({ bike, build, isFavorite, onToggleFavorite }: { bike: typeof BIKES[0], build: any, isFavorite: boolean, onToggleFavorite: () => void }) {
  const [downPayment, setDownPayment] = useState<number | string>('');
  const [promo, setPromo] = useState('none');
  const [standardTerm, setStandardTerm] = useState(36);
  const [standardApr, setStandardApr] = useState(7.99);
  const [taxRate, setTaxRate] = useState<number>(0);
  
  // NEW: State for Dealer Search
  const [showDealerSearch, setShowDealerSearch] = useState(false);
  const [zipCode, setZipCode] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);
  
  const { monthlyPayment, totalInterest, taxAmount, totalFinanced } = useMemo(() => {
    const taxAmt = build.price * (taxRate / 100);
    const downValue = Number(downPayment) || 0;
    const totalFinancedAmt = build.price + taxAmt - downValue;
    const p = Math.max(0, totalFinancedAmt);
    if (promo !== 'none') {
      const t = promo === '6mo' ? 6 : 12;
      return { activeTerm: t, monthlyPayment: p / t, totalInterest: 0, totalCost: totalFinancedAmt, taxAmount: taxAmt, totalFinanced: totalFinancedAmt };
    }
    const r = standardApr / 100 / 12; const t = standardTerm;
    const m = r === 0 ? p / t : (p * r) / (1 - Math.pow(1 + r, -t));
    const interest = (m * t) - p;
    return { activeTerm: t, monthlyPayment: m, totalInterest: interest, totalCost: totalFinancedAmt + interest, taxAmount: taxAmt, totalFinanced: totalFinancedAmt };
  }, [build.price, downPayment, promo, standardTerm, standardApr, taxRate]);

  const formatMoney = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-4">
        <div className="w-full space-y-6">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col w-full border border-slate-200 relative">
            <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }} className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-slate-100 hover:scale-110 active:scale-95 transition-all group">
              <Star size={22} className={`${isFavorite ? 'fill-blue-500 text-blue-500' : 'text-slate-300 group-hover:text-blue-400'}`} />
            </button>
            <div className="w-full h-64 sm:h-72 bg-[#F3F3F3] relative m-0 p-0 overflow-hidden flex items-center justify-center">
              <img src={bike.image} alt={bike.model} className="absolute inset-0 w-full h-full object-contain scale-125 drop-shadow-2xl" crossOrigin="anonymous" />
            </div>
            <div className="p-8 flex flex-col border-t border-slate-100">
              <div className="flex flex-col items-center pb-6 border-b border-slate-100 gap-1">
                {eMTBData.find(b => b.brand === bike.brand)?.logo && <img src={eMTBData.find(b => b.brand === bike.brand)?.logo} alt={bike.brand} className="h-10 object-contain mb-2" crossOrigin="anonymous" />}
                <h2 className="text-xl font-black text-slate-900 text-center leading-snug">{bike.model} - {build.name}</h2>
                <p className="text-2xl font-extrabold text-blue-600 mt-2">{formatMoney(build.price)}</p>
              </div>
              {/* --- RESTORED COMPONENT BREAKDOWN GRID --- */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 pt-6">
                <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Material</span><span className="text-sm font-semibold text-slate-800">{build.material || 'TBD'}</span></div>
                <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suspension</span><span className="text-sm font-semibold text-slate-800">{bike.suspension}</span></div>
                <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fork</span><span className="text-sm font-semibold text-slate-800">{build.fork || 'TBD'}</span></div>
                <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shock</span><span className="text-sm font-semibold text-slate-800">{build.shock || 'TBD'}</span></div>
                <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Motor</span><span className="text-sm font-semibold text-slate-800">{build.motor || 'TBD'}</span></div>
                <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Battery</span><span className="text-sm font-semibold text-slate-800">{build.battery || 'TBD'}</span></div>
                <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Drivetrain</span><span className="text-sm font-semibold text-slate-800">{build.drivetrain || 'TBD'}</span></div>
                <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Brakes</span><span className="text-sm font-semibold text-slate-800">{build.brakes || 'TBD'}</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="bg-[#0B1121] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-slate-800 flex flex-col gap-8 text-left">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwVjB6bTEgMWgxOHYxOEgxdjE4eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="text-left">
                <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-8">What's the Damage?</h3>
                <div className="space-y-6">
                  <div><div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Monthly Payment</div><div className="text-5xl font-black text-white">{formatMoney(monthlyPayment)}<span className="text-xl text-slate-500 font-medium">/mo</span></div></div>
                  <div className="h-px bg-slate-800 w-full"></div>
                  <div className="space-y-3 font-medium text-sm">
                    <div className="flex justify-between"><span className="text-slate-400">Rig Price</span><span>{formatMoney(build.price)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Estimated Tax</span><span>{formatMoney(taxAmount)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Down Payment</span><span className="text-blue-400">-{formatMoney(Number(downPayment) || 0)}</span></div>
                    {/* --- RESTORED TOTAL INTEREST --- */}
                    <div className="flex justify-between"><span className="text-slate-400">Total Interest</span><span className="text-rose-400">+{formatMoney(totalInterest)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-bold uppercase tracking-widest">Financed Total</span><span className="font-bold text-white">{formatMoney(totalFinanced)}</span></div>
                  </div>
                </div>
              </div>

              {/* --- DUAL-ACTION CHECKOUT ZONE --- */}
              <div className="mt-8 pt-8 border-t border-slate-800">
                {!showDealerSearch ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button onClick={() => setShowDealerSearch(true)} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base py-4 px-6 rounded-xl transition-colors shadow-lg shadow-blue-900/20">
                        <MapPin size={18} /> Find Local Dealer
                      </button>
                      <a href={`https://www.google.com/search?q=buy+${bike.brand}+${bike.model}+${build.name}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-extrabold text-base py-4 px-6 rounded-xl transition-colors shadow-sm">
                        <ShoppingCart size={18} /> Shop Online
                      </a>
                    </div>
                    <p className="text-center text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Support local shops or buy direct</p>
                  </div>
                ) : (
                  <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-bold flex items-center gap-2"><MapPin size={18} className="text-blue-500"/> Locate a {bike.brand} Dealer</h4>
                      <button onClick={() => setShowDealerSearch(false)} className="text-slate-400 hover:text-white transition-colors"><X size={18}/></button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="text" 
                        placeholder="Enter Zip Code" 
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 bg-[#0B1121] border border-slate-600 text-white font-bold text-lg rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-slate-600 placeholder:font-normal"
                        maxLength={5}
                      />
                      <button 
                        onClick={() => alert(`Dealer search for ${zipCode} coming soon! This will trigger the Google Places API.`)}
                        className={`bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-colors w-full sm:w-auto ${zipCode.length < 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={zipCode.length < 5}
                      >
                        Search
                      </button>
                    </div>                  </div>
                )}
              </div>
              
              {/* --- RESTORED TRAIL MATH BOX --- */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700 space-y-6 text-left">
                <h3 className="text-lg font-black text-white flex items-center gap-2"><Calculator size={20} className="text-blue-500" />Trail Math</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Down Payment ($)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold pointer-events-none">$</span>
                      <input type="text" inputMode="numeric" pattern="[0-9]*" value={downPayment} placeholder="0" onChange={(e) => { const raw = String(e.target.value).replace(/\D/g, ''); const sanitized = raw.replace(/^0+/, ''); setDownPayment(sanitized === '' ? '' : Number(sanitized)); }} className="w-full bg-[#0B1121] border border-slate-700 rounded-xl p-3 pl-9 text-white font-bold transition-colors focus:border-blue-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">0% Promos</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['none', '6mo', '12mo'].map(p => (
                        <button key={p} onClick={() => setPromo(p)} className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border ${promo === p ? 'bg-blue-600 border-blue-500 text-white shadow-sm' : 'bg-[#0B1121] border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'}`}>
                          {p === 'none' ? 'N/A' : p === '6mo' ? '0% for 6 Mo' : '0% for 12 Mo'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <BrandedStepper label="Estimated Sales Tax (%)" value={taxRate} onChange={setTaxRate} step={0.1} suffix="%" />
                    <p className="text-[10px] text-slate-500 mt-2 font-medium uppercase tracking-wider">Include state, county, and city taxes for accurate math</p>
                  </div>
                  <div className={`space-y-6 transition-opacity duration-300 ${promo !== 'none' ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Standard Term (Months)</label>
                      <input type="range" min="12" max="72" step="12" value={standardTerm} onChange={(e) => setStandardTerm(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                      <div className="text-center font-bold text-slate-400 mt-2">{standardTerm} Months</div>
                    </div>
                    <div>
                      <BrandedStepper label="Standard APR (%)" value={standardApr} onChange={setStandardApr} step={0.1} suffix="%" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}