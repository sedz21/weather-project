const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {res.send('Weather Project Backend')});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {console.log('Server running on port ${PORT}')});

app.get('/api/weather', (req, res) => {
    res.json({message: "Weather data will be here."});
});