"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, User, Palette, Hash, CheckCircle } from "lucide-react"

export default function ValetParkingSystem() {
  const [formData, setFormData] = useState({
    clientName: "",
    carBrandModel: "",
    carColor: "",
    licensePlate: "",
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar que no existan placas duplicadas
    const existingVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]")
    const duplicatePlate = existingVehicles.find(
      (v: any) => v.licensePlate.toUpperCase() === formData.licensePlate.toUpperCase() && v.status === "parked",
    )

    if (duplicatePlate) {
      alert("Ya existe un vehículo estacionado con estas placas")
      return
    }

    const code = generateCode()
    const vehicle = {
      ...formData,
      code,
      timestamp: new Date().toISOString(),
      status: "parked",
    }

    existingVehicles.push(vehicle)
    localStorage.setItem("vehicles", JSON.stringify(existingVehicles))

    setGeneratedCode(code)
    setShowSuccess(true)
    setFormData({ clientName: "", carBrandModel: "", carColor: "", licensePlate: "" })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "licensePlate" ? value.toUpperCase() : value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header profesional */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Car className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Valet Parking</h1>
            </div>
            <p className="text-lg text-muted-foreground">Sistema Profesional de Estacionamiento</p>
          </div>
        </div>

        {/* Formulario principal */}
        <Card className="bg-card border-0 shadow-xl">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <User className="h-6 w-6" />
              Registro de Vehículo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="text-base font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nombre del Cliente
                  </Label>
                  <Input
                    id="clientName"
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange("clientName", e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carBrandModel" className="text-base font-medium flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Marca y Modelo
                  </Label>
                  <Input
                    id="carBrandModel"
                    type="text"
                    placeholder="Ej: Toyota Corolla, Honda Civic"
                    value={formData.carBrandModel}
                    onChange={(e) => handleInputChange("carBrandModel", e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carColor" className="text-base font-medium flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Color del Vehículo
                  </Label>
                  <Input
                    id="carColor"
                    type="text"
                    placeholder="Ej: Blanco, Negro, Rojo"
                    value={formData.carColor}
                    onChange={(e) => handleInputChange("carColor", e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licensePlate" className="text-base font-medium flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Placas del Vehículo
                  </Label>
                  <Input
                    id="licensePlate"
                    type="text"
                    placeholder="Ej: ABC-123, XYZ-789"
                    value={formData.licensePlate}
                    onChange={(e) => handleInputChange("licensePlate", e.target.value)}
                    required
                    className="h-12 text-base uppercase"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Registrar Vehículo
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Navegación */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => (window.location.href = "/codigo")}
            variant="outline"
            className="h-16 text-lg font-medium border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
          >
            Liberar Vehículo
          </Button>
          <Button
            onClick={() => (window.location.href = "/historial")}
            variant="outline"
            className="h-16 text-lg font-medium border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            Ver Historial
          </Button>
        </div>

        {/* Modal de éxito */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-card">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-4">¡Vehículo Registrado Exitosamente!</h3>
                <p className="text-muted-foreground mb-4">Código de retiro:</p>
                <div className="bg-primary text-primary-foreground text-3xl font-bold py-4 px-6 rounded-lg mb-6 tracking-wider">
                  {generatedCode}
                </div>
                <p className="text-sm text-muted-foreground mb-6">Guarde este código para retirar su vehículo</p>
                <Button onClick={() => setShowSuccess(false)} className="w-full h-12 text-base">
                  Cerrar
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
