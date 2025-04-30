import React, { useEffect, useState } from "react";

const API_URL = "https://vidrieriafloridabackend-production.up.railway.app/api/presentacion";

const PresentacionManager = () => {
  const [presentacion, setPresentacion] = useState({
    textoPrincipal: "",
    textoSecundario: ""
  });
  const [id, setId] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error("No existe");
        return res.json();
      })
      .then(data => {
        setPresentacion(data);
        setId(data.id);
      })
      .catch(() => console.log("No hay presentación aún."));
  }, []);

  const handleChange = (e) => {
    setPresentacion({ ...presentacion, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(presentacion)
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al guardar");
        return res.json();
      })
      .then(data => {
        alert(id ? "Actualizado correctamente" : "Creado correctamente");
        if (!id) setId(data.id);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow p-4" style={{ maxWidth: "700px", width: "100%" }}>
        <h3 className="card-title text-center mb-4">Gestión de Presentación</h3>

        <div className="mb-3">
          <label className="form-label fw-bold">Texto Principal</label>
          <textarea
            className="form-control"
            name="textoPrincipal"
            value={presentacion.textoPrincipal}
            onChange={handleChange}
            rows={3}
            placeholder="Escribe el texto principal..."
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Texto Secundario</label>
          <textarea
            className="form-control"
            name="textoSecundario"
            value={presentacion.textoSecundario}
            onChange={handleChange}
            rows={3}
            placeholder="Escribe el texto secundario..."
          />
        </div>

        <div className="d-grid">
          <button className="btn btn-success" onClick={handleSave}>
            {id ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentacionManager;
