var S = require('./settings')
var U = require('./utils')

function createPlayer(playerId) {
	// core
	let player = {
		id: playerId,
		x: 20, // fixme level specific
		y: 20, // fixme level specific
		direction: 2, // fixme level specific
		grow: 0, // S.playerSize, // fixme level specific
		hue: U.hsvToRgb((Math.random() * 360) / 360, 0.8, 0.5), // fixme tune colors
		cells: []
	}
	// cells
	player.cells[0] = createHead(player)
	for (let i = 0; i < S.playerSize; i++) {
		player.cells.push(createCell(player, player.x - 1 - (1 * i), player.y))
	}
	return player
}

function createHead(player) {
	return {
		type: 'head',
		x: player.x,
		y: player.y,
		playerId: player.id
	}
}

function createCell(player, x, y, type = 'body') {
	return { type, x, y, 'playerId': player.id }
}

module.exports = {
	createPlayer, createHead, createCell
}