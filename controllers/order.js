const Order = require("../models/Order");
const OrderHistory = require("../models/OrderHistory");
const User = require("../models/User");
const Deliver = require("../models/Deliver");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const io = require("../utils/socket");

// @desc    Get Orders
// @route   GET /api/v1/orders
// @access  Private
exports.getOrders = asyncHandler(async (req, res, next) => {
  try {
    const order = await Order.find();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Get Orders for Deliver
// @route   GET /api/v1/delivers/:deliverId/orders
// @access  Private
exports.getOrdersForDeliver = asyncHandler(async (req, res, next) => {
  try {
    const orders = await Order.find({ deliver: req.params.id });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Get Order
// @route   POST /api/v1/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(
        new ErrorResponse(`No user with the id of ${req.params.userId}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Add order
// @route   POST /api/v1/user/:userId/order
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  try {
    req.body.user = req.params.userId;

    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(
        new ErrorResponse(`No user with the id of ${req.params.userId}`, 404)
      );
    }

    const order = await Order.create(req.body);
    io.getIO().emit("order", {
      action: "create",
      data: order,
    });
    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Update order position
// @route   PUT /api/v1/orders/:id
// @access  Private
exports.updateOrderPosition = asyncHandler(async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return next(
        new ErrorResponse(`No order with the id of ${req.params.userId}`, 404)
      );
    }

    if (req.body.position === "success") {
      const orderHistory = await new OrderHistory({
        user: order.user,
        products: order.products,
        allPrice: order.allPrice,
        address: order.address,
        restaurantName: order.restaurantName,
        position: order.position,
        deliver: order.deliver,
        createdAt: order.createdAt,
      });
      orderHistory.save();

      const deliver = await Deliver.findByIdAndUpdate(
        order.deliver,
        {
          isBusy: false,
        },
        {
          new: true,
        }
      );

      if (deliver.atWork) {
        io.getIO().emit("deliverisbusy", {
          action: "updated",
          data: deliver,
        });
      }

      await order.remove();

      res.status(200).json({
        success: true,
        data: {},
      });
    } else {
      let position = order.position;
      position = position.push(req.body.position);
      req.body.position = position;
      await order.save();

      io.getIO().emit("position", {
        action: "updated",
        data: order,
      });

      res.status(200).json({
        sucess: true,
        data: order,
      });
    }
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Order to Deliver
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private
exports.orderToDeliver = asyncHandler(async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return next(
        new ErrorResponse(`No order with the id of ${req.params.id}`, 404)
      );
    }

    order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Update Deliver Position
    const deliverId = req.body.deliver;
    let deliver = await Deliver.findById(deliverId);

    if (!deliver) {
      return next(
        new ErrorResponse(`No deliver with the id of ${deliverId}`, 404)
      );
    }

    if (!deliver.atWork) {
      return next(new ErrorResponse(`Deliver does not work!`, 400));
    }

    deliver.isBusy = true;
    deliver.save();

    // Send Ios
    io.getIO().emit("deliverorders", {
      action: "updated",
      data: order,
    });

    io.getIO().emit("deliverisbusy", {
      action: "updated",
      data: deliver,
    });

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Delete order
// @route   PUT /api/v1/orders/:id
// @access  Private
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(
        new ErrorResponse(`No order with the id of ${req.params.id}`, 404)
      );
    }

    order.remove();

    io.getIO().emit("order", {
      action: "delete",
      data: req.params.id,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});
