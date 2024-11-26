import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { Rnd } from "react-rnd";

function Schemas({ schemasInfo, onItemClick }) {
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
      maxHeight={"100%"}
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
      <SimpleTreeView>
        {schemasInfo.map((schema) => (
          <TreeItem
            key={schema.database}
            itemId={schema.database}
            label={
              <>
                <i className="fa-solid fa-database"></i> {schema.database}
              </>
            }
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
          </TreeItem>
        ))}
      </SimpleTreeView>
    </Rnd>
  );
}

export default Schemas;
