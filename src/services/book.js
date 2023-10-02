import { response } from "express"
import pool from "/NN/connectDB.js"
import { v4 as generateId } from "uuid"
const cloudinary = require('cloudinary').v2
//  READ -> method get
export let getBooks = async ({ page, limit, order, name, ...query }) => {
    try {
        const flimit = +limit || process.env.LIMIT_BOOKS
        let offset = 0
        if (page >= 2) {
            offset = (+page - 1) * flimit
        }
        let values = []
        let sqlQuery = ` SELECT 
        id	,
        title	,
        price	,
        available,	
        image	,
        description	,
        books.createdAt	,
        books.updatedAt, 
        code,
        value
        FROM books join categories on (books.category_code = categories.code)  WHERE  1=1  `;
        if (name) {
            sqlQuery += `AND title LIKE ? `
            values.push(`%${name}%`)
        }

        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                const value = query[key];
                // Sử dụng key và value trong câu truy vấn SQL
                sqlQuery += ` AND ${key} = ? `;
                values.push(value)
            }
        }
        if (order) {
            sqlQuery += `ORDER BY  ? `
            values.push(order.join(' '))
        }
        sqlQuery += `LIMIT ?    OFFSET ?`;
        values.push(flimit)
        values.push(offset)
        const [rows, fields] = await pool.execute(sqlQuery, values);
        const bookData = rows.map((row) => {
            const { id,
                title,
                price,
                available,
                image,
                description,
                createdAt,
                updatedAt,
                ...categoriesData } = row
            row = {
                id,
                title,
                price,
                available,
                image,
                description,
                createdAt,
                updatedAt,
                categoriesData
            }
            return row
        })

        return {
            err: rows ? 0 : 1,
            mes: rows ? 'GOT' : 'Cannot find books',
            bookData: bookData
        }




    } catch (error) {
        return error
    }
}

//CREATE -> method post
export let createNewBook = async (body, fileData) => {
    try {
        const [row, field] = await pool.execute(`SELECT * FROM books WHERE LOWER(title) like LOWER(?) `, [body.title])
        if (row[0]) {
            cloudinary.uploader.destroy(fileData.filename)
            return {
                err: 1,
                mes: "Sách này đã tồn tại trong shop",

            }
        } else {
            const id = generateId()
            await pool.execute(`INSERT INTO books ( id, title, price, available, image, category_code,description) VALUES (?,?, ?,?,?,?,?);`, [id, body.title, body.price, body.available, fileData.path, body.category_code, body.description])
            return {
                err: 0,
                mes: "created"
            }
        }


    } catch (error) {
        return error
    }
}
//UPDATE
export let updateBook = async (body, fileData) => {
    try {

        if (!body.title && !body.price && !body.available && !fileData && !body.description && !body.category_code) {
            return {
                err: 1,
                mes: "không có thông tin gì để update",
            }

        }

        let values = []
        let sqlQuery = ` UPDATE books SET `
        if (body.title) {
            sqlQuery += ` title = ?, `
            values.push(`${body.title}`)
        }
        if (body.price) {
            sqlQuery += ` price = ?, `
            values.push(body.price)
        }
        if (body.available) {
            sqlQuery += ` available = ?, `
            values.push(body.available)
        }
        if (fileData) {
            sqlQuery += ` image = ?, `
            values.push(`${fileData.path}`)
        }
        if (body.description) {
            sqlQuery += ` description = ?, `
            values.push(`${body.description}`)
        }
        if (body.category_code) {
            sqlQuery += ` category_code = ?, `
            values.push(`${body.category_code}`)
        }
        sqlQuery = sqlQuery.slice(0, -2); // Xóa dấu phẩy cuối cùng
        sqlQuery += ` WHERE id= ?`
        values.push(`${body.bid}`)
        const response = await pool.execute(sqlQuery, values)
        if (response[0].changedRows == 0) {
            if (fileData) cloudinary.uploader.destroy(fileData.filename)
            return {
                err: 1,
                mes: "id sai hoặc record không có thay đổi"
            }
        }
        else
            return {
                err: 0,
                mes: 'Cập nhật thành công'
            }
    } catch (error) {
        if (fileData) cloudinary.uploader.destroy(fileData.filename)
        return error
    }
}
// DELETE
export let deleteBooks = async (bids) => {
    try {

        let sqlQuery = 'DELETE FROM books WHERE id IN ('

        for (let i = 0; i < bids.length; i++) {
            sqlQuery += '?,'; // Sử dụng tham số '?' để tránh lỗ hổng SQL injection
        }
        sqlQuery = sqlQuery.slice(0, -1); // Xóa dấu phẩy cuối cùng
        sqlQuery += ')';

        const response = await pool.execute(sqlQuery, bids); // Truyền mảng bids vào tham số của execute
        if (response[0].changedRows == 0) {
            return {
                err: 1,
                mes: "không tìm thấy id"
            }
        }
        return {
            err: 0,
            mes: "xóa thành công",
            dt: response
        }

    } catch (error) {
        return error
    }
}