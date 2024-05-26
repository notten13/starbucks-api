import express from 'express';
import db, { Order, Payment } from './db';

const router = express.Router();

const drinkPrices = {
  latte: 3.5,
  cappuccino: 3,
  espresso: 2.5,
};

router.post('/', async (req, res) => {
  const orderId = db.data.orders.length + 1;
  const paymentId = db.data.payments.length + 1;

  const amount = drinkPrices[req.body.drink];

  if (!amount) {
    res.status(400).send({
      error: 'Invalid drink',
    });

    res.end();
    return;
  }

  const order: Order = {
    id: orderId,
    drink: req.body.drink,
    status: 'PLACED',
  };

  const payment: Payment = {
    id: paymentId,
    amount,
    status: 'PENDING',
  };

  db.data.orders.push(order);
  db.data.payments.push(payment);

  await db.write();

  // Status 201 Means "Created", it's much better than a simple 200 in this case
  res.status(201);

  // The "Location" header should indicate where the created resource is
  res.header('Location', `/orders/${orderId}`);

  // We don't need to include the internal order ID in the response body
  const { id, ...orderWithoutId } = order;

  res.send({
    order: orderWithoutId,
    links: [
      {
        rel: 'payment',
        href: `/payments/${paymentId}`,
      },
    ],
  });
});

export default router;
