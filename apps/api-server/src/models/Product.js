import mongoose from 'mongoose';

const warehouseStockSchema = new mongoose.Schema(
  {
    warehouseId: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    reserved: { type: Number, required: true, min: 0, default: 0 },
    reorderPoint: { type: Number, min: 0, default: 0 },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    tenant_id: { type: String, required: true, index: true, trim: true },
    sku: { type: String, required: true, trim: true, uppercase: true },
    barcode: { type: String, trim: true, sparse: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD', uppercase: true },
    stockByWarehouse: { type: [warehouseStockSchema], default: [] },
    attributes: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, versionKey: false },
);

productSchema.index({ tenant_id: 1, sku: 1 }, { unique: true });
productSchema.index({ tenant_id: 1, barcode: 1 }, { unique: true, sparse: true });

export default mongoose.models.Product ?? mongoose.model('Product', productSchema);
