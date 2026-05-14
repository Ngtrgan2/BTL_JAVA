// auth.js — Quản lý trạng thái đăng nhập/đăng xuất trên mọi trang
document.addEventListener('DOMContentLoaded', () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const authIconContainer = document.querySelector('.nav-icon[title="Tài khoản"]');

    if (!authIconContainer) return; // Trang không có header (login, register)

    if (userInfo && userInfo.token) {
        // ĐÃ ĐĂNG NHẬP → Hiện tên người dùng + menu dropdown
        const avatarDisplay = userInfo.avatar 
            ? `<img src="${userInfo.avatar}" class="header-avatar">`
            : `<i class="fa-solid fa-circle-user"></i>`;

        authIconContainer.innerHTML = `
            <div class="user-dropdown">
                <div class="user-name" id="user-dropdown-toggle">
                    ${avatarDisplay}
                    <span>${userInfo.fullName}</span>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
                <div class="dropdown-content" id="user-dropdown-menu">
                    <a href="profile.html"><i class="fa-solid fa-user" style="margin-right:10px"></i>Hồ sơ</a>
                    ${(userInfo.role === 'admin' || userInfo.role === 'staff') 
                        ? `<a href="admin/${userInfo.role === 'admin' ? 'dashboard.html' : 'staff-dashboard.html'}"><i class="fa-solid fa-user-shield" style="margin-right:10px"></i>Quản trị</a>` 
                        : ''}
                    <a href="#" id="logout-btn" style="color:#e74c3c"><i class="fa-solid fa-right-from-bracket" style="margin-right:10px"></i>Đăng xuất</a>
                </div>
            </div>
        `;

        // Click để mở/đóng dropdown
        const toggle = document.getElementById('user-dropdown-toggle');
        const menu = document.getElementById('user-dropdown-menu');

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = menu.classList.toggle('show');
            toggle.classList.toggle('active', isOpen);
        });

        // Click ra ngoài thì đóng dropdown
        document.addEventListener('click', () => {
            menu.classList.remove('show');
            toggle.classList.remove('active');
        });

        // Đăng xuất
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('userInfo');
            window.location.href = 'index.html';
        });
    } else {
        // CHƯA ĐĂNG NHẬP → Hiện nút Đăng nhập
        authIconContainer.innerHTML = `
            <a href="login.html" style="display:flex;align-items:center;gap:6px;color:var(--gold-primary);font-size:0.9rem;">
                <i class="fa-regular fa-user"></i> Đăng nhập
            </a>
        `;
    }
});
