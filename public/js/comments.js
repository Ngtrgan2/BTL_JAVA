window.initComments = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) return;

    let selectedMediaBase64 = null;
    let selectedMediaType = null;

    const btnSubmit = document.getElementById('btn-submit-comment');
    const commentInput = document.getElementById('comment-text');
    const mediaInput = document.getElementById('comment-media-upload');
    const mediaPreviewContainer = document.getElementById('comment-media-preview');
    const commentsList = document.getElementById('comments-list');

    let currentPage = 1;
    let currentSort = 'newest';

    const sortSelect = document.getElementById('comments-sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            currentPage = 1;
            loadComments();
        });
    }

    // 0. Show logged-in user's avatar in comment form
    const formAvatar = document.getElementById('comment-form-avatar');
    if (formAvatar) {
        const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (currentUser.avatar) {
            formAvatar.innerHTML = `<img src="${currentUser.avatar}" alt="Avatar" style="width:45px;height:45px;border-radius:50%;object-fit:cover;border:2px solid var(--gold-dark);">`;
        }
    }

    // 1. Load Comments
    const loadComments = async () => {
        try {
            const res = await fetch(`/api/comments?productId=${productId}&page=${currentPage}&limit=3&sortType=${currentSort}`);
            const data = await res.json();
            
            if (res.ok) {
                renderComments(data.comments);
                renderPagination(data.totalPages, data.currentPage);
            } else {
                commentsList.innerHTML = `<p style="color: var(--text-muted); text-align: center;">Chưa thể tải bình luận lúc này.</p>`;
            }
        } catch (error) {
            console.error('Error loading comments:', error);
            commentsList.innerHTML = `<p style="color: var(--text-muted); text-align: center;">Chưa thể tải bình luận lúc này.</p>`;
        }
    };

    // 2. Render Comments
    const renderComments = (comments) => {
        if (!comments || comments.length === 0) {
            commentsList.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem 0;">Chưa có đánh giá nào. Hãy là người đầu tiên bình luận!</p>`;
            return;
        }

        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        
        let html = '';
        comments.forEach(c => {
            const date = new Date(c.createdAt).toLocaleDateString('vi-VN', { 
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
            });
            
            let mediaHtml = '';
            if (c.media) {
                if (c.mediaType === 'video') {
                    mediaHtml = `<video src="${c.media}" controls></video>`;
                } else {
                    mediaHtml = `<img src="${c.media}" alt="Bình luận hình ảnh" onclick="window.open('${c.media}')" style="cursor:zoom-in;">`;
                }
                mediaHtml = `<div class="comment-attached-media">${mediaHtml}</div>`;
            }

            const roleBadge = c.userRole === 'admin' || c.userRole === 'staff' 
                ? `<span class="comment-role-badge">Quản trị viên</span>` 
                : '';

            const isLikedByMe = c.likes && userInfo.id && c.likes.includes(userInfo.id);
            const likeCount = c.likes ? c.likes.length : 0;
            const authorLikedBadge = c.likedByAuthor 
                ? `<div class="author-liked-badge"><i class="fa-solid fa-heart"></i> Đã được tim của tác giả</div>` 
                : '';

            const avatarHtml = c.userAvatar 
                ? `<img src="${c.userAvatar}" alt="${c.userName}" style="width:45px;height:45px;border-radius:50%;object-fit:cover;border:2px solid var(--gold-dark);">` 
                : `<i class="fa-solid fa-user-circle"></i>`;

            const deleteBtnHtml = userInfo.role === 'admin' 
                ? `<button class="btn-like" style="color: #e74c3c; margin-left: auto;" onclick="deleteComment('${c._id}')"><i class="fa-solid fa-trash"></i> Xóa</button>`
                : '';

            html += `
                <div class="comment-item">
                    <div class="comment-user-avatar" style="font-size: 2.5rem;">
                        ${avatarHtml}
                    </div>
                    <div class="comment-body">
                        <div class="comment-meta">
                            <span class="comment-author">${c.userName}</span>
                            ${roleBadge}
                            <span class="comment-date">${date}</span>
                        </div>
                        ${c.productName ? `<div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.5rem;"><i class="fa-solid fa-gem" style="color:var(--gold-dark);margin-right:4px;"></i>đã bình luận ở sản phẩm <strong style="color:var(--gold-primary);">${c.productName}</strong></div>` : ''}
                        <div class="comment-content">${c.text}</div>
                        ${mediaHtml}
                        
                        <div class="comment-interactions">
                            <button class="btn-like ${isLikedByMe ? 'liked' : ''}" onclick="toggleLikeComment('${c._id}')">
                                <i class="${isLikedByMe ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                                <span>${likeCount} Hữu ích</span>
                            </button>
                            ${authorLikedBadge}
                            ${deleteBtnHtml}
                        </div>
                    </div>
                </div>
            `;
        });
        
        commentsList.innerHTML = html;
    };

    // 3. Handle File Upload (Preview & Base64)
    if (mediaInput) {
        mediaInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Check size (5MB = 5 * 1024 * 1024 bytes)
            if (file.size > 5 * 1024 * 1024) {
                window.alert('File hình ảnh/video không được vượt quá 5MB!');
                mediaInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                selectedMediaBase64 = event.target.result;
                selectedMediaType = file.type.startsWith('video/') ? 'video' : 'image';
                
                // Show preview
                let previewInner = '';
                if (selectedMediaType === 'video') {
                    previewInner = `<video src="${selectedMediaBase64}" class="media-preview-item" autoplay muted loop></video>`;
                } else {
                    previewInner = `<img src="${selectedMediaBase64}" class="media-preview-item">`;
                }
                previewInner += `<button class="btn-remove-media" id="btn-remove-media"><i class="fa-solid fa-times"></i></button>`;
                
                mediaPreviewContainer.innerHTML = previewInner;
                mediaPreviewContainer.style.display = 'inline-block';

                document.getElementById('btn-remove-media').addEventListener('click', () => {
                    selectedMediaBase64 = null;
                    selectedMediaType = null;
                    mediaInput.value = '';
                    mediaPreviewContainer.style.display = 'none';
                    mediaPreviewContainer.innerHTML = '';
                });
            };
            reader.readAsDataURL(file);
        });
    }

    // 4. Submit Comment
    if (btnSubmit) {
        btnSubmit.addEventListener('click', async () => {
            const text = commentInput.value.trim();
            if (!text && !selectedMediaBase64) {
                window.alert('Vui lòng nhập nội dung hoặc đính kèm hình ảnh/video.');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                window.alert('Vui lòng đăng nhập để bình luận!');
                return;
            }

            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...`;

            try {
                const res = await fetch('/api/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        productId,
                        text,
                        media: selectedMediaBase64,
                        mediaType: selectedMediaType
                    })
                });

                const data = await res.json();
                if (res.ok) {
                    window.alert('Đã gửi bình luận thành công!');
                    commentInput.value = '';
                    if (document.getElementById('btn-remove-media')) {
                        document.getElementById('btn-remove-media').click();
                    }
                    loadComments(); // reload list
                } else {
                    window.alert(data.message || 'Có lỗi xảy ra khi gửi bình luận.');
                }
            } catch (error) {
                console.error(error);
                window.alert('Không thể kết nối đến máy chủ.');
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Gửi bình luận`;
            }
        });
    }

    // 5. Global Toggle Like Function
    window.toggleLikeComment = async (commentId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.alert('Vui lòng đăng nhập để thả tim!');
            return;
        }

        try {
            const res = await fetch(`/api/comments/${commentId}/like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (res.ok) {
                loadComments(); // Refresh comments to update likes count and status
            } else {
                const data = await res.json();
                window.alert(data.message || 'Lỗi thả tim.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Render Pagination
    const renderPagination = (totalPages, currentPage) => {
        const paginationContainer = document.getElementById('comments-pagination');
        if (!paginationContainer) return;
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let html = '';
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="btn ${i === currentPage ? 'btn-primary' : 'btn-outline'}" style="padding: 0.3rem 0.8rem; border-radius: 4px; border: 1px solid var(--gold-dark); background: ${i === currentPage ? 'var(--gold-primary)' : 'transparent'}; color: ${i === currentPage ? '#000' : 'var(--gold-primary)'};" onclick="changeCommentPage(${i})">${i}</button>`;
        }
        paginationContainer.innerHTML = html;
    };

    window.changeCommentPage = (page) => {
        currentPage = page;
        loadComments();
    };

    window.deleteComment = async (commentId) => {
        if (!confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) return;
        
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                window.alert('Đã xóa bình luận.');
                // Nếu trang hiện tại có 1 comment và bị xóa, lùi về trang trước
                const currentComments = document.querySelectorAll('.comment-item').length;
                if (currentComments === 1 && currentPage > 1) {
                    currentPage--;
                }
                loadComments();
            } else {
                window.alert(data.message || 'Lỗi khi xóa.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Initial Load
    loadComments();
};
