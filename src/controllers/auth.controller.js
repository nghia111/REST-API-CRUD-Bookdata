import * as services from "../services/index"
import { internalServerError, badRequest } from "../middlewares/handle_error"
import { email, password, refreshToken } from "../helpers/joi_schema"
import joi from 'joi'
export let register = async (req, res) => {
    try {
        const { error } = joi.object({ email, password }).validate(req.body)
        if (error) {
            return badRequest(error.details[0].message, res)
        }
        const response = await services.register(req.body)
        res.status(200).json(response)



    } catch (error) {
        return internalServerError(res)
    }
}
export let login = async (req, res) => {
    try {
        const { error } = joi.object({ email, password }).validate(req.body)
        if (error) {
            return badRequest(error.details[0].message, res)
        }
        const response = await services.login(req.body)
        return res.status(200).json(response)

    } catch (error) {
        return internalServerError(res)
    }
}
export let refreshTokenController = async (req, res) => {
    try {
        const { error } = joi.object({ refreshToken }).validate(req.body)
        if (error) {
            return badRequest(error.details[0].message, res)
        }
        const response = await services.refresh_token(req.body.refreshToken)
        return res.status(200).json(response)

    } catch (error) {
        return internalServerError(res)
    }
}