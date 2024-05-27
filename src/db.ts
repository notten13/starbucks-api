import { JSONFileSyncPreset } from 'lowdb/node';

export type Order = {
  id: number;
  drink: string;
  additions: string[];
  status: 'PLACED' | 'PREPARING' | 'READY' | 'RELEASED';
  paymentId: number;
  ETag: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Payment = {
  id: number;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED' | 'REFUNDED';
  ETag: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Data = {
  orders: Order[];
  payments: Payment[];
};

const db = JSONFileSyncPreset<Data>('db.json', { orders: [], payments: [] });

export default db;
