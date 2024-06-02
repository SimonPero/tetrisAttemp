let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
context.lineWidth = 1;
context.strokeStyle = "#FFFFFFFF";

// Ancho del canvas
let canvasWidth = canvas.width;
// Alto del canvas
let canvasHeight = canvas.height;
// Ancho de cada columna
let cellWidth = 20;
// Altura de cada fila
let cellHeight = 20;

// Dibujar líneas verticales
for (var x = 0; x <= canvasWidth; x += cellWidth) {
    context.moveTo(x, 0);
    context.lineTo(x, canvasHeight);
}

// Dibujar líneas horizontales
for (var y = 0; y <= canvasHeight; y += cellHeight) {
    context.moveTo(0, y);
    context.lineTo(canvasWidth, y);
}

context.stroke();

const square = {
    matrix: [
        [1, 1],
        [1, 1]
    ],
    height: 2
};
const stick = {
    matrix: [
        [1],
        [1],
        [1],
        [1]
    ],
    height: 4
};
const z = {
    matrix: [
        [1, 1, 0],
        [0, 1, 1]
    ],
    height: 2
};
const reverse_z = {
    matrix: [
        [0, 1, 1],
        [1, 1, 0]
    ],
    height: 2
};
const t = {
    matrix: [
        [0, 1, 0],
        [1, 1, 1]
    ],
    height: 2
};
const l = {
    matrix: [
        [1, 0],
        [1, 0],
        [1, 1]
    ],
    height: 3
};
const reverse_l = {
    matrix: [
        [0, 1],
        [0, 1],
        [1, 1]
    ],
    height: 3
};
let block = {
    matrix: Array.from({ length: 24 }, () => Array(10).fill(0)),
};

const tetrominos = [square, stick, z, reverse_z, t, l, reverse_l];

const cellSize = 20; // Tamaño de cada celda

function drawTetromino(tetromino, offsetX, offsetY) {
    const matrix = tetromino.matrix;
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col]) {
                context.fillStyle = "red";
            } else {
                context.fillStyle = "black";
            }
            context.fillRect((col + offsetX) * cellSize, (row + offsetY) * cellSize, cellSize, cellSize);
            context.strokeRect((col + offsetX) * cellSize, (row + offsetY) * cellSize, cellSize, cellSize);
        }
    }
}

function deleteTetromino(tetromino, offsetX, offsetY) {
    const matrix = tetromino.matrix;
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            context.fillStyle = "black";
            context.fillRect((col + offsetX) * cellSize, (row + offsetY) * cellSize, cellSize, cellSize);
            context.strokeRect((col + offsetX) * cellSize, (row + offsetY) * cellSize, cellSize, cellSize);
        }
    }
}

function insertMatrix(bigMatrix, smallMatrix, startRow, startCol) {
    for (let i = 0; i < smallMatrix.length; i++) {
        for (let j = 0; j < smallMatrix[i].length; j++) {
            if (smallMatrix[i][j]) {
                bigMatrix[startRow + i][startCol + j] = smallMatrix[i][j];
            }
        }
    }
}

function eliminarMatrix(bigMatrix, smallMatrix, startRow, startCol) {
    for (let i = 0; i < smallMatrix.length; i++) {
        for (let j = 0; j < smallMatrix[i].length; j++) {
            if (smallMatrix[i][j]) {
                bigMatrix[startRow + i][startCol + j] = 0;
            }
        }
    }
}

function bfs(matrix, startRow, startCol) {
    const queue = [];
    const directions = [
        { dr: -1, dc: 0 },
        { dr: 1, dc: 0 },
        { dr: 0, dc: -1 },
        { dr: 0, dc: 1 }
    ];
    queue.push({ row: startRow, col: startCol });

    while (queue.length > 0) {
        const { row, col } = queue.shift();
        for (const { dr, dc } of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 1 && newRow < matrix.length && newCol >= 1 && newCol < matrix[0].length && matrix[newRow][newCol] === 2) {
                queue.push({ row: newRow, col: newCol });
                return 0;
            }
        }
    }
}
function bfs2(matrix, startRow, startCol) {
    const queue = [];
    const directions = [
        { dr: -1, dc: 0 },
        { dr: 1, dc: 0 },
        { dr: 0, dc: -1 },
        { dr: 0, dc: 1 }
    ];
    queue.push({ row: startRow, col: startCol });
    matrix[startRow][startCol] = 0; // Marcamos como visitado

    while (queue.length > 0) {
        const { row, col } = queue.shift();
        for (const { dr, dc } of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < matrix.length && newCol >= 0 && newCol < matrix[0].length && matrix[newRow][newCol] === 1) {
                matrix[newRow][newCol] = 0; // Marcamos como visitado
                queue.push({ row: newRow, col: newCol });
            }
        }
    }
}

function markVisited(matrix) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] === 1) {
                bfs2(matrix, row, col);
            }
        }
    }
}
function startGame() {
    let currentY = 0;
    let piece = getRandomTetromino();
    setInterval(function () {
        let colition = colitions(block.matrix)
        if(colition === 0){
            markOld(block.matrix)
            // console.log(block.matrix)
            // piece = getRandomTetromino();
            currentY = 0
        }
        if (currentY > 0) {
            markVisited(block.matrix);
            if (currentY > 1) {
                deleteTetromino(block, 0, 0);
            }
        }
        console.log(block.matrix)
        insertMatrix(block.matrix, t.matrix, currentY, 0);
        drawTetromino(block, 0, 0);
        currentY += 1;
        if (currentY === 5) {
            markOld(block.matrix)
            console.log(block.matrix)
            //piece = getRandomTetromino();
            currentY = 0;
        }
    }, 3000);
}

function markOld(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 1) {
                matrix[i][j] = 2;
            }
        }
    }
}

function colitions(matrix) {
    let colition = 1
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] === 1) {
                colition = bfs(matrix, row, col);
            }
        }
    }
    return colition
}

function getRandomTetromino() {
    const randomIndex = Math.floor(Math.random() * tetrominos.length);
    return tetrominos[randomIndex];
}