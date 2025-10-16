document.addEventListener("DOMContentLoaded", () => {
  const requestForm = document.getElementById("requestForm")
  const successMessage = document.getElementById("successMessage")
  const errorMessage = document.getElementById("errorMessage")

  requestForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const vehicleNumber = Number.parseInt(document.getElementById("vehicleNumber").value)

    // Validar número
    if (vehicleNumber < 1 || vehicleNumber > 30) {
      showError("Número debe estar entre 1 y 30")
      return
    }

    // Obtener vehículos del localStorage
    const vehicles = JSON.parse(localStorage.getItem("vehicles")) || []

    const vehicle = vehicles.find((v) => Number.parseInt(v.code) === vehicleNumber && v.status === "parked")

    if (!vehicle) {
      showError("Vehículo no encontrado o ya fue retirado")
      return
    }

    const request = {
      id: Date.now(),
      vehicleNumber: vehicleNumber,
      clientName: vehicle.clientName,
      carBrandModel: vehicle.carBrandModel,
      carColor: vehicle.carColor,
      licensePlate: vehicle.licensePlate,
      timestamp: new Date().toISOString(),
      status: "pending",
    }

    // Guardar solicitud en localStorage
    const requests = JSON.parse(localStorage.getItem("vehicleRequests")) || []
    requests.push(request)
    localStorage.setItem("vehicleRequests", JSON.stringify(requests))

    // Mostrar mensaje de éxito
    showSuccess()
  })

  function showError(message) {
    errorMessage.querySelector("p").textContent = `⚠️ ${message}`
    errorMessage.style.display = "block"
    successMessage.style.display = "none"

    setTimeout(() => {
      errorMessage.style.display = "none"
    }, 5000)
  }

  function showSuccess() {
    successMessage.style.display = "block"
    errorMessage.style.display = "none"
    requestForm.style.display = "none"
  }
})

function goHome() {
  window.location.href = "index.html"
}
