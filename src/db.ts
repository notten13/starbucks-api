import { JSONFileSyncPreset } from 'lowdb/node';

export type Order = {
  id: number;
  drink: string;
  status: 'PLACED' | 'PREPARING' | 'READY' | 'RELEASED';
  paymentId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Payment = {
  id: number;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED' | 'REFUNDED';
  createdAt: Date;
  updatedAt: Date;
};

export type Data = {
  orders: Order[];
  payments: Payment[];
};

const db = JSONFileSyncPreset<Data>('db.json', { orders: [], payments: [] });

export default db;
