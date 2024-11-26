import { DataGrid, GridToolbar } from "@mui/x-data-grid";

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

function Table({ rows, columns, title, onClose }) {
  return (
    <div className="containerTable">
      <div className="headerTable">
        <h2>{title}</h2>
        <div className="tableActions">
          <button className="closeTable" type="button">
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
          <button className="closeTable" type="button">
            <i className="fa-solid fa-gear"></i>
          </button>
          <button className="closeTable" type="button" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
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
  );
}

export default Table;
