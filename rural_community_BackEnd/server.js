    const express = require('express');
    const app = express();
    const AuthorizationFromTokenMiddleWare = require('./middleware/jwtMiddleware')
    const cors = require('cors');
    app.use(cors());
    const port = 9009;
    const corsOptions = {
        origin: 'http://localhost:3000', // Replace with your frontend URL
        optionsSuccessStatus: 200, // For legacy browser support
        methods: "GET,POST,PUT,DELETE", // Methods allowed
    };

    app.use(cors(corsOptions));

    const connectionMongoDB = require('./MongoConnection');  // Fixed typo in function name
    connectionMongoDB();
    const buildInMiddleware = require('./middleware/buildinMiddleware');
    buildInMiddleware(app);
    // AuthorizationFromTokenMiddleWare(app)

    const signUpRoute = require('./routes/signUpRoute');
    const forgotPasswordRoute = require('./routes/forgotPasswordRoute')
    
    app.use('/api/ruralcommunity', signUpRoute);
    app.use('/api/ruralcommunity/forgotpassword',forgotPasswordRoute );

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
