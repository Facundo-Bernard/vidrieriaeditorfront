import React, { useEffect, useState } from "react";

function FAQEditor() {
  const [faqList, setFaqList] = useState([]);

  // Obtiene las preguntas frecuentes desde el backend
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch("https://vidrieriafloridabackend-production.up.railway.app/api/faq");
        const data = await response.json();
        setFaqList(data);
      } catch (error) {
        console.error("Error al obtener las preguntas frecuentes:", error);
      }
    };
    fetchFaqs();
  }, []);

  // Maneja el cambio en los campos de pregunta o respuesta
  const handleChange = (index, field, value) => {
    const updatedFaqs = [...faqList];
    updatedFaqs[index][field] = value;
    setFaqList(updatedFaqs);
  };

  // Añade una nueva pregunta y respuesta vacía
  const handleAddFaq = () => {
    setFaqList([...faqList, { pregunta: "", respuesta: "" }]);
  };

  // Elimina una pregunta por su índice y realiza la petición DELETE al backend
  const handleRemoveFaq = async (index) => {
    const faqToDelete = faqList[index];
    try {
      const response = await fetch(`https://vidrieriafloridabackend-production.up.railway.app/api/faq/${faqToDelete.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const updatedFaqs = faqList.filter((_, i) => i !== index);
        setFaqList(updatedFaqs);
        alert("Pregunta eliminada correctamente.");
      } else {
        throw new Error("Hubo un error al eliminar la pregunta.");
      }
    } catch (error) {
      console.error("Error al eliminar la pregunta:", error);
      alert("Error al eliminar la pregunta. Intenta de nuevo.");
    }
  };

  // Guarda cada pregunta y respuesta individualmente en el backend
  const handleSave = async () => {
    if (faqList.some(faq => faq.pregunta.trim() === "" || faq.respuesta.trim() === "")) {
      alert("Por favor, complete todas las preguntas y respuestas.");
      return;
    }

    try {
      for (const faq of faqList) {
        const response = await fetch("https://vidrieriafloridabackend-production.up.railway.app/api/faq", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(faq),
        });

        if (!response.ok) {
          throw new Error("Error al guardar una de las preguntas.");
        }
      }

      alert("Preguntas guardadas exitosamente.");
    } catch (error) {
      console.error("Error al guardar las preguntas:", error);
      alert("Error al guardar las preguntas. Intenta de nuevo.");
    }
  };

  // Verifica si alguna pregunta o respuesta está vacía para deshabilitar el botón "Guardar"
  const isSaveDisabled = faqList.some(faq => faq.pregunta.trim() === "" || faq.respuesta.trim() === "");

  return (
    <div className="card shadow-lg p-4 animate__animated animate__fadeIn">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Instalación Profesional y Confianza Garantizada</h2>
        <p className="lead">
          En <strong>Vidriería Florida</strong>, no solo ofrecemos productos de alta calidad,
          sino también un proceso de instalación seguro, rápido y limpio.
        </p>
        <p>
          Nuestro equipo de expertos se encarga de cada detalle, asegurando una colocación perfecta
          de vidrios templados, espejos decorativos y sistemas DVH.
        </p>
      </div>

      <h4 className="text-center mb-3">Preguntas Frecuentes</h4>

      {faqList.map((faq, index) => (
        <div className="accordion-item mb-3" key={index}>
          <h5 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#faq-edit-${index}`}
              aria-expanded="true"
              aria-controls={`faq-edit-${index}`}
            >
              {faq.pregunta || `Pregunta ${index + 1}`}
            </button>
          </h5>
          <div id={`faq-edit-${index}`} className="accordion-collapse collapse show">
            <div className="accordion-body">
              <div className="mb-2">
                <label className="form-label">Pregunta</label>
                <input
                  type="text"
                  className="form-control"
                  value={faq.pregunta}
                  onChange={(e) => handleChange(index, "pregunta", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Respuesta</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={faq.respuesta}
                  onChange={(e) => handleChange(index, "respuesta", e.target.value)}
                  required
                />
              </div>
              <button
                className="btn btn-danger btn-sm mt-2"
                onClick={() => handleRemoveFaq(index)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="text-center mt-4">
        <button className="btn btn-secondary me-2" onClick={handleAddFaq}>
          Agregar Pregunta
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={isSaveDisabled}>
          Guardar FAQ
        </button>
      </div>
    </div>
  );
}

export default FAQEditor;
