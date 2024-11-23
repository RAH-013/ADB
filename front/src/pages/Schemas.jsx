import { useEffect } from "react";
import { schemas } from "../api/servidor"; // Asegúrate de que esta función haga la solicitud.

function Schemas() {
  useEffect(() => {
    async function fetchSchemas() {
      try {
        const respuesta = await schemas(); // Supongo que esta función llama a tu API.
        console.log("Respuesta del servidor:", respuesta);
      } catch (error) {
        console.error("Error al obtener schemas:", error);
      }
    }

    fetchSchemas();
  }, []);

  return (
    <div>
      <h2>Componente Schemas</h2>
    </div>
  );
}

export default Schemas;
