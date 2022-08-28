import express from 'express';
import { join } from 'path';
const app = express();
const PORT = 3000;

app.use(express.static(join(__dirname, 'public')));

app.get('/*', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.listen(PORT);
console.log(`listen on port: ${PORT}`);
