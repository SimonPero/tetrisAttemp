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

let block = {
    matrix: Array.from({ length: 24 }, () => Array(10).fill(0)),
};

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

function getShape() {
    const shapes = [
        [[1], [1], [1], [1]],
        [
            [1, 1, 0],
            [0, 1, 1]
        ],
        [
            [0, 1, 1],
            [1, 1, 0]
        ],
        [
            [1, 1],
            [1, 1]
        ],
        [
            [1, 0],
            [1, 0],
            [1, 1]
        ],
        [
            [0, 1],
            [0, 1],
            [1, 1]
        ],
        [
            [0, 1, 0],
            [1, 1, 1]
        ]
    ];
    return shapes[Math.floor(Math.random() * shapes.length)];
}

function startGame() {
    let currentY = 0;
    let currentX = 4;
    let piece = getShape();

    document.addEventListener("keyup", (event) => {
        switch (event.key) {
            case "ArrowLeft":
                if (canMove(piece, currentY, currentX - 1)) {
                    markVisited(block.matrix);
                    deleteTetromino(block, 0, 0);
                    currentX -= 1;
                    insertMatrix(block.matrix, piece, currentY, currentX);
                    drawTetromino(block, 0, 0);
                }
                break;
            case "ArrowRight":
                if (canMove(piece, currentY, currentX + 1)) {
                    markVisited(block.matrix);
                    deleteTetromino(block, 0, 0);
                    currentX += 1;
                    insertMatrix(block.matrix, piece, currentY, currentX);
                    drawTetromino(block, 0, 0);
                }
                break;
            case "ArrowDown":
                if (canMove(piece, currentY + 1, currentX)) {
                    markVisited(block.matrix);
                    deleteTetromino(block, 0, 0);
                    currentY += 1;
                    insertMatrix(block.matrix, piece, currentY, currentX);
                    drawTetromino(block, 0, 0);
                }
                break;
        }
    });

    setInterval(function () {
        let colition = detectCollisions(block.matrix)
        if (colition) {
            markOld(block.matrix)
            piece = getShape();
            currentY = 0
        }
        if (currentY > 0) {
            markVisited(block.matrix);
            if (currentY > 1) {
                deleteTetromino(block, 0, 0);
            }
        }
        insertMatrix(block.matrix, piece, currentY, currentX);
        drawTetromino(block, 0, 0);
        if (canMove(piece, currentY + 1, currentX)) {
            currentY += 1;
        } else {
            markOld(block.matrix);
            piece = getShape();
            currentY = 0;
            currentX = 4;
            if (!canMove(piece, currentY, currentX)) {
                // Game Over //revisar
                alert("Game Over");
                clearInterval(this);
            }
        }
    }, 1000);
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

function checkCollision(matrix, row, col) {
    const directions = [
        { dr: 1, dc: 0 },  // Abajo
    ];

    for (const { dr, dc } of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < matrix.length && newCol >= 0 && newCol < matrix[0].length && matrix[newRow][newCol] === 2) {
            return true;
        }
    }

    return false;
}

function detectCollisions(matrix) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] === 1 && checkCollision(matrix, row, col)) {
                return true;
            }
        }
    }
    return false;
}

function canMove(matrix, offsetY, offsetX) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col]) {
                let newX = col + offsetX;
                let newY = row + offsetY;

                // Verificar si la nueva posición está fuera de los límites del tablero
                if (newY >= block.matrix.length || newX < 0 || newX >= block.matrix[0].length) {
                    return false;
                }

                // Verificar si hay un 2 en la nueva posición
                if (block.matrix[newY][newX] === 2) {
                    return false;
                }
            }
        }
    }
    return true;
}