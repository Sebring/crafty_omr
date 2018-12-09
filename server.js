
var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var utils = require('./server/src/utils')
var G = require('/server/src/game')

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
	}

	socket.emit('accept_connection')

	let currentPlayer = G.addPlayer(socket.id)
	/*
	{
		id: socket.id,
		// FIXME - Move to *Game*
		direction: 2,
		x: 20,
		y: 20,
		grow: 0,

	}*/

	// disconnect
	socket.on('disconnect', function () {
		G.removePlayer(currentPlayer.id)
		console.log('user disconnected', currentPlayer.id)
	})

	// join
	socket.on('join', function (player) {
		console.log('join')
		if (!validateName(player.name)) {
			socket.disconnect()
		}
		currentPlayer.name = player.name;
		currentPlayer = G.addPlayer(currentPlayer)
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
