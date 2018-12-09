var _levels = []

function initLevels() {

	// level 0
	let level = {}
	let cells = []
	cells.push({x:0, y:0, h:50, w:2, type:'solid'})
	cells.push({x:98, y:0, h:50, w:2, type: 'solid'})
	cells.push({x:2, y:0, h:2, w:96, type: 'solid'})
	cells.push({x:2, y:48, h:2, w:96, type: 'solid'})
	level.cells = level
	level.settings = {name: '1', growth: '2' }

	_levels.push(level)
}

/*
* Cycle through levels
*/
function getLevel(index) {
	if (!_levels.length) initLevels()
	return _levels[index%_levels.length]
}

function getLevelByName(name) {
	return _levels.find(l => l.name === name)
}

/*
* Convert level to fit the *Engine*
*/
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