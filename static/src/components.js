Crafty.c('Connecting', {
	required: '2D, DOM, Text, Motion, Delay',
	init: function () {
		this.text('Connecting')
		this.attr({
			trail: '.',
			x: 100,
			y: 20,
			w: 500,
			vy: 20
		})
		this.textAlign('left')
		this.textFont({
			family: 'courier',
			weight: 'bold',
			size: '20px'
		})
		this.delay(function () {
			if (this.y > 400) {
				this.attr({
					y: 20
				})
			}
			Crafty.e("ConnectionDot").text(this.trail)
		}, 800, -1)
	},
	setTrail(text) {
		this.trail = text;
	}
})


Crafty.c('ConnectionDot', {
	required: '2D, DOM, Text, Motion, Delay',
	init: function () {
		let c = Crafty('Connecting').get(0)
		this.attr('x', c.attr('x') + 115)
		this.attr('y', c.attr('y'))
		this.text('.')
		this.textFont({
			family: 'courier',
			weight: 'bold',
			size: '20px'
		})
		this.attr({
			vx: 20,
			vy: 20,
			ax: -2,
			ay: -20
		})
		this.delay(function () {
			this.destroy()
		}, 10000, 1)
	}
})