class Game {
	constructor() {
		this.socket = {}
		this.player = {}
	}

	start() {
		let G = this;
		Crafty.init(1000, 500, 'crafty');
		Crafty.background('yellowgreen')
		Crafty.bind('KeyDown', function (e) {
			switch (e.key) {
				case Crafty.keys.UP_ARROW:
					G.socket.emit('input', 1)
					break
				case Crafty.keys.RIGHT_ARROW:
					G.socket.emit('input', 2)
					break
				case Crafty.keys.DOWN_ARROW:
					G.socket.emit('input', 3)
					break
				case Crafty.keys.LEFT_ARROW:
					G.socket.emit('input', 4)
					break
				case Crafty.keys.SPACE:
					console.log('space')
					G.socket.emit('action', 'PAUSE')

			}
		})
		this.connect()
	}

	connect() {
		this.socket = io()
		this.socket.on('accept_connection', () => {
			this.onConnected()
		})
	}

	onConnected() {
		console.log('connected!', this)
		this.player.name = 'Sebring'
		this.join()
	}

	join() {
		this.socket.on('accept_join', (player, level) => {
			this.onJoined(player)
		})
		this.socket.emit('join', this.player.name)
	}

	onJoined(player) {
		console.log('joined', player)
		this.player = player
		this.startGame()
	}

	startGame() {
		this.socket.on('update_game', (game_state) => {
			this.onGameUpdate(game_state)
		})
		this.socket.on('player_status', (player) => {
			this.onPlayerUpdate(player)
		})
		this.socket.on('level', (level) => {
			this.onLevel(level)
		})
		console.log('emit')
		this.socket.emit('ready_start')
	}

	onLevel(level) {
		console.log('level', level)
		this.loadLevel(level)
	}

	onPlayerUpdate(player) {
		this.player = player
	}

	onGameUpdate(game_state) {
		console.log(game_state)

		Crafty('Cell, Other').destroy()

		for (const player of game_state[0]) {
			for (let cell of player.cells) {
				let p = Crafty.e("2D, WebGL, Color, Cell")
				p.attr({
					x: cell.x*10,
					y: cell.y*10,
					h: 10,
					w: 10
				})
				let [r, g, b] = player.hue
				p.color(r, g, b)
			}
		}

		for (const other of game_state[1]) {
			let o = Crafty.e("2D, WebGL, Color, Other")
			o.attr({
				x: other.x*10, y: other.y*10, h:10, w:10
			})
			o.color('red')
		}
	}

	loadLevel(level) {
		console.log('level', level)
		for (const cell of level.cells) {
			let o = Crafty.e("2D, WebGL, Color, Level")
			o.attr({
				x: cell.x * 10,
				y: cell.y * 10,
				h: cell.h * 10,
				w: cell.w * 10
			})
			o.color('black')
		}
	}

}