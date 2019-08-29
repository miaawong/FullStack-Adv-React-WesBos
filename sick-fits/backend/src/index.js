const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

// access all the cookies in an object
server.express.use(cookieParser());

// TODO use express middle to populate current user

//decode the jwt so we can get the user id on each request
server.express.use((req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        const { userId } = jwt.verify(token, process.env.APP_SECRET);
        // put the userid onto the request for future request
        req.userId = userId;
    }
    next();
});

// create a middleware that populates the user on each request
server.express.use(async (req, res, next) => {
    // if they aren't logged in.. skip dis
    if (!req.userId) return next();
    const user = await db.query.user(
        { where: { id: req.userId } },
        "{id, permissions, email, name}"
    );
    req.user = user;
    // console.log(user);
    next();
});

server.start(
    {
        cors: {
            credentials: true,
            origin: process.env.FRONTEND_URL
        }
    },
    deets => {
        console.log(`server started on https:/localhost:${deets.port}`);
    }
);
