import * as services from "../services/index"

export const insert = async (req, res) => {
    try {
        const response = await services.insertData(response)
        return res.status(200).json(response)
    } catch (error) {

    }
}