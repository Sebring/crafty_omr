var S = require('./settings')
var L = require('./levels')

var _players = []
var _others = []
var otherId = 0
var callback = function(){ console.log('e cb')}
var _board = {}
var _static_board = {}
var timer

function createSegment(x, y, playerId) {
	return { type: 'body', x, y, playerId }
}

function addPlayer(player) {

	// FIXME - move to settings

	player.direction = 2
	player.cells = []

	player.cells[0] = {type: 'head', x:player.x, y:player.y, playerId: player.id }
	for (let i = 0; i < 5; i++) {
		let c = createSegment(player.x - 1 - (1 * i), player.y, player.id)
		console.log('player', player)
		player.cells.push(c)
	}

	_players.push(player)

	if (_players.length > 1) {
		_players[1].direction = 1
	}
	addFood()
	return player;
}

function removePlayer(playerId) {
	console.log('remove', playerId)
	const index = _players.findIndex(player => player.id === playerId)
	if (index != -1) {
		let pp = _players.splice(index, 1)
		console.log(' - removed player')
	}
}

function setDirection(direction, playerId) {
	let player = _players.find(p => (p.id === playerId))
	if (!player) return;
	player.direction = direction
}

function setCallback(cb) {
	callback = cb
}

function loadLevel(level) {
	_static_board = L.convertLevel(L.levels[0])
}

function startGame() {
	loadLevel()
	timer = setInterval(function () {
		_players = tick()
		if (callback) {
			callback([_players, _others])
		}
	}, 1000 / S.speed)
}

function togglePause() {
	if (timer)
		pauseGame()
	else
		startGame()
}

function pauseGame() {
	clearInterval(timer)
	timer = null;
}

function getPlayerFromCell(cell) {
	return _players.find(p => { return p.id === cell.playerId })
}


function getRandomInclusive(max, min) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addFood() {
	let x = getRandomInclusive(2, 20)
	let y = getRandomInclusive(2, 20)

	addOther({ x , y , type: 'food', growth: S.growth})
}

function addOther(item) {
	item.id = otherId++
	_others.push(item)
}

function collide(a, b) {
	console.log('a', a)
	console.log('b', b)

	if (a.type === 'body' && b.type === 'head') {
		collide(b, a)
		return;
	}

	let index_a = _players.findIndex(p => { return p.id === a.playerId })
	let index_b = _players.findIndex(p => { return p.id === b.playerId })

	if (a.type != 'head') {
		// console.log('What? Head expected');
		return;
	}
	// vs body?
	if (b.type === 'body') {

		// kill all the cells starting from the end
		let c = _players[index_b].cells.pop()
		while (!!c && c != b) {
			c.type = 'dead'
			c.growth = 1
			let key = `${c.x} ${c.y}`
			_board[key].push(c) // FIXME - another omr's head might be overwritten here!
			//_static_board[key] = c
			addOther(c)
			c = _players[index_b].cells.pop()
		}

		_players[index_a].grow++
		return true
	}

	// vs food
	if (b.type === 'food' || b.type === 'dead') {
		_players[index_a].grow += b.growth
		_others.splice(_others.findIndex(i => i.id === b.id), 1)
		// add new food
		if (b.type === 'food') addFood()

		return true
	}

	// vs solid

	if (b.type === 'solid') {
		console.log('solid')
		let cell = _players[index_a].cells.splice(1, 1)
		_players[index_a].cells[0].x = cell[0].x
		_players[index_a].cells[0].y = cell[0].y
		return true
	}

}

function kill(player) {
	console.log('Player died ', player.id)
	for (let c of player.cells) {
		c.type =  'dead'
		c.growth = 1
	}
}

function tick() {
	// empty board
	_board = Object.assign({}, _static_board) // need to make level compatible with this

	let key = ''
	for (const o of _others) {
		key = `${o.x} ${o.y}`
		_board[key] = [o]
	}

	let hasGrown = false;
	// update omr cell positions
	for (const p of _players) {
		// update in reverse direction
		for(let N = p.cells.length, i=N-1;i>0; i--) {
			if (p.grow && !hasGrown) {
				i = 1
				let growCell = createSegment(p.cells[i].x, p.cells[i].y, p.id)
				p.cells.splice(1, 0, growCell)
				p.grow--
				hasGrown = true
			}
			let c = p.cells[i]
			// TODO: handle growth
			// update all but head
			const cc = p.cells[i-1]
			c.x = cc.x
			c.y = cc.y

			// add cell to board
			let addCell = true;
			let key = `${c.x} ${c.y}`

			if (!_board[key]) {
				_board[key] = [] // this should always happen now
			} else {
				// console.log('COLLISION BODY', c, _board[key])
				// pauseGame()
				// addCell = collide(c, _board[key][0])
			}
			if (addCell)
				_board[key].push(c)
		}
			// p.cells[i] = c

	}
	for(const p of _players) {
		// update head in direction
		const c = p.cells[0]
		switch (p.direction) {
			case 1:
				c.y--
				break
			case 2:
				c.x++
				break
			case 3:
				c.y++
				break
			case 4:
				c.x--
				break
		}

		// add cell to board
		let addCell = true;
		let key = `${c.x} ${c.y}`
		if (!_board[key]) {
			_board[key] = []
		} else {
			console.log('COLLISION HEAD', c, _board[key])
			// pauseGame()
			addCell = collide(c, _board[key][0])
		}
		if (addCell)
			_board[key].push(c)
	}
	return _players
}

// super hacky thing to determine whether this is a node module or inlined via script tag
if (!this.navigator) {
	module.exports = {
		players: _players,
		addPlayer,
		setCallback,
		removePlayer,
		setDirection,
		togglePause,
		startGame,
		pauseGame
	}
}
