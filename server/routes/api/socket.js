const express = require('express');
const mongoose = require('mongoose');
const Orders = mongoose.model('Orders');
const Users = mongoose.model('Users');
const jwt = require('jsonwebtoken');

const socket = express();
var http = require('http').createServer(socket);
var io = require('socket.io')(http);

const OrdersStream = Orders.watch();

OrdersStream.on('change', (change) => {
  console.log(change.operationType);
  if(change.operationType == "insert"){
    Orders.find({catering_id: change.fullDocument.catering_id}, {'catering_id': 0, 'renter_id': 0, '__v': 0}, {sort: {'time': -1}}, (err, orders) => {
      Users.find({catering_id: change.fullDocument.catering_id, role: "deliverer"}, {}, {sort: {username: 1}}, (err, deliverers) => {
        //io.to(change.fullDocument.catering_id).emit('newOrder', change.fullDocument);
        io.to(change.fullDocument.catering_id).emit('newOrder', {orders: orders, deliverers: deliverers});
      });
    });
  } else if(change.operationType == "replace" || change.operationType == "update"){
    Orders.findOne({_id: change.documentKey}, (err, data) => {
      Orders.find({catering_id: data.catering_id}, {'catering_id': 0, 'renter_id': 0, '__v': 0}, {sort: {'time': -1}}, (err, orders) => {
        Users.find({catering_id: data.catering_id, role: "deliverer"}, {}, {sort: {username: 1}}, (err, deliverers) => {
          //io.to(change.fullDocument.catering_id).emit('orderUpdate', change.fullDocument);
          io.to(data.catering_id).emit('orderUpdate', {orders: orders, deliverers: deliverers});
        });
      });
    });
  }
});

io.on('connection', function(socket){
  socket.on('introduce', (token) => {
    socket.join(jwt.verify(token, "secret").id);
    Orders.find({catering_id: jwt.verify(token, "secret").id}, {'catering_id': 0, 'renter_id': 0, '__v': 0}, {sort: {'time': -1}}, (err, orders) => {
      Users.find({catering_id: jwt.verify(token, "secret").id, role: "deliverer"}, {}, {sort: {username: 1}}, (err, deliverers) => {
        io.to(jwt.verify(token, "secret").id).emit('initialize', {orders: orders, deliverers: deliverers});
      });
    });
    socket.on('updateStatus', (data) => {
      Orders.findOneAndUpdate({catering_id: jwt.verify(data.token, "secret").id, _id: data._id}, {status: data.status}, (err, order) => {
        io.to(jwt.verify(data.token, "secret").id).emit('updateStatusSuccess', order);
      });
    });
    socket.on('updateDeliverer', (data) => {
      Orders.findOneAndUpdate({_id: data.order, catering_id: jwt.verify(data.token, "secret").id}, {deliverer: data.deliverer, deliverer_id: data.deliverer_id}, (err, order) => {
        io.to(jwt.verify(data.token, "secret").id).emit('updateDelivererSuccess', order);
      });
    });
  });
});

http.listen(3001, () => {console.log('Socket.io running on http://localhost:3001/')});