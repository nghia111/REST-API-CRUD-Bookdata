import pool from "/NN/connectDB.js"
import bcrypt from "bcryptjs"
import jwt, { sign } from 'jsonwebtoken'
import { notAuth } from "../middlewares/handle_error"
const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(8))
export let register = async ({ email, password }) => {
    try {
        const [row, fields] = await pool.execute("SELECT * FROM USERS WHERE email = ?", [email])
        if (row[0]) {
            return {
                err: 1,
                mes: "email is used",
                'access_token': null,
                'refresh_token': null
            }
        }
        password = hashPassword(password)
        await pool.execute("INSERT INTO USERS (email, password) VALUES (?,?)", [email, password])
        const response = await pool.execute("SELECT * FROM USERS WHERE email = ?", [email])
        const access_token = jwt.sign({ id: response[0][0].id, email: response[0][0].email, role_code: response[0][0].role_code }, process.env.JWT_SECRET, { expiresIn: '5s' })
        const refresh_token = jwt.sign({ id: response[0][0].id }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '15d' })
        await pool.execute(`
        UPDATE users
        SET refresh_token = ?
        WHERE id = ?`, [refresh_token, response[0][0].id])
        return {
            err: 0,
            mes: "Register is successfully",
            'access_token': 'Bearer ' + access_token,
            'refresh_token': 'Bearer ' + refresh_token
        }

    } catch (error) {
        return error
    }
}

export let login = async ({ email, password }) => {

    const [row, fields] = await pool.execute("SELECT * FROM USERS WHERE email = ? ", [email])
    if (!row[0]) {
        return {
            err: 1,
            mes: "email hasn't been registed",
            'access_token': null
        }
    }
    const isChecked = bcrypt.compareSync(password, row[0].password);
    const token = isChecked ? jwt.sign({ id: row[0].id, email: row[0].email, role_code: row[0].role_code }, process.env.JWT_SECRET, { expiresIn: '5s' }) : null
    const refresh_token = isChecked ? jwt.sign({ id: row[0].id }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '15d' }) : null
    await pool.execute(`
        UPDATE users
        SET refresh_token = ?
        WHERE id = ?`, [refresh_token, row[0].id])
    if (token) {
        return {
            err: 0,
            mes: "login is successfully",
            'access_token': 'Bearer ' + token,
            'refresh_token': 'Bearer ' + refresh_token
        }
    } else {
        return {
            err: 1,
            mes: "Password incorrect",
            'access_token': null,
            'refresh_token': null
        }
    }


}
export const refresh_token = async (refresh_token) => {
    return new Promise((resolve, reject) => {
        pool.execute("SELECT * FROM users WHERE refresh_token = ?", [refresh_token])
            .then(([row, fields]) => {
                if (row.length > 0) {
                    jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH_TOKEN, (err) => {
                        if (err) {
                            resolve({
                                err: 1,
                                mes: 'Refersh_token is expired. Require login again'
                            });
                        } else {
                            const access_token = jwt.sign({ id: row[0].id, email: row[0].email, role_code: row[0].role_code }, process.env.JWT_SECRET, { expiresIn: '5s' });
                            resolve({
                                err: access_token ? 0 : 1,
                                mes: access_token ? 'ok' : 'fail to generate access_token.',
                                'access_token': access_token,
                                'refresh_token': refresh_token
                            });
                        }
                    });
                } else {
                    resolve(null);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};