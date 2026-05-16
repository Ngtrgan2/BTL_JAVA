// api.js - Helper Functions to fetch data from Node.js server
const BASE_URL = '/api';

const fetchAPI = async (endpoint, options = {}) => {
    try {
        let token = localStorage.getItem('token');
        if (!token) {
            const ui = JSON.parse(localStorage.getItem('userInfo') || '{}');
            token = ui.token;
        }
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(`Server trả về lỗi không xác định (${response.status}): ${text.substring(0, 50)}... tại endpoint: ${endpoint}`);
        }
        
        if (!response.ok) {
            throw new Error(data.message || 'Có lỗi xảy ra!');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

window.API = {
    getProducts: (query = '') => fetchAPI(`/products${query}`),
    getProduct: (id) => fetchAPI(`/products/${id}`),
    login: (credentials) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    createOrder: (orderData) => fetchAPI('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
    getOrders: () => fetchAPI('/orders'),
    getOrder: (id) => fetchAPI(`/orders/${id}`),
    updateOrder: (id, data) => fetchAPI(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteOrder: (id) => fetchAPI(`/orders/${id}`, { method: 'DELETE' }),
    createBooking: (bookingData) => fetchAPI('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
    getBookings: () => fetchAPI('/bookings'),
    updateBooking: (id, data) => fetchAPI(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteBooking: (id) => fetchAPI(`/bookings/${id}`, { method: 'DELETE' }),
    createProduct: (data) => fetchAPI('/products', { method: 'POST', body: JSON.stringify(data) }),
    updateProduct: (id, data) => fetchAPI(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProduct: (id) => fetchAPI(`/products/${id}`, { method: 'DELETE' }),
    applyGlobalDiscount: (percentage) => fetchAPI('/admin/products/global-discount', { method: 'POST', body: JSON.stringify({ percentage }) }),
    sendChatMessage: (message) => fetchAPI('/chat', { method: 'POST', body: JSON.stringify({ message }) }),
    updateProfile: (data) => fetchAPI('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
    getUsers: () => fetchAPI('/users'),
    updateUserRole: (id, role) => fetchAPI(`/users/${id}`, { method: 'PUT', body: JSON.stringify({ role }) }),
    getNews: () => fetchAPI('/news'),
    createNews: (data) => fetchAPI('/news', { method: 'POST', body: JSON.stringify(data) }),
    updateNews: (id, data) => fetchAPI(`/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteNews: (id) => fetchAPI(`/news/${id}`, { method: 'DELETE' }),
    getWarranty: (code) => fetchAPI(`/warranty/${code}`)
};
