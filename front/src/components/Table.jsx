import { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { dropTable, createRow, deleteRow, updateRow, getForm } from "../api/servidor";
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

function Table({ rows, columns, title, schema, onClose }) {
  const [selectedRowId, setSelectedRowId] = useState([]);

  const handleDrop = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Confirma para eliminar la tabla: ${title}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await dropTable(schema, title);
          if (res.status === 200) {
            Swal.fire({
              title: "Éxito",
              text: res.data.message,
              icon: "success",
            }).then(() => {
              onClose();
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: `Hubo un problema al eliminar la tabla: ${error.message}`,
            icon: "error",
          });
        }
      }
    });
  };

  const handleDeleteRow = () => {
    if (selectedRowId) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Confirma para eliminar el registro seleccionado.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await deleteRow(schema, title, selectedRowId);
            if (res.status === 200) {
              Swal.fire({
                title: "Éxito",
                text: res.data.message,
                icon: "success",
              }).then(() => {
                onClose();
                setSelectedRowId([]);
              });
            }
          } catch (error) {
            Swal.fire({
              title: "Error",
              text: `Error al eliminar el registro: ${error.message}`,
              icon: "error",
            });
          }
        }
      });
    } else {
      Swal.fire({
        title: "Selecciona un registro",
        text: "Debes seleccionar un registro para eliminar.",
        icon: "warning",
      });
    }
  };

  const handleUpdateRow = async () => {
    if (selectedRowId.length === 1) {
      const rowToUpdate = rows.find((row) => row.id === selectedRowId[0]);
      const formFields = await getForm(schema, title);
      const formData = formFields.data.formFields;

      if (!formData || formData.length === 0) {
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los campos del formulario.",
          icon: "error",
        });
        return;
      }

      const formHtml = `
      <form id="dynamicForm">
        ${formData
          .map((field) => {
            let value = rowToUpdate[field.name] || "";

            // Formatear el valor si es una fecha
            if (field.type === "date" && value) {
              const date = new Date(value);
              value = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
            }

            return `
              <div class="form-group">
                <label for="${field.name}">${field.name.charAt(0).toUpperCase() + field.name.slice(1)}</label>
               <input type="${
                 field.type === "date"
                   ? "date"
                   : field.type === "datetime" || field.type === "timestamp"
                   ? "datetime-local"
                   : field.type === "time"
                   ? "time"
                   : field.type === "decimal" || field.type === "float" || field.type === "double"
                   ? "number"
                   : field.type === "int" ||
                     field.type === "bigint" ||
                     field.type === "tinyint" ||
                     field.type === "smallint" ||
                     field.type === "mediumint"
                   ? "number"
                   : field.type === "boolean"
                   ? "checkbox"
                   : "text"
               }"
                       name="${field.name}"
                       id="${field.name}" 
                       class="swal2-input" 
                       autocomplete="off"
                       value="${value}"
                       placeholder="Introduce ${field.name}" 
                       ${field.required ? "required" : ""} />
              </div>
            `;
          })
          .join("")}
      </form>
    `;

      const { value: updatedRowData, isConfirmed } = await Swal.fire({
        title: "Editar registro",
        html: formHtml,
        showCancelButton: true,
        focusConfirm: false,
        preConfirm: () => {
          const form = document.getElementById("dynamicForm");
          const formData = new FormData(form);
          const formObj = {};
          formData.forEach((value, key) => {
            formObj[key] = value.trim();
          });

          if (Object.values(formObj).some((val) => val === "")) {
            Swal.showValidationMessage("Todos los campos deben estar completos");
            return false;
          }

          return formObj;
        },
      });

      if (isConfirmed && updatedRowData) {
        try {
          const res = await updateRow(schema, title, selectedRowId[0], updatedRowData);
          if (res.status === 200) {
            Swal.fire({
              title: "Éxito",
              text: res.data.message,
              icon: "success",
            }).then(() => {
              onClose();
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: `Hubo un problema al actualizar el registro: ${error.message}`,
            icon: "error",
          });
        }
      }
    } else {
      Swal.fire({
        title: "Selecciona un registro",
        text: "Debes seleccionar un único registro para actualizar.",
        icon: "warning",
      });
    }
  };

  const handleCreateRow = async () => {
    const formFields = await getForm(schema, title);
    const formData = formFields.data.formFields;

    if (!formData || formData.length === 0) {
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los campos del formulario.",
        icon: "error",
      });
      return;
    }

    const formHtml = `
    <form id="dynamicForm">
      ${formData
        .map((field) => {
          return `
            <div class="form-group">
              <label for="${field.name}">${field.name.charAt(0).toUpperCase() + field.name.slice(1)}</label>
              <input type="${
                field.type === "date"
                  ? "date"
                  : field.type === "datetime" || field.type === "timestamp"
                  ? "datetime-local"
                  : field.type === "time"
                  ? "time"
                  : field.type === "decimal" || field.type === "float" || field.type === "double"
                  ? "number"
                  : field.type === "int" ||
                    field.type === "bigint" ||
                    field.type === "tinyint" ||
                    field.type === "smallint" ||
                    field.type === "mediumint"
                  ? "number"
                  : field.type === "boolean"
                  ? "checkbox"
                  : "text"
              }"
                     name="${field.name}"
                     id="${field.name}" 
                     class="swal2-input" 
                     autocomplete="off"
                     placeholder="Introduce ${field.name}" 
                     ${field.required ? "required" : ""} />
            </div>
          `;
        })
        .join("")}
    </form>
  `;

    const { value: newRowData, isConfirmed } = await Swal.fire({
      title: "Crear registro",
      html: formHtml,
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const form = document.getElementById("dynamicForm");
        const formData = new FormData(form);
        const formObj = {};
        formData.forEach((value, key) => {
          formObj[key] = value.trim();
        });

        if (Object.values(formObj).some((val) => val === "")) {
          Swal.showValidationMessage("Todos los campos deben estar completos");
          return false;
        }

        return formObj;
      },
    });

    if (isConfirmed && newRowData) {
      try {
        const res = await createRow(schema, title, newRowData); // Llamada a la función createRow
        if (res.status === 200) {
          Swal.fire({
            title: "Éxito",
            text: res.data.message,
            icon: "success",
          }).then(() => {
            onClose();
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: `Hubo un problema al crear el registro: ${error.response.data.error}`,
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="containerTable">
      <div className="headerTable">
        <h2>{title}</h2>
        <div className="tableActions">
          {schema && (
            <>
              {selectedRowId.length > 0 && (
                <>
                  <button className="closeTable" onClick={handleDeleteRow} title="Eliminar registro">
                    <i className="fa-solid fa-eraser"></i>
                  </button>
                  <button className="closeTable" onClick={handleUpdateRow} title="Editar registro">
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <hr />
                </>
              )}
              <button className="closeTable" onClick={handleCreateRow} title="Agregar registro">
                <i className="fa-solid fa-plus"></i>
              </button>
              <button className="closeTable" onClick={handleDrop} title="Eliminar tabla">
                <i className="fa-solid fa-trash"></i>
              </button>
            </>
          )}
          <button className="closeTable" onClick={onClose} title="Cerrar tabla">
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
          localeText={esES}
          checkboxSelection
          disableRowSelectionOnClick
          disableMultipleRowSelection
          onRowSelectionModelChange={(newSelection) => {
            setSelectedRowId(newSelection);
          }}
          rowSelectionModel={selectedRowId}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              printOptions: { disableToolbarButton: true },
              csvOptions: { fileName: title },
              sx: { backgroundColor: "white" },
            },
          }}
        />
      </div>
    </div>
  );
}

export default Table;
