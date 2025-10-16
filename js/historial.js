let allVehicles = []
let currentFilter = "all"

// Cargar historial al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  loadHistory()
  updateStats()
})

// Cargar historial desde localStorage
function loadHistory() {
  allVehicles = JSON.parse(localStorage.getItem("vehicles")) || []
  displayHistory(allVehicles)
}

// Mostrar historial filtrado
function displayHistory(vehicles) {
  const historyList = document.getElementById("historyList")

  if (vehicles.length === 0) {
    historyList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <h3>No hay registros disponibles</h3>
                <p>Los vehículos registrados aparecerán aquí</p>
            </div>
        `
    return
  }

  // Ordenar por fecha de entrada (más recientes primero)
  vehicles.sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime))

  historyList.innerHTML = vehicles
    .map(
      (vehicle) => `
        <div class="history-item ${vehicle.status}">
            <div class="item-header">
                <div class="item-code">${vehicle.code}</div>
                <div class="item-status status-${vehicle.status}">
                    ${vehicle.status === "parked" ? "ESTACIONADO" : "LIBERADO"}
                </div>
                ${
                  vehicle.status === "released"
                    ? `
                    <div class="options-menu">
                        <button class="options-btn" onclick="toggleOptionsMenu('${vehicle.code}')">⋮</button>
                        <div class="options-dropdown" id="options-${vehicle.code}">
                            <button onclick="deleteVehicle('${vehicle.code}')" class="delete-option">
                                Eliminar auto
                            </button>
                        </div>
                    </div>
                `
                    : ""
                }
            </div>
            <div class="item-details">
                <p><strong>Cliente:</strong> ${vehicle.clientName}</p>
                <p><strong>Vehículo:</strong> ${vehicle.carBrandModel || `${vehicle.carBrand} ${vehicle.carModel}`}</p>
                <p><strong>Color:</strong> ${vehicle.carColor}</p>
                <p><strong>Placas:</strong> ${vehicle.licensePlate}</p>
                <p><strong>Entrada:</strong> ${vehicle.entryTime}</p>
                ${vehicle.releaseTime ? `<p><strong>Salida:</strong> ${vehicle.releaseTime}</p>` : ""}
                ${vehicle.status === "parked" ? `<p><strong>Tiempo:</strong> ${calculateParkedTime(vehicle.entryTime)}</p>` : ""}
            </div>
        </div>
    `,
    )
    .join("")
}

// Calcular tiempo estacionado
function calculateParkedTime(entryTime) {
  const entry = new Date(entryTime.split(", ")[0].split("/").reverse().join("-") + "T" + entryTime.split(", ")[1])
  const current = new Date()
  const diffMs = current - entry
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  return `${diffHours}h ${diffMinutes}m`
}

// Actualizar estadísticas
function updateStats() {
  const parkedVehicles = allVehicles.filter((v) => v.status === "parked")
  const releasedVehicles = allVehicles.filter((v) => v.status === "released")

  // Vehículos de hoy
  const today = new Date().toLocaleDateString("es-ES")
  const todayVehicles = allVehicles.filter((v) => v.entryTime.split(", ")[0] === today)

  document.getElementById("totalParked").textContent = parkedVehicles.length
  document.getElementById("totalReleased").textContent = releasedVehicles.length
  document.getElementById("totalToday").textContent = todayVehicles.length
}

// Filtros
function showAll() {
  currentFilter = "all"
  displayHistory(allVehicles)
  updateFilterButtons()
}

function showParked() {
  currentFilter = "parked"
  const parkedVehicles = allVehicles.filter((v) => v.status === "parked")
  displayHistory(parkedVehicles)
  updateFilterButtons()
}

function showReleased() {
  currentFilter = "released"
  const releasedVehicles = allVehicles.filter((v) => v.status === "released")
  displayHistory(releasedVehicles)
  updateFilterButtons()
}

// Actualizar botones de filtro
function updateFilterButtons() {
  document.querySelectorAll(".filter-section .btn").forEach((btn) => {
    btn.style.background = "#e9ecef"
    btn.style.color = "#495057"
  })

  const activeBtn = document.getElementById(`btn${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)}`)
  if (activeBtn) {
    activeBtn.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    activeBtn.style.color = "white"
  }
}

// Actualizar estadísticas cada minuto para el tiempo estacionado
setInterval(() => {
  if (currentFilter === "all" || currentFilter === "parked") {
    loadHistory()
    updateStats()
  }
}, 60000)

// Mostrar/ocultar menú de opciones
function toggleOptionsMenu(vehicleCode) {
  const dropdown = document.getElementById(`options-${vehicleCode}`)
  const allDropdowns = document.querySelectorAll(".options-dropdown")

  // Cerrar todos los otros menús
  allDropdowns.forEach((menu) => {
    if (menu.id !== `options-${vehicleCode}`) {
      menu.style.display = "none"
    }
  })

  // Toggle el menú actual
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block"
}

// Eliminar vehículo con confirmación
function deleteVehicle(vehicleCode) {
  const vehicle = allVehicles.find((v) => v.code === vehicleCode)

  if (!vehicle) {
    alert("Vehículo no encontrado")
    return
  }

  // Crear modal de confirmación
  const modal = document.createElement("div")
  modal.className = "delete-modal"
  modal.innerHTML = `
    <div class="modal-content">
      <h3>¿Eliminar vehículo?</h3>
      <p><strong>Cliente:</strong> ${vehicle.clientName}</p>
      <p><strong>Vehículo:</strong> ${vehicle.carBrandModel || `${vehicle.carBrand} ${vehicle.carModel}`}</p>
      <p><strong>Placas:</strong> ${vehicle.licensePlate}</p>
      <p>Esta acción no se puede deshacer.</p>
      <div class="modal-buttons">
        <button onclick="confirmDelete('${vehicleCode}')" class="btn-confirm">Aceptar</button>
        <button onclick="cancelDelete()" class="btn-cancel">Rechazar</button>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  // Cerrar menú de opciones
  document.getElementById(`options-${vehicleCode}`).style.display = "none"
}

// Confirmar eliminación
function confirmDelete(vehicleCode) {
  // Eliminar vehículo del array
  allVehicles = allVehicles.filter((v) => v.code !== vehicleCode)

  // Guardar en localStorage
  localStorage.setItem("vehicles", JSON.stringify(allVehicles))

  // Actualizar vista
  loadHistory()
  updateStats()

  // Cerrar modal
  cancelDelete()

  // Mostrar mensaje de confirmación
  showDeleteMessage()
}

// Cancelar eliminación
function cancelDelete() {
  const modal = document.querySelector(".delete-modal")
  if (modal) {
    document.body.removeChild(modal)
  }
}

// Mostrar mensaje de eliminación exitosa
function showDeleteMessage() {
  const message = document.createElement("div")
  message.className = "success-message"
  message.textContent = "Vehículo eliminado correctamente"
  document.body.appendChild(message)

  setTimeout(() => {
    if (document.body.contains(message)) {
      document.body.removeChild(message)
    }
  }, 3000)
}

// Cerrar menús al hacer clic fuera
document.addEventListener("click", (e) => {
  if (!e.target.closest(".options-menu")) {
    document.querySelectorAll(".options-dropdown").forEach((menu) => {
      menu.style.display = "none"
    })
  }
})
