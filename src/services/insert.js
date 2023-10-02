import pool from '../../connectDB.js'
import data from '../../data/data.json'
import genarateCode from '../helpers/function.js'
export const insertData = async () => {
    try {
        // trả về 1 mảng các key
        const categories = Object.keys(data)
        // thêm vào bảng categories
        categories.forEach(async item => {
            if (item != null) {
                await pool.execute('INSERT INTO categories (code, value) VALUES (?,?) ', [genarateCode(item), item])
            }
        })

        // trả về 1 mảng các cặp key, value
        const dataArr = Object.entries(data)
        dataArr.forEach((items) => {
            items[1].forEach(async (book) => {
                if (book != null) {
                    const id = book?.upc
                    const title = book?.title
                    const price = book?.price
                    const available = book?.available
                    const image = book?.imageUrl
                    const description = book?.bookDescription
                    const category_code = genarateCode(items[0])
                    await pool.execute('INSERT INTO books (id, title, price, available, image, description, category_code	) VALUES (?,?,?,?,?,?,?) ', [id, title, price, available, image, description, category_code])
                }
            })
        })
        return {
            err: 0,
            mes: ' thêm dữ liệu thành công'
        }
    } catch (error) {
        return {
            err: 1,
            mes: "thêm dữ liệu bị lỗi " + error
        }
    }
}