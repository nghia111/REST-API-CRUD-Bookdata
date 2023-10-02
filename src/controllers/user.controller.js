import * as services from "../services/index"
import { internalServerError, badRequest } from "../middlewares/handle_error"

export let getCurrent = async (req, res) => {
    try {
        const userId = req.user.id
        const response = await services.getOne(userId)
        res.status(200).json(response)



    } catch (error) {
        return internalServerError(res)
    }
}