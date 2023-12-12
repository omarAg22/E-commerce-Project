const Order = require('../models/ordersModel');

const createOrder = async (req, res) => {
  try {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({
        ...x,
        product: x.product,
      })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      customer: req.customer.customerId,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.customer.customerId });
    res.send(orders);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const payOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Adjust the limit as needed
    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      Order.find()
        .populate({
          path: 'customer',
          select: 'first_name last_name',
        })
        .limit(limit)
        .skip(skip)
        .exec(),
      Order.countDocuments(), // Get the total count
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    res.json({ orders, totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deliverOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).send({ message: 'Order Not Found' });
    }

    order.isDelivred = true;
    order.delivredAt = Date.now();
    await order.save();

    res.send({
      message: 'Order Delivered',
      order: {
        _id: order._id,
        customer: order.customer,
        createdAt: order.createdAt,
        totalPrice: order.totalPrice,
        isPaid: order.isPaid,
        paidAt: order.paidAt,
        isDelivred: order.isDelivred,
        delivredAt: order.delivredAt, // Include the deliveredAt property
      },
    });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};



module.exports = {
  createOrder,
  getOrder,
  payOrder,
  myOrders,
  getOrders,
  deliverOrder,
};
