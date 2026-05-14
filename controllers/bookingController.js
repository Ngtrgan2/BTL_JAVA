const { getDB } = require('../db');
const { ObjectId } = require('mongodb');
const { getPostData, verifyToken, isValidObjectId } = require('../utils');

const createBooking = async (req, res) => {
    try {
        const db = getDB();
        const body = await getPostData(req);
        const data = JSON.parse(body);

        const decoded = verifyToken(req);
        const actualUserId = decoded ? decoded.id : null;

        const booking = {
            userId: actualUserId,
            customerName: data.customerName || '',
            phone: data.phone || '',
            email: data.email || '',
            category: data.category || '',
            date: data.date || '',
            time: data.time || data.timeSlot || '',
            note: data.note || '',
            productIds: data.productIds || [],
            status: 'pending',
            createdAt: new Date()
        };

        const result = await db.collection('bookings').insertOne(booking);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Booking created', id: result.insertedId }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};


const getBookings = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Unauthorized' }));
        }

        const db = getDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
        
        if (!user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User not found' }));
        }

        let query = {};
        // If not admin/staff, only show their own bookings
        if (user.role !== 'admin' && user.role !== 'staff') {
            query = { 
                $or: [
                    { userId: decoded.id },
                    { userId: new ObjectId(decoded.id) }
                ] 
            };
        }

        const bookings = await db.collection('bookings').find(query).toArray();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(bookings));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

const updateBooking = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Unauthorized' }));
        }

        const db = getDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
        if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Forbidden' }));
        }

        const id = req.url.split('/')[3];
        if (!isValidObjectId(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'ID không hợp lệ' }));
        }
        
        const body = await getPostData(req);
        const { status } = JSON.parse(body);

        const result = await db.collection('bookings').updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        );

        if (result.matchedCount === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Booking not found' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Booking updated' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

const deleteBooking = async (req, res) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Unauthorized' }));
        }

        const db = getDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
        if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Forbidden' }));
        }

        const id = req.url.split('/')[3];
        if (!isValidObjectId(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'ID không hợp lệ' }));
        }

        const result = await db.collection('bookings').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Booking not found' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Booking deleted' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
    }
};

module.exports = { createBooking, getBookings, updateBooking, deleteBooking };
