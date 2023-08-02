#!/usr/bin/env node
const amqp = require('amqplib/callback_api');
const path = require('path');
var bodyParser = require('body-parser')
const express = require('express');
const app = express();
app.use(bodyParser.json());
const port = 3000;

amqp.connect('amqp://localhost', function (connectionError, connection) {
  if (connectionError) throw connectionError;
  initServer(connection)
});

async function initServer(connection) {
  const channel = connection.createChannel(function (err, channel) {
    if (err) {
      throw err;
    }
    return channel
  });

  channel.assertQueue('incoming_orders_durable', {
    durable: true
  });

  app.get('/store', function(req, res) {
    res.sendFile(path.join(__dirname, '../store.json'));
  });

  app.post('/order', (req, res) => {
    var orderId = 'order_' + Date.now();
    channel.sendToQueue('incoming_orders_durable', Buffer.from(JSON.stringify({orderId, demand: req.body})));

    channel.assertQueue(orderId, {
      durable: true
    });

    let data = channel.get(orderId, { noAck: true }, (err, msg) => {
      if (err) throw err;
      res.send(msg.content.toString());
    });
    
  })

  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  });

}


