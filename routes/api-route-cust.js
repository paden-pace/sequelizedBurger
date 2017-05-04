// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================

module.exports = function(app) {
  app.get("/api/customers", function(req, res) {
    db.Customer.findAll({ include: [ db.Burber ] }).then(function(dbCustomer) {
      res.json(dbCustomer);
    });
  });

  app.get("/api/customers/:id", function(req, res) {
    db.Customer.findOne({
      where: {
        id: req.params.id
      },
       include: [db.Burger] 
    }).then(function(dbCustomer) {
      res.json(dbCustomer);
    });
  });

  app.post("/api/customers", function(req, res) {
    db.Customer.create(req.body).then(function(dbCustomer) {
      res.json(dbCustomer);
    });
  });

  app.delete("/api/customers/:id", function(req, res) {
    db.Customer.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbCustomer) {
      res.json(dbCustomer);
    });
  });

};
