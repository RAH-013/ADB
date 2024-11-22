import { Router } from "express";
import { createPool } from "mysql2/promise";

export const router = Router();

let pool = null;

// 1. Conexión y Autenticación
router.post("/auth", async (req, res) => {
  const { host, port, user, password } = req.body;

  if (!host || !port || !user || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios." });
  }

  try {
    pool = createPool({
      host,
      port: parseInt(port, 10),
      user,
      password,
      database: "information_schema", // Conectamos directamente a information_schema
    });

    await pool.query("SELECT 1"); // Verificamos si la conexión es exitosa
    res.json({ message: "Conexión establecida exitosamente." });
  } catch (err) {
    console.error("Error al conectar:", err);
    res.status(500).json({ message: "No se pudo establecer la conexión con la base de datos." });
  }
});

// 2. Selección de Base de Datos y Tabla Activa
router.get("/schemas", async (req, res) => {
  if (!pool) {
    return res.status(400).json({ message: "No se ha establecido una conexión con el servidor." });
  }

  try {
    const [schemasRows] = await pool.query("SHOW DATABASES");
    const schemas = schemasRows
      .map((row) => row.Database)
      .filter((schema) => !["information_schema", "mysql", "performance_schema", "sys"].includes(schema));
    res.json({ schemas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener los schemas del servidor." });
  }
});

// 3. Visualización y Navegación de Datos
router.get("/tables/:schema", async (req, res) => {
  const { schema } = req.params;
  if (!pool) {
    return res.status(400).json({ message: "No se ha establecido una conexión con el servidor." });
  }

  try {
    await pool.query(`USE ${schema}`);
    const [tablesRows] = await pool.query("SHOW TABLES");
    const tables = tablesRows.map((row) => Object.values(row)[0]); // Extraemos los nombres de las tablas
    res.json({ tables });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error al obtener las tablas de ${schema}.` });
  }
});

// 4. Consultas Personalizadas
router.post("/query", async (req, res) => {
  const { query } = req.body;
  if (!pool) {
    return res.status(400).json({ message: "No se ha establecido una conexión con el servidor." });
  }

  try {
    const [results] = await pool.query(query);
    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al ejecutar la consulta." });
  }
});

// 5. Operaciones CRUD: Agregar un nuevo registro
router.post("/insert/:schema/:table", async (req, res) => {
  const { schema, table } = req.params;
  const data = req.body; // Suponemos que el cuerpo contiene los valores del nuevo registro

  if (!pool) {
    return res.status(400).json({ message: "No se ha establecido una conexión con el servidor." });
  }

  try {
    await pool.query(`USE ${schema}`);
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data)
      .map((value) => `'${value}'`)
      .join(", ");
    const query = `INSERT INTO ${table} (${columns}) VALUES (${values})`;

    await pool.query(query);
    res.json({ message: "Registro insertado exitosamente." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al insertar el registro." });
  }
});

// 6. Modificar un registro existente
router.put("/update/:schema/:table/:id", async (req, res) => {
  const { schema, table, id } = req.params;
  const data = req.body;

  if (!pool) {
    return res.status(400).json({ message: "No se ha establecido una conexión con el servidor." });
  }

  try {
    await pool.query(`USE ${schema}`);
    const setClause = Object.keys(data)
      .map((key) => `${key}='${data[key]}'`)
      .join(", ");
    const query = `UPDATE ${table} SET ${setClause} WHERE id=${id}`;

    await pool.query(query);
    res.json({ message: "Registro actualizado exitosamente." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar el registro." });
  }
});

// 7. Borrar un registro
router.delete("/delete/:schema/:table/:id", async (req, res) => {
  const { schema, table, id } = req.params;

  if (!pool) {
    return res.status(400).json({ message: "No se ha establecido una conexión con el servidor." });
  }

  try {
    await pool.query(`USE ${schema}`);
    const query = `DELETE FROM ${table} WHERE id=${id}`;

    await pool.query(query);
    res.json({ message: "Registro eliminado exitosamente." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar el registro." });
  }
});

// 8. Cierre de sesión
router.post("/logout", async (req, res) => {
  pool = null;
  res.json({ message: "Sesión cerrada." });
});
