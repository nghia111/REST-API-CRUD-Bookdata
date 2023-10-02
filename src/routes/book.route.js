import express from "express";
import * as controllers from "../controllers/index.js"
import { verifyToken } from "../middlewares/verify_token.js";
import { isAdmin, isCreaterOrAdmin } from "../middlewares/verify_role.js";
import uploadClound from "../middlewares/uploader.js";

let router = express.Router()
let initBookRoute = (app) => {
    //PUBLIC ROUTER
    router.get('/', controllers.getBooks)

    //PRIVATE ROUTER
    router.use(verifyToken)
    router.use(isAdmin)
    router.post('/', uploadClound.single('image'), controllers.createNewBook)
    router.use(isCreaterOrAdmin)
    router.put('/', uploadClound.single('image'), controllers.updateBook)
    router.delete('/', controllers.deleteBooks)




    return app.use('/api/v1/book', router)
}
export default initBookRoute