import express from "express"
import tetrisRouter from "./routes/tetris.routes.js";

const app = express();
const PORT = process.env.PORT || 8070

app.use('/api/game', tetrisRouter);

app.get('/', (req, res) => {
    res.redirect('/api/game');
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});