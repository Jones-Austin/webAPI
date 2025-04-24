const express = require('express');
const app = express();

app.disable('x-powered-by');


const port = 8004;
const carroutes = require('./src/brands/routers.js'); // Import the car routes

app.use(express.json());

const cors = require('cors');
app.use(cors({
    origin : '*'
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

//API routes
app.use('/api/v1/cars', carroutes); // Use the car routes for the /api/cars path

app.listen(port, () => console.log(`Example app listening on port ${port}!`));




