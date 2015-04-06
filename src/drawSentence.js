/**
 * Some code I wrote to make a small pleasant surprise for my girlfriend
 */

// Kocham Cię, Kociu!

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

    array.forEach(function(letter) {
        width += letters[letter].w + 2;
    });

    if (width > 0) {
        width -= 2;
    }

    var xOffset = Math.floor((xBlocks - width) / 2);

    array.forEach(function(letter) {
        letters[letter].data.forEach(function(blockInfo) {
            var x = xOffset;
            var y = yOffset;
            setTimeout(function() {
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

drawSentence(fistLine);
drawSentence(secondLine);
drawSentence(thirdLine);

// Endof: Kocham Cię, Kociu!
