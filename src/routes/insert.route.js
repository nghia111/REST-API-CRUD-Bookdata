import * as controllers from '../controllers/index'
let router = require('express').Router()
let initInsertRoute = (app) => {
    router.post('/', controllers.insert)
    return app.use('/api/v1/insert', router)
}

export default initInsertRoute
