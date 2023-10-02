import pool from "/NN/connectDB.js"
export let getOne = async (userId) => {
    try {
        const [row, fields] = await pool.execute("SELECT id,name,email,avatar,users.createdAt,users.updatedAt,users.role_code,value FROM users JOIN roles on (users.role_code = roles.role_code) WHERE users.id = ?", [userId])
        if (row[0]) {
            return {
                err: 0,
                mes: 'got',
                userData: row[0]
            }
        }
        else {
            return {
                err: 1,
                mes: 'User not found',
                userData: row[0]
            }
        }
    } catch (error) {
        return error
    }
}
