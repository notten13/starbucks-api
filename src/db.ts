import { JSONFileSyncPreset } from 'lowdb/node';

export type Order = {
  id: number;
  drink: string;
  status: 'PLACED' | 'PREPARING' | 'READY' | 'RELEASED';
};

export type Payment = {
  id: number;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED' | 'REFUNDED';
};

export type Data = {
  orders: Order[];
  payments: Payment[];
};

const db = JSONFileSyncPreset<Data>('db.json', { orders: [], payments: [] });

export default db;
