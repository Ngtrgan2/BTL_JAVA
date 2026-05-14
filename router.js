const fs = require('fs');
const path = require('path');
const { register, login, updateProfile, getUsers, updateUserRole, googleLogin } = require('./controllers/userController');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('./controllers/productController');
const { createOrder, getOrders, getOrderById, updateOrder, deleteOrder } = require('./controllers/orderController');
const { createBooking, getBookings, updateBooking, deleteBooking } = require('./controllers/bookingController');
const { getWarrantyByCode } = require('./controllers/warrantyController');
const { chatResponse } = require('./controllers/chatController');

function router(req, res) {
    const fullUrl = req.url;
    let url = fullUrl.split('?')[0]; // Strip query string for matching
    if (url.length > 1 && url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    const method = req.method;

    console.log(`[Router] ${method} ${url}`);

    // CORS Headers
    const origin = req.headers.origin;
    const allowedOrigins = ['http://localhost:5000', 'http://127.0.0.1:5000'];
    
    if (process.env.ALLOWED_ORIGINS) {
        allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
    }

    if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.onrender.com'))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]); 
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS (Preflight)
    if (method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    // API Routes - Google Auth (Moved to top for priority)
    if (url === '/api/auth/google' && method === 'POST') {
        return googleLogin(req, res);
    }

    // Temporary Seed Route (DELETE AFTER USE)
    if (url === '/api/auth/seed' && method === 'GET') {
        const { seedAdmin } = require('./controllers/userController');
        return seedAdmin(req, res);
    }

    // API Routes - Auth & Users
    if (url === '/api/auth/register' && method === 'POST') {
        return register(req, res);
    }
    if (url === '/api/auth/login' && method === 'POST') {
        return login(req, res);
    }

    if (url === '/api/users/profile' && method === 'PUT') {
        return updateProfile(req, res);
    }
    if (url === '/api/users' && method === 'GET') {
        return getUsers(req, res);
    }
    if (url.startsWith('/api/users/') && method === 'PUT') {
        return updateUserRole(req, res);
    }

    // API Routes - Products
    if (url === '/api/products' && method === 'GET') {
        return getProducts(req, res);
    }
    if (url === '/api/products' && method === 'POST') {
        return createProduct(req, res);
    }
    if (url.startsWith('/api/products/') && method === 'GET') {
        return getProductById(req, res);
    }
    if (url.startsWith('/api/products/') && method === 'PUT') {
        return updateProduct(req, res);
    }
    if (url.startsWith('/api/products/') && method === 'DELETE') {
        return deleteProduct(req, res);
    }

    // API Routes - Orders
    if (url === '/api/orders' && method === 'POST') {
        return createOrder(req, res);
    }
    if (url === '/api/orders' && method === 'GET') {
        return getOrders(req, res);
    }
    if (url.startsWith('/api/orders/') && method === 'GET') {
        return getOrderById(req, res);
    }
    if (url.startsWith('/api/orders/') && method === 'PUT') {
        return updateOrder(req, res);
    }
    if (url.startsWith('/api/orders/') && method === 'DELETE') {
        return deleteOrder(req, res);
    }

    // API Routes - Bookings
    if (url === '/api/bookings' && method === 'POST') {
        return createBooking(req, res);
    }
    if (url === '/api/bookings' && method === 'GET') {
        return getBookings(req, res);
    }
    if (url.startsWith('/api/bookings/') && method === 'PUT') {
        return updateBooking(req, res);
    }
    if (url.startsWith('/api/bookings/') && method === 'DELETE') {
        return deleteBooking(req, res);
    }

    // API Routes - Chat AI
    if (url === '/api/chat' && method === 'POST') {
        return chatResponse(req, res);
    }

    // API Routes - Warranty
    if (url.startsWith('/api/warranty/') && method === 'GET') {
        return getWarrantyByCode(req, res);
    }

    // If it's an API route but not matched above, return 404 as JSON
    if (url.startsWith('/api/')) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'API endpoint not found' }));
    }

    // Redirect root to /pages/index.html
    if (url === '/') {
        res.writeHead(302, { 'Location': '/pages/index.html' });
        return res.end();
    }

    // Static File Server
    let filePath = path.join(__dirname, 'public', url);
    
    // Safety check for path traversal
    if (!filePath.startsWith(path.join(__dirname, 'public'))) {
        res.writeHead(403);
        return res.end('Forbidden');
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpg'; break;
        case '.webp': contentType = 'image/webp'; break;
        case '.svg': contentType = 'image/svg+xml'; break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}

module.exports = router;
