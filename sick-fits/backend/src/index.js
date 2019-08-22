const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "variables.env" });
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

// access all the cookies in an object
server.express.use(cookieParser());
// TODO use express middle to populate current user

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
