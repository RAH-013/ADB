-- Query pesada
SELECT e.id,e.nombre,e.puesto,e.fecha_contratacion,e.salario,
            DATEDIFF(CURRENT_DATE, e.fecha_contratacion) AS dias_trabajados,
    CASE
    WHEN e.salario > 40000 THEN 'Alto'
        WHEN e.salario BETWEEN 30000 AND 40000 THEN 'Medio'
 ELSE 'Bajo'END AS rango_salario,
    AVG(e.salario) OVER (PARTITION BY e.puesto) AS salario_promedio_puesto,
    (SELECT COUNT(*) 
FROM empresa.empleados WHERE puesto = e.puesto AND salario > e.salario) AS empleados_con_salario_mayor,
    (SELECT COUNT(*) FROM empresa.empleados 
     WHERE puesto = e.puesto) AS total_empleados_puesto,CONCAT(e.nombre, ' - ', e.puesto) AS nombre_completo_puesto
FROM empresa.empleados e WHERE e.salario > 30000ORDER BY e.salario DESC, e.nombre ASC;