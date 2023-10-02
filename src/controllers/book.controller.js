import * as services from "../services/index"
import { internalServerError, badRequest } from "../middlewares/handle_error"
import { bid, bids, title, image, category_code, available, price, description } from "../helpers/joi_schema"
import joi from 'joi'
const cloudinary = require('cloudinary').v2
export let getBooks = async (req, res) => {
    try {
        const response = await services.getBooks(req.query)
        return res.status(200).json(response)



    } catch (error) {
        return internalServerError(res)
    }
}
export let createNewBook = async (req, res) => {
    try {
        const fileData = req.file
        const { error } = joi.object({ description, title, image, category_code, price, available }).validate({ ...req.body, image: fileData?.path })
        if (error) {
            if (fileData)
                cloudinary.uploader.destroy(fileData.filename)
            return badRequest(error.details[0].message, res)
        }
        const response = await services.createNewBook(req.body, fileData)
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}
export let updateBook = async (req, res) => {
    try {
        const fileData = req.file
        const { error } = joi.object({ bid }).validate({ bid: req.body.bid })

        if (error) {
            if (fileData)
                cloudinary.uploader.destroy(fileData.filename)
            return badRequest(error.details[0].message, res)
        }
        const response = await services.updateBook(req.body, fileData)
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}
export let deleteBooks = async (req, res) => {
    try {

        const { error } = joi.object({ bids }).validate(req.query)

        if (error) {
            return badRequest(error.details[0].message, res)
        }
        const response = await services.deleteBooks(req.query.bids)
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}

