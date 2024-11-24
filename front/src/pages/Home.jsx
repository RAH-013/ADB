import { useEffect, useState } from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { schemas, getTable, logout } from "../api/servidor";
import { DataGrid, GridToolbar } from "@mui/x-data-grid"; // Importar el DataGrid
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const esES = {
  // Root
  noRowsLabel: "No hay filas",
  noResultsOverlayLabel: "No se encontraron resultados.",

  // Density selector toolbar button text
  toolbarDensity: "Densidad",
  toolbarDensityLabel: "Densidad",
  toolbarDensityCompact: "Compacto",
  toolbarDensityStandard: "Estándar",
  toolbarDensityComfortable: "Cómodo",

  // Columns selector toolbar button text
  toolbarColumns: "Columnas",
  toolbarColumnsLabel: "Seleccionar columnas",

  // Filters toolbar button text
  toolbarFilters: "Filtros",
  toolbarFiltersLabel: "Mostrar filtros",
  toolbarFiltersTooltipHide: "Ocultar filtros",
  toolbarFiltersTooltipShow: "Mostrar filtros",
  toolbarFiltersTooltipActive: (count) => (count !== 1 ? `${count} filtros activos` : `${count} filtro activo`),

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: "Buscar…",
  toolbarQuickFilterLabel: "Buscar",
  toolbarQuickFilterDeleteIconLabel: "Limpiar",

  // Export selector toolbar button text
  toolbarExport: "Exportar",
  toolbarExportLabel: "Exportar",
  toolbarExportCSV: "Descargar como CSV",
  toolbarExportPrint: "Imprimir",
  toolbarExportExcel: "Descargar como Excel",

  // Columns management text
  columnsManagementSearchTitle: "Buscar",
  columnsManagementNoColumns: "No hay columnas",
  columnsManagementShowHideAllText: "Mostrar/Ocultar todo",
  columnsManagementReset: "Restablecer",
  columnsManagementDeleteIconLabel: "Limpiar",

  // Filter panel text
  filterPanelAddFilter: "Agregar filtro",
  filterPanelRemoveAll: "Eliminar todo",
  filterPanelDeleteIconLabel: "Eliminar",
  filterPanelLogicOperator: "Operador lógico",
  filterPanelOperator: "Operador",
  filterPanelOperatorAnd: "Y",
  filterPanelOperatorOr: "O",
  filterPanelColumns: "Columnas",
  filterPanelInputLabel: "Valor",
  filterPanelInputPlaceholder: "Valor de filtro",

  // Filter operators text
  filterOperatorContains: "contiene",
  filterOperatorDoesNotContain: "no contiene",
  filterOperatorEquals: "es igual a",
  filterOperatorDoesNotEqual: "no es igual a",
  filterOperatorStartsWith: "empieza con",
  filterOperatorEndsWith: "termina con",
  filterOperatorIs: "es",
  filterOperatorNot: "no es",
  filterOperatorAfter: "es después de",
  filterOperatorOnOrAfter: "es el mismo o después de",
  filterOperatorBefore: "es antes de",
  filterOperatorOnOrBefore: "es el mismo o antes de",
  filterOperatorIsEmpty: "está vacío",
  filterOperatorIsNotEmpty: "no está vacío",
  filterOperatorIsAnyOf: "es cualquiera de",
  "filterOperator=": "=",
  "filterOperator!=": "!=",
  "filterOperator>": ">",
  "filterOperator>=": ">=",
  "filterOperator<": "<",
  "filterOperator<=": "<=",

  // Header filter operators text
  headerFilterOperatorContains: "Contiene",
  headerFilterOperatorDoesNotContain: "No contiene",
  headerFilterOperatorEquals: "Es igual a",
  headerFilterOperatorDoesNotEqual: "No es igual a",
  headerFilterOperatorStartsWith: "Empieza con",
  headerFilterOperatorEndsWith: "Termina con",
  headerFilterOperatorIs: "Es",
  headerFilterOperatorNot: "No es",
  headerFilterOperatorAfter: "Es después de",
  headerFilterOperatorOnOrAfter: "Es el mismo o después de",
  headerFilterOperatorBefore: "Es antes de",
  headerFilterOperatorOnOrBefore: "Es el mismo o antes de",
  headerFilterOperatorIsEmpty: "Está vacío",
  headerFilterOperatorIsNotEmpty: "No está vacío",
  headerFilterOperatorIsAnyOf: "Es cualquiera de",
  "headerFilterOperator=": "Es igual a",
  "headerFilterOperator!=": "No es igual a",
  "headerFilterOperator>": "Es mayor que",
  "headerFilterOperator>=": "Es mayor o igual a",
  "headerFilterOperator<": "Es menor que",
  "headerFilterOperator<=": "Es menor o igual a",

  // Filter values text
  filterValueAny: "cualquiera",
  filterValueTrue: "verdadero",
  filterValueFalse: "falso",

  // Column menu text
  columnMenuLabel: "Menú",
  columnMenuShowColumns: "Mostrar columnas",
  columnMenuManageColumns: "Gestionar columnas",
  columnMenuFilter: "Filtrar",
  columnMenuHideColumn: "Ocultar columna",
  columnMenuUnsort: "Desordenar",
  columnMenuSortAsc: "Ordenar ascendente",
  columnMenuSortDesc: "Ordenar descendente",

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => (count !== 1 ? `${count} filtros activos` : `${count} filtro activo`),
  columnHeaderFiltersLabel: "Mostrar filtros",
  columnHeaderSortIconLabel: "Ordenar",

  // Rows selected footer text
  footerRowSelected: (count) => (count !== 1 ? `${count.toLocaleString()} filas seleccionadas` : `${count.toLocaleString()} fila seleccionada`),

  // Total row amount footer text
  footerTotalRows: "Total de filas:",

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) => `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: "Selección con casilla",
  checkboxSelectionSelectAllRows: "Seleccionar todas las filas",
  checkboxSelectionUnselectAllRows: "Desmarcar todas las filas",
  checkboxSelectionSelectRow: "Seleccionar fila",
  checkboxSelectionUnselectRow: "Desmarcar fila",

  // Boolean cell text
  booleanCellTrueLabel: "sí",
  booleanCellFalseLabel: "no",

  // Actions cell more text
  actionsCellMore: "más",

  // Column pinning text
  pinToLeft: "Fijar a la izquierda",
  pinToRight: "Fijar a la derecha",
  unpin: "Desfijar",

  // Tree Data
  treeDataGroupingHeaderName: "Grupo",
  treeDataExpand: "ver hijos",
  treeDataCollapse: "ocultar hijos",

  // Grouping columns
  groupingColumnHeaderName: "Grupo",
  groupColumn: (name) => `Agrupar por ${name}`,
  unGroupColumn: (name) => `Dejar de agrupar por ${name}`,

  // Master/detail
  detailPanelToggle: "Alternar panel de detalles",
  expandDetailPanel: "Expandir",
  collapseDetailPanel: "Colapsar",

  // Used core components translation keys
  MuiTablePagination: {
    labelRowsPerPage: "Filas por página", // Traducción de "Rows per page"
    labelDisplayedRows: ({ from, to, count }) => `${from}-${to} de ${count}`, // Traducción de la parte que muestra el rango de filas
  },

  // Row reordering text
  rowReorderingHeaderName: "Reordenar filas",

  // Aggregation
  aggregationMenuItemHeader: "Agregación",
  aggregationFunctionLabelSum: "suma",
  aggregationFunctionLabelAvg: "promedio",
  aggregationFunctionLabelMin: "mínimo",
  aggregationFunctionLabelMax: "máximo",
  aggregationFunctionLabelSize: "tamaño",
};

function Home() {
  const navigate = useNavigate();
  const [schemasInfo, setSchemasInfo] = useState([]);
  const [rows, setRows] = useState([]); // Estado para las filas del DataGrid
  const [columns, setColumns] = useState([]); // Estado para las columnas del DataGrid
  const [titleTable, setTitleTable] = useState("");

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
      }).then(async (result) => {
        if (result.isConfirmed) {
          const result = await logout();
          if (result.data === "Conexión cerrada correctamente.") navigate("/");
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
        <div className="containerSchemas">
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
                      onClick={() => handleItemClick(schema.database, table, "Tabla")}
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
                      onClick={() => handleItemClick(schema.database, view, "Vista")}
                    />
                  ))}
                </TreeItem>
              </TreeItem>
            ))}
          </SimpleTreeView>
        </div>
        <div className="conatinerRight">
          <div className="containerQuery">
            <h2>Query</h2>
            <textarea name="query" id="textQuery"></textarea>
            <button type="button">Execute</button>
          </div>
          {rows.length > 0 && ( // Verificamos si hay filas
            <div className="containerTable">
              <div className="headerTable">
                <h2>{titleTable}</h2>
                <div className="tableActions">
                  <button className="closeTable" type="button" onClick={handleCloseTable}>
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button className="closeTable" type="button" onClick={handleCloseTable}>
                    <i class="fa-solid fa-gear"></i>
                  </button>
                  <button className="closeTable" type="button" onClick={handleCloseTable}>
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
              <div className="table">
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableRowSelectionOnClick
                  localeText={esES}
                  slots={{
                    toolbar: GridToolbar,
                  }}
                  slotProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
