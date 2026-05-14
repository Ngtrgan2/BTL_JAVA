const { getDB } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const { getPostData, verifyToken } = require('../utils');
const secret = process.env.JWT_SECRET || 'anluxury_secret_key_2026';

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '911670166045-36d202c5milab1e56vqcm9t3s8j86g9r.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

const register = async (req, res) => {
    try {
        const body = await getPostData(req);
        const { fullName, phone, email, password } = JSON.parse(body);

        if (!fullName || !phone || !email || !password) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Thiếu thông tin' }));
        }

        const db = getDB();
        const users = db.collection('users');

        const userExists = await users.findOne({ email });
        if (userExists) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Email đã tồn tại' }));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            fullName,
            phone,
            email,
            password: hashedPassword,
            role: 'customer',
            createdAt: new Date()
        };

        const result = await users.insertOne(newUser);
        const token = jwt.sign({ id: result.insertedId }, secret, { expiresIn: '30d' });

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            _id: result.insertedId,
            fullName,
            email,
            role: 'customer',
            token
        }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Lỗi server: ' + error.message }));
    }
};

const login = async (req, res) => {
    try {
        const body = await getPostData(req);
        const { email, password } = JSON.parse(body);

        const db = getDB();
        const users = db.collection('users');

        const user = await users.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, secret, { expiresIn: '30d' });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                address: user.address,
                birthday: user.birthday,
                avatar: user.avatar,
                role: user.role,
                token
            }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Sai email hoặc mật khẩu' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Lỗi server' }));
    }
};

const updateProfile = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Unauthorized' }));
        }

        const body = await getPostData(req);
        const { fullName, phone, address, birthday, password, oldPassword, avatar } = JSON.parse(body);
        
        const db = getDB();
        const users = db.collection('users');
        const user = await users.findOne({ _id: new ObjectId(decoded.id) });

        const updateData = { fullName, phone, address, birthday };
        if (avatar) updateData.avatar = avatar;
        
        if (password) {
            if (!oldPassword) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Vui lòng nhập mật khẩu cũ để đổi mật khẩu mới' }));
            }
            if (!(await bcrypt.compare(oldPassword, user.password))) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Mật khẩu cũ không chính xác' }));
            }
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        await users.updateOne(
            { _id: new ObjectId(decoded.id) },
            { $set: updateData }
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Cập nhật thành công' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Lỗi server: ' + error.message }));
    }
};

const getUsers = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Unauthorized' }));
        }

        const db = getDB();
        const users = db.collection('users');
        const currentUser = await users.findOne({ _id: new ObjectId(decoded.id) });

        if (currentUser.role !== 'admin') {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Forbidden' }));
        }

        const allUsers = await users.find({}).sort({ createdAt: -1 }).toArray();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(allUsers));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Lỗi server' }));
    }
};

const updateUserRole = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        const urlParts = req.url.split('/');
        const userId = urlParts[urlParts.length - 1];

        const db = getDB();
        const users = db.collection('users');
        const adminUser = await users.findOne({ _id: new ObjectId(decoded.id) });

        if (!adminUser || adminUser.role !== 'admin') {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Forbidden' }));
        }

        const body = await getPostData(req);
        const { role } = JSON.parse(body);

        await users.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { role } }
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Cập nhật quyền thành công' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Lỗi server' }));
    }
};

const googleLogin = async (req, res) => {
    try {
        const body = await getPostData(req);
        const { token } = JSON.parse(body);

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, picture, sub } = payload;

        const db = getDB();
        const users = db.collection('users');

        let user = await users.findOne({ email });

        if (!user) {
            const newUser = {
                fullName: name,
                email: email,
                avatar: picture,
                googleId: sub,
                role: 'customer',
                createdAt: new Date()
            };
            const result = await users.insertOne(newUser);
            user = { ...newUser, _id: result.insertedId };
        } else if (!user.googleId) {
            await users.updateOne(
                { _id: user._id },
                { $set: { googleId: sub, avatar: user.avatar || picture } }
            );
            user.googleId = sub;
            if (!user.avatar) user.avatar = picture;
        }

        const sysToken = jwt.sign({ id: user._id }, secret, { expiresIn: '30d' });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            birthday: user.birthday || '',
            avatar: user.avatar,
            role: user.role,
            token: sysToken
        }));

    } catch (error) {
        console.error("Google Auth Error:", error);
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Xác thực Google thất bại' }));
    }
};

module.exports = { register, login, updateProfile, getUsers, updateUserRole, googleLogin };
