const express = require('express');
const app = express();

const cors = require('cors');

app.use(cors());

const router = require('./routes/routes');

app.use(router);

const server = app.listen(port = 3001, () => {
    console.log(`Server running on port ${port}`);
});