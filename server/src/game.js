var E = require('./engine')
var S = require('./settings')
var L = require('./levels')
var P = require('./player')

var _callback = {}
var _timer
var _status = 0
var _players = []
var _items = []
var _static = {}
var _level = {}

function setCallback(callback) {
	_callback = callback
	L.initLevels()
	loadLevel()
}

/*
* Start game using current settings
*/
function startGame() {
	loadLevel()
	_timer = setInterval(function () {
		tick()
		if (_callback) {
			_callback([_players, _items])
		}
	}, 1000 / S.speed)
}

/*
* Creates and adds a new player
*/
function addPlayer(playerId) {
	console.log('*Game* | addPlayer', playerId)
	let player = P.createPlayer(playerId)
	_players.push(player)
	console.log('- players', _players)
	return player
}

/*
* Remove an existing player
*/
function removePlayer(playerId) {
	console.log('*Game* removePlayer', playerId, _players)
	const index = _players.findIndex(player => player.id === playerId)
	if (index != -1) {
		let pp = _players.splice(index, 1)
		console.log(' - removed player')
	}
}

function setPlayerDirection(id, dir) {
	let player = _players.find(p => (p.id === playerId))
	if (!player) return;
	player.direction = direction
}

/*
* Load current level
*/
function loadLevel() {
	_level = L.getLevel(S.currentLevel)
	_static = L.convertLevel(_level)
}

function getLevel() {
	return _level
}

function getCurrentLevel() {
	return L.getLevel(S.currentLevel)
}

function togglePause() {
	if (_timer)
		pauseGame()
	else
		startGame()
}

function pauseGame() {
	clearInterval(_timer)
	_timer = null;
}

function tick() {
	let actors = E.update({'static': _static, 'players': _players, 'items': _items})
	_players = actors.players
	_item = actors.items
	return { players: actors.players, items: actors.items }
}

module.exports = {
	getLevel,
	addPlayer, removePlayer, setPlayerDirection,
	setCallback, startGame, getCurrentLevel, togglePause, pauseGame
}