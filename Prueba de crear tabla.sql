-- Crea un esquema
CREATE SCHEMA empresa;

-- Crea una tabla
CREATE TABLE empresa.empleados (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  puesto VARCHAR(50) NOT NULL,
  fecha_contratacion DATE NOT NULL,
  salario DECIMAL(10, 2) NOT NULL
);

-- Crea datos
INSERT INTO
  empresa.empleados (nombre, puesto, fecha_contratacion, salario)
VALUES
  ('Carlos Lopez', 'Gerente', '2020-03-15', 45000.00),
  (
    'Maria Fernandez',
    'Analista',
    '2021-05-10',
    30000.00
  ),
  (
    'Juan Perez',
    'Programador',
    '2022-01-20',
    35000.00
  ),
  ('Ana Gomez', 'Disenadora', '2021-11-05', 32000.00),
  (
    'Luis Torres',
    'Desarrollador Web',
    '2019-08-01',
    37000.00
  ),
  (
    'Elena Morales',
    'Administrador',
    '2018-12-12',
    40000.00
  ),
  (
    'Pedro Castillo',
    'Soporte Tecnico',
    '2020-07-07',
    28000.00
  ),
  (
    'Sofia Ramirez',
    'Especialista en Marketing',
    '2022-04-25',
    34000.00
  ),
  (
    'Juan Martinez',
    'Analista de Datos',
    '2021-03-17',
    36000.00
  ),
  (
    'Lucia Sanchez',
    'Contadora',
    '2019-09-09',
    38000.00
  );