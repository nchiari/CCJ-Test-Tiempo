document.addEventListener("DOMContentLoaded", () => {
  const rotateButton = document.querySelector("button")
  rotateButton.addEventListener("click", () => {
    alert("Este botón girará la imagen. Funcionalidad pendiente.")
  })
})

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tastingSheet")

  // Vaciar el formulario al recargar la página
  window.onload = () => form.reset()

  form.addEventListener("submit", (e) => {
    e.preventDefault() // Previene el envío tradicional del formulario

    const formData = new FormData(form)

    // Comprobar si todos los campos y el reto están completados
    if (!formData.get("challenge") || formData.get("challenge") === "") {
      alert("Debes completar todo el formulario para generar el PDF")
      return
    }

    // Instanciar jsPDF en formato A4
    const doc = new window.jspdf.jsPDF({
      format: "a4",
      unit: "mm",
    })

    // Márgenes estándar para impresión
    const margins = {
      top: 25,
      bottom: 25,
      left: 25,
      right: 25,
      width: 210,
    }

    // Títulos de la página
    const mainTitle = document.querySelector("h1").textContent
    const subTitle = document.querySelector("h2").textContent

    // Configuración de fuentes y tamaños para títulos
    doc.setFont("Helvetica") // Usamos Helvetica, una fuente segura para el PDF
    doc.setFontSize(22)
    doc.text(mainTitle, margins.left, 20)
    doc.setFontSize(18)
    doc.text(subTitle, margins.left, 30)

    // Recolectar y añadir datos del formulario al PDF
    doc.setFontSize(12)
    let yPosition = 50 // Iniciar más abajo para más margen en la parte superior

    // Nueva entrada para el Reto seleccionado
    const challengeValue = formData.get("challenge")
    doc.setFont("Helvetica", "bold")
    doc.text("Reto:", margins.left, yPosition)
    doc.setFont("Helvetica", "normal")
    doc.text(challengeValue, margins.left + 30, yPosition)
    yPosition += 10 // Aumentar el espacio para el siguiente elemento

    // Resto de las entradas del formulario
    formData.set("firstName", formData.get("firstName") || "") // Corrige si algún campo está vacío
    formData.set("lastName", formData.get("lastName") || "")
    formData.set("comments", formData.get("comments") || "")
    const formEntries = {
      Nombre: formData.get("firstName"),
      Apellido: formData.get("lastName"),
      Comentarios: formData.get("comments"),
    }

    for (let [key, value] of Object.entries(formEntries)) {
      doc.setFont("Helvetica", "bold")
      doc.text(`${key}:`, margins.left, yPosition)
      doc.setFont("Helvetica", "normal")
      doc.text(value, margins.left + 30, yPosition, {
        maxWidth: margins.width - margins.left - 30,
      })
      yPosition += 10 // Aumentar el espacio para el siguiente elemento
    }

    // Generar el nombre del archivo PDF basado en el reto seleccionado
    const challengeName = challengeValue.replace(/:/g, "").replace(/ /g, "-")
    const pdfName = `hoja-degustacion-${challengeName}.pdf`

    // Guardar el PDF dentro de los márgenes de impresión
    doc.save(pdfName)
  })
})

document.getElementById("resetButton").addEventListener("click", (e) => {
  form.reset()
})
