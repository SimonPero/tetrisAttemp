let puntos = 0;
//canvas-principal
let canvasPrincipal = document.getElementById("canvas");
let contextPrincipal = canvasPrincipal.getContext("2d");
contextPrincipal.lineWidth = 1;
contextPrincipal.strokeStyle = "#FFFFFFFF";
let canvasWidthPrincipal = canvasPrincipal.width;
let canvasHeightPrincipal = canvasPrincipal.height;
let cellWidthPrincipal = 20;
let cellHeightPrincipal = 20;

//canvas-guardado
let canvasSaved = document.getElementById("saved-block");
let contextSaved = canvasSaved.getContext("2d");
contextSaved.lineWidth = 1;
contextSaved.strokeStyle = "#FFFFFFFF";
let canvasWidthSaved = canvasSaved.width;
let canvasHeightSaved = canvasSaved.height;
let cellWidthSaved = 20;
let cellHeightSaved = 20;

//canvas-lista
let canvasList = document.getElementById("future-blocks");
let contextList = canvasList.getContext("2d");
contextList.lineWidth = 1;
contextList.strokeStyle = "#FFFFFFFF";
let canvasWidthList = canvasList.width;
let canvasHeightList = canvasList.height;
let cellWidthList = 20;
let cellHeightList = 20;
drawGrid(canvasHeightPrincipal, canvasWidthPrincipal, cellWidthPrincipal, cellHeightPrincipal, contextPrincipal)
drawGrid(canvasHeightSaved, canvasWidthSaved, cellWidthSaved, cellHeightSaved, contextSaved)
drawGrid(canvasHeightList, canvasWidthList, cellWidthList, cellHeightList, contextList)

function drawGrid(canvasHeight, canvasWidth, cellWidth, cellHeight, context) {
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
}


let block = {
    matrix: Array.from({ length: 24 }, () => Array(10).fill(0)),
};
let block_saved = {
    matrix: Array.from({ length: 6 }, () => Array(6).fill(0)),
};
let block_list = {
    matrix: Array.from({ length: 11 }, () => Array(4).fill(0)),
};
const cellSize = 20; // Tamaño de cada celda

let pieceQueue = [];
const maxQueueSize = 4;

function drawQueue() {
    // Limpiar el canvas de la lista
    contextList.clearRect(0, 0, canvasWidthList, canvasHeightList);

    // Dibujar cada pieza en la cola
    for (let i = 0; i < pieceQueue.length; i++) {
        let piece = pieceQueue[i];
        // Calcula la posición de la pieza en el canvas
        let offsetX = 0;
        let offsetY = i * (cellHeightList * 4); // Asumiendo que cada pieza ocupa 4 celdas de altura
        drawTetromino({ matrix: piece }, offsetX, offsetY, contextList);
    }
}

function addPieceToQueue() {
    if (pieceQueue.length >= maxQueueSize) {
        pieceQueue.shift(); // Elimina la pieza más antigua
    }
    pieceQueue.push(getShape());
    drawQueue(); // Actualizar la visualización de la cola
}

function getNextPiece() {
    if (pieceQueue.length > 0) {
        const nextPiece = pieceQueue.shift(); // Retira la pieza más antigua
        drawQueue(); // Actualizar la visualización de la cola
        return nextPiece;
    } else {
        return getShape();
    }
}

function drawTetromino(tetromino, offsetX, offsetY, context) {
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

function deleteTetromino(tetromino, offsetX, offsetY, context) {
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
    let interval = 1000;
    let level = 50; 
    let intervalId;

    function gameLoop() {
        let collision = detectCollisions(block.matrix);
        if (puntos >= level) {
            level += 50;
            if(interval !==100){
                interval = interval - 100;
            }
            clearInterval(intervalId);
            intervalId = setInterval(gameLoop, interval); // Reinicia el intervalo con el nuevo valor
        }
        if (collision) {
            markOld(block.matrix);
            block.matrix = eliminarFilasCompletas(block.matrix);
            piece = getNextPiece();
            addPieceToQueue();
            currentY = 0;
            currentX = 4;
            coolDown = 0;
            if (!canMove(piece, currentY, currentX)) {
                // Game Over
                alert("Game Over");
                clearInterval(intervalId);
            }
        }
        if (currentY > 0) {
            markVisited(block.matrix);
            if (currentY > 1) {
                deleteTetromino(block, 0, 0, contextPrincipal);
            }
        }
        insertMatrix(block.matrix, piece, currentY, currentX);
        drawTetromino(block, 0, 0, contextPrincipal);
        if (canMove(piece, currentY + 1, currentX)) {
            currentY += 1;
        } else {
            markOld(block.matrix);
            block.matrix = eliminarFilasCompletas(block.matrix);
            piece = getNextPiece();
            addPieceToQueue();
            currentY = 0;
            currentX = 4;
            coolDown = 0;
            if (!canMove(piece, currentY, currentX)) {
                // Game Over
                alert("Game Over");
                clearInterval(intervalId);
            }
        }
    }

    addPieceToQueue();
    addPieceToQueue();
    addPieceToQueue();
    addPieceToQueue();
    let piece = getNextPiece();
    let coolDown = 0;
    let savedPiece = null;
    drawQueue();

    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowLeft":
                if (canMove(piece, currentY, currentX - 1)) {
                    markVisited(block.matrix);
                    deleteTetromino(block, 0, 0, contextPrincipal);
                    currentX -= 1;
                    insertMatrix(block.matrix, piece, currentY, currentX);
                    drawTetromino(block, 0, 0, contextPrincipal);
                }
                break;
            case "ArrowRight":
                if (canMove(piece, currentY, currentX + 1)) {
                    markVisited(block.matrix);
                    deleteTetromino(block, 0, 0, contextPrincipal);
                    currentX += 1;
                    insertMatrix(block.matrix, piece, currentY, currentX);
                    drawTetromino(block, 0, 0, contextPrincipal);
                }
                break;
            case "ArrowUp":
                let { pieza: rotatedPiece, offsetX } = rotacion(piece, currentX, currentY);
                if (canMove(rotatedPiece, currentY, currentX + offsetX)) {
                    markVisited(block.matrix);
                    deleteTetromino(block, 0, 0, contextPrincipal);
                    piece = rotatedPiece;
                    currentX += offsetX;
                    insertMatrix(block.matrix, piece, currentY, currentX);
                    drawTetromino(block, 0, 0, contextPrincipal);
                }
                break;
            case "ArrowDown":
                if (canMove(piece, currentY + 1, currentX)) {
                    markVisited(block.matrix);
                    deleteTetromino(block, 0, 0, contextPrincipal);
                    currentY += 1;
                    insertMatrix(block.matrix, piece, currentY, currentX);
                    drawTetromino(block, 0, 0, contextPrincipal);
                }
                break;
            case "c":
            case "C":
                if (savedPiece && coolDown === 0) {
                    let temp = piece;
                    piece = savedPiece;
                    savedPiece = temp;
                    markVisited(block.matrix);
                    markVisited(block_saved.matrix);
                    deleteTetromino(block_saved, 0, 0, contextSaved);
                    deleteTetromino(block, 0, 0, contextPrincipal);
                    currentY = 0;
                    currentX = 4;
                    insertMatrix(block_saved.matrix, savedPiece, 1, 2);
                    drawTetromino(block, 0, 0, contextPrincipal);
                    drawTetromino(block_saved, 0, 0, contextSaved);
                    coolDown = 1;
                } else if (coolDown === 0) {
                    savedPiece = piece;
                    piece = getNextPiece();
                    markVisited(block.matrix);
                    markVisited(block_saved.matrix);
                    deleteTetromino(block_saved, 0, 0, contextSaved);
                    deleteTetromino(block, 0, 0, contextPrincipal);
                    currentY = 0;
                    currentX = 4;
                    insertMatrix(block_saved.matrix, savedPiece, 1, 2);
                    drawTetromino(block, 0, 0, contextPrincipal);
                    drawTetromino(block_saved, 0, 0, contextSaved);
                    coolDown = 1;
                }
                break;
        }
    });

    intervalId = setInterval(gameLoop, interval);
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
                // Check if the new position is out of bounds
                if (newY >= block.matrix.length || newX < 0 || newX >= block.matrix[0].length) {
                    return false;
                }
                // Check if the new position is occupied
                if (block.matrix[newY][newX] === 2) {
                    return false;
                }
            }
        }
    }
    return true;
}


function rotacion(pieza, posX, posY) {
    if (pieza.length === 2 && pieza[0].length === 2) {
        return pieza; // No rotation needed for square
    }
    let filas = pieza.length;
    let columnas = pieza[0].length;
    let nuevo = Array.from({ length: columnas }, () => Array(filas).fill(0));

    for (let c = 0; c < columnas; c++) {
        for (let f = 0; f < filas; f++) {
            nuevo[c][filas - 1 - f] = pieza[f][c];
        }
    }

    // Check if the rotated piece is out of bounds and adjust if necessary
    let offsetX = 0;
    if (posX + nuevo[0].length > block.matrix[0].length) {
        offsetX = block.matrix[0].length - (posX + nuevo[0].length);
    } else if (posX < 0) {
        offsetX = -posX;
    }

    if (canMove(nuevo, posY, posX + offsetX)) {
        return { pieza: nuevo, offsetX };
    }
    return { pieza, offsetX: 0 };
}

function eliminarFilasCompletas(matrix) {
    let rows = matrix.length;
    let cols = matrix[0].length;
    let newMatrix = [];
    for (let r = 0; r < rows; r++) {
        if (!isRowComplete(matrix[r])) {
            newMatrix.push(matrix[r]);
        }
    }
    // Calcular cuántas filas completas se eliminaron
    let rowsDeleted = rows - newMatrix.length;
    // Agregar filas vacías al principio de la matriz
    for (let i = 0; i < rowsDeleted; i++) {
        puntos += 50
        newMatrix.unshift(Array(cols).fill(0));
    }
    document.getElementById("points").innerHTML = puntos;
    return newMatrix;
}

function isRowComplete(row) {
    return row.every(cell => cell === 2);
}