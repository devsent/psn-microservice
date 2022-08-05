import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import statusRoute from "./routes/status.route";
import usersRoute from "./routes/users.route";
import trophiesRoute from "./routes/trophies.route";
import errorHandler from "./middlewares/error-handler.middleware";

const port = process.env.PORT || 5000;
const options = {
    "origin": [
        "http://localhost:3000"
    ],
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 200
}
const app = express();
dotenv.config()

// App Initiliazation 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(options));

// Route Configuration

app.use(statusRoute);
app.use(usersRoute);
app.use(trophiesRoute);

// Error Handling

app.use(errorHandler);

// Server Initialization

app.listen(port, () => {
    console.log(`Server inicializado na porta ${port}!`)
});