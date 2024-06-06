
import { PrismaClient, Order, Category, Product, CartItem } from "@prisma/client";
import fastify from "fastify";

const app = fastify();

const prisma = new PrismaClient();

app.get('/orders', async () => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        cart: {
          include: {
            product: true,
          },
        },
      },
    });
    return { orders };
  } catch (error) {
    throw new Error('Failed to fetch orders');
  }
});

app.post<{ Body: Order }>('/orders', async (request, reply) => {
  const orderData = request.body;

  try {
    const createdOrder = await prisma.order.create({
      data: {
        total: orderData.total,
        status: orderData.status,
        observations: orderData.observations,
        cart: {
          createMany: {
            data: orderData.cart.map((cartItem: CartItem) => ({
              productId: cartItem.productId,
              quantity: cartItem.quantity,
            })),
          },
        },
      },
      include: {
        cart: true,
      },
    });

    return reply.status(201).send(createdOrder);
  } catch (error) {
    console.error(error);
    return reply.status(500).send('Failed to create order');
  }
});

app.post<{ Body: Category }>('/categories', async (request, reply) => {
  const categoryData = request.body;

  try {
    const createdCategory = await prisma.category.create({
      data: categoryData,
    });

    return reply.status(201).send(createdCategory);
  } catch (error) {
    return reply.status(500).send('Failed to create category');
  }
});

app.post<{ Body: Product }>('/products', async (request, reply) => {
  const productData = request.body;

  try {
    const createdProduct = await prisma.product.create({
      data: productData,
    });

    return reply.status(201).send(createdProduct);
  } catch (error) {
    return reply.status(500).send('Failed to create product');
  }
});

app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
  console.log('HTTP Server Running 🔥');
});