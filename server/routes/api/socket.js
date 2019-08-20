const express = require('express');
const mongoose = require('mongoose');
const Orders = mongoose.model('Orders');
const jwt = require('jsonwebtoken');

const socket = express();
var http = require('http').createServer(socket);
var io = require('socket.io')(http);

const OrdersStream = Orders.watch();

OrdersStream.on('change', (change) => {
  if(change.operationType == "insert"){
    io.to(change.fullDocument.catering_id).emit('newOrder', change.fullDocument);
  } else if(change.operationType == "replace"){
    io.to(change.fullDocument.catering_id).emit('orderUpdate', change.fullDocument);
  }
});

io.on('connection', function(socket){
  socket.on('introduce', (token) => {
    socket.join(jwt.verify(token, "secret").id);
  });
});

http.listen(3000, () => {console.log('Socket.io running on http://localhost:3000/')});