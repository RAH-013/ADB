import React, { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { formatDialect, mysql } from "sql-formatter";
import Swal from "sweetalert2";

const SQLEditor = ({ value, onChange, onExecuteQuery, schemasInfo }) => {
  const editorRef = useRef(null);
  const schemasInfoRef = useRef(schemasInfo);

  useEffect(() => {
    schemasInfoRef.current = schemasInfo;
  }, [schemasInfo]);

  const createLightTheme = (monaco) => {
    monaco.editor.defineTheme("adbSystemeTheme", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "5cb8ff" },
        { token: "string", foreground: "cfa100" },
        { token: "operator", foreground: "ff6347" },
        { token: "keyword", foreground: "8800cc", fontStyle: "bold" },
        { token: "number", foreground: "ff5c5c" },
        { token: "identifier", foreground: "333333" },
        { token: "operator.arithmetic", foreground: "ff6347" },
        { token: "operator.comparison", foreground: "ff4500" },
        { token: "operator.logical", foreground: "f0e68c" },
        { token: "delimiter", foreground: "32cd32" },
      ],
      colors: {
        "editor.background": "#ffffff",
        "editor.foreground": "#000000",
        "editorLineNumber.foreground": "#aaaaaa",
        "editorCursor.foreground": "#000000",
        "editor.selectionBackground": "#d3e9ff",
        "editor.inactiveSelectionBackground": "#eaf6ff",
      },
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    const sqlKeywords = [
      "USE",
      "SELECT",
      "FROM",
      "WHERE",
      "INSERT",
      "UPDATE",
      "DELETE",
      "JOIN",
      "INNER",
      "OUTER",
      "LEFT",
      "RIGHT",
      "GROUP",
      "BY",
      "ORDER",
      "HAVING",
      "LIMIT",
      "AS",
      "IF",
      "ELSE",
      "CASE",
      "WHEN",
      "THEN",
      "END",
      "AND",
      "OR",
      "NOT",
      "IS",
      "NULL",
      "IN",
      "EXISTS",
      "BETWEEN",
      "LIKE",
      "ASC",
      "DESC",
      "DISTINCT",
      "INTO",
      "VALUES",
      "SET",
      "CREATE",
      "SCHEMA",
      "DROP",
      "TABLE",
    ];

    monaco.languages.register({ id: "sql" });

    monaco.languages.setMonarchTokensProvider("sql", {
      tokenizer: {
        root: [
          [
            /\b(?:SELECT|TABLE|DROP|SCHEMA|CREATE|USE|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|INNER|OUTER|LEFT|RIGHT|GROUP|BY|ORDER|HAVING|LIMIT|AS|IF|ELSE|CASE|WHEN|THEN|END|AND|OR|NOT|IS|NULL|IN|EXISTS|BETWEEN|LIKE|ASC|DESC|DISTINCT|INTO|VALUES|SET)\b/,
            "keyword",
          ],
          [/[a-zA-Z_][a-zA-Z0-9_]*/, "identifier"], // Identificador para nombres de tablas/esquemas
          [/'(?:\\'|[^'])*'/, "string"],
          [/"(?:\\"|[^"])*"/, "string"],
          [/`(?:\\`|[^`])*`/, "string"],
          [/\b\d+(\.\d+)?\b/, "number"],
          [/[=<>!]+/, "operator"],
          [/--.*$/, "comment"],
          [/\/\*/, { token: "comment", next: "@comment" }],
        ],
        comment: [
          [/\*\//, "comment", "@pop"],
          [/./, "comment"],
        ],
      },
    });

    monaco.languages.registerCompletionItemProvider("sql", {
      provideCompletionItems: () => {
        let suggestions = sqlKeywords.map((keyword) => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
        }));

        const editorSchemas = schemasInfoRef.current;

        if (Array.isArray(editorSchemas)) {
          editorSchemas.forEach((schema) => {
            if (schema.database) {
              suggestions.push({
                label: schema.database,
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: schema.database,
                detail: "Database",
              });
            }

            if (schema.tables && Array.isArray(schema.tables)) {
              schema.tables.forEach((table) => {
                suggestions.push({
                  label: table,
                  kind: monaco.languages.CompletionItemKind.Struct,
                  insertText: table,
                  detail: "Table",
                });
              });
            }

            if (schema.views && Array.isArray(schema.views)) {
              schema.views.forEach((view) => {
                suggestions.push({
                  label: view,
                  kind: monaco.languages.CompletionItemKind.Struct,
                  insertText: view,
                  detail: "View",
                });
              });
            }
          });
        }

        return { suggestions };
      },
    });

    createLightTheme(monaco);
    monaco.editor.setTheme("adbSystemeTheme");
  };

  const openQuery = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".sql";

    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          editor.setValue(content);
        };
        reader.readAsText(file);
      }
    };

    input.click();
  };

  const saveQuery = async () => {
    const editor = editorRef.current;
    if (!editor) return;

    const content = editor.getValue();
    const blob = new Blob([content], { type: "text/sql" });

    try {
      const archivoHandle = await window.showSaveFilePicker({
        suggestedName: "newQuery.sql",
        types: [
          {
            description: "SQL Files",
            accept: { "text/sql": [".sql"] },
          },
        ],
      });

      const writable = await archivoHandle.createWritable();
      await writable.write(blob);
      await writable.close();

      Swal.fire({
        title: "Exito",
        text: "Archivo guardado exitosamente.",
        icon: "success",
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        Swal.fire({
          title: "Error",
          text: "Error al guardar el archivo: " + error,
          icon: "error",
        });
      }
    }
  };

  const formatQuery = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const contentToFormat = editor.getValue();
    const formattedContent = formatDialect(contentToFormat, { dialect: mysql, keywordCase: "upper" });
    editor.setValue(formattedContent);
  };

  const execute = async () => {
    try {
      const editor = editorRef?.current;
      if (!editor) {
        console.warn("El editor no está inicializado.");
        return;
      }

      const selectionRange = editor.getSelection();
      const selection = selectionRange ? editor.getModel().getValueInRange(selectionRange) : "";
      const query = selection.trim() ? selection : editor.getValue();

      if (!query.trim()) {
        Swal.fire({
          title: "Advertencia",
          text: "El editor está vacío, no hay consulta para ejecutar.",
          icon: "warning",
        });
        return;
      }

      await onExecuteQuery(query);
    } catch (error) {
      console.error("Error al ejecutar la consulta:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="queryHeader">
        <button type="button" title="Abrir archivo" onClick={openQuery}>
          <i className="fa-solid fa-folder"></i>
        </button>
        <button type="button" title="Guardar como" onClick={saveQuery}>
          <i className="fa-solid fa-floppy-disk"></i>
        </button>
        <button type="button" title="Formatear" onClick={formatQuery}>
          <i className="fa-solid fa-brush"></i>
        </button>
        <button type="button" title="Ejecutar" onClick={execute}>
          <i className="fa-solid fa-bolt"></i>
        </button>
      </div>
      <Editor height="100%" value={value} onChange={onChange} onMount={(editor, monaco) => handleEditorDidMount(editor, monaco)} language="sql" />
    </div>
  );
};

export default SQLEditor;
