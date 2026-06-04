
        let allOrders = [];
        let currentPage = 1;
        const itemsPerPage = 10;

        async function loadOrders() {
            currentPage = 1;
            const tbody = document.getElementById('orderTableBody');
            try {
                const orders = await API.getOrders();
                allOrders = orders;
                renderOrders(orders);
                updateStats(orders);
            } catch (error) {
                console.error('Lỗi load orders:', error);
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--status-danger); padding: 3rem;">Lỗi tải dữ liệu</td></tr>';
            }
        }

        function renderOrders(orders) {
            const tbody = document.getElementById('orderTableBody');
            const searchTerm = document.getElementById('searchOrder').value.toLowerCase();
            const statusFilter = document.getElementById('filterStatus').value;

            const filtered = orders.filter(o => {
                const matchesSearch = o._id.toLowerCase().includes(searchTerm) || (o.address && o.address.toLowerCase().includes(searchTerm));
                const matchesStatus = !statusFilter || o.status === statusFilter;
                return matchesSearch && matchesStatus;
            });

            if (filtered.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 3rem;">Không tìm thấy đơn hàng nào</td></tr>';
                const pag = document.getElementById('pagination');
                if (pag) pag.innerHTML = '';
                return;
            }

            const totalPages = Math.ceil(filtered.length / itemsPerPage);
            if (currentPage > totalPages) currentPage = totalPages || 1;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const sortedOrders = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const paginated = sortedOrders.slice(startIndex, startIndex + itemsPerPage);

            tbody.innerHTML = paginated.map((o, i) => {
                const index = startIndex + i;
                const totalAmt = o.totalAmount || o.total || 0;
                return `
                <tr>
                    <td style="text-align: center; font-weight: bold; color: var(--admin-text-light);">${index + 1}</td>
                    <td>
                        <div style="font-weight: 600; color: var(--admin-accent);">#OD-${o._id.slice(-6).toUpperCase()}</div>
                        <small style="color: var(--admin-text-light);">${new Date(o.createdAt).toLocaleDateString('vi-VN')}</small>
                    </td>
                    <td>
                        <div style="font-weight: 500;">${o.customerName || (o.address ? o.address.split(',')[0] : 'Khách lẻ')}</div>
                        <small style="color: var(--admin-text-light);">${o.phone ? o.phone + ', ' : ''}${o.address || 'Không để lại địa chỉ'}</small>
                    </td>
                    <td style="font-weight: 600; color: var(--gold-primary);">${Number(totalAmt).toLocaleString('vi-VN')} ₫</td>
                    <td>
                        <div style="font-size: 0.85rem;">${o.paymentMethod === 'cod' ? 'COD (Thanh toán khi nhận)' : 'Chuyển khoản'}</div>
                    </td>
                    <td>
                        <select class="status-dropdown ${o.status}" onchange="updateOrderStatus('${o._id}', this.value)">
                            <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Chờ xác nhận</option>
                            <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Đang xử lý</option>
                            <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Đang giao</option>
                            <option value="done" ${o.status === 'done' ? 'selected' : ''}>Hoàn thành</option>
                            <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                        </select>
                    </td>
                    <td style="text-align: right;">
                        <button class="btn-icon" title="Xem chi tiết" onclick="viewOrderDetails('${o._id}')"><i class="fa-regular fa-eye"></i></button>
                        <button class="btn-icon" title="Xóa" style="color: var(--status-danger);" onclick="deleteOrder('${o._id}')"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
                </tr>
            `}).join('');

            const pag = document.getElementById('pagination');
            if (pag) {
                if (totalPages <= 1) {
                    pag.innerHTML = '';
                } else {
                    let html = `<div class="pagination-info">Trang ${currentPage} / ${totalPages} (Tổng ${filtered.length} đơn hàng)</div>`;
                    html += `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;
                    for (let i = 1; i <= totalPages; i++) {
                        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                            html += `<button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
                        } else if (i === currentPage - 2 || i === currentPage + 2) {
                            html += `<span style="color: var(--admin-text-light);">...</span>`;
                        }
                    }
                    html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
                    pag.innerHTML = html.replace(/\.\.\.<\/span><span style="color: var\(--admin-text-light\);">\.\.\./g, '...</span>');
                }
            }
        }

        function changePage(page) {
            currentPage = page;
            renderOrders(allOrders);
        }

        function updateStats(orders) {
            const vals = document.querySelectorAll('.stat-val');
            vals[0].textContent = orders.length;
            vals[1].textContent = orders.filter(o => o.status === 'pending').length;
            vals[2].textContent = orders.filter(o => o.status === 'shipped').length;
            vals[3].textContent = orders.filter(o => o.status === 'done').length;
        }

        async function updateOrderStatus(id, status) {
            try {
                await API.updateOrder(id, { status });
                loadOrders();
            } catch (error) {
                alert('Lỗi: ' + error.message);
            }
        }

        async function deleteOrder(id) {
            if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) return;
            try {
                await API.deleteOrder(id);
                loadOrders();
            } catch (error) {
                alert('Lỗi: ' + error.message);
            }
        }

        function viewOrderDetails(id) {
            const o = allOrders.find(order => order._id === id);
            if (!o) return;

            const modalContent = document.getElementById('modalContent');
            const totalAmt = o.totalAmount || o.total || 0;
            const statusLabels = {
                'pending': 'Chờ xác nhận',
                'processing': 'Đang xử lý',
                'shipped': 'Đang giao',
                'done': 'Hoàn thành',
                'cancelled': 'Đã hủy'
            };

            modalContent.innerHTML = `
                <div class="details-header">
                    <div>
                        <h2 style="font-family: var(--font-heading); margin-bottom: 0.3rem;">Đơn hàng #OD-${o._id.slice(-6).toUpperCase()}</h2>
                        <span class="badge badge-${o.status === 'pending' ? 'pending' : (o.status === 'done' ? 'success' : 'info')}">${statusLabels[o.status]}</span>
                    </div>
                    <button class="close-modal-btn" onclick="document.getElementById('orderModal').classList.remove('active')"><i class="fa-solid fa-xmark"></i></button>
                </div>
                
                <div class="details-body">
                    <div class="info-grid">
                        <div class="info-section">
                            <h4>Thông tin khách hàng</h4>
                            <div class="info-item"><span>Họ tên</span>${o.customerName || (o.address ? o.address.split(',')[0] : 'N/A')}</div>
                            <div class="info-item"><span>Số điện thoại</span>${o.phone || 'N/A'}</div>
                            <div class="info-item"><span>Địa chỉ</span>${o.address || 'N/A'}</div>
                        </div>
                        <div class="info-section">
                            <h4>Thông tin thanh toán</h4>
                            <div class="info-item"><span>Ngày đặt</span>${new Date(o.createdAt).toLocaleString('vi-VN')}</div>
                            <div class="info-item"><span>Phương thức</span>${o.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}</div>
                            <div class="info-item"><span>Trạng thái</span>${o.status === 'done' ? 'Đã thanh toán' : 'Chờ xử lý'}</div>
                        </div>
                    </div>

                    <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--gold-primary); margin-bottom: 1rem;">Sản phẩm đã đặt</h4>
                    <div class="order-items-list">
                        ${o.items.map(item => `
                            <div class="item-row">
                                <img src="${(item.image && item.image.startsWith('data:')) ? item.image : '../../' + item.image}" class="item-img" onerror="this.src='../../images/product-ring.png'">
                                <div>
                                    <div style="font-weight: 500; margin-bottom: 0.3rem;">${item.name}</div>
                                    <div style="font-size: 0.75rem; color: var(--admin-text-light);">Size: ${item.size || 'N/A'} | SL: ${item.quantity}</div>
                                </div>
                                <div style="text-align: right; font-weight: 600;">${Number(item.price * item.quantity).toLocaleString('vi-VN')} ₫</div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="total-summary">
                        <div class="row">
                            <span style="color: var(--admin-text-light);">Tạm tính:</span>
                            <span>${Number(totalAmt).toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <div class="row">
                            <span style="color: var(--admin-text-light);">Phí vận chuyển:</span>
                            <span>Miễn phí</span>
                        </div>
                        <div class="row grand-total">
                            <span>Tổng thanh toán:</span>
                            <span>${Number(totalAmt).toLocaleString('vi-VN')} ₫</span>
                        </div>
                    </div>
                </div>
                <div style="padding: 1.5rem 2rem; border-top: 1px solid var(--admin-border); text-align: right; background: rgba(255,255,255,0.01);">
                    <button class="btn-admin" style="background: transparent; border: 1px solid var(--admin-border);" onclick="document.getElementById('orderModal').classList.remove('active')">Đóng cửa sổ</button>
                    ${o.status === 'pending' ? `<button class="btn-admin btn-primary" style="margin-left: 1rem;" onclick="updateOrderStatus('${o._id}', 'processing')">Xác nhận đơn</button>` : ''}
                </div>
            `;

            document.getElementById('orderModal').classList.add('active');
        }

        document.addEventListener('DOMContentLoaded', () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo || (userInfo.role !== 'admin' && userInfo.role !== 'staff')) {
                window.location.href = '../login.html';
                return;
            }

            // Sync Sidebar
            const dashNav = document.getElementById('nav-dashboard');
            const revNav = document.getElementById('nav-revenue');
            const custNav = document.getElementById('nav-customers');
            if (userInfo.role === 'staff') {
                if (dashNav) dashNav.href = 'staff-dashboard.html';
                if (revNav) revNav.style.display = 'none';
                document.getElementById('sidebar-role-text').textContent = 'Hệ Thống Tư Vấn Viên';
            }
            if (userInfo.role === 'admin' && revNav) {
                revNav.style.display = 'flex';
            }
            if (userInfo.role === 'admin' && custNav) {
                custNav.style.display = 'flex';
            }

            // Set Active Menu
            const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
            document.querySelectorAll('.menu-item').forEach(item => {
                const href = item.getAttribute('href');
                if (href === currentPage || (currentPage === 'staff-dashboard.html' && href === 'dashboard.html')) {
                    item.classList.add('active');
                }
            });

            const avatarUrl = (userInfo.avatar && String(userInfo.avatar).trim())
                ? userInfo.avatar
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.fullName)}&background=1a1a1a&color=d4af37`;

            // Sidebar User Info
            const userInfoDiv = document.getElementById('sidebar-user-info');
            if (userInfoDiv) {
                userInfoDiv.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; padding: 0 0.5rem;">
                        <img src="${avatarUrl}" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover;">
                        <div style="overflow: hidden;">
                            <div style="font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #fff;">${userInfo.fullName}</div>
                            <div style="font-size: 0.7rem; color: var(--admin-text-light); text-transform: capitalize;">${userInfo.role === 'admin' ? 'Quản trị viên' : 'Tư vấn viên'}</div>
                        </div>
                    </div>
                `;
            }

            loadOrders();

            // Logout
            document.querySelectorAll('.logout-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('userInfo');
                    localStorage.removeItem('token');
                    window.location.href = '../login.html';
                });
            });
        });
    
