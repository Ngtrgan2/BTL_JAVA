const fs = require('fs');
const path = require('path');
const { register, login, updateProfile, getUsers, updateUserRole, googleLogin, forgotPassword, resetPassword, seedAdmin, updateUserInfo, deleteUser, toggleBanUser } = require('./controllers/userController');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, applyGlobalDiscount, likeProduct, shareProduct, shareSEO, seedAll, getLikedProducts } = require('./controllers/productController');
const { createOrder, getOrders, getOrderById, updateOrder, deleteOrder } = require('./controllers/orderController');
const { createBooking, getBookings, updateBooking, deleteBooking } = require('./controllers/bookingController');
const { getWarrantyByCode, getWarranties, updateWarranty, deleteWarranty } = require('./controllers/warrantyController');
const { chatResponse } = require('./controllers/chatController');
const { getNews, createNews, updateNews, deleteNews } = require('./controllers/newsController');
const { getComments, createComment, likeComment, deleteComment } = require('./controllers/commentController');
const { getAIContext } = require('./controllers/aiController');
const { getDiscounts, createDiscount, updateDiscount, deleteDiscount, validateDiscount } = require('./controllers/discountController');

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

    // Seed All Data Route
    if (url === '/api/seed-all' && method === 'GET') {
        const { seedAll } = require('./controllers/productController');
        return seedAll(req, res);
    }

    // API Routes - Auth & Users
    if (url === '/api/auth/register' && method === 'POST') {
        return register(req, res);
    }
    if (url === '/api/auth/login' && method === 'POST') {
        return login(req, res);
    }
    if (url === '/api/auth/forgot-password' && method === 'POST') {
        return forgotPassword(req, res);
    }
    if (url === '/api/auth/reset-password' && method === 'POST') {
        return resetPassword(req, res);
    }

    if (url === '/api/users/profile' && method === 'PUT') {
        return updateProfile(req, res);
    }
    if (url === '/api/users' && method === 'GET') {
        return getUsers(req, res);
    }
    if (url === '/api/users/liked-products' && method === 'GET') {
        return getLikedProducts(req, res);
    }
    if (url.match(/\/api\/users\/[^\/]+\/info$/) && method === 'PUT') {
        return updateUserInfo(req, res);
    }
    if (url.match(/\/api\/users\/[^\/]+\/ban$/) && method === 'PUT') {
        return toggleBanUser(req, res);
    }
    if (url.startsWith('/api/users/') && method === 'DELETE') {
        return deleteUser(req, res);
    }
    if (url.startsWith('/api/users/') && method === 'PUT') {
        return updateUserRole(req, res);
    }

    // API Routes - Products
    if (url.startsWith('/api/products') && url.includes('?')) {
        // match /api/products?sort=popular
        return getProducts(req, res);
    }
    if (url === '/api/products' && method === 'GET') {
        return getProducts(req, res);
    }
    
    // API Routes - Comments
    if (url.startsWith('/api/comments') && method === 'GET') {
        // match /api/comments?productId=...
        return getComments(req, res);
    }
    if (url === '/api/comments' && method === 'POST') {
        return createComment(req, res);
    }
    if (url.startsWith('/api/comments/') && url.endsWith('/like') && method === 'PUT') {
        return likeComment(req, res);
    }
    if (url.startsWith('/api/comments/') && method === 'DELETE') {
        return deleteComment(req, res);
    }

    // API Routes - AI Context
    if (url === '/api/ai-data' && method === 'GET') {
        return getAIContext(req, res);
    }

    if (url === '/api/products' && method === 'POST') {
        return createProduct(req, res);
    }
    if (url === '/api/admin/products/global-discount' && method === 'POST') {
        return applyGlobalDiscount(req, res);
    }
    if (url.startsWith('/api/products/') && method === 'GET') {
        return getProductById(req, res);
    }
    if (url.startsWith('/api/products/') && method === 'PUT' && !url.includes('/like') && !url.includes('/share')) {
        return updateProduct(req, res);
    }
    if (url.match(/^\/api\/products\/[^\/]+\/like$/) && method === 'PUT') {
        return likeProduct(req, res);
    }
    if (url.match(/^\/api\/products\/[^\/]+\/share$/) && method === 'PUT') {
        return shareProduct(req, res);
    }
    if (url.startsWith('/api/products/') && method === 'DELETE') {
        return deleteProduct(req, res);
    }
    
    // SEO Share Route
    if (url.startsWith('/share/product/') && method === 'GET') {
        return shareSEO(req, res);
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
    if (url === '/api/warranties' && method === 'GET') {
        return getWarranties(req, res);
    }
    if (url.startsWith('/api/warranties/') && method === 'PUT') {
        return updateWarranty(req, res);
    }
    if (url.startsWith('/api/warranties/') && method === 'DELETE') {
        return deleteWarranty(req, res);
    }
    if (url.startsWith('/api/warranty/') && method === 'GET') {
        return getWarrantyByCode(req, res);
    }
    
    // API Routes - Discounts
    if (url.startsWith('/api/discounts/validate/') && method === 'GET') {
        return validateDiscount(req, res);
    }
    if (url === '/api/discounts' && method === 'GET') {
        return getDiscounts(req, res);
    }
    if (url === '/api/discounts' && method === 'POST') {
        return createDiscount(req, res);
    }
    if (url.startsWith('/api/discounts/') && method === 'PUT') {
        return updateDiscount(req, res);
    }
    if (url.startsWith('/api/discounts/') && method === 'DELETE') {
        return deleteDiscount(req, res);
    }
    
    // API Routes - News
    if (url === '/api/news' && method === 'GET') {
        return getNews(req, res);
    }
    if (url === '/api/news' && method === 'POST') {
        return createNews(req, res);
    }
    if (url.startsWith('/api/news/') && method === 'PUT') {
        return updateNews(req, res);
    }
    if (url.startsWith('/api/news/') && method === 'DELETE') {
        return deleteNews(req, res);
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
