const { getDB } = require('../db');
const { getPostData } = require('../utils');
const { ObjectId } = require('mongodb');

const chatResponse = async (req, res) => {
    try {
        const body = await getPostData(req);
        const { message } = JSON.parse(body);
        const msg = message.toLowerCase();

        const db = getDB();
        let reply = '';

        // 1. Basic FAQs
        if (msg.includes('địa chỉ') || msg.includes('cửa hàng') || msg.includes('ở đâu')) {
            reply = 'Anh ở 21/33 Bạch Đằng, con vợ muốn gặp anh thì di chuyển qua đây nhé :))';
        } else if (msg.includes('liên hệ') || msg.includes('số điện thoại') || msg.includes('hotline')) {
            reply = '0392326230, con vợ cần gì gọi ngay cho anh nhé';
        } else if (msg.includes('chào') || msg.includes('hi') || msg.includes('hello')) {
            reply = 'Con vợ cần gì nhỉ ?? Nói nhanh anh tư vấn nào';
        } else if (msg.includes('ship') || msg.includes('giao hàng') || msg.includes('vận chuyển')) {
            reply = 'Đợi tí anh gọi mấy thằng đệ ship cho con vợ nhé ';
        } else if (msg.includes('bảo hành') || msg.includes('đổi trả')) {
            reply = 'Sản phẩm tại An LUXURY được bảo hành làm mới, đánh bóng trọn đời. Chính sách đổi trả linh hoạt trong vòng 7 ngày nếu có lỗi sản xuất ạ.';
        } else if (msg.includes('đo size') || msg.includes('kích cỡ')) {
            reply = 'Dạ, trong phần chi tiết mỗi sản phẩm đều có bảng hướng dẫn đo size. Hoặc anh/chị có thể cho em biết chiều cao, cân nặng để em tư vấn size tương đối nhé.';
        }

        // 2. Product Search (Dynamic)
        else {
            // Search by name or category
            const products = await db.collection('products').find({}).toArray();
            let foundProducts = products.filter(p =>
                p.name.toLowerCase().includes(msg) ||
                (p.categoryLabel && p.categoryLabel.toLowerCase().includes(msg)) ||
                p.category.toLowerCase().includes(msg)
            ).slice(0, 3); // Get top 3

            if (foundProducts.length > 0) {
                reply = `Dạ, bên em có các mẫu ${msg} tuyệt đẹp sau đây ạ:\n` +
                    foundProducts.map(p => `- ${p.name}: ${Number(p.price).toLocaleString('vi-VN')} ₫`).join('\n') +
                    '\nAnh/chị nhấn vào "Bộ sưu tập" để xem hình ảnh chi tiết nhé!';
            } else {
                reply = 'Dạ, hiện tại em chưa tìm thấy thông tin chính xác về yêu cầu của anh/chị. Anh/chị có thể để lại số điện thoại hoặc nhắn tin qua Zalo 0339.194.214 để chuyên viên bên em tư vấn kỹ hơn nhé!';
            }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
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
