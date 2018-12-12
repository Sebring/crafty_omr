
var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var G = require('./server/src/game')
var L = require('./server/src/levels')

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html')
})

app.use(express.static('static'))

http.listen(process.env.PORT || 3000, function () {
	console.log('listening on *:3000')
})

G.setCallback(function(state) {
	io.emit('update_game', state)
})

io.on('connection', function(socket) {
	console.log('a user connected', socket.id)

	if (!validateSocket(socket)) {
		socket.disconnect()
		return;
	}
	socket.emit('accept_connection')

	let currentPlayer = G.addPlayer(socket.id)

	// disconnect
	socket.on('disconnect', function () {
		G.removePlayer(socket.id)
		console.log('user disconnected', socket.id)
	})

	// join
	socket.on('join', function (name) {
		console.log('join')
		if (!validateName(name)) {
			socket.disconnect()
		}
		currentPlayer.name = name;
		// currentPlayer = G.addPlayer(currentPlayer)
		socket.emit("accept_join", currentPlayer)
	})

	// ready to start game
	socket.on('ready_start', function() {
		console.log('ReadyStart')
		socket.emit('player_status', currentPlayer)
		socket.emit('level', G.getLevel())
	})

	// input
	socket.on('input', function(input) {
		// move to *Game*
		currentPlayer.direction = input
	})

	// action
	socket.on('action', function(action) {
		// TODO - quit - etc
		console.log('action', action)
		switch(action) {
			case 'PAUSE':
				G.togglePause()
				break;
		}
	})

})

function validateSocket() {
	// TODO
	return true
}

function validateName(name) {
	// TODO
	return true
}
