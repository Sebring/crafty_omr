var P = require('./player')

var _players = []
var _others = []
var otherId = 0
var _board = {}
var _static_board = {}



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

function update(actors) {
	// console.log('*Engine* update', actors.players)
	// quick bail if no players
	if (!actors.players || !actors.players.length) return actors

	// clear board
	_board = Object.assign({}, actors.static)

	let key = ''
	for (const o of actors.items) {
		key = `${o.x} ${o.y}`
		_board[key] = [o]
	}

	let hasGrown = false;
	// update omr cell positions
	for (const p of actors.players) {
		// update in reverse direction
		for(let N = p.cells.length, i=N-1;i>0; i--) {
			if (p.grow && !hasGrown) {
				i = 1
				let growCell = P.createCell(p, p.cells[i].x, p.cells[i].y, 'body')
				p.cells.splice(1, 0, growCell)
				p.grow--
				hasGrown = true
			}
			let c = p.cells[i]
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
	for(const p of actors.players) {
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
	return actors
}

// super hacky thing to determine whether this is a node module or inlined via script tag
if (!this.navigator) {
	module.exports = {
		update
	}
}
