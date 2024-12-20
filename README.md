﻿#donGalletoValidacion
Documentación del Módulo de Validación de Galletas

Este módulo de Node.js y Express.js está diseñado para realizar validaciones y conversiones del tipo de venta de galletas, garantizando que la cantidad solicitada esté disponible en el inventario antes de realizar una venta. Dependiendo del tipo de venta, convierte las cantidades proporcionadas en "sueltas" y calcula la cantidad exacta de galletas que se pueden vender.
Dependencias
•	express: Framework web para Node.js, utilizado para gestionar las rutas y solicitudes HTTP.
•	dotenv: Carga las variables de entorno desde un archivo .env.
•	mysql: Cliente para interactuar con bases de datos MySQL.
Variables de Entorno
Este módulo utiliza variables de entorno cargadas mediante dotenv.config(), lo que permite configurar aspectos como la conexión a la base de datos y otras configuraciones sensibles fuera del código fuente.
Conexión a la Base de Datos
La conexión con la base de datos se realiza a través de un módulo de configuración (config.db) que exporta la conexión connection. Esto garantiza que las consultas a la base de datos se realicen correctamente, utilizando las credenciales y parámetros definidos en las variables de entorno.
Rutas
1. Validar Existencia de Galletas en Inventario
•	Ruta: /api/validarExistencia
•	Método: POST
•	Descripción: Esta ruta recibe la información de una venta (tipo de venta, cantidad, y parámetros específicos según el tipo de venta) y valida si hay suficiente inventario disponible en la base de datos. La cantidad vendida se convierte a unidades "sueltas" y se regresa como parte de la respuesta.
•	Ejemplo de cuerpo de la solicitud:
Tipo de venta: Por precio
{
  "Receta_id": 1,
  "Cantidad": 100,
  "TipoVenta": "precio",
  "PrecioPorUnidad": 25
}
Tipo de venta: Por precio
 {
  "Receta_id": 1,
  "Cantidad": 100,
  "TipoVenta": "precio",
  "PrecioPorUnidad": 25
}
Tipo de venta: Por gramo
{
  "Receta_id": 1,
  "Cantidad": 100,
  "TipoVenta": "gramo",
  "PesoPorUnidad": 25
}
Tipo de venta: Sueltas
{
  "Receta_id": 1,
  "Cantidad": 10,
  "TipoVenta": "sueltas"
}
Mensaje de cantidad insuficiente: Ingreso:
{
  "Receta_id": 1,
  "Cantidad": 9999999,
  "TipoVenta": "precio",
  "PrecioPorUnidad": 25
}
Salida:
 {
  "error": "Inventario insuficiente.",
  "cantidadSolicitada": 399999,
  "cantidadDisponible": 750
}

Notas Importantes
•	Los valores enviados en las solicitudes deben estar correctamente formateados, de lo contrario se generarán errores de validación (ej. valores negativos o nulos en parámetros como PrecioPorUnidad o PesoPorUnidad).
•	La conversión de la cantidad a "sueltas" depende del tipo de venta:
o	Por precio: Se calcula dividiendo la cantidad entre el precio por unidad.
o	Por gramo: Se calcula dividiendo la cantidad entre el peso por unidad.
o	Sueltas: No requiere conversión, la cantidad es directamente la cantidad de unidades vendidas.
•	En caso de que el inventario no sea suficiente para satisfacer la solicitud, la respuesta incluirá tanto la cantidad solicitada como la cantidad disponible.
•	Posibles fallos en la API: En ocasiones, el servidor puede estar inactivo temporalmente o haber problemas de red, lo que puede generar fallos en las respuestas. Si ocurre un fallo, solo es necesario realizar la solicitud nuevamente.

