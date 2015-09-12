var Promise = require('bluebird');
var mysql = Promise.promisifyAll(require('mysql'));

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'chat'
});

connection = Promise.promisifyAll(connection);

exports.insertNewMessage = function(data) {
  var userId, roomId;
  connection.connect();

  connection.queryAsync('SELECT id FROM users WHERE name = ?', [data.username])
  .then(function(results) {
    if (results[0].length === 0) {
      return connection.queryAsync('INSERT INTO users SET ?', {name: data.username})
      .then(function (results) {
        console.log(results); // DEBUGGING <<<<<<<<<<<<<<<<<<
        userId = results[0].insertId;
        return userId;
      });
    } else {
      userId = results[0][0].id;
      return userId;
    }
  })
  .then(function (userId) {
    return connection.queryAsync('SELECT id FROM rooms WHERE name = ?', [data.roomname])
    .then(function (results) {
      if (results[0].length === 0) {
        return connection.queryAsync('INSERT INTO rooms SET ?', {name: data.roomname})
        .then(function (results) {
          console.log(results); // DEBUGGING <<<<<<<<<<<<<<<<<<<
          roomId = results[0].insertId;
          return roomId;
        });
      } else {
        roomId = results[0][0].id;
        return roomId;
      }
    })
  })
  .then(function (roomId) {
    console.log("room_id: " + roomId + "\n" + "user_id: " + userId)
    return connection.queryAsync('INSERT INTO messages SET ?', {message: data.message, room_id: roomId, user_id: userId})
  })
  .catch(function (err) {
    console.log(err);
  })
  .finally(function () {
    connection.end();
  });

  /*connection.query('SELECT id FROM users WHERE name = ?', [data.username], function(err, results) {
    if (err) throw err;
    if (results.length === 0) {
      connection.query('INSERT INTO users SET ?', {name: data.username}, function(err, results) {
        if (err) throw err;
        userId = results.insertId;
      });
    } else {
      userId = results[0].id;
    }
  });

  connection.query('SELECT id FROM rooms WHERE name = ?', [data.roomname], function(err, results) {
    if (err) throw err;
    if (results.length === 0) {
      connection.query('INSERT INTO rooms SET ?', {name: data.roomname}, function(err, results) {
        if (err) throw err;
        roomId = results.insertId;
      });
    } else {
      roomId = results[0].id;
    }
    connection.query('INSERT INTO messages SET ?', {message: data.message, room_id: roomId, user_id: userId}, function(err, results) {
      if (err) throw err;
    });
  });*/

  
  //setTimeout(connection.end.bind(connection), 1000)
};

