import { useState, useMemo } from 'react';
import { ChevronLeft, ArrowRight, Scale, Calculator, Bike, Filter, X, Star } from 'lucide-react';
import { eMTBData } from './bikeData';

const BIKES = eMTBData.flatMap(brand => 
  brand.models.map(model => ({
    id: `${brand.brand}-${model.name}`.toLowerCase().replace(/\s+/g, '-'),
    brand: brand.brand,
    model: model.name,
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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showGarage, setShowGarage] = useState(false);

  const [rigAId, setRigAId] = useState(ALL_BUILDS[0].id);
  const [rigBId, setRigBId] = useState(ALL_BUILDS[1].id);

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

  const filteredBikes = useMemo(() => {
    return BIKES.filter(bike => {
      if (showGarage) {
        return bike.builds.some(build => favorites.includes(build.id));
      }
      const matchesBrand = selectedBrandFilters.length === 0 || selectedBrandFilters.includes(bike.brand);
      const matchesMotor = selectedMotorFilters.length === 0 || bike.builds.some(build => selectedMotorFilters.includes(build.motor));
      const matchesWheels = selectedWheelFilters.length === 0 || bike.builds.some(build => build.wheels && selectedWheelFilters.includes(build.wheels));
      return matchesBrand && matchesMotor && matchesWheels;
    }).sort((a, b) => a.brand.localeCompare(b.brand));
  }, [selectedBrandFilters, selectedMotorFilters, selectedWheelFilters, showGarage, favorites]);

  const toggleFavorite = (buildId: string) => {
    setFavorites(prev => 
      prev.includes(buildId) ? prev.filter(id => id !== buildId) : [...prev, buildId]
    );
  };

  const clearFilters = () => {
    setSelectedBrandFilters([]);
    setSelectedMotorFilters([]);
    setSelectedWheelFilters([]);
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setView('showroom')}
          >
            <div className="bg-emerald-600 text-white p-1.5 rounded-lg group-hover:bg-emerald-700 transition-colors">
              <Bike size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">eMTB<span className="text-emerald-600">Compare</span></span>
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
                className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all ${showGarage ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900'}`}
              >
                <Star size={16} className={showGarage ? 'fill-emerald-600 text-emerald-600' : ''} />
                <span className="hidden sm:inline">{showGarage ? 'Exit Garage' : 'My Garage'}</span>
                <span className="sm:hidden">{showGarage ? 'Exit' : 'Garage'}</span>
              </button>
              <button 
                onClick={() => {
                  setShowGarage(false);
                  setView('compare');
                }}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all"
              >
                <Scale size={16} />
                <span className="hidden sm:inline">Compare Rigs</span>
                <span className="sm:hidden">Compare</span>
              </button>
            </div>
          )}
          {view !== 'showroom' && (
            <button 
              onClick={() => setView('showroom')}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Back to Showroom
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {view === 'showroom' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                {showGarage ? (
                  <>Your <span className="text-emerald-600">Dream Garage</span></>
                ) : (
                  <>Find Your Next <br className="sm:hidden" /> <span className="text-emerald-500">Dream Rig</span></>
                )}
              </h1>
              <p className="text-lg text-slate-600">
                {showGarage ? 'The rigs you have saved for later.' : 'Compare the latest 2026 eMTBs, spec by spec, and run the numbers to see whats in budget to make a smart purchase.'}
              </p>
            </div>

            {!showGarage && (
              <>
                <div className="sticky top-16 z-20 bg-slate-50/90 backdrop-blur-md py-3 border-b border-slate-200 -mx-4 px-4 sm:mx-0 sm:px-0">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsFilterModalOpen(true)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-300 py-2.5 px-6 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                    >
                      <Filter size={16} className="text-emerald-600" />
                      Filter Rigs {(selectedBrandFilters.length > 0 || selectedMotorFilters.length > 0 || selectedWheelFilters.length > 0) && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs">{selectedBrandFilters.length + selectedMotorFilters.length + selectedWheelFilters.length}</span>}
                    </button>

                    {(selectedBrandFilters.length > 0 || selectedMotorFilters.length > 0 || selectedWheelFilters.length > 0) && (
                      <button onClick={clearFilters} className="text-slate-500 hover:text-slate-800 font-medium">
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {isFilterModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFilterModalOpen(false)} />
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col relative z-10 overflow-hidden">
                      <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                        <h2 className="text-xl font-bold text-slate-900">Filters</h2>
                        <button onClick={() => setIsFilterModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                          <X size={20} className="text-slate-500" />
                        </button>
                      </div>
                      
                      <div className="p-6 overflow-y-auto space-y-8 flex-1">
                        <div className="space-y-4">
                          <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Brand</label>
                          <div className="space-y-3">
                            {brands.map(brand => {
                              const isSelected = selectedBrandFilters.includes(brand);
                              return (
                                <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 group-hover:border-emerald-500'}`}>
                                    {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                  </div>
                                  <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={isSelected}
                                    onChange={() => {
                                      setSelectedBrandFilters(prev => 
                                        isSelected ? prev.filter(b => b !== brand) : [...prev, brand]
                                      );
                                    }}
                                  />
                                  <span className="text-slate-700 font-medium">{brand}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Motor</label>
                          <div className="space-y-3">
                            {motors.map(motor => {
                              const isSelected = selectedMotorFilters.includes(motor);
                              return (
                                <label key={motor} className="flex items-center gap-3 cursor-pointer group">
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 group-hover:border-emerald-500'}`}>
                                    {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                  </div>
                                  <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={isSelected}
                                    onChange={() => {
                                      setSelectedMotorFilters(prev => 
                                        isSelected ? prev.filter(m => m !== motor) : [...prev, motor]
                                      );
                                    }}
                                  />
                                  <span className="text-slate-700 font-medium">{motor}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">WHEELS</label>
                          <div className="space-y-3">
                            {['29"', '27.5"', 'Mullet'].map(w => {
                              const isSelected = selectedWheelFilters.includes(w);
                              return (
                                <label key={w} className="flex items-center gap-3 cursor-pointer group">
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 group-hover:border-emerald-500'}`}>
                                    {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isSelected}
                                    onChange={() => {
                                      setSelectedWheelFilters(prev =>
                                        isSelected ? prev.filter(x => x !== w) : [...prev, w]
                                      );
                                    }}
                                  />
                                  <span className="text-slate-700 font-medium">{w}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex gap-4">
                        <button 
                          onClick={clearFilters}
                          className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          Clear Filters
                        </button>
                        <button 
                          onClick={() => setIsFilterModalOpen(false)}
                          className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-sm shadow-emerald-200 hover:bg-emerald-700 transition-colors"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBikes.map(bike => (
                <div 
                  key={bike.id} 
                  onClick={() => {
                    setSelectedBikeId(bike.id);
                    setView('builds');
                  }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col"
                >
                  <div className="w-full aspect-[4/3] bg-slate-100 overflow-hidden relative shrink-0">
                    <img 
                      src={bike.image} 
                      alt={bike.model} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-center min-w-0">
                    <div className="text-xs font-semibold text-emerald-600 tracking-wide uppercase mb-1 truncate">{bike.brand}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 truncate">{bike.model}</h3>
                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Starting at</div>
                        <div className="text-lg font-bold text-slate-900">{formatPrice(bike.startingPrice)}</div>
                      </div>
                      <div className="text-slate-400 group-hover:text-emerald-600 transition-colors">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'builds' && selectedBike && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
            <button 
              onClick={() => setView('showroom')}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              <ChevronLeft size={20} />
              Back to Models
            </button>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 p-6 text-center">
                  {eMTBData.find(b => b.brand === selectedBike.brand)?.logo && (
                    <img 
                      src={eMTBData.find(b => b.brand === selectedBike.brand)?.logo} 
                      alt={selectedBike.brand} 
                      className="h-12 w-auto object-contain mx-auto mb-4" 
                      crossOrigin="anonymous" 
                    />
                  )}
                  <h2 className="text-4xl font-extrabold text-slate-900 mb-6">{selectedBike.model}</h2>
                  <img 
                    src={selectedBike.image} 
                    alt={selectedBike.model} 
                    className="w-full object-contain mb-6"
                    crossOrigin="anonymous"
                  />
                  <p className="text-slate-600">
                    Select a build to see the specs and run the trail math.
                  </p>
                </div>
              </div>

              <div className="w-full lg:w-2/3 space-y-4">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{showGarage ? 'Favorited Builds' : 'Available Builds'}</h3>
                {selectedBike.builds.filter(b => showGarage ? favorites.includes(b.id) : true).map(build => (
                  <div 
                    key={build.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-emerald-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                  >
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between sm:justify-start gap-4 mb-2">
                        <h4 className="text-xl font-bold text-slate-900">{build.name}</h4>
                        <span className="text-lg font-semibold text-emerald-700">{formatPrice(build.price)}</span>
                      </div>
                      <p className="text-slate-600 text-sm mt-2">{build.motor}, {build.battery} Battery, {build.material} Frame</p>
                    </div>
                    <div className="flex items-center gap-3 justify-end mt-4 w-full sm:mt-0 sm:w-auto">
                      <button
                        onClick={() => toggleFavorite(build.id)}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                        title="Save to Garage"
                      >
                        <Star size={20} className={favorites.includes(build.id) ? 'fill-emerald-500 text-emerald-500' : 'text-slate-400'} />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedBuildId(build.id);
                          setView('calculator');
                        }}
                        className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        Select Build
                        <ArrowRight size={18} />
                      </button>
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
          />
        )}

        {view === 'compare' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Head-to-Head</h2>
                <p className="text-slate-600 mt-2">Compare specs side-by-side to find your perfect match.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                <div className="p-6 sm:p-8 bg-slate-50/50">
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Rig A</label>
                  <select 
                    value={rigAId}
                    onChange={(e) => setRigAId(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 text-base rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3 shadow-sm"
                  >
                    {ALL_BUILDS.map(b => (
                      <option key={b.id} value={b.id}>{b.fullName} - {formatPrice(b.price)}</option>
                    ))}
                  </select>

                  {rigA && (
                    <div className="mt-8 space-y-6 animate-in fade-in">
                      <img src={rigA.image} alt={rigA.fullName} className="w-full h-48 object-contain mb-4" crossOrigin="anonymous" />
                      
                      <div className="text-center">
                        <div className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">{rigA.brand}</div>
                        <h3 className="text-2xl font-bold text-slate-900">{rigA.model} {rigA.name}</h3>
                        <div className="text-xl font-bold text-slate-700 mt-2">{formatPrice(rigA.price)}</div>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-slate-200">
                        <SpecRow label="Material" value={rigA.material} />
                        <SpecRow label="Motor" value={rigA.motor} />
                        <SpecRow label="Battery" value={rigA.battery} />
                        <SpecRow label="Drivetrain" value={rigA.drivetrain || 'TBD'} />
                        <SpecRow label="Fork" value={rigA.fork || 'TBD'} />
                        <SpecRow label="Shock" value={rigA.shock || 'TBD'} />
                        <SpecRow label="Brakes" value={rigA.brakes || 'TBD'} />
                        <SpecRow label="Wheelset" value={rigA.wheelset || 'TBD'} />
                        <SpecRow label="Tires" value={rigA.tires || 'TBD'} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 sm:p-8 bg-slate-50/50">
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Rig B</label>
                  <select 
                    value={rigBId}
                    onChange={(e) => setRigBId(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 text-base rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3 shadow-sm"
                  >
                    {ALL_BUILDS.map(b => (
                      <option key={b.id} value={b.id}>{b.fullName} - {formatPrice(b.price)}</option>
                    ))}
                  </select>

                  {rigB && (
                    <div className="mt-8 space-y-6 animate-in fade-in">
                      <img src={rigB.image} alt={rigB.fullName} className="w-full h-48 object-contain mb-4" crossOrigin="anonymous" />
                      
                      <div className="text-center">
                        <div className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">{rigB.brand}</div>
                        <h3 className="text-2xl font-bold text-slate-900">{rigB.model} {rigB.name}</h3>
                        <div className="text-xl font-bold text-slate-700 mt-2">{formatPrice(rigB.price)}</div>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-slate-200">
                        <SpecRow label="Material" value={rigB.material} />
                        <SpecRow label="Motor" value={rigB.motor} />
                        <SpecRow label="Battery" value={rigB.battery} />
                        <SpecRow label="Drivetrain" value={rigB.drivetrain || 'TBD'} />
                        <SpecRow label="Fork" value={rigB.fork || 'TBD'} />
                        <SpecRow label="Shock" value={rigB.shock || 'TBD'} />
                        <SpecRow label="Brakes" value={rigB.brakes || 'TBD'} />
                        <SpecRow label="Wheelset" value={rigB.wheelset || 'TBD'} />
                        <SpecRow label="Tires" value={rigB.tires || 'TBD'} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function SpecRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500 uppercase tracking-wider font-medium">{label}</span>
      <span className="text-base font-semibold text-slate-900 text-right">{value}</span>
    </div>
  );
}

const STATE_TAX_RATES: Record<string, number> = { 'None': 0, 'AL': 0.04, 'AK': 0, 'AZ': 0.056, 'AR': 0.065, 'CA': 0.0725, 'CO': 0.029, 'CT': 0.0635, 'DE': 0, 'FL': 0.06, 'GA': 0.04, 'HI': 0.04, 'ID': 0.06, 'IL': 0.0625, 'IN': 0.07, 'IA': 0.06, 'KS': 0.065, 'KY': 0.06, 'LA': 0.0445, 'ME': 0.055, 'MD': 0.06, 'MA': 0.0625, 'MI': 0.06, 'MN': 0.06875, 'MS': 0.07, 'MO': 0.04225, 'MT': 0, 'NE': 0.055, 'NV': 0.0685, 'NH': 0, 'NJ': 0.06625, 'NM': 0.05125, 'NY': 0.04, 'NC': 0.0475, 'ND': 0.05, 'OH': 0.0575, 'OK': 0.045, 'OR': 0, 'PA': 0.06, 'RI': 0.07, 'SC': 0.06, 'SD': 0.045, 'TN': 0.07, 'TX': 0.0625, 'UT': 0.061, 'VT': 0.06, 'VA': 0.053, 'WA': 0.065, 'WV': 0.06, 'WI': 0.05, 'WY': 0.04 };

function CalculatorView({ bike, build, onBack }: { bike: any, build: any, onBack: () => void }) {
  const [downPayment, setDownPayment] = useState(1000);
  const [promo, setPromo] = useState('none');
  const [standardTerm, setStandardTerm] = useState(36);
  const [standardApr, setStandardApr] = useState(7.99);
  const [buyerState, setBuyerState] = useState<string>('None');

  const price = build.price;
  
  const { monthlyPayment, totalInterest, totalCost, principal, activeTerm, taxAmount, totalFinanced } = useMemo(() => {
    const taxAmount = build.price * (STATE_TAX_RATES[buyerState] ?? 0);
    const totalFinanced = build.price + taxAmount;
    const p = Math.max(0, totalFinanced - downPayment);
    
    if (promo === '6mo' || promo === '12mo') {
      const t = promo === '6mo' ? 6 : 12;
      return {
        principal: p,
        activeTerm: t,
        monthlyPayment: p / t,
        totalInterest: 0,
        totalCost: totalFinanced,
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
  }, [price, downPayment, promo, standardTerm, standardApr, buyerState]);

  const formatMoney = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
      >
        <ChevronLeft size={20} />
        Back to Builds
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="w-full space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <img src={build.image || bike.image} alt={build.name} className="w-full h-64 md:h-80 object-contain mb-6" crossOrigin="anonymous" />
            <div className="text-center mb-6">
              <div className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-1">{bike.brand}</div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{bike.model} {build.name}</h2>
              <div className="text-2xl font-medium text-slate-600">{formatMoney(price)}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
              <div className="flex flex-col"><span className="text-xs text-slate-400 uppercase tracking-wider">Material</span><span className="font-medium text-slate-800">{build.material}</span></div>
              <div className="flex flex-col"><span className="text-xs text-slate-400 uppercase tracking-wider">Motor</span><span className="font-medium text-slate-800">{build.motor}</span></div>
              <div className="flex flex-col"><span className="text-xs text-slate-400 uppercase tracking-wider">Battery</span><span className="font-medium text-slate-800">{build.battery}</span></div>
              <div className="flex flex-col"><span className="text-xs text-slate-400 uppercase tracking-wider">Drivetrain</span><span className="font-medium text-slate-800">{build.drivetrain || 'TBD'}</span></div>
              <div className="flex flex-col"><span className="text-xs text-slate-400 uppercase tracking-wider">Fork</span><span className="font-medium text-slate-800">{build.fork || 'TBD'}</span></div>
              <div className="flex flex-col"><span className="text-xs text-slate-400 uppercase tracking-wider">Shock</span><span className="font-medium text-slate-800">{build.shock || 'TBD'}</span></div>
              <div className="flex flex-col"><span className="text-xs text-slate-400 uppercase tracking-wider">Brakes</span><span className="font-medium text-slate-800">{build.brakes || 'TBD'}</span></div>
              <div className="flex flex-col"><span className="text-xs text-slate-400 uppercase tracking-wider">Wheelset</span><span className="font-medium text-slate-800">{build.wheelset || 'TBD'}</span></div>
              <div className="flex flex-col"><span className="text-xs text-slate-400 uppercase tracking-wider">Tires</span><span className="font-medium text-slate-800">{build.tires || 'TBD'}</span></div>
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
                <div className="text-emerald-400 text-sm font-medium mt-2">
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
                  <span className="font-semibold text-emerald-400">-{formatMoney(downPayment)}</span>
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
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
              <Calculator size={24} className="text-emerald-600" />
              Trail Math
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Down Payment ($)</label>
                <input 
                  type="number" 
                  min="0"
                  max={price}
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-lg rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3 transition-colors"
                />
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
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {p === 'none' ? 'N/A' : p === '6mo' ? '0% for 6 Mo' : '0% for 12 Mo'}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`space-y-6 transition-opacity duration-300 ${promo !== 'none' ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
                  <select
                    value={buyerState}
                    onChange={(e) => setBuyerState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-lg rounded-xl p-3"
                  >
                    {Object.keys(STATE_TAX_RATES).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Standard Term (Months)</label>
                  <input 
                    type="range" 
                    min="12" 
                    max="72" 
                    step="12"
                    value={standardTerm}
                    onChange={(e) => setStandardTerm(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
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
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-lg rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3 transition-colors"
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
