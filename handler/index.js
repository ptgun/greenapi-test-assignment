#!/usr/bin/env node
var amqp = require('amqplib/callback_api');

const store = require('../store.json')

amqp.connect('amqp://localhost', function (err, connection) {
    if (err) {
        throw err;
    }
    const channel = connection.createChannel(function (err, channel) {
        if (err) {
            throw err;
        }
        return channel
    });

    channel.assertQueue('incoming_orders_durable', {
        durable: true
    });

    channel.consume('incoming_orders_durable', function (msg) {
        handleOrder(msg, channel)
    }, {
        noAck: true
    });

});

function handleOrder(msg, channel) {
    const order = JSON.parse(msg.content.toString());
    console.log({ order });
    channel.assertQueue(order.orderId, {
        durable: true
    });
    const orderKeys = Object.keys(order.demand)
    for (let i = 0; i < orderKeys.length; i += 1) {
        if (Object.keys(store).indexOf(orderKeys[i]) == -1) {
            channel.sendToQueue(order.orderId, Buffer.from(orderKeys[i] + " - not in store"));
            return
        }
        if (isNaN(order.demand[orderKeys[i]])) {
            channel.sendToQueue(order.orderId, Buffer.from("amount of " + orderKeys[i] + " - wrong"));
            return
        }
        if (order.demand[orderKeys[i]] > store[orderKeys[i]]) {
            channel.sendToQueue(order.orderId, Buffer.from("amount of " + orderKeys[i] + " - exceeds current supply"));
            return
        }
    }
    channel.sendToQueue(order.orderId, Buffer.from("all good, you can order"));
    
}

