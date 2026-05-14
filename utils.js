const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const secret = process.env.JWT_SECRET || 'anluxury_secret_key_2026';

function getPostData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                resolve(body);
            });
        } catch (error) {
            reject(error);
        }
    });
}

function verifyToken(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}

function isValidObjectId(id) {
    if (!id) return false;
    return ObjectId.isValid(id) && (new String(id).length === 12 || new String(id).length === 24);
}

module.exports = { getPostData, verifyToken, isValidObjectId };
