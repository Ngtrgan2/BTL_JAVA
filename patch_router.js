const fs = require('fs');
const path = require('path');

const routerPath = path.join(__dirname, 'router.js');
let routerCode = fs.readFileSync(routerPath, 'utf8');

if (!routerCode.includes('settingsController')) {
    // Inject require
    routerCode = routerCode.replace(
        "const { getAIContext } = require('./controllers/aiController');",
        "const { getAIContext } = require('./controllers/aiController');\nconst { getSettings, updateSettings } = require('./controllers/settingsController');"
    );

    // Inject routes
    const settingsRoutes = `
    // Settings Routes
    if (url === '/api/settings' && method === 'GET') {
        return getSettings(req, res);
    }
    if (url === '/api/settings' && method === 'PUT') {
        return authMiddleware(req, res, () => updateSettings(req, res));
    }
`;
    // Find a good place to inject, like before `if (url === '/api/news' && method === 'GET')`
    routerCode = routerCode.replace(
        "    if (url === '/api/news' && method === 'GET') {",
        settingsRoutes + "\n    if (url === '/api/news' && method === 'GET') {"
    );

    fs.writeFileSync(routerPath, routerCode, 'utf8');
    console.log("Injected settings routes to router.js");
} else {
    console.log("Settings routes already exist in router.js");
}
