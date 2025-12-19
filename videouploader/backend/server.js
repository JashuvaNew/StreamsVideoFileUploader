const express = require('express');
const cors = require('cors');

const uploadRoutes = require('./routes/route');

const app = express();

app.use(cors());
app.use(express.raw({
    type: 'application/octet-stream',
    limit: '50mb'
}));

// mount routes
app.use('/api', uploadRoutes);

app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
