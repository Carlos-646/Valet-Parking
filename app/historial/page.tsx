"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, History, ArrowLeft, Trash2, MoreVertical, User, Palette, Hash, Clock } from "lucide-react"

export default function HistorialPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [filter, setFilter] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<any>(null)
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = () => {
    const storedVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]")
    setVehicles(storedVehicles)
  }

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (filter === "parked") return vehicle.status === "parked"
    if (filter === "released") return vehicle.status === "released"
    return true
  })

  const stats = {
    total: vehicles.length,
    parked: vehicles.filter((v) => v.status === "parked").length,
    released: vehicles.filter((v) => v.status === "released").length,
    today: vehicles.filter((v) => {
      const vehicleDate = new Date(v.timestamp).toDateString()
      const today = new Date().toDateString()
      return vehicleDate === today
    }).length,
  }

  const calculateTime = (timestamp: string, releaseTime?: string) => {
    const start = new Date(timestamp)
    const end = releaseTime ? new Date(releaseTime) : new Date()
    const diffMs = end.getTime() - start.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`
    }
    return `${diffMinutes}m`
  }

  const deleteVehicle = () => {
    if (vehicleToDelete) {
      const updatedVehicles = vehicles.filter((v) => v.code !== vehicleToDelete.code)
      localStorage.setItem("vehicles", JSON.stringify(updatedVehicles))
      setVehicles(updatedVehicles)
      setShowDeleteModal(false)
      setVehicleToDelete(null)
    }
  }

  const toggleMenu = (code: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [code]: !prev[code],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <History className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Historial de Vehículos</h1>
            </div>
            <p className="text-lg text-muted-foreground">Gestión completa del estacionamiento</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{stats.total}</div>
              <div className="text-sm opacity-90">Total</div>
            </CardContent>
          </Card>
          <Card className="bg-green-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{stats.parked}</div>
              <div className="text-sm opacity-90">Estacionados</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{stats.released}</div>
              <div className="text-sm opacity-90">Liberados</div>
            </CardContent>
          </Card>
          <Card className="bg-secondary text-secondary-foreground">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{stats.today}</div>
              <div className="text-sm opacity-90">Hoy</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="bg-card border-0 shadow-xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => setFilter("all")}
                variant={filter === "all" ? "default" : "outline"}
                className="h-12 px-6"
              >
                Todos ({stats.total})
              </Button>
              <Button
                onClick={() => setFilter("parked")}
                variant={filter === "parked" ? "default" : "outline"}
                className="h-12 px-6"
              >
                Estacionados ({stats.parked})
              </Button>
              <Button
                onClick={() => setFilter("released")}
                variant={filter === "released" ? "default" : "outline"}
                className="h-12 px-6"
              >
                Liberados ({stats.released})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de vehículos */}
        <div className="space-y-4 mb-8">
          {filteredVehicles.length === 0 ? (
            <Card className="bg-card border-0 shadow-xl">
              <CardContent className="p-12 text-center">
                <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl text-muted-foreground">No hay vehículos registrados</p>
              </CardContent>
            </Card>
          ) : (
            filteredVehicles.map((vehicle) => (
              <Card key={vehicle.code} className="bg-card border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={vehicle.status === "parked" ? "default" : "secondary"}
                        className="text-sm px-3 py-1"
                      >
                        {vehicle.status === "parked" ? "Estacionado" : "Liberado"}
                      </Badge>
                      <Badge variant="outline" className="text-sm px-3 py-1 font-mono">
                        {vehicle.code}
                      </Badge>
                    </div>

                    {vehicle.status === "released" && (
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleMenu(vehicle.code)}
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        {openMenus[vehicle.code] && (
                          <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg z-10 min-w-[150px]">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setVehicleToDelete(vehicle)
                                setShowDeleteModal(true)
                                setOpenMenus({})
                              }}
                              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Cliente</p>
                        <p className="font-semibold">{vehicle.clientName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Vehículo</p>
                        <p className="font-semibold">{vehicle.carBrandModel}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Palette className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Color</p>
                        <p className="font-semibold">{vehicle.carColor}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Hash className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Placas</p>
                        <p className="font-semibold">{vehicle.licensePlate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.status === "parked" ? "Tiempo estacionado" : "Tiempo total"}
                        </p>
                        <p className="font-semibold text-primary">
                          {calculateTime(vehicle.timestamp, vehicle.releaseTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

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
            onClick={() => (window.location.href = "/codigo")}
            variant="outline"
            className="h-16 text-lg font-medium border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
          >
            Liberar Vehículo
          </Button>
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-card">
              <CardContent className="p-8 text-center">
                <Trash2 className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-4">Confirmar Eliminación</h3>
                <p className="text-muted-foreground mb-2">¿Está seguro de eliminar este registro?</p>
                <p className="text-sm text-muted-foreground mb-6">
                  <strong>Cliente:</strong> {vehicleToDelete?.clientName}
                  <br />
                  <strong>Vehículo:</strong> {vehicleToDelete?.carBrandModel}
                  <br />
                  <strong>Código:</strong> {vehicleToDelete?.code}
                </p>
                <div className="flex gap-4">
                  <Button onClick={deleteVehicle} variant="destructive" className="flex-1 h-12">
                    Eliminar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setVehicleToDelete(null)
                    }}
                    variant="outline"
                    className="flex-1 h-12"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
