"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, Search, CheckCircle, ArrowLeft, Clock, User, Palette, Hash } from "lucide-react"

export default function CodigoPage() {
  const [code, setCode] = useState("")
  const [vehicle, setVehicle] = useState<any>(null)
  const [error, setError] = useState("")

  const searchVehicle = () => {
    if (!code.trim()) {
      setError("Por favor ingrese un código")
      return
    }

    const vehicles = JSON.parse(localStorage.getItem("vehicles") || "[]")
    const foundVehicle = vehicles.find((v: any) => v.code.toUpperCase() === code.toUpperCase() && v.status === "parked")

    if (foundVehicle) {
      setVehicle(foundVehicle)
      setError("")
    } else {
      setError("Código no encontrado o vehículo ya liberado")
      setVehicle(null)
    }
  }

  const releaseVehicle = () => {
    const vehicles = JSON.parse(localStorage.getItem("vehicles") || "[]")
    const updatedVehicles = vehicles.map((v: any) =>
      v.code === vehicle.code ? { ...v, status: "released", releaseTime: new Date().toISOString() } : v,
    )

    localStorage.setItem("vehicles", JSON.stringify(updatedVehicles))
    alert("Vehículo liberado exitosamente")
    setVehicle(null)
    setCode("")
  }

  const calculateParkedTime = (timestamp: string) => {
    const parkedTime = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - parkedTime.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`
    }
    return `${diffMinutes}m`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Car className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Liberar Vehículo</h1>
            </div>
            <p className="text-lg text-muted-foreground">Ingrese el código para retirar su vehículo</p>
          </div>
        </div>

        {/* Formulario de búsqueda */}
        <Card className="bg-card border-0 shadow-xl mb-8">
          <CardHeader className="bg-secondary text-secondary-foreground rounded-t-lg">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <Search className="h-6 w-6" />
              Buscar por Código
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-base font-medium">
                  Código de Retiro
                </Label>
                <div className="flex gap-4">
                  <Input
                    id="code"
                    type="text"
                    placeholder="Ingrese el código de 5 caracteres"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="h-12 text-base uppercase tracking-wider"
                    maxLength={5}
                  />
                  <Button onClick={searchVehicle} className="h-12 px-8 bg-secondary hover:bg-secondary/90">
                    <Search className="h-5 w-5 mr-2" />
                    Buscar
                  </Button>
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Información del vehículo */}
        {vehicle && (
          <Card className="bg-card border-0 shadow-xl mb-8">
            <CardHeader className="bg-green-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                Vehículo Encontrado
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Cliente</p>
                      <p className="text-lg font-semibold">{vehicle.clientName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Vehículo</p>
                      <p className="text-lg font-semibold">{vehicle.carBrandModel}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Color</p>
                      <p className="text-lg font-semibold">{vehicle.carColor}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Hash className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Placas</p>
                      <p className="text-lg font-semibold">{vehicle.licensePlate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tiempo estacionado</p>
                    <p className="text-xl font-bold text-primary">{calculateParkedTime(vehicle.timestamp)}</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={releaseVehicle}
                className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Liberar Vehículo
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Navegación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="h-16 text-lg font-medium border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Registrar Vehículo
          </Button>
          <Button
            onClick={() => (window.location.href = "/historial")}
            variant="outline"
            className="h-16 text-lg font-medium border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            Ver Historial
          </Button>
        </div>
      </div>
    </div>
  )
}
