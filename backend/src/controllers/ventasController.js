import { getConnection } from "../config/db.js";

export const registrarVenta = async (req, res) => {
  const { ClienteID, productos } = req.body;
  try {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    // 1️⃣ Crear la venta
    const ventaRequest = new sql.Request(transaction);
    const resultVenta = await ventaRequest
      .input("ClienteID", sql.Int, ClienteID)
      .input("Fecha", sql.DateTime, new Date())
      .input("Total", sql.Decimal(10, 2), 0)
      .query(
        "INSERT INTO Ventas (ClienteID, Fecha, Total) OUTPUT INSERTED.VentaID VALUES (@ClienteID, @Fecha, @Total)"
      );

    const VentaID = resultVenta.recordset[0].VentaID;
    let total = 0;

    // 2️⃣ Insertar los productos vendidos en DetalleVenta
    for (const p of productos) {
      const detalleRequest = new sql.Request(transaction);
      const subtotal = p.PrecioUnitario * p.Cantidad;
      total += subtotal;

      await detalleRequest
        .input("VentaID", sql.Int, VentaID)
        .input("ProductoID", sql.Int, p.ProductoID)
        .input("Cantidad", sql.Int, p.Cantidad)
        .input("PrecioUnitario", sql.Decimal(10, 2), p.PrecioUnitario)
        .input("Subtotal", sql.Decimal(10, 2), subtotal)
        .query(
          `INSERT INTO DetalleVenta (VentaID, ProductoID, Cantidad, PrecioUnitario, Subtotal)
           VALUES (@VentaID, @ProductoID, @Cantidad, @PrecioUnitario, @Subtotal)`
        );
    }

    // 3️⃣ Actualizar el total de la venta
    const totalRequest = new sql.Request(transaction);
    await totalRequest
      .input("VentaID", sql.Int, VentaID)
      .input("Total", sql.Decimal(10, 2), total)
      .query("UPDATE Ventas SET Total = @Total WHERE VentaID = @VentaID");

    await transaction.commit();
    res.json({ message: "✅ Venta registrada correctamente", VentaID, total });
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error al registrar la venta");
  }
};
