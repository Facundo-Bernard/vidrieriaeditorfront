import { useEffect, useState } from "react";

function PRODUCTOSEDITOR() {
  const [listadoProductos, setListadoProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    title: "",
    description: "",
    image: ""
  });

  const backendUrl = "https://vidrieriaflorida-front-u98r.vercel.app";

  // Cargar productos al montar el componente
  useEffect(() => {
    const intervalo = setInterval(() => {
      fetch(`${backendUrl}/product`)
        .then(res => res.json())
        .then(data => setListadoProductos(data))
        .catch(err => console.error("Error al cargar productos:", err));
    }, 2000); // cada 2 segundos
  
    return () => clearInterval(intervalo); // limpiar intervalo al desmontar
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto({ ...nuevoProducto, [name]: value });
  };

  const agregarProducto = () => {
    if (nuevoProducto.title && nuevoProducto.description && nuevoProducto.image) {
      fetch(`${backendUrl}/product/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto)
      })
        .then(res => res.json())
        .then(data => {
          setNuevoProducto({ title: "", description: "", image: "" });
        })
        .catch(err => console.error("Error al agregar producto:", err));
    }
  };

  const eliminarProducto = (id) => {
    fetch(`${backendUrl}/product/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setListadoProductos(listadoProductos.filter(prod => prod.id !== id));
      })
      .catch(err => console.error("Error al eliminar producto:", err));
  };

  return (
    <div className="container py-5">
      <div className="bg-light p-4 rounded shadow-sm mb-4">
        <h2 className="mb-4 text-center">Editor de Productos</h2>
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Título"
              name="title"
              value={nuevoProducto.title}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Descripción"
              name="description"
              value={nuevoProducto.description}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="URL de Imagen"
              name="image"
              value={nuevoProducto.image}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 d-flex justify-content-center">
            <button className="btn btn-primary mt-3" onClick={agregarProducto}>
              Agregar Producto
            </button>
          </div>
        </div>
      </div>

      <h4 className="mb-3">Productos guardados:</h4>
      <div className="row">
        {listadoProductos.map((prod) => (
          <div key={prod.id} className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <img src={prod.image} className="card-img-top" alt={prod.title} style={{ height: "200px", objectFit: "cover" }} />
              <div className="card-body">
                <h5 className="card-title">{prod.title}</h5>
                <p className="card-text">{prod.description}</p>
                <button className="btn btn-danger" onClick={() => eliminarProducto(prod.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PRODUCTOSEDITOR;
