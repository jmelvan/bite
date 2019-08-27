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
    Orders.find({catering_id: jwt.verify(token, "secret").id}, {'catering_id': 0, 'renter_id': 0, '__v': 0}, {sort: {'time': 1}}, (err, data) => {
      io.to(jwt.verify(token, "secret").id).emit('initialize', data);
    });
    socket.on('updateStatus', (data) => {
      Orders.findOneAndUpdate({catering_id: jwt.verify(data.token, "secret").id, _id: data._id}, {status: data.status}, (err, data) => {
        io.to(jwt.verify(data.token, "secret").id).emit('updateStatusSuccess', data);
      });
    })
  });
});

http.listen(3000, () => {console.log('Socket.io running on http://localhost:3000/')});