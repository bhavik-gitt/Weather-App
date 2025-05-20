"use client"

import React from "react"

import { useState } from "react"
import { format, subDays } from "date-fns"
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  Sun,
  Thermometer,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

// Mock weather data for the last 7 days
const generateWeatherData = () => {
  const today = new Date()
  const weatherTypes = [
    { type: "Sunny", icon: Sun, color: "text-yellow-500" },
    { type: "Cloudy", icon: Cloud, color: "text-gray-500" },
    { type: "Rainy", icon: CloudRain, color: "text-blue-500" },
    { type: "Drizzle", icon: CloudDrizzle, color: "text-blue-400" },
    { type: "Thunderstorm", icon: CloudLightning, color: "text-purple-500" },
    { type: "Snowy", icon: CloudSnow, color: "text-blue-200" },
    { type: "Foggy", icon: CloudFog, color: "text-gray-400" },
  ]

  return Array.from({ length: 7 }).map((_, index) => {
    const date = subDays(today, index)
    const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)]
    const tempHigh = Math.floor(Math.random() * 15) + 15 // 15-30°C
    const tempLow = tempHigh - Math.floor(Math.random() * 10) - 5 // 5-15°C lower
    const humidity = Math.floor(Math.random() * 50) + 30 // 30-80%
    const windSpeed = Math.floor(Math.random() * 30) + 5 // 5-35 km/h
    const precipitation = Math.floor(Math.random() * 100) // 0-100%

    return {
      date,
      formattedDate: format(date, "EEEE, MMMM do"),
      shortDate: format(date, "EEE, MMM d"),
      weather: randomWeather.type,
      icon: randomWeather.icon,
      iconColor: randomWeather.color,
      tempHigh,
      tempLow,
      humidity,
      windSpeed,
      precipitation,
    }
  })
}

const weatherData = generateWeatherData()

export default function WeatherApp() {
  const [selectedDay, setSelectedDay] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Weather Forecast</h1>
          <p className="text-muted-foreground">New York City, NY</p>
        </header>

        {/* Today's Weather */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Today&apos;s Weather</CardTitle>
            <CardDescription>{weatherData[0].formattedDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className={`mr-4 ${weatherData[0].iconColor}`}>
                  {React.createElement(weatherData[0].icon, { size: 64 })}
                </div>
                <div>
                  <h2 className="text-4xl font-bold">{weatherData[0].tempHigh}°C</h2>
                  <p className="text-xl text-muted-foreground">{weatherData[0].weather}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <div className="flex flex-col items-center">
                  <Thermometer className="mb-2 text-red-500" />
                  <p className="text-sm text-muted-foreground">High</p>
                  <p className="font-medium">{weatherData[0].tempHigh}°C</p>
                </div>
                <div className="flex flex-col items-center">
                  <Thermometer className="mb-2 text-blue-500" />
                  <p className="text-sm text-muted-foreground">Low</p>
                  <p className="font-medium">{weatherData[0].tempLow}°C</p>
                </div>
                <div className="flex flex-col items-center">
                  <Droplets className="mb-2 text-blue-400" />
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  <p className="font-medium">{weatherData[0].humidity}%</p>
                </div>
                <div className="flex flex-col items-center">
                  <CloudRain className="mb-2 text-blue-300" />
                  <p className="text-sm text-muted-foreground">Chance of Rain</p>
                  <p className="font-medium">{weatherData[0].precipitation}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Forecast Carousel */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7-Day Forecast</h2>
          <Carousel className="w-full" onSelect={(index) => setSelectedDay(index)}>
            <CarouselContent>
              {weatherData.map((day, index) => (
                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                  <Card className={`h-full ${selectedDay === index ? "border-primary" : ""}`}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{index === 0 ? "Today" : day.shortDate}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex flex-col items-center">
                      <div className={`mb-2 ${day.iconColor}`}>{React.createElement(day.icon, { size: 40 })}</div>
                      <p className="font-medium">{day.weather}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-red-500">{day.tempHigh}°</span>
                        <span className="text-blue-500">{day.tempLow}°</span>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
        </div>

        {/* Selected Day Details */}
        {selectedDay > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{weatherData[selectedDay].formattedDate}</CardTitle>
              <CardDescription>{weatherData[selectedDay].weather}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className={`mr-4 ${weatherData[selectedDay].iconColor}`}>
                    {React.createElement(weatherData[selectedDay].icon, { size: 48 })}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{weatherData[selectedDay].tempHigh}°C</h2>
                    <p className="text-xl text-muted-foreground">{weatherData[selectedDay].weather}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  <div className="flex flex-col items-center">
                    <Thermometer className="mb-2 text-red-500" />
                    <p className="text-sm text-muted-foreground">High</p>
                    <p className="font-medium">{weatherData[selectedDay].tempHigh}°C</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Thermometer className="mb-2 text-blue-500" />
                    <p className="text-sm text-muted-foreground">Low</p>
                    <p className="font-medium">{weatherData[selectedDay].tempLow}°C</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Droplets className="mb-2 text-blue-400" />
                    <p className="text-sm text-muted-foreground">Humidity</p>
                    <p className="font-medium">{weatherData[selectedDay].humidity}%</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <CloudRain className="mb-2 text-blue-300" />
                    <p className="text-sm text-muted-foreground">Chance of Rain</p>
                    <p className="font-medium">{weatherData[selectedDay].precipitation}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
