import { useEffect, useState } from "react";
import { schemas, getTable, logout } from "../api/servidor"; // Asegúrate de tener una función para obtener vistas
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Schemas from "../components/Schemas";
import Table from "../components/Table";
import SQLEditor from "../components/SQLEditor";
import { Rnd } from "react-rnd";

function Home() {
  const navigate = useNavigate();
  const [schemasInfo, setSchemasInfo] = useState([]);
  const [rows, setRows] = useState([]); // Estado para las filas del DataGrid
  const [columns, setColumns] = useState([]); // Estado para las columnas del DataGrid
  const [titleTable, setTitleTable] = useState("");
  const [sqlCode, setSqlCode] = useState("-- Ingresa aqui tu QUERY: \n");

  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        const response = await schemas();
        setSchemasInfo(response.data);
      } catch (error) {
        console.error("Error al obtener schemas:", error);
      }
    };
    fetchSchemas();
  }, []);

  const handleItemClick = async (database, name) => {
    try {
      const response = await getTable(database, name);
      const data = response.data[0]; // Asumimos que el primer array contiene los datos de la tabla

      if (data && data.length > 0) {
        // Extraer las columnas a partir de las claves del primer objeto de los datos
        const columnKeys = Object.keys(data[0]);
        setColumns(
          columnKeys.map((key) => ({
            field: key,
            headerName: key.charAt(0).toUpperCase() + key.slice(1),
            width: 150,
          }))
        );

        // Crear las filas, agregando un id único para cada fila
        setRows(data.map((item, index) => ({ id: index, ...item })));

        setTitleTable(name);
      } else {
        setRows([]); // En caso de que no haya datos, limpiamos las filas
      }
    } catch (error) {
      console.error("Error al obtener la tabla:", error);
    }
  };

  const handleCloseTable = () => {
    setColumns([]);
    setRows([]);
    setTitleTable("");
  };

  const handlelogOut = async () => {
    try {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Confirma para cerrar la conexión.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Cerrar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      }).then(async (resultSwal) => {
        if (resultSwal.isConfirmed) {
          const logoutResponse = await logout();
          if (logoutResponse.data === "Conexión cerrada correctamente.") navigate("/");
          Swal.fire({
            title: "Conexión cerrada",
            html: "La conexión se ha cerrado correctamente.",
            icon: "success",
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCodeChange = (newCode) => {
    setSqlCode(newCode);
  };

  return (
    <div className="containerHome">
      <header>
        <div className="logo">
          <img src="./icon.png" alt="Logotipo" />
          <h1>ADB system</h1>
        </div>
        <button type="button" onClick={handlelogOut}>
          Cerrar Conexión
        </button>
      </header>
      <div className="containerGrid">
        <Schemas schemasInfo={schemasInfo} onItemClick={handleItemClick} />
        <div className="containerRight">
          <Rnd
            default={{
              x: 0,
              y: 0,
              width: "100%",
              height: "40%",
            }}
            bounds="parent"
            disableDragging
            style={{
              position: "relative",
            }}
            minHeight={"40%"}
            maxWidth={"100%"}
            maxHeight={"80%"}
            enableResizing={{
              top: false,
              right: false,
              bottom: true,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            resizeHandleClasses={{
              bottom: "resize-handle-bottom",
            }}
          >
            <SQLEditor value={sqlCode} onChange={handleCodeChange} schemasInfo={schemasInfo} />
          </Rnd>

          {rows.length > 0 && <Table rows={rows} columns={columns} title={titleTable} onClose={handleCloseTable} />}
        </div>
      </div>
    </div>
  );
}

export default Home;
