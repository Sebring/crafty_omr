var _levels = {}

function initLevels() {

	// level 0
	let level = []
	level.push({x:0, y:0, h:50, w:2, type:'solid'})
	level.push({x:98, y:0, h:50, w:2, type: 'solid'})
	level.push({x:2, y:0, h:2, w:96, type: 'solid'})
	level.push({x:2, y:48, h:2, w:96, type: 'solid'})
	_levels.cells = level
	_levels.settings = { growth: '2' }
}

function convertLevel(level) {
	const convert = []
	const cLevel = {}
	for (const l of level.cells)
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