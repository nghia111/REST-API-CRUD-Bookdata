import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { notAuth } from './handle_error'
//middleware giữa router và controller
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) return notAuth('Require login', res)
    const accessToken = token.split(' ')[1]
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decode) => {
        const isChecked = err instanceof TokenExpiredError
        if (isChecked == true) {
            return notAuth('token is expired', res, isChecked)
        }


        else if (err) return notAuth('token is invalid', res, isChecked)
        req.user = decode
        next()
    })
}