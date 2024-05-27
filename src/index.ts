import express from 'express';

import ordersRouter from './orders';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (_, res) => {
  res.send({
    links: [
      {
        rel: 'orders',
        href: '/orders',
      },
      {
        rel: 'payments',
        href: '/payments',
      },
    ],
  });
});

app.use('/orders', ordersRouter);

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
