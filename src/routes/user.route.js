import express from "express";
import * as controllers from "../controllers/index.js"
import { verifyToken } from "../middlewares/verify_token.js";
import { isAdmin, isModeratorOrAdmin } from "../middlewares/verify_role.js";
let router = express.Router()
let initUserRoute = (app) => {
    //PUBLIC ROUTER


    //PRIVATE ROUTER
    router.use(verifyToken)
    router.use(isAdmin)
    router.get('/', controllers.getCurrent)


    return app.use('/api/v1/user', router)
}
export default initUserRoute