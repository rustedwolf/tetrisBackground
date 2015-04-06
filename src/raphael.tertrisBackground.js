var grid = [];

var paper, targetObj, xBlockCount, yBlockCount, containerWidth, containerHeight,
    shapeCount, blockSize, blockSpacing, fallSpeed, blockAreaSize, blockColor;

/**
 * Generates the block on certain paper position
 *
 * @param {int} blockAreaSize complear shape size
 * @param {array} blockInfo Block sizes
 * @param {int} xOffset X-axis position
 * @param {int} yOffset Y-axis postion
 * @returns {object} Raphalel object, the block itself
 */
function generateBlock(blockAreaSize, blockInfo, xOffset, yOffset) {

    var block = paper.rect(blockAreaSize * blockInfo[0] + xOffset, blockAreaSize * blockInfo[1] + yOffset, blockSize, blockSize)
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
        objects: paper.set()
    };

    var blocks = shape.blocks,
        random = Math.floor(Math.random() * (containerWidth / blockAreaSize - shape.size)),
        posX = random * blockAreaSize,
        posY = (rotate % 2 !== 0) ? 0 : -(blockAreaSize);

    shape.xOffset = random;
    if (rotate % 2 !== 0)
        shape.yOffset = -1;

    if (shape.size === 2) {
        posX += blockAreaSize;
        posY += blockAreaSize;
    }

    for (var j in shape.blocks) {
        shape.objects.push(generateBlock(blockAreaSize, blocks[j], posX, posY));
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
            if (undefined !== grid[p[0] + shape.xOffset]) {
                keepFaling = (!grid[p[0] + shape.xOffset + addX][p[1] + shape.yOffset + addY]);
                if (p[1] + shape.yOffset + addY >= yBlockCount) {
                    keepFaling = false;
                }
            } else {
                keepFaling = !(p[1] >= yBlockCount);
            }
        }
    });

    if (keepFaling) {
        shape.yOffset = shape.yOffset + 1;
        if (!shape.faling) {
            shape.faling = true;
            shape.objects.animate({
                transform: 't0,' + (shape.yOffset * blockAreaSize)
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

function tetrisBackground(options) {
    initialize(options);
}

// Refactoring starts here...

function initialize(options) {
    // Settings
    shapeCount = options.shapeCount || 7;
    blockColor = options.blockColor || '#17bee3';
    blockSize = options.blockSize || 9;
    blockSpacing = options.blockSpacing || 1;
    fallSpeed = options.animationSpeed || 400; // less is faster

    targetObj = document.getElementById(options.targetId);
    paper = Raphael(options.targetId, '100%', '100%');

    blockAreaSize = blockSize + blockSpacing;
    xBlockCount = Math.ceil(targetObj.offsetWidth / blockAreaSize);
    yBlockCount = Math.ceil(targetObj.offsetHeight / blockAreaSize);

    containerWidth = xBlockCount * blockAreaSize;
    containerHeight = yBlockCount * blockAreaSize;

	grid = generateGrid();

    fillBottom();
    dropShapes();
}

/**
 * Generates an empty grid for marking block positions
 */
function generateGrid(){
	var grid = new Array(xBlockCount);
	for (var x = 0; x < xBlockCount; x++){
		grid[x] = new Array(yBlockCount);
	}
	return grid;
}

/**
 * Adds random bottom blocks
 */
function fillBottom() {
    var fillPart = Math.floor(yBlockCount * 0.9);
    var xAxisCenter = Math.round(xBlockCount / 2);
    var blockInfo = [0, 0];

    // Fill the paper with base blocks
    for (var x = 0; x < xBlockCount; x++) {
        for (var y = fillPart; y <= yBlockCount; y++) {
            var chance = (Math.random() * 101),
                xChance = 0,
                yChance = 0;
            yChance = (0 !== y) ? ((y - fillPart) * 100) / (yBlockCount + 1 - fillPart) : 0;
            if (x <= xAxisCenter) {
                xChance = (0 !== x) ? (x * 100) / xAxisCenter : 0;
            } else {
                xChance = ((xBlockCount - x + 1) * 100) / xAxisCenter;
            }

            var maxChance = (xChance + yChance) * 0.8;

            //paper.text((blockAreaSize * x) + blockAreaSize / 2, (blockAreaSize * y) + blockAreaSize / 2, x);
            if (chance < maxChance) {
                grid[x][y] = true;
                generateBlock(blockAreaSize, blockInfo, (blockAreaSize * x), (blockAreaSize * y));
                //paper.text((blockAreaSize * x) + blockAreaSize / 2, (blockAreaSize * y) + blockAreaSize / 2, y);
            } else {
                grid[x][y] = false;
            }
        }
    }
}
