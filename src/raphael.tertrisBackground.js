function tetrisBackground(options) {
  var paper, targetObj, xBlockCount, yBlockCount, shapeCount, blockSize,
    blockSpacing, animationSpeed, blockAreaSize, blockColor, bottomFill;
  var grid = [];

  function initialize(options) {
    shapeCount = options.shapeCount || 7;
    blockColor = options.blockColor || '#17bee3';
    blockSize = options.blockSize || 9;
    blockSpacing = options.blockSpacing || 1;
    animationSpeed = options.animationSpeed || 400; // less is faster
    bottomFill = options.bottomFill || 0.8;

    targetObj = document.getElementById(options.targetId);
    paper = Raphael(options.targetId, '100%', '100%');

    blockAreaSize = blockSize + blockSpacing;

    // Generate an empty grid for block tracking
    xBlockCount = Math.ceil(targetObj.offsetWidth / blockAreaSize);
    yBlockCount = Math.ceil(targetObj.offsetHeight / blockAreaSize);
    generateGrid();

    // Fill bottom with blocks
    fillBottom();

    // Spawn a first batch of shapes
    spawnShapes();
  }

  /**
   * Generates an empty grid for marking block positions
   */
  function generateGrid() {
    grid = new Array(xBlockCount);
    for (var x = 0; x < xBlockCount; x++) {
      grid[x] = new Array(yBlockCount);
    }
  }

  /**
   * Adds random bottom blocks
   */
  function fillBottom() {
    var yAxisStart = Math.round(yBlockCount * bottomFill);
    var xAxisCenter = Math.round(xBlockCount / 2);

    for (var x = 0; x < xBlockCount; x++) {
      for (var y = yAxisStart; y < yBlockCount; y++) {
        grid[x][y] = placeBlock(xAxisCenter, yAxisStart, x, y);
        if (grid[x][y]) {
          generateBlock([0, 0], blockAreaSize * x, blockAreaSize * y);
        }
      }
    }
  }

  /**
   * Randomly places a block depending on the block cordiantes
   * placing is done by "hill" type placing
   *
   * @param {int} xAxisCenter center by X-axis
   * @param {int} yAxisStart start of of the Y-axis
   * @param {int} x X-axis position
   * @param {int} y Y-axis position
   *
   * @return {boolean}
   */
  function placeBlock(xAxisCenter, yAxisStart, x, y) {
    var chance, maxChance, xChance, yChance;
    chance = Math.random() * 100;

    if (x <= xAxisCenter) {
      xChance = (0 !== x) ? (x * 100) / xAxisCenter : 0;
    } else {
      xChance = ((xBlockCount - x) * 100) / xAxisCenter;
    }
    if (y) {
      yChance = ((y - yAxisStart) * 100) / (yBlockCount - yAxisStart);
    } else {
      yChance = 0;
    }
    maxChance = (xChance + yChance) * bottomFill;

    return chance < maxChance;
  }

  /**
   * Generates the block on certain paper position
   *
   * @param {array} blockInfo Block sizes
   * @param {int} xOffset X-axis position
   * @param {int} yOffset Y-axis postion
   *
   * @returns {object} Raphalel object, the block itself
   */
  function generateBlock(blockInfo, xOffset, yOffset) {
    var xPos = blockAreaSize * blockInfo[0] + xOffset;
    var yPos = blockAreaSize * blockInfo[1] + yOffset;
    var block = paper.rect(xPos, yPos, blockSize, blockSize)
      .attr({
        fill: blockColor,
        "stroke-width": 0,
        'stroke-linejoin': 'miter'
      });
    return block;
  }

  /**
   * Spawns a batch of shapes
   */
  function spawnShapes() {
    spawnShape();
    for (var i = 0; i < shapeCount - 1; i++) {
      timeoutSpawn();
    }
  }

  /**
   * Spawns a shape at random time
   */
  function timeoutSpawn() {
    setTimeout(function() {
      spawnShape();
    }, Math.random() * 24 * 1000);
  }

  /**
   * Spawns a shape
   */
  function spawnShape() {
    var shape = generateShape(getRandomShapeCordinates());
    nextAction(shape);
  }

  function getRandomShapeCordinates() {
    var keys = Object.keys(shapesData),
      keyPos = Math.floor((Math.random() * keys.length));
    return shapesData[keys[keyPos]];
  }

  /**
   * Generates the shape by it's date
   * and placing it above the paper
   * note: needs spaning under random angle
   *
   * @param {object} shapeInfo Object containing shape data
   *
   * @returns {object} shape
   */
  function generateShape(shapeInfo) {
    var rotate = Math.floor(Math.random() * shapeInfo.blocks.length);
    var random = Math.floor(Math.random() * (xBlockCount - shapeInfo.size));
    var shape = {
      size: shapeInfo.size,
      rotate: rotate,
      blocks: shapeInfo.blocks[rotate],
      moving: false,
      xOffset: random,
      yOffset: (rotate % 2 !== 0) ? -1 : 0,
      objects: paper.set()
    };
    var posX = random * blockAreaSize;
    var posY = (rotate % 2 !== 0) ? 0 : -blockAreaSize;
    if (shape.size === 2) {
      posX += blockAreaSize;
      posY += blockAreaSize;
    }

    for (var j in shape.blocks) {
      shape.objects.push(generateBlock(shape.blocks[j], posX, posY));
    }

    return shape;
  }

  /**
   * Takes next shape action
   *
   * @param {object} shape
   */
  function nextAction(shape) {
    if (canMoveDown(shape)) {
      moveShapeDown(shape);
    } else {
      destroyShape(shape);
      timeoutSpawn();
    }
  }

  /**
   * Moves shape down by one block
   *
   * @param {object} shape
   */
  function moveShapeDown(shape) {
    shape.yOffset = shape.yOffset + 1;
    if (!shape.moving) {
      shape.moving = true;
      shape.objects.animate({
        transform: 't0,' + (shape.yOffset * blockAreaSize)
      }, animationSpeed / 2, '<>', function() {
        shape.moving = false;
        setTimeout(function() {
          return nextAction(shape);
        }, animationSpeed);
      });
    }
  }

  /**
   * Destroys the shape
   */
  function destroyShape(shape) {
    shape.objects.animate({
      opacity: 0
    }, 1000, '<>', function() {
      shape.objects.remove();
      shape.objects = null;
      shape = null;
    });
  }

  function canMoveDown(shape) {
    var canMove = true;
    var addY = (shape.rotate % 2 !== 0) ? 1 : 0;
    var addX = 0;
    if (shape.size === 2) {
      addY = 1;
      addX = 1;
    }

    shape.blocks.forEach(function(p) {
      if (canMove) {
        if (undefined !== grid[p[0] + shape.xOffset]) {
          canMove = (!grid[p[0] + shape.xOffset + addX][p[1] + shape.yOffset + addY]);
          if (p[1] + shape.yOffset + addY >= yBlockCount) {
            canMove = false;
          }
        } else {
          canMove = (p[1] < yBlockCount);
        }
      }
    });

    return canMove;
  }

  initialize(options);
}
