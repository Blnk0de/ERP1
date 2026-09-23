import mongoose from 'mongoose';

const salesOrderLineSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    warehouseId: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const salesOrderSchema = new mongoose.Schema(
  {
    tenant_id: { type: String, required: true, index: true, trim: true },
    orderNumber: { type: String, required: true, trim: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: ['draft', 'confirmed', 'fulfilled', 'cancelled'],
      default: 'draft',
      index: true,
    },
    lines: { type: [salesOrderLineSchema], required: true, validate: (value) => value.length > 0 },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD', uppercase: true },
  },
  { timestamps: true, versionKey: false },
);

salesOrderSchema.index({ tenant_id: 1, orderNumber: 1 }, { unique: true });

salesOrderSchema.statics.createInTransaction = async function createInTransaction(order, operation) {
  const session = await this.db.startSession();

  try {
    let createdOrder;
    await session.withTransaction(async () => {
      [createdOrder] = await this.create([{ ...order }], { session });
      if (operation) {
        await operation({ order: createdOrder, session });
      }
    });
    return createdOrder;
  } finally {
    await session.endSession();
  }
};

export default mongoose.models.SalesOrder ?? mongoose.model('SalesOrder', salesOrderSchema);
