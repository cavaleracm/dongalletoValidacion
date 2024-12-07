const dotenv = require("dotenv");
const { connection } = require("../config.db");

// Cargar las variables de entorno
dotenv.config();

// Función para validar existencia de galletas
const validarExistencia = (req, res) => {
    const { Receta_id, Cantidad, TipoVenta, PrecioPorUnidad, PesoPorUnidad } = req.body;

    // Validar campos obligatorios
    if (!Receta_id || !Cantidad || !TipoVenta) {
        return res.status(400).json({ error: "Datos incompletos o inválidos." });
    }

    // Convertir la cantidad a "sueltas" según el tipo de venta
    let cantidadEnSueltas;

    switch (TipoVenta.toLowerCase()) {
        case "precio":
            if (!PrecioPorUnidad || PrecioPorUnidad <= 0) {
                return res.status(400).json({ error: "Precio por unidad inválido." });
            }
            cantidadEnSueltas = Math.floor(Cantidad / PrecioPorUnidad); // Redondear hacia abajo
            break;

        case "gramo":
            if (!PesoPorUnidad || PesoPorUnidad <= 0) {
                return res.status(400).json({ error: "Peso por unidad inválido." });
            }
            cantidadEnSueltas = Math.floor(Cantidad / PesoPorUnidad); // Redondear hacia abajo
            break;

        case "sueltas":
            cantidadEnSueltas = Cantidad;
            break;

        default:
            return res.status(400).json({ error: "Tipo de venta inválido." });
    }

    // Consultar la cantidad disponible en el inventario
    connection.query(
        "SELECT cantidad_disponible FROM inventario WHERE producto_id = ?",
        [Receta_id],
        (error, results) => {
            if (error) {
                console.error("Error al consultar el inventario:", error);
                return res.status(500).json({ error: "Error al consultar el inventario." });
            }

            // Verificar si el producto existe
            if (results.length === 0) {
                return res.status(404).json({ error: "Producto no encontrado." });
            }

            const cantidadDisponible = results[0].cantidad_disponible;

            // Comparar cantidad solicitada con la disponible
            if (cantidadEnSueltas <= cantidadDisponible) {
                res.status(200).json({ message: "Suficiente inventario disponible." });
            } else {
                res.status(500).json({
                    error: "Inventario insuficiente.",
                    cantidadSolicitada: cantidadEnSueltas,
                    cantidadDisponible,
                });
            }
        }
    );
};

// Exportar como función serverless
module.exports = (req, res) => {
    // Configurar los encabezados CORS
    res.setHeader("Access-Control-Allow-Origin", "*"); // Permitir todos los orígenes
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS"); // Métodos permitidos
    res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Encabezados permitidos

    // Verificar el método de la solicitud
    if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
    }

    if (req.method === "POST") {
        validarExistencia(req, res); // Llamar a la función de validación
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
};
