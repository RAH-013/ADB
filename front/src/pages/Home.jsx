import { useEffect, useState } from "react";
import { schemas, getTable, logout, executeQuery, changeSchema } from "../api/servidor";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Schemas from "../components/Schemas";
import Table from "../components/Table";
import SQLEditor from "../components/SQLEditor";
import { Rnd } from "react-rnd";

function Home() {
  const navigate = useNavigate();
  const [schemasInfo, setSchemasInfo] = useState([]);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [titleTable, setTitleTable] = useState("");
  const [schemaName, setSchemaName] = useState("");
  const [sqlCode, setSqlCode] = useState("");

  const [minHeight, setMinHeight] = useState("100%");

  useEffect(() => {
    getSchemas();
  }, []);

  const getSchemas = async () => {
    try {
      const response = await schemas();
      setSchemasInfo(response.data);
    } catch (error) {
      console.error("Error al obtener schemas:", error);
    }
  };

  const handleItemClick = async (database, name) => {
    try {
      const response = await getTable(database, name);
      const data = response.data;

      if (data && data.length > 0) {
        let columnKeys = [];
        data[1].forEach((columna) => {
          columnKeys.push(columna.name);
        });

        setMinHeight("40%");
        setColumns(
          columnKeys.map((key) => ({
            field: key,
            headerName: key.charAt(0).toUpperCase() + key.slice(1),
            width: 150,
          }))
        );

        setRows(
          data[0] && data[0].length > 0
            ? data[0].map((item, index) => ({ id: index, ...item }))
            : [
                {
                  id: 0,
                  ...columnKeys.reduce((acc, key) => {
                    acc[key] = "null";
                    return acc;
                  }, {}),
                },
              ]
        );

        setSchemaName(database);
        setTitleTable(name);
      } else {
        setRows([]);
      }
    } catch (error) {
      console.error("Error al obtener la tabla:", error);
    }
  };

  const cSchema = async (name) => {
    try {
      await changeSchema(name);
    } catch (error) {
      console.log(error);
    }
  };

  const eQuery = async (query) => {
    try {
      const response = await executeQuery(query);

      console.log(response.statusText);

      const data = response.data.results;

      if (data && data.length > 0) {
        const columnKeys = Object.keys(data[0]);
        setMinHeight("40%");

        setColumns(
          columnKeys.map((key) => ({
            field: key,
            headerName: key.charAt(0).toUpperCase() + key.slice(1),
            width: 150,
          }))
        );

        setRows(data.map((item, index) => ({ id: index, ...item })));

        setTitleTable("Resultado:");
      } else {
        setRows([]);
      }
    } catch (error) {
      console.error("Error al ejecutar la consulta:", error);
      Swal.fire({
        title: "Error",
        text: "Error al ejecutar la consulta: " + error.response.data.error,
        icon: "error",
      });
    }
  };

  const handleCloseTable = () => {
    setMinHeight("100%");
    setColumns([]);
    setRows([]);
    setSchemaName("");
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
        <Schemas schemasInfo={schemasInfo} onSchemaChange={cSchema} onItemClick={handleItemClick} onReloadSchemas={getSchemas} />
        <div className="containerRight">
          <Rnd
            default={{ x: 0, y: 0, width: "100%", height: "40%" }}
            bounds="parent"
            disableDragging
            style={{
              position: "relative",
            }}
            minHeight={minHeight}
            maxWidth={"100%"}
            maxHeight={"100%"}
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
            <SQLEditor value={sqlCode} onChange={handleCodeChange} onExecuteQuery={eQuery} schemasInfo={schemasInfo} />
          </Rnd>

          {rows.length > 0 && <Table rows={rows} columns={columns} title={titleTable} schema={schemaName} onClose={handleCloseTable} />}
        </div>
      </div>
    </div>
  );
}

export default Home;
