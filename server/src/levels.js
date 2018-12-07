var _levels = []

function initLevels() {

	// level 0
	let level = []
	level[0] = []
	level[0].push({x:0, y:0, h:50, w:2, type:'solid'})
	level[0].push({x:98, y:0, h:50, w:2, type: 'solid'})
	level[0].push({x:2, y:0, h:2, w:96, type: 'solid'})
	level[0].push({x:2, y:48, h:2, w:96, type: 'solid'})
	_levels[0] = level[0]
}

function convertLevel(level) {
	const convert = []
	const cLevel = {}
	for (const l of level)
		for (let xx = 0; xx<l.w; xx++)
			for (let yy = 0; yy<l.h; yy++)
				convert.push({x: l.x+xx, y: l.y+yy, type: l.type})
	for (const c of convert) {
		key = `${c.x} ${c.y}`

		cLevel[key] = [c]
	}
	return cLevel
}

module.exports = {
	levels : _levels,
	initLevels,
	convertLevel
}