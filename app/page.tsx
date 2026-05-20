"use client"

import React, { useEffect, useMemo, useState } from "react"
import { format, subDays } from "date-fns"
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Compass,
  Droplets,
  Gauge,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const weatherTypes = [
  {
    type: "Sunny",
    icon: Sun,
    iconColor: "text-amber-300",
    glowClass: "from-amber-400/30 via-yellow-400/20 to-transparent",
  },
  {
    type: "Cloudy",
    icon: Cloud,
    iconColor: "text-slate-200",
    glowClass: "from-slate-300/30 via-slate-300/15 to-transparent",
  },
  {
    type: "Rainy",
    icon: CloudRain,
    iconColor: "text-cyan-200",
    glowClass: "from-cyan-400/30 via-blue-400/20 to-transparent",
  },
  {
    type: "Drizzle",
    icon: CloudDrizzle,
    iconColor: "text-sky-200",
    glowClass: "from-sky-400/30 via-cyan-400/20 to-transparent",
  },
  {
    type: "Thunderstorm",
    icon: CloudLightning,
    iconColor: "text-violet-200",
    glowClass: "from-violet-500/30 via-indigo-500/20 to-transparent",
  },
  {
    type: "Snowy",
    icon: CloudSnow,
    iconColor: "text-blue-100",
    glowClass: "from-blue-200/30 via-sky-200/20 to-transparent",
  },
  {
    type: "Foggy",
    icon: CloudFog,
    iconColor: "text-zinc-200",
    glowClass: "from-zinc-200/25 via-slate-200/15 to-transparent",
  },
] as const

type WeatherSnapshot = {
  date: Date
  formattedDate: string
  shortDate: string
  weather: (typeof weatherTypes)[number]["type"]
  icon: (typeof weatherTypes)[number]["icon"]
  iconColor: string
  glowClass: string
  tempHigh: number
  tempLow: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDirection: string
  precipitation: number
  pressure: number
  uvIndex: number
  visibility: number
  sunrise: string
  sunset: string
}

const windDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const

const generateWeatherData = (): WeatherSnapshot[] => {
  const today = new Date()

  return Array.from({ length: 7 }).map((_, index) => {
    const date = subDays(today, index)
    const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)]
    const tempHigh = Math.floor(Math.random() * 15) + 18
    const tempLow = tempHigh - (Math.floor(Math.random() * 8) + 4)
    const humidity = Math.floor(Math.random() * 40) + 35
    const windSpeed = Math.floor(Math.random() * 24) + 6
    const precipitation = Math.floor(Math.random() * 90) + 5

    return {
      date,
      formattedDate: format(date, "EEEE, MMMM do"),
      shortDate: format(date, "EEE, MMM d"),
      weather: randomWeather.type,
      icon: randomWeather.icon,
      iconColor: randomWeather.iconColor,
      glowClass: randomWeather.glowClass,
      tempHigh,
      tempLow,
      feelsLike: tempHigh - Math.floor(Math.random() * 4) + 1,
      humidity,
      windSpeed,
      windDirection: windDirections[Math.floor(Math.random() * windDirections.length)],
      precipitation,
      pressure: Math.floor(Math.random() * 18) + 1002,
      uvIndex: Math.floor(Math.random() * 8) + 2,
      visibility: Number((Math.random() * 6 + 4).toFixed(1)),
      sunrise: `${String(Math.floor(Math.random() * 2) + 6).padStart(2, "0")}:${String(
        Math.floor(Math.random() * 60)
      ).padStart(2, "0")} AM`,
      sunset: `${String(Math.floor(Math.random() * 2) + 6).padStart(2, "0")}:${String(
        Math.floor(Math.random() * 60)
      ).padStart(2, "0")} PM`,
    }
  })
}

const weatherData = generateWeatherData()

const metricCards = (day: WeatherSnapshot) => [
  { label: "Feels Like", value: `${day.feelsLike}°C`, icon: Thermometer, tone: "text-rose-300" },
  { label: "Humidity", value: `${day.humidity}%`, icon: Droplets, tone: "text-cyan-300" },
  { label: "Wind", value: `${day.windSpeed} km/h`, icon: Wind, tone: "text-emerald-300" },
  { label: "Direction", value: day.windDirection, icon: Compass, tone: "text-violet-300" },
  { label: "Precipitation", value: `${day.precipitation}%`, icon: CloudRain, tone: "text-sky-300" },
  { label: "Pressure", value: `${day.pressure} hPa`, icon: Gauge, tone: "text-indigo-300" },
]

export default function WeatherApp() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

  const selectedWeather = weatherData[selectedDay]

  useEffect(() => {
    if (!carouselApi) return

    const updateSelected = () => setSelectedDay(carouselApi.selectedScrollSnap())
    updateSelected()
    carouselApi.on("select", updateSelected)

    return () => {
      carouselApi.off("select", updateSelected)
    }
  }, [carouselApi])

  const hourlyPreview = useMemo(
    () =>
      ["Now", "3 PM", "6 PM", "9 PM", "12 AM", "3 AM"].map((time, index) => {
        const drop = Math.floor(index / 2)
        return {
          time,
          temp: selectedWeather.tempHigh - drop,
          rain: Math.max(0, selectedWeather.precipitation - index * 6),
        }
      }),
    [selectedWeather]
  )

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-500/30 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-44 h-80 w-80 rounded-full bg-indigo-500/25 blur-[120px]" />

      <div className="container relative mx-auto flex flex-col gap-6 px-4 py-8 md:py-10">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-sky-200/70">Weather intelligence</p>
          <h1 className="text-3xl font-semibold leading-tight md:text-5xl">New York City Forecast</h1>
          <p className="text-sm text-slate-300 md:text-base">
            Beautiful, glanceable weather insights with a premium dashboard feel.
          </p>
        </header>

        <Card className="relative overflow-hidden border-slate-800/70 bg-slate-900/60 backdrop-blur-xl">
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${selectedWeather.glowClass}`} />
          <CardHeader className="relative gap-3 pb-4">
            <CardDescription className="text-slate-300">{selectedWeather.formattedDate}</CardDescription>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`grid h-20 w-20 place-items-center rounded-2xl border border-white/10 bg-slate-900/70 ${selectedWeather.iconColor}`}
                >
                  {React.createElement(selectedWeather.icon, { size: 44 })}
                </div>
                <div>
                  <CardTitle className="text-4xl md:text-5xl">{selectedWeather.tempHigh}°C</CardTitle>
                  <p className="mt-1 text-base text-slate-200">{selectedWeather.weather}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                  <p className="text-xs text-slate-400">Low</p>
                  <p className="text-lg font-semibold text-blue-200">{selectedWeather.tempLow}°C</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                  <p className="text-xs text-slate-400">UV Index</p>
                  <p className="text-lg font-semibold text-amber-200">{selectedWeather.uvIndex}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                  <p className="text-xs text-slate-400">Sunrise</p>
                  <p className="text-sm font-semibold text-emerald-200">{selectedWeather.sunrise}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                  <p className="text-xs text-slate-400">Sunset</p>
                  <p className="text-sm font-semibold text-violet-200">{selectedWeather.sunset}</p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <section>
          <h2 className="mb-3 text-xl font-semibold md:text-2xl">7-Day Forecast</h2>
          <Carousel setApi={setCarouselApi} opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {weatherData.map((day, index) => {
                const isSelected = index === selectedDay

                return (
                  <CarouselItem key={day.shortDate} className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDay(index)
                        carouselApi?.scrollTo(index)
                      }}
                      className={`h-full w-full rounded-2xl border text-left transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                        isSelected
                          ? "border-sky-300/70 bg-sky-500/15 shadow-[0_0_40px_rgba(56,189,248,0.2)]"
                          : "border-slate-700/80 bg-slate-900/50 hover:border-slate-500/90"
                      }`}
                    >
                      <div className="flex h-full flex-col gap-5 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold">{index === 0 ? "Today" : day.shortDate}</p>
                            <p className="text-xs text-slate-400">{day.weather}</p>
                          </div>
                          <div className={day.iconColor}>{React.createElement(day.icon, { size: 26 })}</div>
                        </div>

                        <div className="mt-auto flex items-end justify-between">
                          <p className="text-2xl font-semibold">{day.tempHigh}°</p>
                          <p className="text-sm text-blue-200">{day.tempLow}°</p>
                        </div>
                      </div>
                    </button>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="-left-1 border-slate-700 bg-slate-900/90 hover:bg-slate-800" />
            <CarouselNext className="-right-1 border-slate-700 bg-slate-900/90 hover:bg-slate-800" />
          </Carousel>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metricCards(selectedWeather).map((metric) => (
            <Card
              key={metric.label}
              className="border-slate-800/80 bg-slate-900/60 backdrop-blur-sm transition hover:border-slate-600"
            >
              <CardContent className="flex items-center gap-3 p-4">
                <metric.icon className={`h-5 w-5 ${metric.tone}`} />
                <div>
                  <p className="text-xs text-slate-400">{metric.label}</p>
                  <p className="text-lg font-semibold">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Hourly Snapshot</CardTitle>
            <CardDescription className="text-slate-400">Quick temperature and rain trend for the next hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {hourlyPreview.map((hour) => (
                <div
                  key={hour.time}
                  className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-3 text-center"
                >
                  <p className="text-xs text-slate-400">{hour.time}</p>
                  <p className="mt-2 text-xl font-semibold">{hour.temp}°</p>
                  <p className="mt-1 text-xs text-sky-200">Rain {hour.rain}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <footer className="mt-1 grid gap-3 text-xs text-slate-400 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3">
            <Sunrise className="mb-2 h-4 w-4 text-emerald-200" />
            Current visibility: {selectedWeather.visibility} km
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3">
            <Sunset className="mb-2 h-4 w-4 text-violet-200" />
            Atmosphere pressure stable at {selectedWeather.pressure} hPa
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3">
            <Cloud className="mb-2 h-4 w-4 text-slate-200" />
            Feels like {selectedWeather.feelsLike}°C with {selectedWeather.humidity}% humidity
          </div>
        </footer>
      </div>
    </main>
  )
}
