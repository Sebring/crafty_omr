var _height = 50
var _width = 100
var currentLevel = 1
var _board = {}
var growth = 3
var speed = 10
var playerSize = 3

function level(level) {
	_level = level || _level
	return _level
}

function height(height) {
	_height = height || _height
	return _height
}

function width(width) {
	_width = width || _width
	return _width
}

function getSettings() {
	return {height, width, level}
}

module.exports = {
	currentLevel, growth, speed, level,
	width, height, playerSize,
	getSettings
}
