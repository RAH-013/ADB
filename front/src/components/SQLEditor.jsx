import React, { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { formatDialect, mysql } from "sql-formatter";

const SQLEditor = ({ value, onChange, schemasInfo }) => {
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
    ];

    monaco.languages.register({ id: "sql" });

    monaco.languages.setMonarchTokensProvider("sql", {
      tokenizer: {
        root: [
          [/\b(?:SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|INNER|OUTER|LEFT|RIGHT|GROUP|BY|ORDER|HAVING|LIMIT)\b/, "keyword"],

          [/[a-zA-Z_][a-zA-Z0-9_]*/, "identifier"],

          [/'(?:\\'|[^'])*'/, "string"],

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

  const handleAction = (action) => {
    const editor = editorRef.current;
    if (!editor) return;

    switch (action) {
      case "open":
        alert("Abrir archivo no implementado aún.");
        break;
      case "save":
        const content = editor.getValue();
        alert(`Guardando contenido:\n${content}`);
        break;
      case "format":
        const contentToFormat = editor.getValue();
        const formattedContent = formatDialect(contentToFormat, { dialect: mysql, keywordCase: "upper" });
        editor.setValue(formattedContent);
        break;
      case "execute":
        alert("Ejecutando SQL:\n" + editor.getValue());
        break;
      case "copy":
        navigator.clipboard.writeText(editor.getValue());
        alert("Contenido copiado al portapapeles.");
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="queryHeader">
        <button type="button" title="Abrir archivo" onClick={() => handleAction("open")}>
          <i className="fa-solid fa-folder"></i>
        </button>
        <button type="button" title="Guardar como" onClick={() => handleAction("save")}>
          <i className="fa-solid fa-floppy-disk"></i>
        </button>
        <button type="button" title="Formatear" onClick={() => handleAction("format")}>
          <i className="fa-solid fa-brush"></i>
        </button>
        <button type="button" title="Ejecutar" onClick={() => handleAction("execute")}>
          <i className="fa-solid fa-bolt"></i>
        </button>
      </div>
      <Editor height="100%" value={value} onChange={onChange} onMount={(editor, monaco) => handleEditorDidMount(editor, monaco)} language="sql" />
    </div>
  );
};

export default SQLEditor;
