import { Router } from "express";
import { createPool } from "mysql2/promise";

export const router = Router();

let pool = null;
//  Cierre de sesión
router.get("/logout", (req, res) => {
  if (pool) {
    pool.end();
    pool = null;
    res.status(200).send("Conexión cerrada correctamente.");
  } else {
    res.status(400).send("No hay conexión activa.");
  }
});

// Conexión y Autenticación
router.post("/auth", async (req, res) => {
  const { host, port, user, password, schema } = req.body;

  if (!host || !port || !user || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios." });
  }

  try {
    pool = createPool({
      host,
      port: parseInt(port, 10),
      user,
      password,
      database: schema,
      multipleStatements: true,
    });

    const result = await pool.query("SELECT 1");

    if (result) {
      return res.json({ message: "Conexión establecida exitosamente." });
    }
  } catch (err) {
    return res.status(500).json({ message: "No se pudo establecer la conexión con la base de datos.", error: err.message });
  }
});

// Selección de Base de Datos y Tabla Activa
router.get("/schemas", async (req, res) => {
  if (!pool) {
    return res.status(400).json({ message: "No se ha establecido una conexión con el servidor." });
  }

  try {
    const [schemasRows] = await pool.query("SHOW DATABASES");
    const databases = schemasRows
      .map((row) => row.Database)
      .filter((schema) => !["information_schema", "mysql", "performance_schema", "sys"].includes(schema));

    const schemas = [];

    for (const database of databases) {
      const [tablesRows] = await pool.query(
        `SELECT TABLE_NAME AS table_name 
         FROM information_schema.TABLES 
         WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'`,
        [database]
      );
      const tables = tablesRows.map((row) => row.table_name);

      const [viewsRows] = await pool.query(
        `SELECT TABLE_NAME AS view_name 
         FROM information_schema.TABLES 
         WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'VIEW'`,
        [database]
      );
      const views = viewsRows.map((row) => row.view_name);

      schemas.push({
        database,
        tables,
        views,
      });
    }

    res.json(schemas);
  } catch (err) {
    console.error("Error al obtener los schemas del servidor:", err);
    res.status(500).json({
      message: "Error al obtener los schemas del servidor.",
      error: err.message,
    });
  }
});

// Visualización y Navegación de Datos
router.get("/tables/:schema/:data", async (req, res) => {
  const { schema, data } = req.params;

  try {
    const result = await pool.query(`SELECT * FROM \`${schema}\`.\`${data}\``);
    res.json(result);
  } catch (error) {
    console.error("Error al verificar existencia de tabla o vista:", error);
    res.status(500).json({
      message: "Error interno del servidor.",
      error: error.message,
    });
  }
});

// Cambia de schema
router.post("/schema/use/:schema", async (req, res) => {
  const { schema } = req.params;

  try {
    const [rows] = await pool.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, [schema]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: `El esquema ${schema} no existe.`,
      });
    }

    await pool.query(`USE \`${schema}\``);

    res.status(200).json({
      message: `Esquema cambiado a ${schema} correctamente.`,
    });
  } catch (error) {
    console.error("Error al cambiar de esquema:", error);
    res.status(500).json({
      message: "Error al cambiar de esquema.",
      error: error.message,
    });
  }
});

// Consultas Personalizadas
router.post("/query", async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "Consulta inválida." });
  }

  if (!pool) {
    return res.status(400).json({ message: "No se ha establecido una conexión con el servidor." });
  }

  try {
    const [results] = await pool.query(query);
    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al ejecutar la consulta.", error: err.message });
  }
});

// Eliminar Tabla
router.delete("/drop/:schema/:table", async (req, res) => {
  const { schema, table } = req.params;

  if (!pool) {
    return res.status(400).json({ message: "No se ha establecido una conexión con el servidor." });
  }

  try {
    await pool.query(`USE ${schema}`);
    const query = `DROP TABLE IF EXISTS \`${table}\``;
    await pool.query(query);

    res.json({ message: `Tabla ${table} eliminada exitosamente.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar la tabla.", error: err.message });
  }
});

// Elimina un schema
router.delete("/drop/:schema", async (req, res) => {
  const { schema } = req.params;

  if (!pool) {
    return res.status(400).json({ message: "No se ha establecido una conexión con el servidor." });
  }

  try {
    const schemaExistsQuery = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${schema}'`;
    const [rows] = await pool.query(schemaExistsQuery);

    if (rows.length === 0) {
      return res.status(404).json({ message: `El esquema ${schema} no existe.` });
    }

    const dropSchemaQuery = `DROP SCHEMA IF EXISTS \`${schema}\``;
    await pool.query(dropSchemaQuery);

    res.json({ message: `Esquema ${schema} eliminado exitosamente.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar el esquema.", error: err.message });
  }
});

// Crear un nuevo registro en una tabla específica
router.post("/add/:schema/:table", async (req, res) => {
  const { schema, table } = req.params;
  const data = req.body;

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return res.status(400).json({ message: "Datos inválidos para insertar." });
  }

  if (!pool) {
    return res.status(400).json({ message: "No se ha establecido una conexión con el servidor." });
  }

  try {
    const columns = Object.keys(data)
      .map((col) => `\`${col}\``)
      .join(", ");
    const values = Object.values(data)
      .map((val) => (typeof val === "string" ? `'${val}'` : val))
      .join(", ");
    const query = `INSERT INTO \`${schema}\`.\`${table}\` (${columns}) VALUES (${values})`;

    await pool.query(query);
    res.json({ message: "Registro agregado exitosamente." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al agregar el registro.", error: err.message });
  }
});

// Eliminar un registro específico en una tabla específica
router.delete("/drop/:schema/:table/:id", async (req, res) => {
  const { schema, table, id } = req.params;

  if (!pool) {
    return res.status(400).json({ message: "No se ha establecido una conexión con el servidor." });
  }

  try {
    const query = `DELETE FROM \`${schema}\`.\`${table}\` WHERE id = ?`;
    await pool.query(query, [id]);

    res.json({ message: "Registro eliminado exitosamente." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar el registro.", error: err.message });
  }
});

// Actualizar un registro específico en una tabla específica
router.put("/update/:schema/:table/:id", async (req, res) => {
  const { schema, table, id } = req.params;
  const data = req.body;

  // Depurar los datos recibidos
  console.log("Datos recibidos:", data);

  // Verificar que los datos sean válidos (no vacío)
  if (!data || typeof data !== "object" || Array.isArray(data) || Object.keys(data).length === 0) {
    return res.status(400).json({ message: "Datos inválidos o vacíos para actualizar." });
  }

  // Verificar si la conexión a la base de datos está disponible
  if (!pool) {
    return res.status(500).json({ message: "No se ha establecido una conexión con el servidor." });
  }

  try {
    // Generar las partes de la consulta de actualización solo si hay propiedades en el objeto 'data'
    const updates = Object.keys(data)
      .map((col) => `\`${col}\` = ?`)
      .join(", ");

    // Asegurar que el id es un valor válido
    const values = [...Object.values(data), id];

    // Verificar si se generaron campos para actualizar
    if (!updates) {
      return res.status(400).json({ message: "No hay campos para actualizar." });
    }

    // Crear la consulta SQL
    const query = `UPDATE \`${schema}\`.\`${table}\` SET ${updates} WHERE \`id\` = ?`;

    // Ejecutar la consulta
    const [result] = await pool.query(query, values);

    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró el registro para actualizar." });
    }

    res.json({ message: "Registro actualizado exitosamente." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar el registro.", error: err.message });
  }
});

// Obtener la estructura de una tabla para crear un formulario dinámico
router.get("/form/:schema/:table", async (req, res) => {
  const { schema, table } = req.params;

  if (!pool) {
    return res.status(400).json({ message: "No se ha establecido una conexión con el servidor." });
  }

  try {
    // Consulta para obtener la información de las columnas de la tabla
    const [columns] = await pool.query(
      `
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
      [schema, table]
    );

    // Formatear los datos para generar el formulario
    const formFields = columns.map((column) => ({
      name: column.COLUMN_NAME,
      type: column.DATA_TYPE,
      required: column.IS_NULLABLE === "NO" ? true : false,
    }));

    res.json({ formFields });
  } catch (error) {
    console.error("Error al obtener la estructura de la tabla:", error);
    res.status(500).json({
      message: "Error al obtener la estructura de la tabla.",
      error: error.message,
    });
  }
});
