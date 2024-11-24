import { Router } from "express";
import { createPool } from "mysql2/promise";

export const router = Router();

let pool = null;

router.get("/logout", (req, res) => {
  if (pool) {
    pool.end();
    pool = null;
    res.status(200).send("Conexión cerrada correctamente.");
  } else {
    res.status(400).send("No hay conexión activa.");
  }
});

// 1. Conexión y Autenticación
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
    });

    const result = await pool.query("SELECT 1");

    if (result) {
      return res.json({ message: "Conexión establecida exitosamente." });
    }
  } catch (err) {
    return res.status(500).json({ message: "No se pudo establecer la conexión con la base de datos.", error: err.message });
  }
});

// 2. Selección de Base de Datos y Tabla Activa
router.get("/schemas", async (req, res) => {
  if (pool === null) {
    return res.status(400).json({ message: "No se ha establecido una conexión con el servidor." });
  }

  try {
    const [schemasRows] = await pool.query("SHOW DATABASES");
    const databases = schemasRows
      .map((row) => row.Database)
      .filter((schema) => !["information_schema", "mysql", "performance_schema", "sys"].includes(schema));

    const schemas = [];

    for (const database of databases) {
      await pool.query(`USE ${database}`);

      const [tablesRows] = await pool.query("SHOW FULL TABLES WHERE Table_Type = 'BASE TABLE'");
      const tables = tablesRows.map((row) => Object.values(row)[0]); // Obtener nombres de las tablas

      const [viewsRows] = await pool.query("SHOW FULL TABLES WHERE Table_Type = 'VIEW'");
      const views = viewsRows.map((row) => Object.values(row)[0]); // Obtener nombres de las vistas

      schemas.push({
        database,
        tables,
        views,
      });
    }

    res.json(schemas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener los schemas del servidor.", error: err.message });
  }
});

// 3. Visualización y Navegación de Datos
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

//diego
