export interface WarehouseStock {
  warehouseId: string;
  quantity: number;
  reserved: number;
  reorderPoint?: number;
}

export interface Product {
  id: string;
  tenantId: string;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  stockByWarehouse: WarehouseStock[];
  attributes: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SalesOrderLine {
  productId: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  warehouseId: string;
}

export interface SalesOrder {
  id: string;
  tenantId: string;
  orderNumber: string;
  customerId: string;
  status: 'draft' | 'confirmed' | 'fulfilled' | 'cancelled';
  lines: SalesOrderLine[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  displayName: string;
  roles: string[];
  active: boolean;
}
