require("dotenv").config({ path: "variables.env" });
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();
//TODO use express middle to handle cookies (JWT)

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
