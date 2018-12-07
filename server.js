
var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var utils = require('./server/src/utils')
var E = require('./server/src/engine')
var S = require('./server/src/settings')
var L = require('./server/src/levels')

L.initLevels()

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html')
})

app.use(express.static('static'))

http.listen(3000, function() {
	console.log('listening on *:3000')
})

E.setCallback(function(state) {
	io.emit('update_game', state)
})

io.on('connection', function(socket) {
	console.log('a user connected', socket.id)

	if (!validateSocket(socket)) {
		socket.disconnect()
	}

	socket.emit('accept_connection')

	let currentPlayer = {
		id: socket.id,
		direction: 2,
		x: 20,
		y: 20,
		grow: 0,
		hue: utils.hsvToRgb((Math.random() * 360)/360, 0.8, 0.5)
	}

	// disconnect
	socket.on('disconnect', function () {
		E.removePlayer(currentPlayer.id)
		console.log('user disconnected', currentPlayer.id)
	})

	// join
	socket.on('join', function (player) {
		console.log('join')
		if (!validateName(player.name)) {
			socket.disconnect()
		}
		currentPlayer.name = player.name;
		currentPlayer = E.addPlayer(currentPlayer)
		socket.emit("accept_join", currentPlayer, L.levels)
	})

	// ready to start game
	socket.on('ready_start', function() {
		console.log('ReadyStart')

		console.log('Current no of players', E.players.length)
		socket.emit('player_status', currentPlayer)
	})

	// input
	socket.on('input', function(input) {
		currentPlayer.direction = input
	})

	// action
	socket.on('action', function(action) {
		// TODO - quit - etc
		console.log('action', action)
		switch(action) {
			case 'PAUSE':
				E.togglePause()
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
