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

exports.insertNewUser = function(data) {
  return connection.queryAsync('INSERT INTO users SET ?', {name: data.username})
                    /*.then(function () {
                      connection.end();
                    });*/
};

exports.insertNewMessage = function(data) {
  var userId, roomId;
  console.log(data);
  return connection.queryAsync('SELECT id FROM users WHERE name = ?', [data.username])
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
        return connection.queryAsync('INSERT INTO rooms SET ?', {name: data.roomname}) // "name='reddit'"
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
  /*.finally(function () {
    connection.end();
  });*/
};

exports.getAllMessages = function() {
  return connection.queryAsync('SELECT messages.message, users.name FROM messages \
                                INNER JOIN users ON messages.user_id = users.id')
          /*.finally(function() {
            connection.end();
          });*/
};

exports.getRoomMessages = function(data) {
  return connection.queryAsync('SELECT messages.message, rooms.name, users.name FROM messages \
                                INNER JOIN rooms ON messages.room_id = rooms.id \
                                INNER JOIN users ON messages.user_id = users.id \
                                WHERE rooms.name = ?', [data.roomname])
         /*.finally(function() {
            connection.end();
         });*/
};

exports.getUserMessages = function(data) {
  return connection.queryAsync('SELECT messages.message, users.name FROM messages \
                                INNER JOIN users ON users.id = messages.user_id \
                                WHERE users.name = ?', [data.username])
         /*.finally(function() {
            connection.end();
         });*/
};

process.on('exit', function() {
  connection.end();
});