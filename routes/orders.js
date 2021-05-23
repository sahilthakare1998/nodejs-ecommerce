const {Order} = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const orderList = await Order.find().populate('user', 'name').populate({path: 'orderItems' , populate : {path: 'product' ,populate:'category'}});

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
})

router.post(`/`, async (req, res) =>{
    // if(!mongoose.isValidObjectId(req.body.category)) {
    //     return res.status(400).send('Invalid Product category')
    //  }
    // const category = await Category.findById(req.body.category);
    // if(!category) return res.status(400).send('Invalid Category')

    const orderItemsIdsResolved =   await Promise.all( req.body.orderItems.map(async(item)=> {
        const OrderItems = new OrderItem({
         quantity:item.quantity,
         product: item.product  
        })

        newOrderItem = await OrderItems.save(); 
        return newOrderItem._id 
    })
    )
    console.log('array',orderItemsIdsResolved)
    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        // totalPrice: totalPrice,
        user: req.body.user,
    })

    order = await order.save();

    if(!order) 
    return res.status(500).send('The order cannot be created')

    res.send(order);
})


module.exports =router;