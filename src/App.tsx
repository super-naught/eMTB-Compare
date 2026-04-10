import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronLeft, ChevronDown, ArrowRight, Scale, Calculator, Filter, X, Star, Plus, Minus, MapPin, Phone, ShoppingCart, Home, Download, List } from "lucide-react";
import { SPONSORED_SHOPS } from './sponsorData';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth,} from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Analytics } from "@vercel/analytics/react";


// Helper to create a secure client using the Clerk token
const createClerkSupabaseClient = (token: string) => {
  return createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  );
};

// --- STRICT TYPES ---
export interface BuildType {
  name: string;
  price: number;
  msrp?: number;
  limitedStock?: boolean;
  material: string;
  motor: string;
  torque?: string;
  battery: string;
  fork?: string;
  shock?: string;
  drivetrain?: string;
  brakes?: string;
  wheelset?: string;
  hubs?: string;
  tires?: string;
  wheels?: string;
}

export interface ModelType {
  name: string;
  image: string;
  suspension: string;
  builds: BuildType[];
}

export interface BrandType {
  brand: string;
  logo: string;
  models: ModelType[];
}

// Variables successfully moved inside component!

// --- CUSTOM BRANDED STEPPER COMPONENT ---
function BrandedStepper({
  label,
  value,
  onChange,
  step = 1,
  suffix = "",
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  step?: number;
  suffix?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
        {label}
      </label>
      <div className="relative flex items-center bg-[#0B1121] border border-slate-700 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
        <button
          type="button"
          onClick={() =>
            onChange(Math.max(0, Number((value - step).toFixed(2))))
          }
          className="p-3 text-blue-500 hover:bg-slate-800 transition-colors shrink-0"
        >
          <Minus size={18} strokeWidth={3} />
        </button>

        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent border-none text-white text-center text-lg font-bold focus:ring-0 p-3 placeholder:text-slate-600 outline-none"
          placeholder="0.0"
        />
        {suffix && (
          <span className="absolute right-14 text-slate-600 font-black pointer-events-none">
            {suffix}
          </span>
        )}

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

// --- UPGRADED SMART CAROUSEL COMPONENT ---
const TrendingCarousel = ({ BIKES, onSelectBike, sponsor }: { BIKES: any[], onSelectBike: (id: string) => void, sponsor?: typeof SPONSORED_SHOPS[0] | null }) => {
  
 const displayBikes = useMemo(() => {
    if (sponsor) {
      const MODELS_PER_BRAND = 2;
      // ✅ Added explicit typing ': any[]' to satisfy the TypeScript compiler
      const curatedList: any[] = []; 
      
      sponsor.brands.forEach(brandName => {
        const brandMatches = BIKES.filter(
          b => b.brand.toLowerCase() === brandName.toLowerCase()
        );
        
        curatedList.push(...brandMatches.slice(0, MODELS_PER_BRAND));
      });
      
      return curatedList.slice(0, 12);
    } else {
      return ['Shuttle AMP', 'Zendit', 'PR Carbon', 'Meta Power SX', 'Ekano 3', 'Timp Peak', 'Sight VLT CX']
        .map(m => BIKES.find(b => b.model.includes(m)))
        .filter(Boolean);
    }
  }, [BIKES, sponsor]);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  if (!displayBikes || displayBikes.length === 0) return null;

  const activeBike = displayBikes[activeIndex];

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = thumbnailContainerRef.current.clientWidth * 0.75;
      thumbnailContainerRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div className="w-full bg-slate-50 pt-6 pb-6 sm:pt-14 sm:pb-12 mb-12 border-t border-b border-slate-200 relative overflow-x-hidden">
      
      <div className="absolute top-[30%] inset-x-0 -translate-y-1/2 text-[18vw] sm:text-[15vw] font-black text-slate-200/40 select-none pointer-events-none uppercase tracking-tighter text-center whitespace-nowrap z-0 overflow-hidden">
        {sponsor ? sponsor.name : 'Showroom'}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
{/* HEADER SECTION */}
        {sponsor ? (
          <div className="flex flex-row items-center justify-center sm:justify-start gap-3 sm:gap-4 mb-4 sm:mb-12 text-left">
            <div className="h-20 sm:h-20 w-25 sm:w-32 px-3 sm:px-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
               {sponsor?.logo ? (
                 <img src={sponsor.logo} alt={sponsor?.name} className="h-12 sm:h-16 w-auto object-contain scale-125" />
               ) : (
                 <span className="text-2xl sm:text-4xl font-black text-slate-300">{sponsor?.name?.charAt(0)}</span>
               )}
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                {sponsor?.name}
              </h2>
              <div className="mt-1 sm:mt-2 text-left">
                <p className="text-blue-600 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest flex items-center justify-start gap-1">
                  <Star size={10} className="fill-blue-600 sm:w-3 sm:h-3" /> EXCLUSIVE DEALER
                </p>
<p className="text-slate-500 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest flex items-start justify-start gap-1 mt-0.5">
                  <MapPin size={10} className="sm:w-3 sm:h-3 shrink-0 mt-[2px]" /> 
                  <span>
                    {sponsor?.address?.split('|')[0]}
                    {sponsor?.address?.includes('|') && (
                      <>
                        <span className="hidden sm:inline"> | </span>
                        <br className="block sm:hidden" />
                        {sponsor?.address?.split('|')[1]}
                      </>
                    )}
                  </span>
                </p>
                </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 sm:mb-12">
            <h2 className="text-2xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase italic text-center sm:text-left leading-none">
              TRENDING RIGS FOR 2026
            </h2>
          </div>
        )}

        {/* HERO IMAGE TOP, DETAILS BOTTOM */}
        <div className="relative w-full flex flex-col items-center mb-6 sm:mb-8">
          
          <div className="relative z-10 w-[calc(100%+2rem)] -mx-4 sm:w-full sm:mx-0 h-[28vh] min-h-[220px] sm:h-[40vh] md:h-[35rem] flex items-center justify-center cursor-pointer group mb-2 sm:mb-6" onClick={() => onSelectBike(activeBike?.id)}>
             <img 
               key={`hero-${activeBike?.id}`} 
               src={activeBike?.image} 
               alt={activeBike?.model} 
               className="w-full h-full object-contain scale-[1.1] sm:scale-100 drop-shadow-[0_20px_25px_rgba(0,0,0,0.15)] group-hover:scale-[1.15] sm:group-hover:scale-105 transition-transform duration-500" 
               crossOrigin="anonymous" 
             />
          </div>

          <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
            
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-blue-500 mb-0.5 sm:mb-1 mt-2 sm:mt-0">
              {activeBike?.brand}
            </span>
            <h3 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 leading-[1.05] mb-4 sm:mb-6">
              {activeBike?.model}
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-2.5 sm:gap-4 px-4 sm:px-0">
              <button 
                onClick={() => onSelectBike(activeBike?.id)}
                className="w-full sm:w-auto font-bold font-mono text-xs sm:text-sm tracking-tighter px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-blue-600 text-white shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:bg-blue-500 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                VIEW BUILDS <ArrowRight size={14} className="sm:w-4 sm:h-4" />
              </button>
              
              {sponsor && (
                <a href={`tel:${sponsor.phone}`} onClick={(e) => e.stopPropagation()} className="w-full sm:w-auto font-bold flex items-center justify-center gap-2 font-mono text-[12px] sm:text-sm tracking-tighter px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:-translate-y-0.5 transition-all">
                  <Phone size={14} className="sm:w-4 sm:h-4" /> CALL SHOP FOR DEMOS
                </a>
              )}
            </div>
          </div>
        </div>

        {/* THUMBNAIL CAROUSEL */}
        <div className="w-full pt-6 sm:pt-8 border-t border-slate-200/80">
           
           <div className="flex items-center justify-between px-2 mb-2">
             <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest animate-pulse sm:hidden mx-auto">
               ← Swipe to explore →
             </div>
             <div className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               More Featured Builds
             </div>
             <div className="hidden sm:flex items-center gap-2">
               <button onClick={() => scrollThumbnails('left')} className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm">
                 <ChevronLeft size={16} />
               </button>
               <button onClick={() => scrollThumbnails('right')} className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm">
                 <ChevronLeft size={16} className="rotate-180" />
               </button>
             </div>
           </div>

           <div ref={thumbnailContainerRef} className="flex overflow-x-auto gap-3 sm:gap-4 pt-2 pb-6 px-2 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
             {displayBikes.map((bike, index) => (
               <div 
                 key={`thumb-${bike?.id}-${index}`}
                 onClick={() => setActiveIndex(index)}
                 className={`shrink-0 w-28 sm:w-36 snap-start cursor-pointer transition-all duration-300 rounded-[1.25rem] p-3 sm:p-4 border-2 ${index === activeIndex ? 'bg-white border-blue-500 shadow-[0_10px_20px_rgba(59,130,246,0.15)] scale-[1.05]' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50 opacity-60 hover:opacity-100'}`}
               >
                 <div className="h-14 sm:h-16 flex items-center justify-center mb-2">
                   <img src={bike?.image} alt={bike?.model} className="max-w-full max-h-full object-contain drop-shadow-sm" crossOrigin="anonymous" />
                 </div>
                 <div className="text-center">
                   <div className="text-[9px] font-extrabold text-blue-500 uppercase tracking-widest truncate">{bike?.brand}</div>
                   <div className="text-[11px] sm:text-xs font-black text-slate-800 uppercase tracking-tight truncate mt-0.5">{bike?.model}</div>
                 </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};

const formatWheelSetup = (setup?: string) => {
  if (!setup) return "TBD";
  const s = setup.toUpperCase();
  if (s.includes("MULLET") || s.includes("MX"))
    return 'MULLET (MX 29"F, 27.5"R)';
  if (s.includes("29")) return '29" (29"F, 29"R)';
  if (s.includes("27.5")) return '27.5" (27.5"F, 27.5"R)';
  return setup;
};

// 1. Import your God File directly!
import { eMTBData as staticBikeData } from './bikeData';

export default function App() {
  // 2. Load directly from the file. Instant updates, zero databases, zero migrations!
  const eMTBData: BrandType[] = staticBikeData as BrandType[];
  const isLoading = false;

  // 2. Safely compute BIKES once data loads
  const BIKES = useMemo(() => {
    return (eMTBData || []).flatMap((brand) =>
      brand.models.map((model) => ({
        id: `${brand.brand}-${model.name}`.toLowerCase().replace(/\s+/g, "-"),
        brand: brand.brand,
        model: model.name,
        suspension: model.suspension || "TBD",
        startingPrice: model.builds.length > 0 ? Math.min(...model.builds.map((b) => b.price)) : 0,
        image: model.image,
        builds: model.builds.map((build) => ({
          ...build,
          id: `${brand.brand}-${model.name}-${build.name}`
            .toLowerCase()
            .replace(/\s+/g, "-"),
        })).sort((a, b) => b.price - a.price), // <-- Always keep S-Works at the top!
      })),
    );
  }, [eMTBData]);

  // 3. Safely compute ALL_BUILDS once data loads
  const ALL_BUILDS = useMemo(() => {
    return (eMTBData || []).flatMap((brand) =>
      brand.models.flatMap((model) =>
        model.builds.map((build) => ({
          ...build,
          id: `${brand.brand}-${model.name}-${build.name}`
            .toLowerCase()
            .replace(/\s+/g, "-"),
          brand: brand.brand,
          model: model.name,
          fullName: `${brand.brand} ${model.name} ${build.name}`,
          image: model.image,
        })),
      ),
    );
  }, [eMTBData]);

  // --- PWA UPDATE LISTENER IS NOW SAFELY INSIDE THE COMPONENT ---
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: any) {
      console.log("SW Registered:", r);
    },
    onRegisterError(error: any) {
      console.error("SW registration error", error);
    },
  });

  // 1. We rename the native React setter to _setView (with an underscore)
  const [view, _setView] = useState<string>("showroom");
  
  // 2. We intercept your normal setView command and secretly add the history trick!
  const setView = (newView: string) => {
    window.history.pushState({ view: newView }, '');
    _setView(newView);
  };

  useEffect(() => {
    // Drop the very first breadcrumb when the app loads
    window.history.replaceState({ view: 'showroom' }, '');

    const handleSwipeBack = (event: PopStateEvent) => {
      // If the phone sees our breadcrumb, go to it!
      if (event.state && event.state.view) {
        _setView(event.state.view);
      } else {
        _setView('showroom');
      }
    };

    window.addEventListener('popstate', handleSwipeBack);
    return () => window.removeEventListener('popstate', handleSwipeBack);
  }, []);
  const [selectedBikeId, setSelectedBikeId] = useState<string | null>(null);
  const [selectedBuildId, setSelectedBuildId] = useState<string | null>(null);

  const [selectedBrandFilters, setSelectedBrandFilters] = useState<string[]>(
    [],
  );
  const [selectedMotorFilters, setSelectedMotorFilters] = useState<string[]>(
    [],
  );
  const [selectedWheelFilters, setSelectedWheelFilters] = useState<string[]>(
    [],
  );
  const [selectedTorqueFilters, setSelectedTorqueFilters] = useState<string[]>(
    [],
  );
  const [selectedTravelFilters, setSelectedTravelFilters] = useState<string[]>(
    [],
  );
  const [selectedDrivetrainFilters, setSelectedDrivetrainFilters] = useState<
    string[]
  >([]);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isMotorOpen, setIsMotorOpen] = useState(false);
  const [isTorqueOpen, setIsTorqueOpen] = useState(false);
  const [isWheelsOpen, setIsWheelsOpen] = useState(false);
  const [isTravelOpen, setIsTravelOpen] = useState(false);
  const [isDrivetrainOpen, setIsDrivetrainOpen] = useState(false);

  const [selectingRig, setSelectingRig] = useState<"A" | "B" | null>(null);
  const [selectorBrand, setSelectorBrand] = useState<string | null>(null);
  const [selectorGarageOnly, setSelectorGarageOnly] = useState(false);
  
  // Wait to set default rigs until data is actually loaded!
  const [rigAId, setRigAId] = useState<string | null>(null);
  const [rigBId, setRigBId] = useState<string | null>(null);

  useEffect(() => {
    if (ALL_BUILDS.length > 1 && !rigAId && !rigBId) {
      setRigAId(ALL_BUILDS[0].id);
      setRigBId(ALL_BUILDS[1].id);
    }
  }, [ALL_BUILDS, rigAId, rigBId]);

  const { userId, getToken } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showGarage, setShowGarage] = useState(false);

  // --- NEW: LOCAL SPONSOR & LOCATION STATE ---
  const [userZip, setUserZip] = useState<string | null>(localStorage.getItem('trailmath_zip') || null);
  const [userCityState, setUserCityState] = useState<string | null>(localStorage.getItem('trailmath_citystate') || null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [manualZipInput, setManualZipInput] = useState('');

  useEffect(() => {
    // Only run the ping if we don't already have a zip code saved
    if (!userZip) {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          if (data.postal && data.city && data.region_code) {
            const cityState = `${data.city}, ${data.region_code}`;
            setUserZip(data.postal);
            setUserCityState(cityState);
            localStorage.setItem('trailmath_zip', data.postal);
            localStorage.setItem('trailmath_citystate', cityState);
          }
        })
        .catch(err => console.error("Silent location ping failed:", err));
    }
  }, [userZip]);

  const handleManualZipSave = () => {
    if (manualZipInput.length >= 5) {
      // For now, we just save the zip. Later, we can do a reverse-lookup for the city!
      setUserZip(manualZipInput);
      setUserCityState(`ZIP: ${manualZipInput}`);
      localStorage.setItem('trailmath_zip', manualZipInput);
      localStorage.setItem('trailmath_citystate', `ZIP: ${manualZipInput}`);
      setIsLocationModalOpen(false);
    }
  };

  // Check if the current zip code belongs to a paying sponsor
  const activeSponsor = useMemo(() => {
    if (!userZip) return null;
    return SPONSORED_SHOPS.find(shop => shop.zipCodes.includes(userZip)) || null;
  }, [userZip]);

  useEffect(() => {
    const fetchGarage = async () => {
      if (!userId) {
        setFavorites([]);
        return;
      }
      // Grab the secure token from Clerk
      const token = await getToken();
      if (!token) return;

      // Use the secure client
      const supabase = createClerkSupabaseClient(token);
      const { data, error } = await supabase
        .from("user_garage")
        .select("build_id")
        .eq("user_id", userId);

      if (!error && data) {
        setFavorites(data.map((row: any) => row.build_id));
      } else if (error) {
        console.error("Error fetching garage:", error.message);
      }
    };
    fetchGarage();
  }, [userId, getToken]);

  const absoluteMaxPrice = useMemo(() => {
    if (ALL_BUILDS.length === 0) return 0;
    const allPrices = ALL_BUILDS.map((b) => b.price);
    const max = Math.max(...allPrices, 0);
    return Math.ceil(max / 1000) * 1000;
  }, [ALL_BUILDS]); // <-- Now it watches for ALL_BUILDS to arrive

  const [priceFilter, setPriceFilter] = useState<number>(0);

  // Automatically slide the filter to the max price once data loads
  useEffect(() => {
    if (absoluteMaxPrice > 0 && priceFilter === 0) {
      setPriceFilter(absoluteMaxPrice);
    }
  }, [absoluteMaxPrice, priceFilter]);

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
    if (view === "showroom") {
      setTimeout(() => window.scrollTo(0, showroomScrollRef.current), 10);
    } else {
      window.scrollTo(0, 0);
    }
  }, [view]);

  const selectedBike = BIKES.find((b) => b.id === selectedBikeId);
  const selectedBuild = selectedBike?.builds.find(
    (b) => b.id === selectedBuildId,
  );
  const rigA = ALL_BUILDS.find((b) => b.id === rigAId);
  const rigB = ALL_BUILDS.find((b) => b.id === rigBId);

  const brands = eMTBData
    .map((b) => b.brand)
    .sort((a, b) => a.localeCompare(b));

  const motors = useMemo(() => {
    const allMotors = new Set<string>();
    BIKES.forEach((bike) =>
      bike.builds.forEach((build) => allMotors.add(build.motor)),
    );
    return Array.from(allMotors).sort((a, b) => a.localeCompare(b));
  }, [BIKES]); // <-- Added BIKES dependency
  // --- PWA INSTALL STATE ---
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Capture the install prompt on Android/Desktop
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Trigger the native Android/Chrome prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      // Show custom instructions for Apple users
      setShowIosInstructions(true);
    } else {
      alert("Trail Math is already installed, or your browser doesn't support installation.");
    }
  };

  const torques = useMemo(
    () => [
      "50Nm",
      "55Nm",
      "60Nm",
      "65Nm",
      "85Nm",
      "90Nm",
      "105Nm",
      "108Nm",
      "125Nm",
      "150Nm",
      "TBD",
    ],
    [],
  );

  const travels = useMemo(() => {
    const allTravels = new Set<string>();
    BIKES.forEach((bike) => {
      if (bike.suspension && bike.suspension !== "TBD")
        allTravels.add(bike.suspension);
    });
    return Array.from(allTravels).sort((a, b) => b.localeCompare(a));
  }, [BIKES]); // <-- Added BIKES dependency

  const totalBrands = eMTBData.length;
  const totalModels = eMTBData.reduce((acc, b) => acc + b.models.length, 0);
  const totalBuilds = eMTBData.reduce(
    (acc, b) => acc + b.models.reduce((macc, m) => macc + m.builds.length, 0),
    0,
  );

  const filteredBikes = useMemo(() => {
    return BIKES.filter((bike) => {
      if (showGarage)
        return bike.builds.some((build) => favorites.includes(build.id));
      const matchesBrand =
        selectedBrandFilters.length === 0 ||
        selectedBrandFilters.includes(bike.brand);
      const matchesTravel =
        selectedTravelFilters.length === 0 ||
        selectedTravelFilters.includes(bike.suspension || "TBD");

      const hasMatchingBuild = bike.builds.some((build) => {
        const buildMatchesPrice = build.price <= priceFilter;
        const buildMatchesMotor =
          selectedMotorFilters.length === 0 ||
          selectedMotorFilters.includes(build.motor);
        const buildMatchesWheels =
          selectedWheelFilters.length === 0 ||
          (build.wheels && selectedWheelFilters.includes(build.wheels));
        const buildMatchesTorque =
          selectedTorqueFilters.length === 0 ||
          selectedTorqueFilters.includes(build.torque || "TBD");
        const buildMatchesDrivetrain =
          selectedDrivetrainFilters.length === 0 ||
          selectedDrivetrainFilters.some((dt) =>
            (build.drivetrain || "").toLowerCase().includes(dt.toLowerCase()),
          );

        return (
          buildMatchesPrice &&
          buildMatchesMotor &&
          buildMatchesWheels &&
          buildMatchesTorque &&
          buildMatchesDrivetrain
        );
      });

      return matchesBrand && matchesTravel && hasMatchingBuild;
    }).sort((a, b) => a.brand.localeCompare(b.brand));
  }, [
    selectedBrandFilters,
    selectedMotorFilters,
    selectedWheelFilters,
    selectedTorqueFilters,
    selectedTravelFilters,
    selectedDrivetrainFilters,
    showGarage,
    favorites,
    priceFilter,
  ]);

  const groupedBikes = useMemo(() => {
    const map = new Map<string, typeof BIKES>();
    filteredBikes.forEach((bike) => {
      if (!map.has(bike.brand)) map.set(bike.brand, [] as typeof BIKES);
      map.get(bike.brand)!.push(bike);
    });
    return Array.from(map.entries())
      .map(([brand, bikes]) => ({ brand, bikes }))
      .sort((a, b) => a.brand.localeCompare(b.brand));
  }, [filteredBikes]);

  const toggleFavorite = async (buildId: string) => {
    if (!userId) {
      alert("Sign in to save rigs to your Shortlist!");
      return;
    }

    // Grab the secure token from Clerk
    const token = await getToken();
    if (!token) return;
    const supabase = createClerkSupabaseClient(token);

    const isFavorited = favorites.includes(buildId);
    setFavorites((prev) =>
      isFavorited ? prev.filter((id) => id !== buildId) : [...prev, buildId],
    );

    if (isFavorited) {
      const { error } = await supabase
        .from("user_garage")
        .delete()
        .match({ user_id: userId, build_id: buildId });
      if (error) console.error("Error removing bike:", error.message);
    } else {
      const { error } = await supabase
        .from("user_garage")
        .insert({ user_id: userId, build_id: buildId });
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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  const randomizedBrands = useMemo(
    () => [...eMTBData].sort(() => Math.random() - 0.5),
    [eMTBData], // <-- Added eMTBData dependency
  );
  const totalActiveFilters =
    selectedBrandFilters.length +
    selectedMotorFilters.length +
    selectedWheelFilters.length +
    selectedTorqueFilters.length +
    selectedTravelFilters.length +
    selectedDrivetrainFilters.length;

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-[#0B1121] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold tracking-widest uppercase text-sm animate-pulse">Loading Database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col relative pb-20 sm:pb-0">
      <Analytics />
      <header className="bg-slate-50/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              showroomScrollRef.current = 0;
              setView("showroom");
              setShowGarage(false);
            }}
          >
            <img
              src="/trail_math_logo_emtb.png"
              alt="Trail Math"
              className="h-8 sm:h-10 w-auto max-w-[40vw] sm:max-w-none object-contain"
            />
            {/* INSTALL BUTTON */}
          {(deferredPrompt || isIOS) && (
            <button 
              onClick={handleInstallClick}
              className="ml-2 sm:ml-4 flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-colors"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Install App</span>
              <span className="sm:hidden">Install</span>
            </button>
          )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* --- MAIN DESKTOP TABS --- */}
            <div className="hidden sm:flex items-center gap-2 mr-2">
              {/* Desktop Back buttons if they dive into a build/calc page */}

              
              {/* The 3 Main Tabs (Visible on ALL pages) */}
              <button
                onClick={() => {
                  setView("showroom");
                  setShowGarage(false);
                  showroomScrollRef.current = 0;
                }}
                className={`flex items-center gap-1.5 text-sm font-bold px-3 lg:px-4 py-2 rounded-full transition-all ${(view === 'showroom' || view === 'builds' || view === 'calculator') && !showGarage ? "bg-blue-100 text-blue-900" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
              >
                <Home size={16} className={(view === 'showroom' || view === 'builds' || view === 'calculator') && !showGarage ? "text-blue-600" : "text-slate-600"} />
                <span>Showroom</span>
              </button>

              <button
                onClick={() => {
                  setView("showroom");
                  setShowGarage(true);
                }}
                className={`flex items-center gap-1.5 text-sm font-bold px-3 lg:px-4 py-2 rounded-full transition-all ${(view === 'showroom' || view === 'builds' || view === 'calculator') && showGarage ? "bg-blue-100 text-blue-900" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
              >
                <Star size={16} className={(view === 'showroom' || view === 'builds' || view === 'calculator') && showGarage ? "fill-blue-600 text-blue-600" : "text-slate-600"} />
                <span>My Shortlist</span>
              </button>

              <button
                onClick={() => {
                  setView("compare");
                  setShowGarage(false);
                }}
                className={`flex items-center gap-1.5 text-sm font-bold px-3 lg:px-4 py-2 rounded-full transition-all ${view === 'compare' ? "bg-blue-100 text-blue-900" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
              >
                <Scale size={16} className={view === 'compare' ? "text-blue-600" : "text-slate-600"} />
                <span>Compare Rigs</span>
              </button>
            </div>

            {/* DIVIDER (Desktop Only) */}
            <div className="hidden sm:block h-6 w-[2px] bg-slate-200 mx-1"></div>

            {/* --- RIGHT NAV: AUTH & ZIPCODE --- */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors px-1 sm:px-2">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
              
              <button 
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 text-xs md:text-sm font-bold px-2 md:px-4 py-1.5 md:py-2 rounded-full transition-all bg-slate-100 text-slate-900 hover:bg-slate-200"
              >
                <MapPin size={16} className="text-blue-600" />
                <span className="hidden sm:inline">{userCityState || 'Set Location'}</span>
                <span className="sm:hidden">{userZip || 'Local'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-8 pb-8 sm:pb-12 relative z-10">

        {/* --- SHOWROOM VIEW --- */}
        {view === "showroom" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {showGarage ? (
              <div className="w-full pb-2 sm:pb-4">
                <div className="relative w-full bg-[#0B1121] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800 p-6 sm:p-12 lg:p-16 flex flex-col w-full">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwVjB6bTEgMWgxOHYxOEgxdjE4eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-50"></div>
                  <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[30rem] h-[30rem] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[20rem] h-[20rem] rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none"></div>
                  <div className="relative z-10 w-full flex items-center justify-between">
                    <div className="relative z-10 w-full text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-3 mb-3 sm:mb-4">
                        <div className="h-[2px] w-8 sm:w-10 bg-blue-500"></div>
                        <span className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
                          Saved Favorites
                        </span>
                        <div className="h-[2px] w-8 bg-blue-500 sm:hidden"></div>
                      </div>
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-[1.05]">
                        THE <span className="text-blue-500">SHORTLIST</span>
                      </h1>
                      <p className="text-slate-400 mt-4 sm:mt-6 font-medium max-w-xl mx-auto sm:mx-0 text-sm sm:text-base leading-relaxed">
                        The specific builds you've saved for later. Click a rig to
                        calculate your exact out-of-pocket costs, or hit compare
                        to stack them head-to-head.
                      </p>
                      {favorites.length > 1 && (
                        <button
                          onClick={() => {
                            showroomScrollRef.current = window.scrollY;
                            setShowGarage(false);
                            setView("compare");
                          }}
                          className="mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-blue-900/50 inline-flex items-center justify-center gap-2"
                        >
                          <Scale size={18} /> Compare Shortlist
                        </button>
                      )}
                    </div>
                    <div className="hidden lg:flex items-center justify-center relative z-10 opacity-20 pr-8 shrink-0">
                      <List size={160} className="text-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="w-full pb-2 sm:pb-4">
                  <div className="relative w-full bg-[#0B1121] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwVjB6bTEgMWgxOHYxOEgxdjE4eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-50"></div>
                    <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[30rem] h-[30rem] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[20rem] h-[20rem] rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none"></div>

                  {/* HERO CARD */}
                  <div className="relative flex flex-col md:flex-row items-center gap-4 lg:gap-6 p-4 sm:p-8 lg:p-10 z-10">
                      <div className="md:w-1/2 z-10 w-full text-center sm:text-left">
                        <div className="relative z-10 w-full text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-3 mb-3 sm:mb-4">
                            <div className="h-[2px] w-8 sm:w-10 bg-blue-500"></div>
                            <span className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
                              The Definitive Database
                            </span>
                            <div className="h-[2px] w-8 bg-blue-500 sm:hidden"></div>
                          </div>
                          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-[1.05]">
                            FIND YOUR <br />
                            <span className="text-blue-500 mt-1 inline-block">
                              DREAM BIKE
                            </span>
                          </h1>
                          <p className="text-slate-400 mt-3 sm:mt-4 font-medium max-w-xl mx-auto sm:mx-0 text-sm sm:text-base leading-snug mb-4 sm:mb-5">
                            TRAIL MATH is the world's first and largest comparison
                            tool for current gen eMTBs. Compare builds, specs, and
                            calculate exact out-of-pocket costs.
                          </p>
                        </div>                        
                        <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start gap-3 pt-1">
                          <button
                            onClick={() => setIsFilterModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl transition-colors shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 w-full sm:w-auto text-sm"
                          >
                            <Filter size={16} />
                            Start Filtering
                          </button>
                          <button
                            onClick={() => setView("compare")}
                            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2 w-full sm:w-auto text-sm"
                          >
                            <Scale size={16} />
                            Head-to-Head
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 lg:pt-4 mt-3 lg:mt-4 border-t border-slate-800/80 text-center sm:text-left">
                            <div>
                              <div className="text-2xl lg:text-3xl font-black text-white leading-none">
                                {totalBrands}
                              </div>
                              <div className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                                Brands
                              </div>
                            </div>
                            <div>
                              <div className="text-2xl lg:text-3xl font-black text-white leading-none">
                                {totalModels}
                              </div>
                              <div className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                                Models
                              </div>
                            </div>
                            <div>
                              <div className="text-2xl lg:text-3xl font-black text-white leading-none">
                                {totalBuilds}
                              </div>
                              <div className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                                Builds
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ✅ Tightened mobile top margin from mt-6 to mt-4 */}
                        <div className="md:w-1/2 w-full mt-4 md:mt-0 relative z-10 aspect-video rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-700/50 transform md:-rotate-2 hover:rotate-0 transition-transform duration-500 overflow-hidden ring-1 ring-white/10">
                          {heroImages.map((src, index) => (
                            <img
                              key={src}
                              src={src}
                              alt={`Dream Rig ${index + 1}`}
                              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === heroImageIndex ? "opacity-100" : "opacity-0"}`}
                              crossOrigin="anonymous"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                {/* Bigger spacer to push the next section out of view: mb-16 sm:mb-24 */}
                <div className="w-full mb-16 sm:mb-24 [mask-image:_linear-gradient(to_right,transparent_0,_black_10%,_black_90%,transparent_100%)]">
                  <div className="w-full bg-slate-50 border-y border-slate-200 py-2 sm:py-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="flex items-center space-x-6 sm:space-x-8 px-4 w-max animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused]">
                      {randomizedBrands.map(
                        (b) =>
                          b.logo && (
                            <img
                              key={`${b.brand}-1`}
                              src={b.logo}
                              alt={b.brand}
                              className="h-5 md:h-7 max-w-[100px] md:max-w-[120px] w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                            />
                          ),
                      )}
                      {randomizedBrands.map(
                        (b) =>
                          b.logo && (
                            <img
                              key={`${b.brand}-2`}
                              src={b.logo}
                              alt={b.brand}
                              className="h-5 md:h-7 max-w-[100px] md:max-w-[120px] w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                            />
                          ),
                      )}
                    </div>
                  </div>
                </div>

                {/* --- SCROLLING SHOWROOM COMPONENT --- */}
                <TrendingCarousel
                  BIKES={BIKES}
                  onSelectBike={(id) => {
                    showroomScrollRef.current = window.scrollY;
                    setSelectedBikeId(id);
                    setView("builds");
                  }}
                  sponsor={activeSponsor} // Pass the active sponsor
                />
              </>
            )}

            {showGarage ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-8">
                {ALL_BUILDS.filter((b) => favorites.includes(b.id)).map(
                  (build) => {
                    const parentBike = BIKES.find((bike) =>
                      bike.builds.some((bb) => bb.id === build.id),
                    );
                    return (
                      <div
                        key={`garage-${build.id}`}
                        onClick={() => {
                          showroomScrollRef.current = window.scrollY;
                          if (parentBike) {
                            setSelectedBikeId(parentBike.id);
                            setSelectedBuildId(build.id);
                            setView("calculator");
                          }
                        }}
                        className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col relative"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(build.id);
                          }}
                          className="absolute top-4 right-4 z-20 p-2 bg-slate-50 rounded-full hover:bg-red-50 text-blue-500 hover:text-red-500 transition-colors"
                          title="Remove from Shortlist"
                        >
                          <Star size={16} className="fill-current" />
                        </button>
                        <div className="w-full h-40 sm:h-48 bg-[#F3F3F3] rounded-2xl mb-5 relative overflow-hidden flex items-center justify-center">
                          <img
                            src={build.image}
                            alt={build.fullName}
                            className="absolute inset-0 w-full h-full object-contain scale-110 group-hover:scale-125 transition-transform duration-500"
                            crossOrigin="anonymous"
                          />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">
                            {build.brand}
                          </span>
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md shrink-0">
                            {parentBike?.suspension || "TBD"}
                          </span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-1">
                          {build.model}
                        </h4>
                        <div className="text-xs sm:text-sm font-bold text-slate-500 mb-4">
                          {build.name}
                        </div>
                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex flex-col">
                            {build.msrp && build.price < build.msrp && (
                              <span className="text-[10px] font-bold text-slate-400 line-through mb-0.5">{formatPrice(build.msrp)}</span>
                            )}
                            {/* ✅ Updated to match the "SAVE $X" styling from the Builds page */}
                            <div className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
                              {formatPrice(build.price)}
                              {build.msrp && build.price < build.msrp && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-red-600 text-[10px] sm:text-xs font-black uppercase tracking-tight">SAVE ${ (build.msrp - build.price).toLocaleString() }</span>
                                  {build.limitedStock && (
                                    <span className="bg-amber-500 text-white text-[8px] font-black uppercase px-1 py-0.5 rounded">Ltd</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform text-blue-600 shrink-0"
                          />
                        </div>
                      </div>
                    );
                  },
                )}{" "}
                {favorites.length === 0 && (
                  <div className="col-span-full py-20 sm:py-32 text-center">
                    <Star size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-2xl font-bold text-slate-500">
                      Your Shortlist is Empty
                    </h3>
                    <p className="text-slate-400 mt-2 font-medium">
                      Click the star icon on any build to save it here.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex flex-col mt-8 sm:mt-12 mb-4 px-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Trail Math Full Catalog</h3>
                    <div className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider hidden sm:block">{totalBuilds} Total Builds</div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] sm:text-xs text-slate-500 font-medium">Spot an error in our spec data?</span>
                    <a href="mailto:TrailMath@gmail.com?subject=Data%20Correction" className="text-[10px] sm:text-xs font-bold text-blue-600 hover:underline">Let us know.</a>
                  </div>
                </div>

                <div className="sticky top-16 sm:top-20 z-30 bg-slate-50/90 backdrop-blur-md py-2 sm:py-4 border-b border-slate-200 -mx-4 px-4 sm:mx-0 sm:px-0 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.05)] shadow-slate-200/50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 bg-white border border-slate-300 py-1.5 sm:py-2.5 px-3 sm:px-6 rounded-xl text-xs sm:text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                      >
                        <Filter
                          size={14}
                          className="text-blue-600 sm:w-4 sm:h-4"
                        />{" "}
                        Filter <span className="hidden sm:inline">Rigs</span>{" "}
                        {totalActiveFilters > 0 && (
                          <span className="bg-blue-100 text-blue-700 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs">
                            {totalActiveFilters}
                          </span>
                        )}
                      </button>
                      <span className="flex-1 sm:flex-none text-center text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1.5 sm:px-3 sm:py-2.5 rounded-xl">
                        {filteredBikes.length}{" "}
                        {filteredBikes.length === 1 ? "Match" : "Matches"}
                      </span>
                      {(totalActiveFilters > 0 ||
                        priceFilter !== absoluteMaxPrice) && (
                        <button
                          onClick={clearFilters}
                          className="text-xs sm:text-sm text-slate-500 hover:text-slate-800 font-medium whitespace-nowrap px-1 sm:px-2"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-stretch gap-3 sm:gap-0 min-w-[100%] sm:min-w-[240px] bg-white sm:bg-transparent p-2 sm:p-0 rounded-xl border sm:border-0 border-slate-200 shadow-sm sm:shadow-none">
                      <div className="flex justify-between items-center w-auto sm:w-full text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-0 sm:mb-2 shrink-0">
                        <span className="hidden sm:inline">Budget</span>
                        <span className="text-blue-600 bg-blue-50 sm:bg-transparent px-2 py-0.5 sm:p-0 rounded">
                          Under ${priceFilter.toLocaleString()}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={absoluteMaxPrice}
                        step="500"
                        value={priceFilter}
                        onChange={(e) =>
                          setPriceFilter(parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* The Min-Height Wrapper preventing the scroll-snap */}
                <div className="min-h-[100vh] pt-6 pb-12 [overflow-anchor:none]">
                  {groupedBikes.length === 0 && (
                    <div className="text-center py-20">
                      <h3 className="text-2xl font-bold text-slate-500">
                        No Rigs Found
                      </h3>
                      <p className="text-slate-400 mt-2 font-medium">
                        Try raising your budget or clearing filters.
                      </p>
                    </div>
                  )}

                  {groupedBikes.map((group) => (
                    <section key={group.brand} className="w-full mb-12">
                      <div className="w-full">
                        <h2 className="text-6xl md:text-8xl font-bold italic uppercase tracking-tight text-black/5 select-none border-b-2 border-slate-200 pb-2 mb-6 md:mb-8">
                          {group.brand}
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {group.bikes.map((bike) => (
                          <div
                            key={bike.id}
                            onClick={() => {
                              showroomScrollRef.current = window.scrollY;
                              setSelectedBikeId(bike.id);
                              setView("builds");
                            }}
                            className="bg-white rounded-[1.5rem] p-4 sm:p-5 shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group flex flex-col"
                          >
                            <div className="w-full h-48 sm:h-56 bg-[#F3F3F3] rounded-xl mb-5 relative overflow-visible flex items-center justify-center p-4">
                              <img
                                src={bike.image}
                                alt={bike.model}
                                className="w-[115%] max-w-[115%] h-auto object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_20px_20px_rgba(37,99,235,0.2)] group-hover:scale-105 transition-all duration-500"
                                crossOrigin="anonymous"
                              />
                            </div>

                            <div className="flex-1 flex flex-col justify-center min-w-0 px-2 pb-2">
                              <div className="flex justify-between items-center text-xs uppercase mb-2">
                                <div className="text-[10px] font-extrabold text-blue-600 tracking-widest truncate pr-2">
                                  {bike.brand}
                                </div>
                                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md shrink-0">
                                  {bike.suspension}
                                </span>
                              </div>
                              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 truncate group-hover:text-blue-600 transition-colors">
                                {bike.model}
                              </h3>
                              <div className="mt-auto flex items-end justify-between pt-4 border-t border-slate-100">
                                <div>
                                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">
                                    Starting at
                                  </div>
                                  <div className="text-lg font-black text-slate-900">
                                    {formatPrice(bike.startingPrice)}
                                  </div>
                                </div>
                                <div className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
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
              </>
            )}
          </div>
        )}

        {/* --- BUILDS VIEW --- */}
        {view === "builds" && selectedBike && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="flex flex-col lg:flex-row gap-8 items-start mt-4">
              <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 flex flex-col relative">
                  
                  {/* BACK BUTTON TO SHOWROOM */}
                  <button
                    onClick={() => {
                      setView("showroom");
                      setSelectedBikeId(null);
                    }}
                    className="absolute top-4 left-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-slate-100 hover:scale-110 active:scale-95 transition-all group"
                  >
                    <ChevronLeft size={22} className="text-slate-600 group-hover:text-blue-500" />
                  </button>

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
                    <img
                      src={selectedBike.image}
                      alt={selectedBike.model}
                      className="absolute inset-0 w-full h-full object-contain scale-125 drop-shadow-2xl"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="p-8 text-center flex flex-col items-center">
                    {(selectedBike as any).logo && (
                      <img
                        src={(selectedBike as any).logo}
                        alt={selectedBike.brand}
                        className="h-10 w-auto object-contain mx-auto mb-4"
                        crossOrigin="anonymous"
                      />
                    )}
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                      {selectedBike.model}
                    </h2>
                    <p className="text-slate-500 font-medium text-sm">
                      Select a build below to review specs and calculate
                      payments.
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-2/3 space-y-4">
                <div className="bg-[#0B1121] rounded-2xl p-6 relative overflow-hidden shadow-lg border border-slate-800 flex items-center justify-between mb-6">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwVjB6bTEgMWgxOHYxOEgxdjE4eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-50 pointer-events-none"></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[60px] pointer-events-none"></div>
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <h3 className="text-2xl font-extrabold text-white tracking-tight">
                      {showGarage ? "Shortlisted Builds" : "Available Builds"}
                    </h3>
                    <span className="text-sm font-bold text-blue-400 bg-blue-900/30 border border-blue-800/50 px-3 py-1 rounded-full">
                      {
                        selectedBike.builds.filter((b) =>
                          showGarage ? favorites.includes(b.id) : true,
                        ).length
                      }{" "}
                      Options
                    </span>
                  </div>
                </div>

                {selectedBike.builds
                  .filter((b) => (showGarage ? favorites.includes(b.id) : true))
                  .map((build) => (
                    <div
                      key={build.id}
                      onClick={() => {
                        setSelectedBuildId(build.id);
                        setView("calculator");
                      }}
                      className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-600 hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col gap-4 sm:gap-5"
                    >
                      <div className="flex items-start sm:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                          <h4 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                            {build.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-lg sm:text-xl font-extrabold text-slate-900 bg-slate-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg border border-slate-200 inline-block w-fit">
                              {formatPrice(build.price)}
                            </span>
                            {build.msrp && build.price < build.msrp && (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-bold text-slate-400 line-through">{formatPrice(build.msrp)}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-red-600 text-[10px] sm:text-xs font-black uppercase">Save ${build.msrp - build.price}</span>
                                  {build.limitedStock && (
                                    <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[9px] sm:text-[10px] font-black uppercase px-2 py-1 rounded-md">Limited Sizes</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(build.id);
                            }}
                            className="p-2 sm:p-3 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors"
                            title="Save to Shortlist"
                          >
                            <Star
                              size={20}
                              className={
                                favorites.includes(build.id)
                                  ? "fill-blue-500 text-blue-500"
                                  : "text-slate-400"
                              }
                            />
                          </button>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                            <ArrowRight size={18} />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-slate-100">
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                            Motor
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
                            {build.motor}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                            Battery
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
                            {build.battery}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                            Material
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
                            {build.material}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                            Torque
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
                            {build.torque || "TBD"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* --- CALCULATOR VIEW --- */}
        {view === "calculator" && selectedBuild && selectedBike && (
        <CalculatorView
          bike={selectedBike}
          build={selectedBuild}
          isFavorite={favorites.includes(selectedBuild.id)}
          onToggleFavorite={() => toggleFavorite(selectedBuild.id)}
          onBack={() => setView("builds")} 
          sponsor={activeSponsor}
        />
        )}

        {/* --- COMPARE VIEW --- */}
        {view === "compare" && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 pb-12 w-full">
            <div className="bg-[#0B1121] rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border border-slate-800 overflow-hidden flex flex-col w-full relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwVjB6bTEgMWgxOHYxOEgxdjE4eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-50 pointer-events-none z-0"></div>
              <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[30rem] h-[30rem] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none z-0"></div>
              <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[20rem] h-[20rem] rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none z-0"></div>

              <div className="p-6 sm:p-12 lg:p-16 relative flex items-center justify-between border-b border-slate-800 shrink-0 z-10">
                <div className="relative z-10 w-full text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-3 mb-3 sm:mb-4">
                    <div className="h-[2px] w-8 sm:w-10 bg-blue-500"></div>
                    <span className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
                      Spec Check
                    </span>
                    <div className="h-[2px] w-8 bg-blue-500 sm:hidden"></div>
                  </div>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-[1.05]">
                    HEAD-<span className="text-blue-500">TO</span>-HEAD
                  </h2>
                  <p className="text-slate-400 mt-4 sm:mt-6 font-medium max-w-xl mx-auto sm:mx-0 text-sm sm:text-base leading-relaxed">
                    Stack two rigs side-by-side to compare geometry, motors, and
                    components before you calculate the damage.
                  </p>
                </div>
                <div className="hidden lg:flex items-center justify-center relative z-10 opacity-20 pr-8 shrink-0">
                  <Scale size={160} className="text-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-slate-800 relative shrink-0 z-10">
                {/* --- RIG A COLUMN --- */}
                <div className="flex flex-col relative w-full">
                  <div className="p-4 sm:p-8 border-b border-slate-800">
                    <label className="block text-[10px] sm:text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
                      Rig A
                    </label>
                    <button
                      onClick={() => {
                        setSelectingRig("A");
                        setSelectorBrand(rigA ? String(rigA.brand) : brands[0]);
                      }}
                      className="w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl p-3 sm:p-4 text-left flex justify-between items-center transition-all shadow-sm"
                    >
                      <span className="truncate pr-2">
                        {rigA
                          ? `${rigA.brand} ${rigA.model} ${rigA.name}`
                          : "Select Rig A"}
                      </span>
                      <ChevronDown
                        size={18}
                        className="text-blue-500 shrink-0 group-hover:scale-110 transition-transform"
                      />
                    </button>
                  </div>
                  {rigA && (
                    <>
                      {/* NEW DISPLAY CASE FOR RIG A */}
                      <div className="w-full px-4 sm:px-8 pt-8 pb-4">
                        <div className="w-full h-40 sm:h-80 bg-[#F3F3F3] rounded-2xl relative overflow-visible flex items-center justify-center p-4 shadow-inner">
                          <img
                            src={rigA.image}
                            alt={rigA.fullName}
                            className="w-[115%] max-w-[115%] h-auto object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)]"
                            crossOrigin="anonymous"
                          />
                        </div>
                      </div>
                      <div className="px-6 pb-6 sm:px-10 sm:pb-10 text-center flex flex-col justify-center">
                        <h3 className="text-xl sm:text-3xl font-black text-white leading-tight mb-2 sm:mb-3">
                          {rigA.model} <br className="sm:hidden" />
                          {rigA.name}
                        </h3>
                      {/* ✅ Stripped the sale tag out entirely so the text perfectly centers! */}
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-lg sm:text-2xl font-bold text-blue-400">
                          {formatPrice(rigA.price)}
                        </span>
                        {rigA.msrp && rigA.price < rigA.msrp && (
                          <span className="text-xs sm:text-sm font-bold text-slate-500 line-through mt-0.5">{formatPrice(rigA.msrp)}</span>
                        )}
                      </div>
                      </div>
                    </>
                  )}
                </div>

                {/* --- RIG B COLUMN --- */}
                <div className="flex flex-col relative w-full">
                  <div className="p-4 sm:p-8 border-b border-slate-800">
                    <label className="block text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
                      Rig B
                    </label>
                    <button
                      onClick={() => {
                        setSelectingRig("B");
                        setSelectorBrand(rigB ? String(rigB.brand) : brands[0]);
                      }}
                      className="w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl p-3 sm:p-4 text-left flex justify-between items-center transition-all shadow-sm"
                    >
                      <span className="truncate pr-2">
                        {rigB
                          ? `${rigB.brand} ${rigB.model} ${rigB.name}`
                          : "Select Rig B"}
                      </span>
                      <ChevronDown
                        size={18}
                        className="text-emerald-500 shrink-0 group-hover:scale-110 transition-transform"
                      />
                    </button>{" "}
                  </div>
                  {rigB && (
                    <>
                      {/* NEW DISPLAY CASE FOR RIG B */}
                      <div className="w-full px-4 sm:px-8 pt-8 pb-4">
                        <div className="w-full h-40 sm:h-80 bg-[#F3F3F3] rounded-2xl relative overflow-visible flex items-center justify-center p-4 shadow-inner">
                          <img
                            src={rigB.image}
                            alt={rigB.fullName}
                            className="w-[115%] max-w-[115%] h-auto object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)]"
                            crossOrigin="anonymous"
                          />
                        </div>
                      </div>
                      <div className="px-6 pb-6 sm:px-10 sm:pb-10 text-center flex flex-col justify-center">
                        <h3 className="text-xl sm:text-3xl font-black text-white leading-tight mb-2 sm:mb-3">
                          {rigB.model} <br className="sm:hidden" />
                          {rigB.name}
                        </h3>
                        {/* ✅ Stripped the sale tag out entirely so the text perfectly centers! */}
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-lg sm:text-2xl font-bold text-emerald-400">
                            {formatPrice(rigB.price)}
                          </span>
                          {rigB.msrp && rigB.price < rigB.msrp && (
                            <span className="text-xs sm:text-sm font-bold text-slate-500 line-through mt-0.5">{formatPrice(rigB.msrp)}</span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {rigA && rigB && (
                <div className="bg-slate-50 divide-y divide-slate-200 relative z-10 w-full">
                  {[
                    { label: "Material", a: rigA.material, b: rigB.material },
                    { label: "Motor", a: rigA.motor, b: rigB.motor },
                    {
                      label: "Torque",
                      a: rigA.torque || "TBD",
                      b: rigB.torque || "TBD",
                    },
                    { label: "Battery", a: rigA.battery, b: rigB.battery },
                    {
                      label: "Drivetrain",
                      a: rigA.drivetrain || "TBD",
                      b: rigB.drivetrain || "TBD",
                    },
                    {
                      label: "Fork",
                      a: rigA.fork || "TBD",
                      b: rigB.fork || "TBD",
                    },
                    {
                      label: "Shock",
                      a: rigA.shock || "TBD",
                      b: rigB.shock || "TBD",
                    },
                    {
                      label: "Brakes",
                      a: rigA.brakes || "TBD",
                      b: rigB.brakes || "TBD",
                    },
                    {
                      label: "Wheelset",
                      a: rigA.wheelset || "TBD",
                      b: rigB.wheelset || "TBD",
                    },
                    {
                      label: "Hubs",
                      a: rigA.hubs || "TBD",
                      b: rigB.hubs || "TBD",
                    },
                    {
                      label: "Wheel Setup",
                      a: formatWheelSetup(rigA.wheels),
                      b: formatWheelSetup(rigB.wheels),
                    },
                    {
                      label: "Tires",
                      a: rigA.tires || "TBD",
                      b: rigB.tires || "TBD",
                    },
                  ].map((spec, idx) => (
                    <div
                      key={idx}
                      className="hover:bg-white transition-colors w-full"
                    >
                      <div className="hidden sm:grid grid-cols-3 items-center py-5 px-8">
                        <div className="text-right pr-8 font-semibold text-slate-900 text-sm">
                          {spec.a}
                        </div>
                        <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-200/50 py-1.5 rounded-lg">
                          {spec.label}
                        </div>
                        <div className="text-left pl-8 font-semibold text-slate-900 text-sm">
                          {spec.b}
                        </div>
                      </div>
                      <div className="sm:hidden flex flex-col py-4 px-5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-2">
                          {spec.label}
                        </div>
                        <div className="grid grid-cols-2 gap-4 divide-x divide-slate-200">
                          <div className="text-center text-xs font-semibold text-slate-900 pr-2">
                            {spec.a}
                          </div>
                          <div className="text-center text-xs font-semibold text-slate-900 pl-2">
                            {spec.b}
                          </div>
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

      {/* --- BULLETPROOF LOCATION MODAL --- */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="absolute inset-0 bg-[#0B1121]/80 backdrop-blur-md" onClick={() => setIsLocationModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] w-[90vw] max-w-sm flex flex-col relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <MapPin className="text-blue-600" /> Set Local Trailhead
              </h2>
              <button onClick={() => setIsLocationModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-500" /></button>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-6">
              Enter your zip code to see inventory and exclusive deals from authorized bike shops in your immediate area.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                placeholder="Enter Zip Code" 
                value={manualZipInput}
                onChange={(e) => setManualZipInput(e.target.value.replace(/\D/g, ''))}
                maxLength={5}
                className="w-full sm:flex-1 min-w-0 bg-slate-50 border border-slate-300 text-slate-900 font-bold text-lg rounded-xl px-4 py-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
              />
              <button 
                onClick={handleManualZipSave}
                disabled={manualZipInput.length < 5}
                className={`w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-colors shrink-0 ${manualZipInput.length < 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- BULLETPROOF FILTER MODAL --- */}
      {isFilterModalOpen && (
        <div
          className="fixed inset-0 flex items-end sm:items-center justify-center p-4"
          style={{ zIndex: 9998 }}
        >
          <div
            className="absolute inset-0 bg-[#0B1121]/80 backdrop-blur-md"
            onClick={() => setIsFilterModalOpen(false)}
          />
          <div className="bg-white rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] w-[90vw] max-w-md max-h-[80vh] flex flex-col relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Filters
              </h2>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <button
                  onClick={() => setIsBrandOpen((v) => !v)}
                  className="w-full flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  aria-expanded={isBrandOpen}
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Brand
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-blue-500 transition-transform duration-300 ${isBrandOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isBrandOpen && (
                  <div className="mt-3 space-y-2">
                    {brands.map((brand) => {
                      const isSelected = selectedBrandFilters.includes(brand);
                      return (
                        <label
                          key={brand}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}
                          >
                            {isSelected && (
                              <svg
                                className="w-3.5 h-3.5 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isSelected}
                            onChange={() =>
                              setSelectedBrandFilters((prev) =>
                                isSelected
                                  ? prev.filter((b) => b !== brand)
                                  : [...prev, brand],
                              )
                            }
                          />
                          <span className="text-sm font-medium text-slate-700">
                            {brand}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => setIsMotorOpen((v) => !v)}
                  className="w-full flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  aria-expanded={isMotorOpen}
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Motor
                  </span>
                  <ChevronDown
                    className={`transition-transform ${isMotorOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isMotorOpen && (
                  <div className="mt-3 space-y-2">
                    {motors.map((motor) => {
                      const isSelected = selectedMotorFilters.includes(motor);
                      return (
                        <label
                          key={motor}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}
                          >
                            {isSelected && (
                              <svg
                                className="w-3.5 h-3.5 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isSelected}
                            onChange={() =>
                              setSelectedMotorFilters((prev) =>
                                isSelected
                                  ? prev.filter((m) => m !== motor)
                                  : [...prev, motor],
                              )
                            }
                          />
                          <span className="text-sm font-medium text-slate-700">
                            {motor}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => setIsTorqueOpen((v) => !v)}
                  className="w-full flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  aria-expanded={isTorqueOpen}
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Torque
                  </span>
                  <ChevronDown
                    className={`transition-transform ${isTorqueOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isTorqueOpen && (
                  <div className="mt-3 space-y-2">
                    {torques.map((tq) => {
                      const isSelected = selectedTorqueFilters.includes(tq);
                      return (
                        <label
                          key={tq}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}
                          >
                            {isSelected && (
                              <svg
                                className="w-3.5 h-3.5 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isSelected}
                            onChange={() =>
                              setSelectedTorqueFilters((prev) =>
                                isSelected
                                  ? prev.filter((x) => x !== tq)
                                  : [...prev, tq],
                              )
                            }
                          />
                          <span className="text-sm font-medium text-slate-700">
                            {tq}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => setIsDrivetrainOpen((v) => !v)}
                  className="w-full flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  aria-expanded={isDrivetrainOpen}
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Drivetrain
                  </span>
                  <ChevronDown
                    className={`transition-transform ${isDrivetrainOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isDrivetrainOpen && (
                  <div className="mt-3 space-y-2">
                    {["SRAM", "Shimano", "TRP", "Pinion"].map((dt) => {
                      const isSelected = selectedDrivetrainFilters.includes(dt);
                      return (
                        <label
                          key={dt}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}
                          >
                            {isSelected && (
                              <svg
                                className="w-3.5 h-3.5 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isSelected}
                            onChange={() =>
                              setSelectedDrivetrainFilters((prev) =>
                                isSelected
                                  ? prev.filter((x) => x !== dt)
                                  : [...prev, dt],
                              )
                            }
                          />
                          <span className="text-sm font-medium text-slate-700">
                            {dt}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => setIsWheelsOpen((v) => !v)}
                  className="w-full flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  aria-expanded={isWheelsOpen}
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Wheels
                  </span>
                  <ChevronDown
                    className={`transition-transform ${isWheelsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isWheelsOpen && (
                  <div className="mt-3 space-y-2">
                    {['29"', '27.5"', "Mullet"].map((w) => {
                      const isSelected = selectedWheelFilters.includes(w);
                      return (
                        <label
                          key={w}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}
                          >
                            {isSelected && (
                              <svg
                                className="w-3.5 h-3.5 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isSelected}
                            onChange={() =>
                              setSelectedWheelFilters((prev) =>
                                isSelected
                                  ? prev.filter((x) => x !== w)
                                  : [...prev, w],
                              )
                            }
                          />
                          <span className="text-sm font-medium text-slate-700">
                            {w}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => setIsTravelOpen((v) => !v)}
                  className="w-full flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  aria-expanded={isTravelOpen}
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Travel
                  </span>
                  <ChevronDown
                    className={`transition-transform ${isTravelOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isTravelOpen && (
                  <div className="mt-3 space-y-2">
                    {travels.map((tvl) => {
                      const isSelected = selectedTravelFilters.includes(tvl);
                      return (
                        <label
                          key={tvl}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}
                          >
                            {isSelected && (
                              <svg
                                className="w-3.5 h-3.5 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isSelected}
                            onChange={() =>
                              setSelectedTravelFilters((prev) =>
                                isSelected
                                  ? prev.filter((x) => x !== tvl)
                                  : [...prev, tvl],
                              )
                            }
                          />
                          <span className="text-sm font-medium text-slate-700">
                            {tvl} mm
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex gap-4">
              <button
                onClick={clearFilters}
                className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl shadow-sm shadow-blue-200 hover:bg-blue-700 transition-colors"
              >
                Show {filteredBikes.length}{" "}
                {filteredBikes.length === 1 ? "Match" : "Matches"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- BULLETPROOF RIG SELECTION MODAL --- */}
      {selectingRig && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
        >
          <div
            className="absolute inset-0 bg-[#0B1121]/80 backdrop-blur-md"
            onClick={() => setSelectingRig(null)}
          />
          <div className="bg-white rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] w-[90vw] max-w-4xl max-h-[85vh] flex flex-col relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 shrink-0">
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
                Select Rig {selectingRig}
              </h2>
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => setSelectorGarageOnly(!selectorGarageOnly)}
                  className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full transition-all ${selectorGarageOnly ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  <Star
                    size={16}
                    className={
                      selectorGarageOnly
                        ? "fill-blue-600 text-blue-600"
                        : "text-slate-400"
                    }
                  />
                  <span className="hidden sm:inline">My Shortlist</span>
                  <span className="sm:hidden">Shortlist</span>
                </button>
                <button
                  onClick={() => setSelectingRig(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <div className="w-1/3 sm:w-1/4 bg-slate-50 border-r border-slate-100 overflow-y-auto">
                {brands.map((brand) => {
                  const brandBuilds = ALL_BUILDS.filter(
                    (b) =>
                      b.brand === brand &&
                      (!selectorGarageOnly || favorites.includes(b.id)),
                  );
                  if (selectorGarageOnly && brandBuilds.length === 0)
                    return null;
                  return (
                    <button
                      key={brand}
                      onClick={() => setSelectorBrand(brand)}
                      className={`w-full text-left px-3 sm:px-4 py-4 text-xs sm:text-sm font-bold border-l-4 transition-colors ${selectorBrand === brand ? "bg-white border-blue-600 text-blue-700 shadow-sm" : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                    >
                      {brand}{" "}
                      <span className="text-[10px] sm:text-xs font-normal text-slate-400 ml-1 block sm:inline">
                        ({brandBuilds.length})
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="w-2/3 sm:w-3/4 p-4 sm:p-6 overflow-y-auto bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ALL_BUILDS.filter((b) => b.brand === selectorBrand)
                    .filter(
                      (b) => !selectorGarageOnly || favorites.includes(b.id),
                    )
                    .map((build) => (
                      <button
                        key={build.id}
                        onClick={() => {
                          if (selectingRig === "A") setRigAId(build.id);
                          if (selectingRig === "B") setRigBId(build.id);
                          setSelectingRig(null);
                        }}
                        className="group flex items-center justify-between text-left p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all bg-white gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            {build.model}
                          </div>
                          <div className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-blue-600 mb-1 leading-tight truncate">
                            {build.name}
                          </div>
                          <div className="text-sm font-bold text-blue-600">
                            {formatPrice(build.price)}
                          </div>
                        </div>
                        <div className="w-16 h-12 sm:w-20 sm:h-16 bg-slate-50 rounded-lg shrink-0 flex items-center justify-center p-1 border border-slate-100 group-hover:border-blue-200 transition-colors">
                          <img
                            src={build.image}
                            alt={build.model}
                            className="w-full h-full object-contain mix-blend-multiply"
                            crossOrigin="anonymous"
                          />
                        </div>
                      </button>
                    ))}
                  {ALL_BUILDS.filter(
                    (b) =>
                      b.brand === selectorBrand &&
                      (!selectorGarageOnly || favorites.includes(b.id)),
                  ).length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 font-medium">
                      No Shortlisted Builds for this brand.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PWA UPDATE PROMPT --- */}
      {needRefresh && (
        <div className="fixed bottom-24 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 z-[100] bg-slate-800 border border-blue-500 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-3 sm:max-w-sm animate-in slide-in-from-bottom-8 duration-500">
          <p className="text-white text-sm font-semibold">
            A new version of{" "}
            <span className="text-blue-400 font-black tracking-widest">
              TRAIL MATH
            </span>{" "}
            is available!
          </p>
          <div className="flex gap-3 mt-1">
            <button
              onClick={() => updateServiceWorker(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg"
            >
              Update Now
            </button>
            <button
              onClick={() => setNeedRefresh(false)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="w-full bg-slate-900 border-t border-slate-800 py-8 sm:py-6 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex flex-col items-center md:items-start gap-2">
      <img src="/trail_math_logo_footer.png" alt="Trail Math" className="h-8 sm:h-7 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
      <a href="mailto:TrailMath@gmail.com?subject=Local%20Shop%20Sponsorship" className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest mt-2">
        Become a Sponsored Shop
      </a>
      <p className="text-xs text-slate-500 font-medium">&copy; {new Date().getFullYear()} Trail Math.</p>
      </div>

          <div className="max-w-md text-center md:text-right space-y-3">
            {/* Required Affiliate Disclosure */}
            <div className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
              *Trail Math is reader-supported. When you click links and make a
              purchase, we may receive an affiliate commission at no extra cost
              to you.
            </div>

            {/* Financial Disclaimer */}
            <div className="text-[10px] text-slate-500 font-medium leading-relaxed">
              Monthly payments, interest rates, and tax calculations are
              estimates provided for educational purposes only. Final prices,
              specs, and availability are subject to change by the manufacturer.
              Estimates exclude dealer fees, setup, and destination charges.
            </div>

            {/* Privacy Policy Toggle */}
            <div className="flex justify-center md:justify-end gap-4 pt-1">
              <button
                onClick={() =>
                  alert(
                    "Privacy Policy: Trail Math does not sell user data. We use Clerk for authentication and Supabase for secure data storage. We track outbound clicks to provide affiliate services.",
                  )
                }
                className="text-[10px] text-blue-500 hover:text-blue-400 hover:underline font-bold uppercase tracking-widest transition-colors"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </footer>
      {/* iOS PWA INSTALL INSTRUCTIONS */}
      {showIosInstructions && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-sm shadow-2xl relative mb-20 sm:mb-0">
            <button onClick={() => setShowIosInstructions(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <div className="text-center">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Install on iPhone</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">
                Apple requires a manual install. Tap the <span className="font-bold text-blue-600 text-lg mx-1">↑</span> Share button at the bottom of Safari, then scroll down and tap <span className="font-bold text-slate-900">"Add to Home Screen"</span>.
              </p>
              <button 
                onClick={() => setShowIosInstructions(false)}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

{/* --- MOBILE BOTTOM NAVIGATION --- */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 pb-[env(safe-area-inset-bottom)] shadow-[0_-20px_40px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center px-4 py-2">
          
          {/* Left: Garage */}
          <button
            onClick={() => {
              setView("showroom");
              setShowGarage(true);
              if (!showGarage) clearFilters();
            }}
            className={`flex flex-col items-center justify-center gap-1 w-20 py-2 rounded-2xl transition-all duration-300 ${showGarage ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <Star size={20} className={showGarage ? 'fill-blue-600' : ''} />
            <span className="text-[10px] font-bold tracking-wide">Shortlist</span>
          </button>

          {/* Center: Home */}
          <button
            onClick={() => {
              showroomScrollRef.current = 0;
              setView("showroom");
              setShowGarage(false);
            }}
            className={`flex flex-col items-center justify-center gap-1 w-20 py-2 rounded-2xl transition-all duration-300 ${view === 'showroom' && !showGarage ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <Home size={20} className={view === 'showroom' && !showGarage ? 'fill-blue-100' : ''} />
            <span className="text-[10px] font-bold tracking-wide">Home</span>
          </button>

          {/* Right: Compare */}
          <button
            onClick={() => {
              showroomScrollRef.current = window.scrollY;
              setShowGarage(false);
              setView("compare");
            }}
            className={`flex flex-col items-center justify-center gap-1 w-20 py-2 rounded-2xl transition-all duration-300 ${view === 'compare' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <Scale size={20} />
            <span className="text-[10px] font-bold tracking-wide">Compare</span>
          </button>
          
        </div>
      </div>

    </div>
  );
}

function CalculatorView({
  bike,
  build,
  isFavorite,
  onToggleFavorite,
  onBack,
  sponsor,
}: {
  bike: any;
  build: any;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  sponsor?: any;
}) {
  const [downPayment, setDownPayment] = useState<number | string>("");
  const [promo, setPromo] = useState("none");
  const [standardTerm, setStandardTerm] = useState(36);
  const [standardApr, setStandardApr] = useState(15);
  const [taxRate, setTaxRate] = useState<number>(0);



  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

const { monthlyPayment, totalInterest, taxAmount, totalFinanced, totalCost } =
    useMemo(() => {
      const taxAmt = build.price * (taxRate / 100);
      const downValue = Number(downPayment) || 0;
      const totalFinancedAmt = build.price + taxAmt - downValue;
      const p = Math.max(0, totalFinancedAmt);
      if (promo !== "none") {
        const t = promo === "6mo" ? 6 : 12;
        return {
          activeTerm: t,
          monthlyPayment: p / t,
          totalInterest: 0,
          totalCost: totalFinancedAmt,
          taxAmount: taxAmt,
          totalFinanced: totalFinancedAmt,
        };
      }
      const r = Number(standardApr) / 100 / 12;
      const t = standardTerm;
      const m = r === 0 ? p / t : (p * r) / (1 - Math.pow(1 + r, -t));
      const interest = m * t - p;
      return {
        activeTerm: t,
        monthlyPayment: m,
        totalInterest: interest,
        totalCost: totalFinancedAmt + interest,
        taxAmount: taxAmt,
        totalFinanced: totalFinancedAmt,
      };
    }, [build.price, downPayment, promo, standardTerm, standardApr, taxRate]);

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-4">
        <div className="w-full space-y-6">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col w-full border border-slate-200 relative">
            {/* BACK BUTTON */}
            <button
              onClick={() => onBack()} 
              className="absolute top-4 left-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-slate-100 hover:scale-110 active:scale-95 transition-all group"
            >
              <ChevronLeft size={22} className="text-slate-600 group-hover:text-blue-500" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-slate-100 hover:scale-110 active:scale-95 transition-all group"
            >
              <Star
                size={22}
                className={`${isFavorite ? "fill-blue-500 text-blue-500" : "text-slate-300 group-hover:text-blue-400"}`}
              />
            </button>
            <div className="w-full h-64 sm:h-72 bg-[#F3F3F3] relative m-0 p-0 overflow-hidden flex items-center justify-center">
              <img
                src={bike.image}
                alt={bike.model}
                className="absolute inset-0 w-full h-full object-contain scale-125 drop-shadow-2xl"
                crossOrigin="anonymous"
              />
            </div>
            <div className="p-8 flex flex-col border-t border-slate-100">
              <div className="flex flex-col items-center pb-6 border-b border-slate-100 gap-1">
                {bike.logo && (
                  <img
                    src={bike.logo}
                    alt={bike.brand}
                    className="h-10 object-contain mb-2"
                    crossOrigin="anonymous"
                  />
                )}
                <h2 className="text-xl font-black text-slate-900 text-center leading-snug">
                  {bike.model} - {build.name}
                </h2>
                <p className="text-2xl font-extrabold text-blue-600 mt-2">
                  {formatMoney(build.price)}
                </p>
              </div>
              {/* --- RESTORED COMPONENT BREAKDOWN GRID --- */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 pt-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Material
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {build.material || "TBD"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Suspension
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {bike.suspension}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Fork
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {build.fork || "TBD"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Shock
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {build.shock || "TBD"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Motor
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {build.motor || "TBD"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Battery
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {build.battery || "TBD"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Drivetrain
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {build.drivetrain || "TBD"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Brakes
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {build.brakes || "TBD"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Wheelset
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {build.wheelset || "TBD"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Hubs
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {build.hubs || "TBD"}
                  </span>
                </div>
              </div>{" "}
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="bg-[#0B1121] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-slate-800 flex flex-col gap-8 text-left">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwVjB6bTEgMWgxOHYxOEgxdjE4eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10 space-y-8">
              <div className="w-full">
                <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-6 text-center">
                  What's the Damage?
                </h3>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                      Monthly Payment
                    </div>
                    <div className="text-5xl font-black text-white flex items-baseline justify-center gap-1">
                      {formatMoney(monthlyPayment)}
                      <span className="text-xl text-slate-500 font-medium">
                        /mo
                      </span>
                    </div>
                  </div>
                  <div className="h-px bg-slate-800 w-full"></div>
                  <div className="space-y-3 font-medium text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rig Price</span>
                      <span>{formatMoney(build.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated Tax</span>
                      <span>{formatMoney(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Down Payment</span>
                      <span className="text-blue-400">
                        -{formatMoney(Number(downPayment) || 0)}
                      </span>
                    </div>

                    <div className="flex justify-between font-bold text-white pt-2 border-t border-slate-800/50 mt-2">
                      <span className="text-slate-300">Amount Financed</span>
                      <span>{formatMoney(totalFinanced)}</span>
                    </div>

                    <div className="flex justify-between text-rose-400">
                      <span>Total Interest</span>
                      <span>+{formatMoney(totalInterest)}</span>
                    </div>

                    {/* --- GRAND TOTAL --- */}
                    <div className="mt-6 pt-4 border-t border-slate-800">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="font-bold text-lg text-white">TOTAL OUT-OF-POCKET</span>
                          <span className="text-xs text-slate-500 font-medium">(Amount Financed + Interest)</span>
                        </div>
                        <span className="font-black text-xl text-white">
                          {formatMoney(totalCost)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- DUAL-ACTION CHECKOUT ZONE --- */}
              <div className="mt-8 pt-8 border-t border-slate-700/50">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 text-center sm:text-left">Ready to pull the trigger?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      const isDealer = sponsor?.brands.includes(bike.brand);
                      
                      if (isDealer) {
                        if (sponsor?.website) {
                          // Option A: They have a website
                          window.open(sponsor.website, '_blank');
                        } else {
                          // Option B: No website, initiate a call instead
                          window.location.href = `tel:${sponsor.phone.replace(/\D/g, '')}`;
                        }
                      } else {
                        // Fallback: Generic Google Search
                        window.open(`https://www.google.com/search?q=${bike.brand}+dealers+near+me`, '_blank');
                      }
                    }}
                    className="flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-white py-3.5 px-4 rounded-xl font-bold transition-all border border-slate-700 hover:border-blue-500 group"
                  >
                    {/* ✅ DYNAMIC ICON: Shows a phone if they don't have a website */}
                    {sponsor?.brands.includes(bike.brand) && !sponsor?.website ? (
                      <Phone className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                    ) : (
                      <MapPin className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                    )}

                    {/* ✅ DYNAMIC TEXT */}
                    {sponsor?.brands.includes(bike.brand) 
                      ? (sponsor?.website ? `Visit ${sponsor.name}` : `Call ${sponsor.name}`)
                      : "Find Local Dealer"
                    }
                  </button>
                  <button
                    onClick={() => window.open(`https://www.jensonusa.com/search?q=${bike.brand}`, '_blank')}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3.5 px-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 group"
                  >
                    <ShoppingCart className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                    Shop Online
                  </button>
                </div>
              </div>

              {/* --- RESTORED TRAIL MATH BOX --- */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700 space-y-6 text-left">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Calculator size={20} className="text-blue-500" />
                  Trail Math
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Down Payment ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold pointer-events-none">
                        $
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={downPayment}
                        placeholder="0"
                        onChange={(e) => {
                          const raw = String(e.target.value).replace(/\D/g, "");
                          const sanitized = raw.replace(/^0+/, "");
                          setDownPayment(
                            sanitized === "" ? "" : Number(sanitized),
                          );
                        }}
                        className="w-full bg-[#0B1121] border border-slate-700 rounded-xl p-3 pl-9 text-white font-bold transition-colors focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      0% Promos
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["none", "6mo", "12mo"].map((p) => (
                        <button
                          key={p}
                          onClick={() => setPromo(p)}
                          className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border ${promo === p ? "bg-blue-600 border-blue-500 text-white shadow-sm" : "bg-[#0B1121] border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"}`}
                        >
                          {p === "none"
                            ? "N/A"
                            : p === "6mo"
                              ? "0% for 6 Mo"
                              : "0% for 12 Mo"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <BrandedStepper
                      label="Estimated Sales Tax (%)"
                      value={taxRate}
                      onChange={setTaxRate}
                      step={0.1}
                      suffix="%"
                    />
                    <p className="text-[10px] text-slate-500 mt-2 font-medium uppercase tracking-wider">
                      Include state, county, and city taxes for accurate math
                    </p>
                  </div>
                  <div
                    className={`space-y-6 transition-opacity duration-300 ${promo !== "none" ? "opacity-40 pointer-events-none" : "opacity-100"}`}
                  >
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        Standard Term (Months)
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="72"
                        step="12"
                        value={standardTerm}
                        onChange={(e) =>
                          setStandardTerm(Number(e.target.value))
                        }
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="text-center font-bold text-slate-400 mt-2">
                        {standardTerm} Months
                      </div>
                    </div>
                    <div>
                      <BrandedStepper
                        label="Standard APR (%)"
                        value={standardApr}
                        onChange={setStandardApr}
                        step={0.1}
                        suffix="%"
                      />
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
