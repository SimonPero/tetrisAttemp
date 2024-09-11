import DrawUi from "./tetris/tetrisUi/drawUi.js";
import ColisionLogic from "./tetris/tetrisLogic/colisionsLogic.js";
import PiecesListLogic from "./tetris/tetrisLogic/futurePiecesLogic.js";
import MatrixLogic from "./tetris/tetrisLogic/matrixLogic.js";
import DeleteRowLogic from "./tetris/tetrisLogic/deleteRowsLogic.js";
const deleteRowManager = new DeleteRowLogic();
const matrixManager = new MatrixLogic();
const piecesListManager = new PiecesListLogic();
const colosionManager = new ColisionLogic();
const drawManager = new DrawUi();
//valores generales
let puntos = 0;
const cellSize = 20;
//canvas-principal
let canvasPrincipal = document.getElementById("canvas");
let contextPrincipal = canvasPrincipal.getContext("2d");
contextPrincipal.lineWidth = 1;
contextPrincipal.strokeStyle = "#FFFFFFFF";
let canvasWidthPrincipal = canvasPrincipal.width;
let canvasHeightPrincipal = canvasPrincipal.height;
const tetrisPrincipal = {
    context: contextPrincipal, canvasWidth: canvasWidthPrincipal, canvasHeight: canvasHeightPrincipal
};
//canvas-guardado
let canvasSaved = document.getElementById("saved-block");
let contextSaved = canvasSaved.getContext("2d");
contextSaved.lineWidth = 1;
contextSaved.strokeStyle = "#FFFFFFFF";
let canvasWidthSaved = canvasSaved.width;
let canvasHeightSaved = canvasSaved.height;
const tetrisSaved = { context: contextSaved, canvasWidth: canvasWidthSaved, canvasHeight: canvasHeightSaved };
//canvas-lista
let canvasList = document.getElementById("future-blocks");
let contextList = canvasList.getContext("2d");
contextList.lineWidth = 1;
contextList.strokeStyle = "#FFFFFFFF";
let canvasWidthList = canvasList.width;
let canvasHeightList = canvasList.height;
const tetrisList = { context: contextList, canvasWidth: canvasWidthList, canvasHeight: canvasHeightList };
//matrices logicas de 0
let block = {
    matrix: Array.from({ length: 24 }, () => Array(10).fill(0)),
};
let block_saved = {
    matrix: Array.from({ length: 6 }, () => Array(6).fill(0)),
};
//Lista de las proximas piezas a usar
let pieceQueue = [];
const maxQueueSize = 4;
//draw tetris grids 
drawManager.drawGrids(tetrisPrincipal, tetrisList, tetrisSaved, cellSize);
//funcion para iniciar el juego
export function startGame() {
    const startButton = document.getElementById("startButton");
    startButton.disabled = true;
    let currentY = 0;
    let currentX = 4;
    let interval = 1000;
    let level = 300;
    let intervalId;
    //intervalo de tiempo para la caida de las piezas
    //mover afuera el gameloop pa que quede más limpio con todo lo necesario
    function gameLoop() {
        let collision = colosionManager.detectCollisions(block.matrix);
        if (puntos >= level) {
            level += 300;
            if (interval !== 100) {
                interval = interval - 100;
            }
            clearInterval(intervalId);
            intervalId = setInterval(gameLoop, interval); // Reinicia el intervalo con el nuevo valor
        }
        if (collision) {
            colosionManager.markOld(block.matrix);
            let result = deleteRowManager.eliminarFilasCompletas(block.matrix, puntos);
            block.matrix = result.matrix;
            puntos = result.puntos;
            piece = piecesListManager.getNextPiece(tetrisList, pieceQueue, cellSize);
            pieceQueue = piecesListManager.addPieceToQueue(pieceQueue, maxQueueSize, tetrisList, cellSize);
            currentY = 0;
            currentX = 4;
            coolDown = 0;
            if (!colosionManager.canMove(block, piece, currentY, currentX)) {
                // Game Over
                startButton.disabled = false;
                alert("Game Over");
                clearInterval(intervalId);
                //cambiar a futuro cuando lo vaya a hostear para evitar peticiones
                location.reload();
            }
        }
        if (currentY > 0) {
            matrixManager.markVisited(block.matrix);
            if (currentY > 1) {
                drawManager.deleteTetromino(block, 0, 0, tetrisPrincipal, cellSize);
            }
        }
        matrixManager.insertMatrix(block.matrix, piece, currentY, currentX);
        drawManager.drawTetromino(block, 0, 0, tetrisPrincipal, cellSize);
        if (colosionManager.canMove(block, piece, currentY + 1, currentX)) {
            currentY += 1;
        }
        else {
            colosionManager.markOld(block.matrix);
            let result = deleteRowManager.eliminarFilasCompletas(block.matrix, puntos);
            block.matrix = result.matrix;
            puntos = result.puntos;
            piece = piecesListManager.getNextPiece(tetrisList, pieceQueue, cellSize);
            pieceQueue = piecesListManager.addPieceToQueue(pieceQueue, maxQueueSize, tetrisList, cellSize);
            currentY = 0;
            currentX = 4;
            coolDown = 0;
            if (!colosionManager.canMove(block, piece, currentY, currentX)) {
                // Game Over
                startButton.disabled = false;
                alert("Game Over");
                clearInterval(intervalId);
                //cambiar a futuro cuando lo vaya a hostear para evitar peticiones
                location.reload();
            }
        }
    }
    pieceQueue = piecesListManager.addPieceToQueue(pieceQueue, maxQueueSize, tetrisList, cellSize);
    pieceQueue = piecesListManager.addPieceToQueue(pieceQueue, maxQueueSize, tetrisList, cellSize);
    pieceQueue = piecesListManager.addPieceToQueue(pieceQueue, maxQueueSize, tetrisList, cellSize);
    pieceQueue = piecesListManager.addPieceToQueue(pieceQueue, maxQueueSize, tetrisList, cellSize);
    let piece = piecesListManager.getNextPiece(tetrisList, pieceQueue, cellSize);
    let coolDown = 0;
    let savedPiece = null;
    drawManager.drawQueue(tetrisList, pieceQueue, cellSize);
    //Movimientos permitidos del jugador
    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowLeft":
                if (colosionManager.canMove(block, piece, currentY, currentX - 1)) {
                    matrixManager.markVisited(block.matrix);
                    drawManager.deleteTetromino(block, 0, 0, tetrisPrincipal, cellSize);
                    currentX -= 1;
                    matrixManager.insertMatrix(block.matrix, piece, currentY, currentX);
                    drawManager.drawTetromino(block, 0, 0, tetrisPrincipal, cellSize);
                }
                break;
            case "ArrowRight":
                if (colosionManager.canMove(block, piece, currentY, currentX + 1)) {
                    matrixManager.markVisited(block.matrix);
                    drawManager.deleteTetromino(block, 0, 0, tetrisPrincipal, cellSize);
                    currentX += 1;
                    matrixManager.insertMatrix(block.matrix, piece, currentY, currentX);
                    drawManager.drawTetromino(block, 0, 0, tetrisPrincipal, cellSize);
                }
                break;
            case "ArrowUp":
                let { pieza: rotatedPiece, offsetX } = colosionManager.rotation(block.matrix, piece, currentX, currentY);
                if (colosionManager.canMove(block, rotatedPiece, currentY, currentX + offsetX)) {
                    matrixManager.markVisited(block.matrix);
                    drawManager.deleteTetromino(block, 0, 0, tetrisPrincipal, cellSize);
                    piece = rotatedPiece;
                    currentX += offsetX;
                    matrixManager.insertMatrix(block.matrix, piece, currentY, currentX);
                    drawManager.drawTetromino(block, 0, 0, tetrisPrincipal, cellSize);
                }
                break;
            case "ArrowDown":
                if (colosionManager.canMove(block, piece, currentY + 1, currentX)) {
                    matrixManager.markVisited(block.matrix);
                    drawManager.deleteTetromino(block, 0, 0, tetrisPrincipal, cellSize);
                    currentY += 1;
                    matrixManager.insertMatrix(block.matrix, piece, currentY, currentX);
                    drawManager.drawTetromino(block, 0, 0, tetrisPrincipal, cellSize);
                }
                break;
            case "c":
            case "C":
                if (savedPiece && coolDown === 0) {
                    let temp = piece;
                    piece = savedPiece;
                    savedPiece = temp;
                    matrixManager.markVisited(block.matrix);
                    matrixManager.markVisited(block_saved.matrix);
                    drawManager.deleteTetromino(block_saved, 0, 0, tetrisSaved, cellSize);
                    drawManager.deleteTetromino(block, 0, 0, tetrisPrincipal, cellSize);
                    currentY = 0;
                    currentX = 4;
                    matrixManager.insertMatrix(block_saved.matrix, savedPiece, 1, 2);
                    drawManager.drawTetromino(block, 0, 0, tetrisPrincipal, cellSize);
                    drawManager.drawTetromino(block_saved, 0, 0, tetrisSaved, cellSize);
                    coolDown = 1;
                }
                else if (coolDown === 0) {
                    savedPiece = piece;
                    piece = piecesListManager.getNextPiece(tetrisList, pieceQueue, cellSize);
                    matrixManager.markVisited(block.matrix);
                    matrixManager.markVisited(block_saved.matrix);
                    drawManager.deleteTetromino(block_saved, 0, 0, tetrisSaved, cellSize);
                    drawManager.deleteTetromino(block, 0, 0, tetrisPrincipal, cellSize);
                    currentY = 0;
                    currentX = 4;
                    matrixManager.insertMatrix(block_saved.matrix, savedPiece, 1, 2);
                    drawManager.drawTetromino(block, 0, 0, tetrisPrincipal, cellSize);
                    drawManager.drawTetromino(block_saved, 0, 0, tetrisSaved, cellSize);
                    coolDown = 1;
                }
                break;
        }
    });
    intervalId = setInterval(gameLoop, interval);
}
document.getElementById('startButton').addEventListener('click', startGame);
