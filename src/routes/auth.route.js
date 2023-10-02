let router = require("express").Router()
import * as controllers from "../controllers/index.js"
let initAuthRoute = (app) => {
    router.post('/register', controllers.register)
    router.post('/login', controllers.login)
    router.post('/refresh-token', controllers.refreshTokenController)
    return app.use('/api/v1/auth', router)
}

export default initAuthRoute