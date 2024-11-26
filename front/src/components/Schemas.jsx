import { useState, useEffect } from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { Rnd } from "react-rnd";
import { dropSchema } from "../api/servidor";
import Swal from "sweetalert2";

function Schemas({ schemasInfo, onSchemaChange, onItemClick, onReloadSchemas }) {
  const [searchText, setSearchText] = useState("");
  const [filteredSchemas, setFilteredSchemas] = useState(schemasInfo);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
  };

  const filterSchemas = (search) => {
    if (!search) {
      setFilteredSchemas(schemasInfo);
      return;
    }

    const filtered = schemasInfo.filter((schema) => {
      const matchDatabase = schema.database.toLowerCase().includes(search.toLowerCase());
      return matchDatabase;
    });

    setFilteredSchemas(filtered);
  };

  useEffect(() => {
    filterSchemas(searchText);
  }, [searchText, schemasInfo]);

  const handleReload = () => {
    setSearchText("");
    onReloadSchemas();
  };

  const handleTrash = (name) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Confirma para eliminar el esquema.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await dropSchema(name);
        try {
          if (res.status === 200) {
            Swal.fire({
              title: "Éxito",
              text: res.message,
              icon: "success",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al conectar con el servidor: " + error,
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: "25%",
        height: "100%",
      }}
      bounds="parent"
      disableDragging
      style={{
        background: "#f0f0f0",
        position: "relative",
      }}
      minWidth={"20%"}
      minHeight={"100%"}
      maxWidth={"50%"}
      enableResizing={{
        top: false,
        right: true,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      className="containerSchemas"
      resizeHandleClasses={{
        right: "resize-handle-right",
      }}
    >
      <div className="schemas-header">
        <h2 className="schemas-title">Schemas</h2>
        <button className="reload-button" type="button" title="Recargar schemas" onClick={handleReload}>
          <i className="fa-solid fa-arrows-rotate"></i>
        </button>
      </div>
      <div className="search-container">
        <input className="search-input" type="search" value={searchText} onChange={handleSearchChange} placeholder="Buscar schema" />
      </div>
      <div className="containerTree">
        <SimpleTreeView>
          {filteredSchemas.map((schema) => (
            <TreeItem
              key={schema.database}
              itemId={schema.database}
              label={
                <>
                  <i className="fa-solid fa-database"></i> {schema.database}
                </>
              }
              onClick={() => {
                onSchemaChange(schema.database);
              }}
            >
              <TreeItem
                itemId={`${schema.database}-tables`}
                label={
                  <>
                    <i className="fa-solid fa-table"></i> Tablas ({schema.tables.length})
                  </>
                }
              >
                {schema.tables.map((table) => (
                  <TreeItem
                    key={`${schema.database}-table-${table}`}
                    itemId={`${schema.database}-table-${table}`}
                    label={
                      <>
                        <i className="fa-solid fa-bolt"></i> {table}
                      </>
                    }
                    onClick={() => onItemClick(schema.database, table, "Tabla")}
                  />
                ))}
              </TreeItem>
              <TreeItem
                itemId={`${schema.database}-views`}
                label={
                  <>
                    <i className="fa-solid fa-eye"></i> Vistas ({schema.views.length})
                  </>
                }
              >
                {schema.views.map((view) => (
                  <TreeItem
                    key={`${schema.database}-view-${view}`}
                    itemId={`${schema.database}-view-${view}`}
                    label={
                      <>
                        <i className="fa-solid fa-bolt"></i> {view}
                      </>
                    }
                    onClick={() => onItemClick(schema.database, view, "Vista")}
                  />
                ))}
              </TreeItem>
              <TreeItem
                className="schemaTrash"
                itemId={`${schema.database}-delete`}
                label={
                  <>
                    <i className="fa-solid fa-trash"></i> Eliminar schema
                  </>
                }
                onClick={() => {
                  handleTrash(schema.database);
                }}
              ></TreeItem>
            </TreeItem>
          ))}
        </SimpleTreeView>
      </div>
    </Rnd>
  );
}

export default Schemas;
