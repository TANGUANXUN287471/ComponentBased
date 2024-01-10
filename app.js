const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

app.use(bodyParser.json());

// Endpoint for grammar checking using GrammarBot API
app.post('/check-grammar', async (req, res) => {
    try {
        const { text } = req.body;

        const encodedParams = new URLSearchParams();
        encodedParams.set('text', text);
        encodedParams.set('language', 'en-US');

        const options = {
            method: 'POST',
            url: 'https://grammarbot.p.rapidapi.com/check',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '5e2ccdc186msh5f6f488575d3757p125196jsn4ba6bcb25bed',
                'X-RapidAPI-Host': 'grammarbot.p.rapidapi.com',
            },
            data: encodedParams,
        };

        const response = await axios.request(options);
        const grammarCheckResults = response.data.matches.map(match => match.message);

        // Send the result back to the client
        res.json({ errors: grammarCheckResults });
    } catch (error) {
        console.error('Error during grammar checking:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
