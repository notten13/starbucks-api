import express from 'express';
import db, { Order, Payment } from './db';
import { generateETag } from './utils';

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

  const now = new Date();

  if (!amount) {
    res.status(400).send({
      error: 'Invalid drink',
    });

    res.end();
    return;
  }

  const payment: Payment = {
    id: paymentId,
    amount,
    status: 'PENDING',
    createdAt: now,
    updatedAt: now,
  };

  const order: Order = {
    id: orderId,
    drink: req.body.drink,
    status: 'PLACED',
    paymentId,
    createdAt: now,
    updatedAt: now,
  };

  db.data.orders.push(order);
  db.data.payments.push(payment);

  await db.write();

  // Status 201 Means "Created", it's much better than a simple 200 in this case
  res.status(201);

  // The "Location" header should indicate where the created resource is
  res.header('Location', `/orders/${orderId}`);

  // The "ETag" header can be used by clients in further requests to prevent conflicts
  res.header('ETag', generateETag(now));

  res.send({
    order: {
      drink: order.drink,
      status: order.status,
    },
    links: [
      {
        rel: 'payment',
        href: `/payments/${paymentId}`,
      },
    ],
  });
});

router.options('/:orderId', (req, res) => {
  const order = db.data.orders.find(
    (order) => order.id === Number(req.params.orderId)
  );

  if (!order) {
    res.status(404).send({
      error: 'Order not found',
    });

    res.end();
    return;
  }

  // We only allowing updating an order if the barista hasn't started making it yet
  const allowedMethods = order.status === 'PLACED' ? 'GET, PUT' : 'GET';

  res.header('Allow', allowedMethods);
  res.end();
});

router.get('/:orderId', (req, res) => {
  const order = db.data.orders.find(
    (order) => order.id === Number(req.params.orderId)
  );

  if (!order) {
    res.status(404).send({
      error: 'Order not found',
    });

    res.end();
    return;
  }

  // The "ETag" header can be used by clients in further requests to prevent conflicts
  res.header('ETag', generateETag(order.updatedAt));

  res.send({
    order: {
      drink: order.drink,
      status: order.status,
    },
    links: [
      {
        rel: 'self',
        href: `/orders/${order.id}`,
      },
      {
        rel: 'payment',
        href: `/payments/${order.paymentId}`,
      },
    ],
  });
});

export default router;
