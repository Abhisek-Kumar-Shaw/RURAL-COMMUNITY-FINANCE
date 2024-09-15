const express = require('express')
const buildinMiddleware = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true })); // You should specify extended option
  };
  
  module.exports = buildinMiddleware;
  