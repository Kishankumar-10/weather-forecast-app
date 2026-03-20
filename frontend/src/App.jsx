import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { Search, Wind, Droplets, Thermometer, MapPin, Loader2, Cloud, Sun, CloudRain, Zap, Snowflake } from 'lucide-react'

// Default preview data for the initial state
const DEFAULT_PREVIEW = {
  name: 'London',
  sys: { country: 'GB' },
  main: {
    temp: 18,
    feels_like: 16,
    humidity: 65,
    temp_max: 20,
    temp_min: 15
  },
  wind: { speed: 4.5 },
  weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }]
}

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)

  // Auto-reset logic: When input is cleared, show default weather again
  useEffect(() => {
    if (city.trim() === '') {
      setWeather(null)
    }
  }, [city])

  // Use real weather if available, otherwise use preview (London)
  const displayWeather = weather || DEFAULT_PREVIEW

  const fetchWeather = async (e) => {
    e.preventDefault()
    
    const normalizedCity = city.trim()
    if (!normalizedCity) {
      toast.error('Please enter a city name')
      return
    }

    setLoading(true)

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/weather`, {
        params: { city: normalizedCity }
      })
      setWeather(response.data)
      toast.success(`Weather for ${response.data.name} loaded`)
    } catch (err) {
      const status = err.response?.status
      const errorMessage = err.response?.data?.message

      if (status === 404) {
        toast.error('City not found. Please check spelling.')
      } else if (status === 400) {
        toast.error(errorMessage || 'Invalid city name')
      } else {
        toast.error('Server error. Try again later')
      }
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#243247] to-[#4E5D73] text-[#F1F5F9] flex flex-col items-center justify-center antialiased overflow-hidden transition-all duration-1000 ease-in-out">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Top Navbar Section */}
      <nav className="absolute top-0 w-full flex items-center justify-between px-8 py-4 md:px-16 z-20">
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tighter uppercase text-[#F1F5F9]">Weatherly</span>
          <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-[0.2em] -mt-1">Your daily weather companion</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-[#CBD5E1]">
          <span className="cursor-pointer hover:text-[#F1F5F9] transition-colors">Forecast</span>
          <span className="cursor-pointer hover:text-[#F1F5F9] transition-colors">Maps</span>
          <span className="cursor-pointer hover:text-[#F1F5F9] transition-colors">Settings</span>
        </div>
      </nav>

      {/* Main Hero Content */}
      <main className="relative z-10 w-full max-w-6xl px-6 md:px-16 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Left: Hero Text & Search */}
          <div className="space-y-5 md:space-y-6 flex flex-col justify-center">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight animate-in fade-in slide-in-from-left-8 duration-700 text-[#F1F5F9]">
                Stay ahead of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F1F5F9] via-[#CBD5E1] to-[#94A3B8]">the weather</span>
              </h2>
              <p className="text-sm md:text-base text-[#CBD5E1] max-w-md animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
                Get real-time weather updates anywhere in the world with precision and style.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={fetchWeather} className="relative w-full max-w-lg animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
              <div className="flex items-center bg-[#3F4B5E] border border-white/15 rounded-full p-1 focus-within:ring-2 focus-within:ring-[#60A5FA] focus-within:shadow-[0_0_15px_rgba(96,165,250,0.3)] transition-all duration-300 ease-in-out shadow-2xl">
                <div className="pl-4 text-[#A0AEC0]">
                  <Search size={20} strokeWidth={2.5} className="text-gray-300" />
                </div>
                <input
                  type="text"
                  placeholder="Search city..."
                  className="w-full bg-transparent pl-3 pr-2 py-2 outline-none text-[#F1F5F9] placeholder:text-[#A0AEC0] text-sm font-medium"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="bg-[#E5E7EB] text-[#1E293B] hover:bg-white hover:scale-105 active:scale-95 px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 ease-in-out flex items-center justify-center min-w-[100px] md:min-w-[120px]"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" size={16} strokeWidth={2.5} /> : "Search"}
                </button>
              </div>
            </form>
          </div>

          {/* Right: Immersive Weather Preview */}
          <div className="flex justify-center md:justify-end items-center animate-in fade-in zoom-in-95 duration-1000 overflow-hidden">
            <div className={`relative w-full max-w-sm bg-white/[0.08] backdrop-blur-3xl border border-white/15 rounded-[2rem] p-5 md:p-6 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col transition-all duration-500 ease-in-out ${loading ? 'animate-pulse opacity-50' : 'opacity-100'}`}>
              <div className="relative z-10 flex flex-col items-center flex-1">
                <div className="flex items-center gap-2 text-[#CBD5E1] font-bold uppercase tracking-[0.2em] text-[9px] mb-3">
                  <MapPin size={18} strokeWidth={2.5} className="text-[#60A5FA]" />
                  <span>{displayWeather.name}</span>
                </div>

                {/* Main Weather Visual */}
                <div className="flex flex-col items-center text-center">
                  {loading ? (
                    <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                      <Loader2 className="animate-spin text-[#60A5FA]" size={48} strokeWidth={2.5} />
                    </div>
                  ) : (
                    <img
                      src={`https://openweathermap.org/img/wn/${displayWeather.weather[0].icon}@4x.png`}
                      alt={displayWeather.weather[0].description}
                      className="w-24 h-24 md:w-28 md:h-28 drop-shadow-2xl brightness-110 animate-float"
                    />
                  )}
                  <div className="text-6xl md:text-7xl font-black tracking-tighter text-[#F1F5F9]">
                    {Math.round(displayWeather.main.temp)}°
                  </div>
                  <div className="text-base font-bold text-[#CBD5E1] capitalize mt-1">
                    {displayWeather.weather[0].description}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-2 w-full mt-5 pt-5 border-t border-white/10">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Droplets size={20} strokeWidth={2.5} className="text-[#60A5FA]" />
                    <div className="flex flex-col items-center">
                      <span className="text-[7px] text-[#94A3B8] font-black uppercase tracking-wider">Humidity</span>
                      <span className="text-xs font-bold text-[#F1F5F9]">{displayWeather.main.humidity}%</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Wind size={20} strokeWidth={2.5} className="text-[#60A5FA]" />
                    <div className="flex flex-col items-center">
                      <span className="text-[7px] text-[#94A3B8] font-black uppercase tracking-wider">Wind</span>
                      <span className="text-xs font-bold text-[#F1F5F9]">{displayWeather.wind.speed}m/s</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Thermometer size={20} strokeWidth={2.5} className="text-[#60A5FA]" />
                    <div className="flex flex-col items-center">
                      <span className="text-[7px] text-[#94A3B8] font-black uppercase tracking-wider">Feels</span>
                      <span className="text-xs font-bold text-[#F1F5F9]">{Math.round(displayWeather.main.feels_like)}°</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
