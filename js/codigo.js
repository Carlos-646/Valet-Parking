let currentVehicle = null

document.addEventListener("DOMContentLoaded", () => {
  loadParkedVehicles()
  loadPendingRequests()
  setInterval(loadPendingRequests, 1000)

  window.addEventListener("storage", (e) => {
    if (e.key === "vehicleRequests") {
      loadPendingRequests()
    }
  })
})

function loadPendingRequests() {
  const requests = JSON.parse(localStorage.getItem("vehicleRequests")) || []
  const pendingRequests = requests.filter((r) => r.status === "pending")
  const requestsSection = document.getElementById("requestsSection")
  const container = document.getElementById("pendingRequests")

  if (pendingRequests.length === 0) {
    requestsSection.style.display = "none"
    return
  }

  requestsSection.style.display = "block"
  container.innerHTML = pendingRequests
    .map(
      (request) => `
    <div class="request-card">
      <div class="request-info">
        <h4>La persona ${request.clientName} quiere retirar su vehículo</h4>
        <p><strong>Número asignado:</strong> #${request.vehicleNumber}</p>
        <p><strong>Vehículo:</strong> ${request.carBrandModel} (${request.carColor})</p>
        <p><strong>Placas:</strong> ${request.licensePlate}</p>
        <p><strong>Hora de solicitud:</strong> ${new Date(request.timestamp).toLocaleString("es-ES")}</p>
      </div>
      <div class="request-actions">
        <button onclick="processRequest(${request.vehicleNumber})" class="btn btn-success btn-sm">
          Procesar Vehículo #${request.vehicleNumber}
        </button>
      </div>
    </div>
  `,
    )
    .join("")
}

function processRequest(vehicleNumber) {
  document.getElementById("releaseCode").value = vehicleNumber

  const event = new Event("submit")
  document.getElementById("codeForm").dispatchEvent(event)

  const requests = JSON.parse(localStorage.getItem("vehicleRequests")) || []
  const updatedRequests = requests.map((r) =>
    r.vehicleNumber === vehicleNumber && r.status === "pending" ? { ...r, status: "processed" } : r,
  )
  localStorage.setItem("vehicleRequests", JSON.stringify(updatedRequests))

  loadPendingRequests()
}

function dismissRequest(requestId) {
  const requests = JSON.parse(localStorage.getItem("vehicleRequests")) || []
  const updatedRequests = requests.filter((r) => r.id !== requestId)
  localStorage.setItem("vehicleRequests", JSON.stringify(updatedRequests))
  loadPendingRequests()
}

document.getElementById("codeForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const code = document.getElementById("releaseCode").value.trim()

  const codeNumber = Number.parseInt(code)
  if (isNaN(codeNumber) || codeNumber < 1 || codeNumber > 30) {
    showError()
    return
  }

  const vehicles = JSON.parse(localStorage.getItem("vehicles")) || []
  const vehicle = vehicles.find((v) => Number.parseInt(v.code) === codeNumber && v.status === "parked")

  if (vehicle) {
    currentVehicle = vehicle
    showVehicleInfo(vehicle)
    hideError()
  } else {
    showError()
    hideVehicleInfo()
  }
})

function loadParkedVehicles() {
  const vehicles = JSON.parse(localStorage.getItem("vehicles")) || []
  const parkedVehicles = vehicles.filter((v) => v.status === "parked")
  const container = document.getElementById("parkedVehiclesList")

  if (parkedVehicles.length === 0) {
    container.innerHTML = '<p class="no-vehicles">No hay vehículos estacionados actualmente</p>'
    return
  }

  container.innerHTML = parkedVehicles
    .map(
      (vehicle) => `
    <div class="parked-vehicle-card">
      <div class="vehicle-details">
        <h4>${vehicle.clientName} - #${vehicle.code}</h4>
        <p><strong>Vehículo:</strong> ${vehicle.carBrandModel}</p>
        <p><strong>Color:</strong> ${vehicle.carColor}</p>
        <p><strong>Placas:</strong> ${vehicle.licensePlate}</p>
        <p><strong>Entrada:</strong> ${vehicle.entryTime}</p>
      </div>
    </div>
  `,
    )
    .join("")
}

function showVehicleInfo(vehicle) {
  document.getElementById("infoClientName").textContent = vehicle.clientName
  document.getElementById("infoCarDetails").textContent = `${vehicle.carBrandModel} (${vehicle.carColor})`
  document.getElementById("infoLicensePlate").textContent = vehicle.licensePlate
  document.getElementById("infoEntryTime").textContent = vehicle.entryTime

  const entryTime = new Date(
    vehicle.entryTime.split(", ")[0].split("/").reverse().join("-") + "T" + vehicle.entryTime.split(", ")[1],
  )
  const currentTime = new Date()
  const diffMs = currentTime - entryTime
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  document.getElementById("infoParkedTime").textContent = `${diffHours}h ${diffMinutes}m`

  document.getElementById("vehicleInfo").style.display = "block"
}

function hideVehicleInfo() {
  document.getElementById("vehicleInfo").style.display = "none"
}

function showError() {
  document.getElementById("errorMessage").style.display = "block"
  setTimeout(() => {
    hideError()
  }, 3000)
}

function hideError() {
  document.getElementById("errorMessage").style.display = "none"
}

function confirmRelease() {
  if (!currentVehicle) return

  const vehicles = JSON.parse(localStorage.getItem("vehicles")) || []
  const vehicleIndex = vehicles.findIndex((v) => v.id === currentVehicle.id)

  if (vehicleIndex !== -1) {
    vehicles[vehicleIndex].status = "released"
    vehicles[vehicleIndex].releaseTime = getCurrentDateTime()
    localStorage.setItem("vehicles", JSON.stringify(vehicles))

    const requests = JSON.parse(localStorage.getItem("vehicleRequests")) || []
    const updatedRequests = requests.map((r) =>
      r.vehicleNumber === Number.parseInt(currentVehicle.code) && r.status === "pending"
        ? { ...r, status: "completed" }
        : r,
    )
    localStorage.setItem("vehicleRequests", JSON.stringify(updatedRequests))

    alert("¡Vehículo liberado exitosamente!")

    loadParkedVehicles()
    loadPendingRequests()

    document.getElementById("codeForm").reset()
    hideVehicleInfo()
    currentVehicle = null
  }
}

function cancelRelease() {
  document.getElementById("codeForm").reset()
  hideVehicleInfo()
  hideError()
  currentVehicle = null
}

function getCurrentDateTime() {
  return new Date().toLocaleString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

document.getElementById("releaseCode").addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "")

  if (e.target.value.length > 2) {
    e.target.value = e.target.value.slice(0, 2)
  }

  const value = Number.parseInt(e.target.value)
  if (value > 30) {
    e.target.value = "30"
  }
})