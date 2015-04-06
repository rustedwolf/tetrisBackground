// Options
var shapeCount = 7;
var blockTrueSize = 9;
var spacing = 1;
var fallSpeed = 400; // less is faster
var blockSize = blockTrueSize + spacing;
var blockColor = '#17bee3';
var target = 'animationContainer';
var blockPlacement = Array();

// Other Globals
var targetObj = document.getElementById(target);
var xBlocks = Math.floor(targetObj.offsetWidth / blockSize);
var yBlocks = Math.floor(targetObj.offsetHeight / blockSize);
var containerWidth = xBlocks * blockSize;
var containerHeight = yBlocks * blockSize;

var R = Raphael(target, '100%', '100%');

var shapesData = {
	'I': {
		size: 4,
		blocks: Array(
				[[0, 1], [1, 1], [2, 1], [3, 1]],
				[[2, 0], [2, 1], [2, 2], [2, 3]]
				)
	},
	'T': {
		size: 3,
		blocks: Array(
				[[0, 1], [1, 1], [2, 1], [1, 2]],
				[[1, 0], [0, 1], [1, 1], [1, 2]],
				[[1, 1], [0, 2], [1, 2], [2, 2]],
				[[1, 0], [1, 1], [2, 1], [1, 2]]
				)
	},
	'L': {
		size: 3,
		blocks: Array(
				[[0, 1], [1, 1], [2, 1], [0, 2]],
				[[0, 0], [1, 0], [1, 1], [1, 2]],
				[[2, 1], [0, 2], [1, 2], [2, 2]],
				[[1, 0], [1, 1], [1, 2], [2, 2]]
				)
	},
	'J': {
		size: 3,
		blocks: Array(
				[[0, 1], [1, 1], [2, 1], [2, 2]],
				[[1, 0], [1, 1], [0, 2], [1, 2]],
				[[0, 1], [0, 2], [1, 2], [2, 2]],
				[[1, 0], [2, 0], [1, 1], [1, 2]]
				)
	},
	'S': {
		size: 3,
		blocks: Array(
				[[1, 1], [2, 1], [0, 2], [1, 2]],
				[[0, 0], [0, 1], [1, 1], [1, 2]]
				)
	},
	'Z': {
		size: 3,
		blocks: Array(
				[[0, 1], [1, 1], [1, 2], [2, 2]],
				[[2, 0], [1, 1], [2, 1], [1, 2]]
				)
	},
	'O': {
		size: 2,
		blocks: Array(
				[[0, 0], [1, 0], [0, 1], [1, 1]]
				)
	}
};

/**
 * Generates the block on certain paper position
 *
 * @param {int} blockSize complear shape size
 * @param {array} blockInfo Block sizes
 * @param {int} xOffset X-axis position
 * @param {int} yOffset Y-axis postion
 * @returns {object} Raphalel object, the block itself
 */
function generateBlock(blockSize, blockInfo, xOffset, yOffset) {

	var block = R.rect(blockSize * blockInfo[0] + xOffset, blockSize * blockInfo[1] + yOffset, blockTrueSize, blockTrueSize)
			.attr({
				fill: blockColor,
				"stroke-width": 0,
				'stroke-linejoin': 'miter'
			});
	return block;
}

/**
 * Generates the shape by it's date
 * and placing it above the paper
 * note: needs spaning under random angle
 *
 * @param {object} shapeInfo Object containing shape data
 * @returns {object} shape
 */
function generateShape(shapeInfo) {
	var rotate = Math.floor(Math.random() * shapeInfo.blocks.length);

	var shape = {
		size: shapeInfo.size,
		rotate: rotate,
		blocks: shapeInfo.blocks[rotate],
		faling: false,
		xOffset: 0,
		yOffset: 0,
		objects: R.set()
	};

	var blocks = shape.blocks,
			random = Math.floor(Math.random() * (containerWidth / blockSize - shape.size)),
			posX = random * blockSize,
			posY = (rotate % 2 !== 0) ? 0 : -(blockSize);

	shape.xOffset = random;
	if (rotate % 2 !== 0)
		shape.yOffset = -1;

	if (shape.size === 2) {
		posX += blockSize;
		posY += blockSize;
	}

	for (var j in shape.blocks) {
		shape.objects.push(generateBlock(blockSize, blocks[j], posX, posY));
	}

	return shape;
}

/**
 * Shape drop sequense
 *
 * @param {type} shape
 * @param {type} speed
 * @returns {undefined}
 */
function dropShape(shape, speed) {

	var addY = (shape.rotate % 2 !== 0) ? 1 : 0;
	var addX = 0;
	if (shape.size === 2) {
		addY = 1;
		addX = 1;
	}

	var keepFaling = true;
	shape.blocks.forEach(function(p) {
		if (keepFaling) {
			if (undefined !== blockPlacement[p[0] + shape.xOffset]) {
				keepFaling = (!blockPlacement[p[0] + shape.xOffset + addX][p[1] + shape.yOffset + addY]);
				if (p[1] + shape.yOffset + addY >= yBlocks) {
					keepFaling = false;
				}
			} else {
				keepFaling = !(p[1] >= yBlocks);
			}
		}
	});

	if (keepFaling) {
		shape.yOffset = shape.yOffset + 1;
		if (!shape.faling) {
			shape.faling = true;
			shape.objects.animate({
				transform: 't0,' + (shape.yOffset * blockSize)
			}, speed / 2, '<>', function() {
				shape.faling = false;
				setTimeout(function() {
					return dropShape(shape, speed);
				}, speed);
			});
		}
	} else {
		shape.objects.animate({
			opacity: 0
		}, 1000, '<>', function() {
			shape.objects.remove();
			shape.objects = null;
			shape = null;
			timeoutDrop();
		});
	}
}

/**
 * Adds random bottom blocks
 */
function fillBottom() {
	var fillPart = Math.floor(yBlocks * 0.9),
			xHalf = Math.floor(xBlocks / 2),
			blockInfo = [0, 0];
	// Fill the paper with base blocks
	for (var x = 0; x <= xBlocks; x++) {
		blockPlacement[x] = Array(yBlocks);

		for (var y = fillPart; y <= yBlocks; y++) {
			var chance = (Math.random() * 101),
					xChance = 0,
					yChance = 0;
			yChance = (0 !== y) ? ((y - fillPart) * 100) / (yBlocks + 1 - fillPart) : 0;
			if (x <= xHalf) {
				xChance = (0 !== x) ? (x * 100) / xHalf : 0;
			} else {
				xChance = ((xBlocks - x + 1) * 100) / xHalf;
			}

			var maxChance = (xChance + yChance) * 0.8;

			//R.text((blockSize * x) + blockSize / 2, (blockSize * y) + blockSize / 2, x);
			if (chance < maxChance) {
				blockPlacement[x][y] = true;
				generateBlock(blockSize, blockInfo, (blockSize * x), (blockSize * y));
				//R.text((blockSize * x) + blockSize / 2, (blockSize * y) + blockSize / 2, y);
			} else {
				blockPlacement[x][y] = false;
			}
		}
	}

}

/**
 * Calls the shape dropping fn in random time
 */
function timeoutDrop() {
	var delay = Math.random() * 24000;
	setTimeout(function() {
		var keys = Object.keys(shapesData),
				keyPos = Math.floor((Math.random() * Object.keys(shapesData).length)),
				shape = generateShape(shapesData[keys[keyPos]]);

		dropShape(shape, fallSpeed);
	}, delay);
}

/**
 * Starts to drop shapes
 *
 * @returns {function} returns the interval loop
 */
function dropShapes() {
	for (var i = 0; i < shapeCount; i++) {
		timeoutDrop();
	}
}

fillBottom();
var interval = dropShapes();


// 1st sequence
function TetrisBackground(targetContainerId){
	this.container = getElementById(targetContainerId);
	this.paper = Raphael(targetContainerId, '100%', '100%');
}
