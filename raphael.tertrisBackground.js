function TetrisBackgroud(target){	
	var targetObj = document.getElementById(target);
	this.paper = Raphael(target, targetObj.offsetWidth, targetObj.offsetHeight);
	this.shapeCount = 7;
    this.blockSize = 10;
    this.spacing = 1;
    this.fallingSpeed = 400;
    this.blockSizeSpaced = blockSize + spacing;
    this.blockColor = '#17bee3';
	
    this.gridWidth = Math.floor(targetObj.offsetWidth / blockSizeSpaced);
    this.gridHeight = Math.floor(targetObj.offsetHeight / blockSizeSpaced);
	this.grid = [new Array(this.gridWidth), new Array(this.gridHeight)];
	
	this.prepareContainer = function(){
		var yZone = Math.floor(yBlocks * 0.9),
			xZone = Math.floor(xBlocks / 2);
		
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

				//R.text((blockSizeSpaced * x) + blockSizeSpaced / 2, (blockSizeSpaced * y) + blockSizeSpaced / 2, x);
				if (chance < maxChance) {
					blockPlacement[x][y] = true;
					generateBlock(blockSizeSpaced, blockInfo, (blockSizeSpaced * x), (blockSizeSpaced * y));
					//R.text((blockSizeSpaced * x) + blockSizeSpaced / 2, (blockSizeSpaced * y) + blockSizeSpaced / 2, y);
				} else {
					blockPlacement[x][y] = false;
				}
			}
		}
	};
	
	this.drawBlock = function(blockSize, xPosition, yPosition) {		
		var block = this.paper.rect(xPosition, yPosition, blockSize, blockSize);
		block.attr({
			fill: this.blockColor,
			'stroke-width': 0,
			'stroke-linejoin': 'miter'
		});
		return block;
	};
	
	this.prepareContainer();
}

// Other Globals
var targetObj = document.getElementById(this.targetContainer),
    xBlocks = Math.floor(targetObj.offsetWidth / blockSizeSpaced),
    yBlocks = Math.floor(targetObj.offsetHeight / blockSizeSpaced),
    containerWidth = xBlocks * blockSizeSpaced,
    containerHeight = yBlocks * blockSizeSpaced;

var R = Raphael(this.targetContainer, containerWidth, containerHeight);

var shapesData = {
    'I': {
        size: 4,
        blocks: Array(
        [
            [0, 1],
            [1, 1],
            [2, 1],
            [3, 1]
        ], [
            [2, 0],
            [2, 1],
            [2, 2],
            [2, 3]
        ])
    },
        'T': {
        size: 3,
        blocks: Array(
        [
            [0, 1],
            [1, 1],
            [2, 1],
            [1, 2]
        ], [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, 2]
        ], [
            [1, 1],
            [0, 2],
            [1, 2],
            [2, 2]
        ], [
            [1, 0],
            [1, 1],
            [2, 1],
            [1, 2]
        ])
    },
        'L': {
        size: 3,
        blocks: Array(
        [
            [0, 1],
            [1, 1],
            [2, 1],
            [0, 2]
        ], [
            [0, 0],
            [1, 0],
            [1, 1],
            [1, 2]
        ], [
            [2, 1],
            [0, 2],
            [1, 2],
            [2, 2]
        ], [
            [1, 0],
            [1, 1],
            [1, 2],
            [2, 2]
        ])
    },
        'J': {
        size: 3,
        blocks: Array(
        [
            [0, 1],
            [1, 1],
            [2, 1],
            [2, 2]
        ], [
            [1, 0],
            [1, 1],
            [0, 2],
            [1, 2]
        ], [
            [0, 1],
            [0, 2],
            [1, 2],
            [2, 2]
        ], [
            [1, 0],
            [2, 0],
            [1, 1],
            [1, 2]
        ])
    },
        'S': {
        size: 3,
        blocks: Array(
        [
            [1, 1],
            [2, 1],
            [0, 2],
            [1, 2]
        ], [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 2]
        ])
    },
        'Z': {
        size: 3,
        blocks: Array(
        [
            [0, 1],
            [1, 1],
            [1, 2],
            [2, 2]
        ], [
            [2, 0],
            [1, 1],
            [2, 1],
            [1, 2]
        ])
    },
        'O': {
        size: 2,
        blocks: Array(
        [
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1]
        ])
    }
};

/**
 * Generates the block on certain paper position
 *
 * @param {int} blockSizeSpaced complear shape size
 * @param {array} blockInfo Block sizes
 * @param {int} xOffset X-axis position
 * @param {int} yOffset Y-axis postion
 * @returns {object} Raphalel object, the block itself
 */
function generateBlock(blockSizeSpaced, blockInfo, xOffset, yOffset) {

    var block = R.rect(blockSizeSpaced * blockInfo[0] + xOffset, blockSizeSpaced * blockInfo[1] + yOffset, blockSize, blockSize)
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
        random = Math.floor(Math.random() * (containerWidth / blockSizeSpaced - shape.size)),
        posX = random * blockSizeSpaced,
        posY = (rotate % 2 !== 0) ? 0 : -(blockSizeSpaced);

    shape.xOffset = random;
    if (rotate % 2 !== 0) shape.yOffset = -1;

    if (shape.size === 2) {
        posX += blockSizeSpaced;
        posY += blockSizeSpaced;
    }

    for (var j in shape.blocks) {
        shape.objects.push(generateBlock(blockSizeSpaced, blocks[j], posX, posY));
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
    shape.blocks.forEach(function (p) {
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
                transform: 't0,' + (shape.yOffset * blockSizeSpaced)
            }, speed / 2, '<>', function () {
                shape.faling = false;
                setTimeout(function () {
                    return dropShape(shape, speed);
                }, speed);
            });
        }
    } else {
        shape.objects.animate({
            opacity: 0
        }, 1000, '<>', function () {
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

            //R.text((blockSizeSpaced * x) + blockSizeSpaced / 2, (blockSizeSpaced * y) + blockSizeSpaced / 2, x);
            if (chance < maxChance) {
                blockPlacement[x][y] = true;
                generateBlock(blockSizeSpaced, blockInfo, (blockSizeSpaced * x), (blockSizeSpaced * y));
                //R.text((blockSizeSpaced * x) + blockSizeSpaced / 2, (blockSizeSpaced * y) + blockSizeSpaced / 2, y);
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
    setTimeout(function () {
        var keys = Object.keys(shapesData),
            keyPos = Math.floor((Math.random() * Object.keys(shapesData).length)),
            shape = generateShape(shapesData[keys[keyPos]]);

        dropShape(shape, fallingSpeed);
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

// Kocham Ci? Kociu!

var letters = {
    0: {
        w: 5,
        data: [
            [0, 0],
            [4, 0],
            [0, 1],
            [1, 1],
            [3, 1],
            [4, 1],
            [0, 2],
            [2, 2],
            [4, 2],
            [0, 3],
            [4, 3],
            [0, 4],
            [4, 4]
        ]
    },
    1: {
        w: 4,
        data: [
            [0, 0],
            [3, 0],
            [0, 1],
            [2, 1],
            [0, 2],
            [1, 2],
            [0, 3],
            [2, 3],
            [0, 4],
            [3, 4]
        ]
    },
    2: {
        w: 4,
        data: [
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0],
            [0, 1],
            [0, 2],
            [1, 2],
            [0, 3],
            [0, 4],
            [1, 4],
            [2, 4],
            [3, 4],
            [2, 5],
            [3, 4]
        ]
    },
    3: {
        w: 4,
        data: [
            [1, 0],
            [2, 0],
            [0, 1],
            [3, 1],
            [0, 2],
            [1, 2],
            [2, 2],
            [3, 2],
            [0, 3],
            [3, 3],
            [0, 4],
            [3, 4]
        ]
    },
    4: {
        w: 4,
        data: [
            [0, 0],
            [3, 0],
            [0, 1],
            [3, 1],
            [0, 2],
            [1, 2],
            [2, 2],
            [3, 2],
            [0, 3],
            [3, 3],
            [0, 4],
            [3, 4]
        ]
    },
    5: {
        w: 4,
        data: [
            [0, 0],
            [3, 0],
            [0, 1],
            [3, 1],
            [0, 2],
            [3, 2],
            [0, 3],
            [3, 3],
            [1, 4],
            [2, 4]
        ]
    },
    6: {
        w: 1,
        data: [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3],
            [0, 4]
        ]
    },
    7: {
        w: 1,
        data: [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 4]
        ]
    },
    8: {
        w: 4,
        data: [
            [1, 0],
            [2, 0],
            [0, 1],
            [3, 1],
            [0, 2],
            [0, 3],
            [3, 3],
            [1, 4],
            [2, 4]
        ]
    },
    9: {
        w: 4,
        data: [
            [1, 0],
            [2, 0],
            [0, 1],
            [3, 1],
            [0, 2],
            [3, 2],
            [0, 3],
            [3, 3],
            [1, 4],
            [2, 4]
        ]
    },
    10: {
        w: 2,
        data: [
            [0, 4],
            [1, 4],
            [1, 5]
        ]
    }
};
var fistLine = [1, 9, 8, 4, 3, 0],
    secondLine = [8, 6, 2, 10],
    thirdLine = [1, 9, 8, 6, 5, 7];

var delay = 7000;
var yOffset = 10;

function drawSentence(array) {
    var width = 0;

    array.forEach(function (letter) {
        width += letters[letter].w + 2;
    });

    if (width > 0) {
        width -= 2;
    }

    var xOffset = Math.floor((xBlocks - width) / 2);

    array.forEach(function (letter) {
        letters[letter].data.forEach(function (blockInfo) {
            var x = xOffset;
            var y = yOffset;
            setTimeout(function () {
                var block = generateBlock(blockSizeSpaced, blockInfo, (blockSizeSpaced * x), (blockSizeSpaced * y));
                block.attr({
                    'opacity': 0
                });
                block.animate({
                    'opacity': 1
                }, 1000);
            }, delay);
            delay += 100;
        });
        xOffset = xOffset + letters[letter].w + 2;
    });

    yOffset += 8;
}

//drawSentence(fistLine);
//drawSentence(secondLine);
//drawSentence(thirdLine);

// Endof: Kocham Ci? Kociu!