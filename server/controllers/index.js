// var models = require('../models');
var db = require('../db/index.js');

module.exports = {
  messages: {
    get: function (req, res) {
      db.getAllMessages()
        .then(function (results) {
          res.json(results[0]);
        });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      //console.log(req.body);
      db.insertNewMessage(req.body)
      .then(function() {
        res.status(201).end()
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {
      db.insertNewUser(req.body)
      .then(function() {
        res.status(201).end();
      });
    }
  }
};

