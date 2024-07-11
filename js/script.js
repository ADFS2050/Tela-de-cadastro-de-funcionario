document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const itemForm = document.getElementById('item-form');
    const errorMessage = document.getElementById('error-message');
    const usernameDisplay = document.getElementById('username-display');

    // Função para salvar usuário no localStorage
    const saveUser = (user) => {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    };

    // Função para validar login
    const validateLogin = (email, password) => {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        return users.find(user => user.email === email && user.password === password);
    };

    // Função para carregar usuários do localStorage
    const loadUsers = () => {
        return JSON.parse(localStorage.getItem('users')) || [];
    };

    // Função para gravar item
    const saveItem = (item) => {
        let items = JSON.parse(localStorage.getItem('items')) || [];
        if (items.length >= 10) {
            alert("Você atingiu o limite de 10 itens.");
            return false;
        }
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
        return true;
    };

    // Função para carregar itens do localStorage
    const loadItems = () => {
        return JSON.parse(localStorage.getItem('items')) || [];
    };

    // Função para limpar itens
    const clearItems = () => {
        if (confirm("Deseja realmente limpar todos os itens?")) {
            localStorage.removeItem('items');
            alert("Todos os itens foram removidos.");
        }
    };

    // Função para logout
    const logout = () => {
        sessionStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    };

    // Evento de submissão do formulário de login
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const user = validateLogin(email, password);
            if (user) {
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                window.location.href = 'menu.html';
            } else {
                errorMessage.textContent = 'E-mail ou senha incorretos!';
            }
        });
    }

    // Evento de submissão do formulário de cadastro
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const phone = document.getElementById('phone').value;
            const dob = document.getElementById('dob').value;

            // Verificar se as senhas coincidem
            if (password !== confirmPassword) {
                errorMessage.textContent = 'As senhas não coincidem!';
                return;
            }

            const newUser = new User(name, email, password, phone, dob);
            saveUser(newUser);
            window.location.href = 'index.html';
        });
    }

    // Evento de submissão do formulário de item
    if (itemForm) {
        itemForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const itemName = document.getElementById('item-name').value;
            const itemDescription = document.getElementById('item-description').value;
            const itemCategory = document.getElementById('item-category').value;
            const itemCondition = Array.from(document.querySelectorAll('input[name="item-condition"]:checked')).map(cb => cb.value);

            if (!itemCondition.length) {
                errorMessage.textContent = 'Selecione pelo menos uma condição!';
                return;
            }

            const newItem = new Item(itemName, itemDescription, itemCategory, itemCondition);
            if (saveItem(newItem)) {
                alert("Item cadastrado com sucesso!");
                itemForm.reset();
            }
        });
    }

    // Exibir nome do usuário logado
    if (usernameDisplay) {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            usernameDisplay.textContent = loggedInUser.name;
        } else {
            window.location.href = 'index.html';
        }
    }

    // Carregar e exibir itens na página de listagem
    const itemsTable = document.getElementById('items-table');
    if (itemsTable) {
        const items = loadItems();
        const tbody = itemsTable.querySelector('tbody');
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${item.name}</td><td>${item.description}</td><td>${item.category}</td><td>${item.condition.join(', ')}</td>`;
            tbody.appendChild(row);
        });
    }

    window.logout = logout;
    window.clearItems = clearItems;
});
