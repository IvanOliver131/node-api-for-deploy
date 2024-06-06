import { Order, Category, Product, CartItem, PrismaClient } from "@prisma/client";
import fastify from "fastify";
import cors from '@fastify/cors'

const app = fastify();
const prisma = new PrismaClient();


app.register(cors, {
  origin: true
})

// Listar todos os pedidos
app.get('/orders', async (request, reply) => {
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
    console.error('Failed to fetch orders:', error);
    return reply.status(500).send('Failed to fetch orders');
  }
});

// Listar todos os produtos
app.get('/products', async (request, reply) => {
  try {
    const products = await prisma.product.findMany();
    return { products };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return reply.status(500).send('Failed to fetch products');
  }
});

// Listar produto por ID
app.get('/products/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product) {
      return reply.status(404).send('Product not found');
    }
    return { product };
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return reply.status(500).send('Failed to fetch product');
  }
});

// Listar todas as categorias
app.get('/categories', async (request, reply) => {
  try {
    const categories = await prisma.category.findMany();
    return { categories };
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return reply.status(500).send('Failed to fetch categories');
  }
});

// Listar categoria por ID
app.get('/categories/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (!category) {
      return reply.status(404).send('Category not found');
    }
    return { category };
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return reply.status(500).send('Failed to fetch category');
  }
});

// Criar novo pedido
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
    console.error('Failed to create order:', error);
    return reply.status(500).send('Failed to create order');
  }
});

// Criar nova categoria
app.post<{ Body: Category }>('/categories', async (request, reply) => {
  const categoryData = request.body;

  try {
    const createdCategory = await prisma.category.create({
      data: categoryData,
    });

    return reply.status(201).send(createdCategory);
  } catch (error) {
    console.error('Failed to create category:', error);
    return reply.status(500).send('Failed to create category');
  }
});

// Criar novo produto
app.post<{ Body: Product }>('/products', async (request, reply) => {
  const productData = request.body;

  try {
    const createdProduct = await prisma.product.create({
      data: productData,
    });

    return reply.status(201).send(createdProduct);
  } catch (error) {
    console.error('Failed to create product:', error);
    return reply.status(500).send('Failed to create product');
  }
});

// Deletar produto por ID
app.delete('/products/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  try {
    await prisma.product.delete({
      where: { id: Number(id) },
    });
    return reply.status(204).send();
  } catch (error) {
    console.error('Failed to delete product:', error);
    return reply.status(500).send('Failed to delete product');
  }
});

// Deletar categoria por ID
app.delete('/categories/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  try {
    await prisma.category.delete({
      where: { id: Number(id) },
    });
    return reply.status(204).send();
  } catch (error) {
    console.error('Failed to delete category:', error);
    return reply.status(500).send('Failed to delete category');
  }
});

app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
  console.log('HTTP Server Running 🔥');
}).catch(err => {
  console.error('Failed to start server:', err);
});
