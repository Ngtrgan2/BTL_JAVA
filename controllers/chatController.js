const { getDB } = require('../db');
const { getPostData } = require('../utils');
const { ObjectId } = require('mongodb');
const { GoogleGenAI } = require('@google/genai');
const chatResponse = async (req, res) => {
    try {
        const body = await getPostData(req);
        const { message } = JSON.parse(body);

        const db = getDB();
        
        // 1. Prepare Store Context (Products)
        const productsRaw = await db.collection('products').find({}).toArray();
        const products = productsRaw.map(p => ({
            name: p.name,
            category: p.categoryLabel || p.category,
            price: Number(p.price).toLocaleString('vi-VN') + ' ₫',
            stock: Number(p.stock)
        }));

        // 2. Prepare Discounts
        const now = new Date();
        const discountsRaw = await db.collection('discounts').find({ isActive: true }).toArray();
        const activeDiscounts = discountsRaw.filter(d => {
            if (d.expiryDate && new Date(d.expiryDate) < now) return false;
            if (d.maxUsage && d.usedCount >= d.maxUsage) return false;
            return true;
        }).map(d => ({
            code: d.code,
            type: d.discountType === 'percent' ? 'Giảm theo %' : 'Giảm tiền mặt',
            value: d.discountType === 'percent' ? `${d.discountValue}%` : `${Number(d.discountValue).toLocaleString('vi-VN')} ₫`
        }));

        // 3. Prepare System Prompt
        const prompt = `
Bạn là một nữ chuyên viên tư vấn bán hàng chuyên nghiệp, duyên dáng và thanh lịch của hệ thống trang sức cao cấp "An LUXURY" (Địa chỉ: 21/33 Bạch Đằng, Việt Nam. Hotline: 0392326230). 
Nhiệm vụ của bạn là trả lời khách hàng một cách lịch sự, thân thiện và ngắn gọn (tối đa 3-4 câu).
Đừng nói lan man, hãy tập trung trả lời đúng trọng tâm. Nếu khách hỏi về sản phẩm, hãy cung cấp giá cả.

THÔNG TIN SẢN PHẨM HIỆN CÓ:
${JSON.stringify(products, null, 2)}

MÃ GIẢM GIÁ ĐANG HOẠT ĐỘNG:
${JSON.stringify(activeDiscounts, null, 2)}

Câu hỏi của khách hàng: "${message}"
Câu trả lời của bạn:
`;

        // 4. Call Gemini AI
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Missing GEMINI_API_KEY in environment variables.");
        }
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        const reply = response.text || "Dạ, hiện tại hệ thống đang bận một chút, anh/chị vui lòng đợi trong giây lát hoặc liên hệ hotline nhé!";

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply }));
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Xin lỗi anh/chị, hệ thống chat đang bảo trì. Vui lòng liên hệ hotline 0392326230." }));
    }
};

const setupChat = (io) => {
    io.on('connection', (socket) => {
        console.log('Chat: A user connected', socket.id);

        socket.on('join_chat', async (data) => {
            const { userId, role, name } = data || {};

            if (role === 'admin' || role === 'staff') {
                socket.join('admins');
                console.log('Admin/Staff joined chat:', socket.id);
                try {
                    const db = getDB();
                    const sessions = await db.collection('chat_sessions').find().sort({ lastUpdated: -1 }).toArray();
                    socket.emit('sessions_list', sessions);
                } catch (e) {
                    console.error(e);
                }
            } else {
                const sessionId = userId || `guest_${socket.id.substring(0,8)}`;
                socket.join(sessionId);
                console.log('Customer joined chat session:', sessionId);

                try {
                    const db = getDB();
                    const messages = await db.collection('chat_messages').find({ sessionId }).sort({ timestamp: 1 }).toArray();
                    await db.collection('chat_sessions').updateOne(
                        { sessionId },
                        { 
                            $set: { customerName: name || 'Khách vãng lai', lastUpdated: new Date() },
                            $setOnInsert: { createdAt: new Date(), unreadCount: 0 }
                        },
                        { upsert: true }
                    );

                    socket.emit('chat_history', { sessionId, messages });
                    io.to('admins').emit('session_updated', { 
                        sessionId, 
                        customerName: name || 'Khách vãng lai',
                        lastUpdated: new Date()
                    });
                } catch (e) {
                    console.error(e);
                }
            }
        });

        socket.on('get_chat_history', async (data) => {
            const { sessionId } = data;
            try {
                const db = getDB();
                const messages = await db.collection('chat_messages').find({ sessionId }).sort({ timestamp: 1 }).toArray();
                socket.emit('chat_history_admin', { sessionId, messages });
            } catch (e) {
                console.error(e);
            }
        });

        socket.on('send_message', async (data) => {
            const { sessionId, senderRole, senderName, text } = data;
            try {
                const db = getDB();
                const message = {
                    sessionId,
                    senderRole: senderRole || 'user',
                    senderName: senderName || 'Khách',
                    text,
                    timestamp: new Date()
                };

                await db.collection('chat_messages').insertOne(message);

                const sessionUpdate = {
                    lastMessage: text,
                    lastUpdated: new Date()
                };
                if (senderRole === 'user' && senderName) {
                    sessionUpdate.customerName = senderName;
                }

                await db.collection('chat_sessions').updateOne(
                    { sessionId },
                    { $set: sessionUpdate, $setOnInsert: { createdAt: new Date() } },
                    { upsert: true }
                );

                io.to(sessionId).emit('receive_message', message);
                io.to('admins').emit('receive_message', message);
                io.to('admins').emit('session_updated', { sessionId, message, customerName: sessionUpdate.customerName });

            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Chat: User disconnected', socket.id);
        });
    });
};

module.exports = { chatResponse, setupChat };
