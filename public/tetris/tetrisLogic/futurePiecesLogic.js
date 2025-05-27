import DrawUi from "../tetrisUi/drawUi.js";
const drawManager = new DrawUi();

export default class PiecesListLogic {
    addPieceToQueue(pieceQueue, maxQueueSize, tetrisList, cellSize) {
        if (pieceQueue.length >= maxQueueSize) {
            pieceQueue.shift(); // Elimina la pieza más antigua
        }
        pieceQueue.push(this.getShape());
        drawManager.drawQueue(tetrisList, pieceQueue, cellSize); // Actualizar la visualización de la cola
        return pieceQueue;
    }

    getNextPiece(tetrisList, pieceQueue, cellSize) {
        if (pieceQueue.length > 0) {
            const nextPiece = pieceQueue.shift(); // Retira la pieza más antigua
            drawManager.drawQueue(tetrisList, pieceQueue, cellSize); // Actualizar la visualización de la cola
            return nextPiece;
        } else {
            return this.getShape();
        }
    }
   getShape() {
    const shapes = [
        { shape: [[1], [1], [1], [1]], color: "red" },          
        { shape: [[1, 1, 0], [0, 1, 1]], color: "green" },      
        { shape: [[0, 1, 1], [1, 1, 0]], color: "blue" },       
        { shape: [[1, 1], [1, 1]], color: "yellow" },           
        { shape: [[1, 0], [1, 0], [1, 1]], color: "purple" },   
        { shape: [[0, 1], [0, 1], [1, 1]], color: "orange" },   
        { shape: [[0, 1, 0], [1, 1, 1]], color: "cyan" }        
    ];
    return shapes[Math.floor(Math.random() * shapes.length)];
}


}