const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DJANGO_URL = 'http://localhost:8000/api/accounts';

app.post('/register', async (req, res) => {
    try {
        const response = await axios.post(`${DJANGO_URL}/register/`, req.body);
        res.status(201).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

app.post('/login', async (req, res) => {
    try {
        const response = await axios.post(`${DJANGO_URL}/login/`, req.body);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));