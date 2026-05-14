const http = require('http');
require('dotenv').config();
const { connectDB } = require('./db');
const router = require('./router');

const PORT = process.env.PORT || 5000;

async function startServer() {
    // Connect to MongoDB first
    await connectDB();

    const server = http.createServer((req, res) => {
        // Pass everything to router
        router(req, res);
    });

    server.listen(PORT, () => {
        console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
}

startServer();
