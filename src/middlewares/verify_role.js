import { notAuth } from "./handle_error"
export const isAdmin = (req, res, next) => {
    const role_code = req.user.role_code
    if (role_code !== 'R1') return notAuth("require role Admin", res)
    next()
}
export const isCreaterOrAdmin = (req, res, next) => {
    const role_code = req.user.role_code
    if (role_code !== 'R1' && role_code !== 'R2') return notAuth("require role Admin or Creater", res)
    next()
}