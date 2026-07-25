// ==========================================
// 1. DUMMY DATA (TEMPORARY STATE)
// ==========================================
const DUMMY_DATA = {
    topEarners: Array.from({length: 50}, (_, i) => ({
        rank: i + 1, 
        id: `EM-${1000 + i}`, 
        name: `User ${i + 1}`,
        country: ['USA', 'UK', 'Canada', 'Australia', 'Japan', 'Philippines'][Math.floor(Math.random() * 6)],
        earnings: (100000 / (i + 1) + Math.random() * 5000).toFixed(2),
        teamSize: Math.floor(5000 / (i + 1) + 10),
        status: i % 10 === 0 ? 'Pending' : 'Active'
    })),
    accounts: [
        { id: 'EM-1001', name: 'Alice Smith', pkg: 'Gold', sponsor: 'EM-1000', date: '2023-10-12', status: 'Active' },
        { id: 'EM-1002', name: 'Bob Johnson', pkg: 'Silver', sponsor: 'EM-1001', date: '2023-10-14', status: 'Active' },
        { id: 'EM-1003', name: 'Carol White', pkg: 'Bronze', sponsor: 'EM-1001', date: '2023-11-02', status: 'Pending' },
        { id: 'EM-1004', name: 'Dave Brown', pkg: 'Gold', sponsor: 'EM-1000', date: '2023-11-15', status: 'Active' },
        { id: 'EM-1005', name: 'Eve Davis', pkg: 'Platinum', sponsor: 'EM-1004', date: '2023-11-20', status: 'Suspended' }
    ],
    walletTx: [
        { id: 'TXN-9823', date: '2023-11-28', type: 'Pairing Bonus', amt: '+$500.00', stat: 'Completed' },
        { id: 'TXN-9824', date: '2023-11-29', type: 'Encashment', amt: '-$1,200.00', stat: 'Pending' },
        { id: 'TXN-9825', date: '2023-11-30', type: 'Direct Referral', amt: '+$150.00', stat: 'Completed' },
        { id: 'TXN-9826', date: '2023-12-01', type: '5th Cycle Bonus', amt: '+$300.00', stat: 'Completed' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 2. MOBILE SIDEBAR LOGIC
    // ==========================================
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar'); 
    const mobileNavToggle = document.getElementById('mobileNavToggle'); 
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    // Desktop Collapse
    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Mobile Open
    if(mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            sidebar.classList.add('mobile-open');
            sidebarOverlay.classList.add('active');
        });
    }

    // Mobile Close
    function closeMobileMenu() {
        if(sidebar && sidebarOverlay) {
            sidebar.classList.remove('mobile-open');
            sidebarOverlay.classList.remove('active');
        }
    }
    if(sidebarOverlay) sidebarOverlay.addEventListener('click', closeMobileMenu);


    // ==========================================
    // 3. ACCORDION SIDEBAR LOGIC
    // ==========================================
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const parentItem = toggle.closest('.has-dropdown');
            const subMenu = parentItem.querySelector('.sub-menu');
            
            // Auto-close other menus
            document.querySelectorAll('.sub-menu').forEach(menu => {
                if (menu !== subMenu) menu.classList.remove('open');
            });

            subMenu.classList.toggle('open');
        });
    });


    // ==========================================
    // 4. VIEW NAVIGATION LOGIC
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-item[data-target], .sub-item-link[data-target]');
    const views = document.querySelectorAll('.view');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Manage active classes
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            if(link.classList.contains('nav-item')) {
                link.classList.add('active');
            } else {
                link.closest('.nav-item').classList.add('active');
            }
            
            // Switch view containers
            const targetId = link.getAttribute('data-target');
            views.forEach(view => {
                view.classList.add('hidden');
                if(view.id === targetId) view.classList.remove('hidden');
            });

            // Post-navigation actions
            if(window.innerWidth <= 768) closeMobileMenu();
            if(targetId === 'dashboardView') initCharts();
            if(targetId === 'genealogyView') renderTree();
        });
    });


    // ==========================================
    // 5. MODAL SYSTEM
    // ==========================================
    const modalOverlay = document.getElementById('modalOverlay');
    
    window.openModal = function(modalId) {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        const targetModal = document.getElementById(modalId);
        if (targetModal) {
            targetModal.classList.remove('hidden');
            modalOverlay.classList.remove('hidden');
        }
    };

    window.closeModal = function() {
        modalOverlay.classList.add('hidden');
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        
        const memberForm = document.getElementById('memberForm');
        if(memberForm) memberForm.reset();
    };

    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    document.querySelectorAll('.close-modal').forEach(btn => { btn.addEventListener('click', closeModal); });


    // ==========================================
    // 6. CRUD ACTIONS (ADD, EDIT, DELETE)
    // ==========================================
    
    // Open Add Mode
    window.openAddMemberModal = function(prefillSponsor = '') {
        document.getElementById('memberModalTitle').innerText = "Add New Member";
        document.getElementById('editMemberId').value = "";
        if (prefillSponsor) document.getElementById('newMemberSponsor').value = prefillSponsor;
        openModal('addMemberModal');
    }

    // Open Edit Mode
    window.editAccount = function(id) { 
        const account = DUMMY_DATA.accounts.find(a => a.id === id);
        if(!account) return;

        document.getElementById('memberModalTitle').innerText = `Edit Member: ${id}`;
        document.getElementById('editMemberId').value = id;
        document.getElementById('newMemberName').value = account.name;
        document.getElementById('newMemberSponsor').value = account.sponsor;
        document.getElementById('newMemberPackage').value = account.pkg;
        
        openModal('addMemberModal');
    };

    // Handle Form Submission (Add or Edit)
    const memberForm = document.getElementById('memberForm');
    if(memberForm) {
        memberForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const editId = document.getElementById('editMemberId').value;
            const name = document.getElementById('newMemberName').value;
            const sponsor = document.getElementById('newMemberSponsor').value;
            const pkg = document.getElementById('newMemberPackage').value;

            if (editId) {
                // Update existing record
                const index = DUMMY_DATA.accounts.findIndex(a => a.id === editId);
                if(index > -1) {
                    DUMMY_DATA.accounts[index].name = name;
                    DUMMY_DATA.accounts[index].sponsor = sponsor;
                    DUMMY_DATA.accounts[index].pkg = pkg;
                    showToast(`Member ${editId} updated successfully!`);
                }
            } else {
                // Create new record
                const newId = `EM-${Math.floor(1000 + Math.random() * 9000)}`;
                const today = new Date().toISOString().split('T')[0];
                DUMMY_DATA.accounts.unshift({ id: newId, name: name, pkg: pkg, sponsor: sponsor, date: today, status: 'Active' });
                showToast(`Success! ${name} added as ${newId}`);
                
                // Update Dashboard stat
                const totMembersEl = document.getElementById('totMembers');
                if(totMembersEl) {
                    let curr = parseInt(totMembersEl.innerText.replace(',', ''));
                    totMembersEl.innerText = (curr + 1).toLocaleString();
                }
            }

            renderAccounts();
            closeModal();
        });
    }

    // Handle Deletion
    let accountToDelete = null;
    window.deleteAccount = function(id) {
        accountToDelete = id;
        document.getElementById('deleteMemberIdText').innerText = id;
        openModal('deleteModal');
    };

    document.getElementById('confirmDeleteBtn')?.addEventListener('click', () => {
        if(accountToDelete) {
            DUMMY_DATA.accounts = DUMMY_DATA.accounts.filter(a => a.id !== accountToDelete);
            renderAccounts(); 
            showToast(`Member ${accountToDelete} has been deleted.`, 'danger');
            
            const totMembersEl = document.getElementById('totMembers');
            if(totMembersEl) {
                let curr = parseInt(totMembersEl.innerText.replace(',', ''));
                totMembersEl.innerText = (curr - 1).toLocaleString();
            }

            accountToDelete = null;
            closeModal();
        }
    });

    // Logout
    const logoutBtnTrigger = document.getElementById('logoutBtnTrigger');
    if(logoutBtnTrigger) logoutBtnTrigger.addEventListener('click', () => { openModal('logoutModal'); });
    document.getElementById('confirmLogoutBtn')?.addEventListener('click', () => { window.location.href = 'index.html'; });


    // ==========================================
    // 7. DATA RENDERING FUNCTIONS
    // ==========================================
    
    function renderEarners() {
        const tbody = document.getElementById('earnersTableBody');
        if(!tbody) return;
        let html = '';
        DUMMY_DATA.topEarners.forEach(e => {
            let rowClass = e.rank === 1 ? 'rank-1' : e.rank === 2 ? 'rank-2' : e.rank === 3 ? 'rank-3' : '';
            let medal = e.rank === 1 ? '🥇' : e.rank === 2 ? '🥈' : e.rank === 3 ? '🥉' : e.rank;
            html += `<tr class="${rowClass}">
                <td>${medal}</td>
                <td>
                    <div class="member-cell">
                        <img src="https://ui-avatars.com/api/?name=${e.name.replace(' ', '+')}&background=random" alt="Avatar">
                        <div><strong>${e.name}</strong><br><small class="text-muted">${e.id}</small></div>
                    </div>
                </td>
                <td>${e.country}</td>
                <td>${e.teamSize}</td>
                <td class="text-emerald">$${parseFloat(e.earnings).toLocaleString()}</td>
                <td><span class="badge-status status-${e.status.toLowerCase()}">${e.status}</span></td>
            </tr>`;
        });
        tbody.innerHTML = html;
    }

    function renderAccounts() {
        const tbody = document.getElementById('accountsTableBody');
        if(!tbody) return;
        let html = '';
        DUMMY_DATA.accounts.forEach(a => {
            let statusClass = a.status === 'Active' ? 'status-active' : a.status === 'Pending' ? 'status-pending' : '';
            html += `<tr>
                <td>${a.id}</td>
                <td>
                    <div class="member-cell">
                        <img src="https://ui-avatars.com/api/?name=${a.name.replace(' ', '+')}&background=10B981&color=fff" alt="Avatar">
                        <strong>${a.name}</strong>
                    </div>
                </td>
                <td>${a.pkg}</td>
                <td>${a.sponsor}</td>
                <td>${a.date}</td>
                <td><span class="badge-status ${statusClass}">${a.status}</span></td>
                <td>
                    <button class="btn-icon" onclick="editAccount('${a.id}')" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-icon text-danger" onclick="deleteAccount('${a.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
        });
        tbody.innerHTML = html;
    }

    function renderWallet() {
        const tbody = document.getElementById('walletTableBody');
        if(!tbody) return;
        let html = '';
        DUMMY_DATA.walletTx.forEach(tx => {
            let color = tx.amt.startsWith('+') ? 'text-emerald' : 'text-danger';
            html += `<tr>
                <td>${tx.id}</td>
                <td>${tx.date}</td>
                <td>${tx.type}</td>
                <td class="${color}"><strong>${tx.amt}</strong></td>
                <td><span class="badge-status ${tx.stat === 'Completed' ? 'status-active' : 'status-pending'}">${tx.stat}</span></td>
            </tr>`;
        });
        tbody.innerHTML = html;
    }

    function renderTree() {
        const treeCont = document.getElementById('binaryTree');
        if(!treeCont || treeCont.innerHTML !== '') return; 
        
        treeCont.innerHTML = `
            <ul><li>
                <div class="node-card" onclick="showToast('Admin Profile')">
                    <img src="https://ui-avatars.com/api/?name=Admin&background=10B981&color=fff">
                    <h4>Admin User</h4><p>EM-1000</p>
                </div>
                <ul>
                    <li>
                        <div class="node-card" onclick="showToast('Alice Profile')">
                            <img src="https://ui-avatars.com/api/?name=Alice&background=065F46&color=fff">
                            <h4>Alice S.</h4><p>EM-1001</p>
                        </div>
                        <ul>
                            <li>
                                <div class="node-card" onclick="showToast('Bob Profile')">
                                    <img src="https://ui-avatars.com/api/?name=Bob&background=3B82F6&color=fff">
                                    <h4>Bob J.</h4><p>EM-1002</p>
                                </div>
                                <ul>
                                    <li><div class="node-card empty-node" onclick="openAddMemberModal('EM-1002')"><i class="fa-solid fa-user-plus text-muted" style="font-size:1.5rem; margin-bottom:10px;"></i><h4>Empty</h4><p>Add Left</p></div></li>
                                    <li><div class="node-card empty-node" onclick="openAddMemberModal('EM-1002')"><i class="fa-solid fa-user-plus text-muted" style="font-size:1.5rem; margin-bottom:10px;"></i><h4>Empty</h4><p>Add Right</p></div></li>
                                </ul>
                            </li>
                            <li><div class="node-card empty-node" onclick="openAddMemberModal('EM-1001')"><i class="fa-solid fa-user-plus text-muted" style="font-size:1.5rem; margin-bottom:10px;"></i><h4>Empty</h4><p>Add Right</p></div></li>
                        </ul>
                    </li>
                    <li>
                        <div class="node-card" onclick="showToast('Dave Profile')">
                            <img src="https://ui-avatars.com/api/?name=Dave&background=065F46&color=fff">
                            <h4>Dave B.</h4><p>EM-1004</p>
                        </div>
                        <ul>
                            <li><div class="node-card empty-node" onclick="openAddMemberModal('EM-1004')"><i class="fa-solid fa-user-plus text-muted" style="font-size:1.5rem; margin-bottom:10px;"></i><h4>Empty</h4><p>Add Left</p></div></li>
                            <li><div class="node-card empty-node" onclick="openAddMemberModal('EM-1004')"><i class="fa-solid fa-user-plus text-muted" style="font-size:1.5rem; margin-bottom:10px;"></i><h4>Empty</h4><p>Add Right</p></div></li>
                        </ul>
                    </li>
                </ul>
            </li></ul>
        `;
    }

    // ==========================================
    // 8. CHART.JS INITIALIZATION
    // ==========================================
    let chartsInitialized = false;
    let mainChartInstance = null;
    let doughnutChartInstance = null;
    
    function initCharts() {
        if(chartsInitialized || typeof Chart === 'undefined') return;
        
        const ctxMain = document.getElementById('mainChart');
        if (ctxMain) {
            mainChartInstance = new Chart(ctxMain.getContext('2d'), {
                type: 'line',
                data: { 
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], 
                    datasets: [
                        { label: 'Registrations', data: [120, 190, 300, 250, 400, 450], borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', tension: 0.4, fill: true },
                        { label: 'Sales ($)', data: [5000, 12000, 25000, 21000, 35000, 42000], borderColor: '#065F46', borderDash: [5, 5], tension: 0.4 }
                    ]
                },
                options: { 
                    responsive: true, maintainAspectRatio: false, 
                    plugins: { legend: { labels: { color: '#F8FAFC' } } }, 
                    scales: { 
                        x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } }, 
                        y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } } 
                    } 
                }
            });
        }

        const ctxDoughnut = document.getElementById('doughnutChart');
        if (ctxDoughnut) {
            doughnutChartInstance = new Chart(ctxDoughnut.getContext('2d'), {
                type: 'doughnut',
                data: { 
                    labels: ['Pairing', 'Direct', 'Leadership'], 
                    datasets: [{ data: [55, 30, 15], backgroundColor: ['#10B981', '#065F46', '#3B82F6'], borderWidth: 0 }] 
                },
                options: { 
                    responsive: true, maintainAspectRatio: false, 
                    plugins: { legend: { position: 'bottom', labels: { color: '#F8FAFC' } } } 
                }
            });
        }

        chartsInitialized = true;
    }

    // ==========================================
    // 9. UTILITIES
    // ==========================================
    window.showToast = function(msg, type = 'primary') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.style.background = type === 'danger' ? 'var(--danger)' : 'var(--primary)';
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    };

    // Initialize initial views
    renderEarners(); 
    renderAccounts(); 
    renderWallet(); 
    initCharts(); // Assuming dashboard is the default active view
});

// ==========================================
    // LIGHT/DARK MODE TOGGLE
    // ==========================================
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = themeToggleBtn?.querySelector('i');
    
    // Check local storage for saved theme preference
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply initial theme
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if(themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    if(themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            
            if (theme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        });
    }