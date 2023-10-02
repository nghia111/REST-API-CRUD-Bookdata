import express from "express";
import initAuthRoute from "./routes/auth.route"
import bodyParser from "body-parser";
import { notFound } from './middlewares/handle_error'
import initUserRoute from "./routes/user.route"
import initInsertRoute from "./routes/insert.route"
import initBookRoute from "./routes/book.route"
require("dotenv").config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
initAuthRoute(app)
initUserRoute(app)
initInsertRoute(app)
initBookRoute(app)
app.use(notFound)
const port = process.env.PORT || 9000
app.listen(port, () => {
    console.log("app listened at port " + port)
})