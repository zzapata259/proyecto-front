import { useEffect, useState } from "react";
import API from "./services/api";

function App() {
  const [productos, setProductos] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    imagen: "",
  });

  const [editando, setEditando] = useState(null);

  // Obtener productos
  const obtenerProductos = async () => {
    try {
      const res = await API.get("/productos");
      setProductos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  // Cambios inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Crear o editar
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await API.put(`/productos/${editando}`, form);
      } else {
        await API.post("/productos", form);
      }

      setForm({
        nombre: "",
        precio: "",
        imagen: "",
      });

      setEditando(null);

      obtenerProductos();
    } catch (error) {
      console.log(error);
    }
  };

  // Eliminar
  const eliminarProducto = async (id) => {
    try {
      await API.delete(`/productos/${id}`);
      obtenerProductos();
    } catch (error) {
      console.log(error);
    }
  };

  // Editar
  const editarProducto = (producto) => {
    setForm({
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
    });

    setEditando(producto.id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CRUD Productos</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
        />

        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
        />

        <input
          type="text"
          name="imagen"
          placeholder="URL Imagen"
          value={form.imagen}
          onChange={handleChange}
        />

        <button type="submit">
          {editando ? "Actualizar" : "Crear"}
        </button>
      </form>

      <hr />

      {productos.map((producto) => (
        <div
          key={producto.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h2>{producto.nombre}</h2>

          <p>${producto.precio}</p>

          <img
            src={producto.imagen}
            alt={producto.nombre}
            width="150"
          />

          <br />

          <button onClick={() => editarProducto(producto)}>
            Editar
          </button>

          <button onClick={() => eliminarProducto(producto.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;