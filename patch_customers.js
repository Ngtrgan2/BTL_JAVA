const fs = require('fs');
const path = require('path');

const customersPath = path.join(__dirname, 'public', 'pages', 'admin', 'customers.html');
let content = fs.readFileSync(customersPath, 'utf8');

// 1. Expose functions to window
if (!content.includes('window.toggleBanUser = toggleBanUser;')) {
    const exposeCode = `
        window.loadUsers = loadUsers;
        window.renderUsers = renderUsers;
        window.changePage = changePage;
        window.updateRole = updateRole;
        window.openEditUserModal = openEditUserModal;
        window.closeUserModal = closeUserModal;
        window.saveUser = saveUser;
        window.toggleBanUser = toggleBanUser;
        window.deleteUser = deleteUser;
        window.setFilter = setFilter;
    `;
    
    // We will inject this before </script>
    content = content.replace('</script>\n    <script src="../../js/toast.js"></script>', exposeCode + '\n    </script>\n    <script src="../../js/toast.js"></script>');
}

// 2. Add sidebar logic
if (!content.includes("custNav.style.display = 'flex';")) {
    const sidebarLogic = `
            const custNav = document.getElementById('nav-customers');
            if (userInfo.role === 'admin' && custNav) {
                custNav.style.display = 'flex';
                const setNav = document.getElementById('nav-settings');
                if(setNav) setNav.style.display = 'flex';
            }
    `;
    
    content = content.replace('loadUsers();', sidebarLogic + '\n            loadUsers();');
}

fs.writeFileSync(customersPath, content, 'utf8');
console.log('Fixed customers.html');
