const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let users = [];
let items = [];

// Endpoint para cadastrar usuário
app.post('/register', (req, res) => {
    const { name, email, password, phone, address } = req.body;
    const user = { name, email, password, phone, address };
    users.push(user);
    res.status(201).json(user);
});

// Endpoint para login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(401).json({ message: 'Email ou senha incorretos' });
    }
});

// Endpoint para cadastrar item
app.post('/items', (req, res) => {
    const { name, description, category, condition } = req.body;
    if (items.length >= 10) {
        return res.status(400).json({ message: 'Limite de 10 itens atingido' });
    }
    const item = { name, description, category, condition };
    items.push(item);
    res.status(201).json(item);
});

// Endpoint para listar itens
app.get('/items', (req, res) => {
    res.status(200).json(items);
});

// Endpoint para limpar itens
app.delete('/items', (req, res) => {
    items = [];
    res.status(200).json({ message: 'Todos os itens foram removidos' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
