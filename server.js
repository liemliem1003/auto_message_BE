const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

const allowedOrigins = [
    'http://localhost:4200',   // Local development
    // 'https://2cat.loca.lt' // Ngrok URL
];

app.options('*', cors());  // Preflight route for all routes

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization',
        //  'ngrok-skip-browser-warning'
        ]
}));

// app.use((req, res, next) => {
//     const token = req.headers['authorization'];
//     if (token === `Bearer ${API_TOKEN}`) {
//         next(); // Token is valid, proceed to the next middleware or route
//     } else {
//         res.status(401).json({ error: 'Unauthorized' });
//     }
// });

app.use(express.json());

const userRoutes = require('./src/routes/userRoutes.js');
app.use('/users', userRoutes);

const postRoutes = require('./src/routes/postRoutes.js');
app.use('/posts', postRoutes);

const channelRoutes = require('./src/routes/channelRoutes.js');
app.use('/channels', channelRoutes);

const exchangeRoutes = require('./src/routes/exchangeRoutes.js');
app.use('/exchanges', exchangeRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });