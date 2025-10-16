// Función para obtener el siguiente número disponible del 1 al 30
function getNextAvailableNumber() {
  const vehicles = JSON.parse(localStorage.getItem("vehicles")) || []
  const usedNumbers = vehicles
    .filter((vehicle) => vehicle.status === "parked")
    .map((vehicle) => Number.parseInt(vehicle.code))

  // Buscar el primer número disponible del 1 al 30
  for (let i = 1; i <= 30; i++) {
    if (!usedNumbers.includes(i)) {
      return i.toString()
    }
  }

  // Si todos los números están ocupados, retornar null
  return null
}

// Función para generar código alfanumérico de 5 dígitos
function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Función para obtener fecha y hora actual
function getCurrentDateTime() {
  return new Date().toLocaleString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Función para guardar vehículo en localStorage
function saveVehicle(vehicleData) {
  const vehicles = JSON.parse(localStorage.getItem("vehicles")) || []
  vehicles.push(vehicleData)
  localStorage.setItem("vehicles", JSON.stringify(vehicles))
}

// Función para verificar si las placas ya están registradas
function isPlateRegistered(plate) {
  const vehicles = JSON.parse(localStorage.getItem("vehicles")) || []
  return vehicles.some(
    (vehicle) => vehicle.licensePlate.toLowerCase() === plate.toLowerCase() && vehicle.status === "parked",
  )
}

// Manejar el envío del formulario
document.getElementById("vehicleForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const clientName = document.getElementById("clientName").value.trim()
  const carBrandModel = document.getElementById("carBrandModel").value.trim()
  const carColor = document.getElementById("carColor").value.trim()
  const licensePlate = document.getElementById("licensePlate").value.trim().toUpperCase()

  // Verificar si las placas ya están registradas
  if (isPlateRegistered(licensePlate)) {
    alert("¡Error! Ya existe un vehículo con estas placas estacionado.")
    return
  }

  const code = getNextAvailableNumber()

  if (!code) {
    alert("¡Error! No hay espacios disponibles. Todos los números del 1 al 30 están ocupados.")
    return
  }

  // Crear objeto del vehículo
  const vehicleData = {
    id: Date.now(),
    code: code,
    clientName: clientName,
    carBrandModel: carBrandModel,
    carColor: carColor,
    licensePlate: licensePlate,
    entryTime: getCurrentDateTime(),
    status: "parked",
    releaseTime: null,
  }

  // Guardar en localStorage
  saveVehicle(vehicleData)

  // Mostrar mensaje de éxito
  document.getElementById("generatedCode").textContent = code
  document.getElementById("successMessage").style.display = "block"

  // Limpiar formulario
  document.getElementById("vehicleForm").reset()

  // Scroll al mensaje de éxito
  document.getElementById("successMessage").scrollIntoView({ behavior: "smooth" })
})

// Función para cerrar mensaje de éxito
function closeSuccessMessage() {
  document.getElementById("successMessage").style.display = "none"
}

// Convertir placas a mayúsculas mientras se escribe
document.getElementById("licensePlate").addEventListener("input", (e) => {
  e.target.value = e.target.value.toUpperCase()
})
