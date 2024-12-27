const { json } = require('express');
const db = require('../config/db');

const exchange = {
    Create: (exchangeBody, callback) => {
        const { exchange_name, url_to_post_list, url_to_latest_post } = exchangeBody;
        const query = `INSERT INTO exchanges (exchange_name, url_to_post_list, url_to_latest_post, status) VALUES (?, ?, ?, ?)`;
        db.query(query, [exchange_name, url_to_post_list, url_to_latest_post, 0], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    },
    GetById: (id, callback) => {
        const query = `SELECT * from exchanges where id = (?)`;
        db.query(query, id, (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        })
    },
    GetAll: (limit, paging, callback) => {
        const offset = paging * limit;
        const countQuery = `SELECT COUNT(*) AS total FROM exchanges`;
        db.query(countQuery, (err, countResult) => {
            if (err) return callback(err);

            const totalRecords = countResult[0].total;
            const totalPages = Math.ceil(totalRecords / limit);
            const query = `SELECT * FROM exchanges ORDER BY id DESC LIMIT ${limit} OFFSET ${offset} `;
            console.log(query, [limit, offset]);
            db.query(query, (err, result) => {
                if (err) return callback(err);
                callback(null, { data: result, totalPages: totalPages });
            });
        });
    },
    Update: (exchangesBody, callback) => {
        const { exchange_name, url_to_post_list, url_to_latest_post, id} = exchangesBody;
        const query = `Update exchanges set exchange_name ='${exchange_name}', url_to_post_list = '${url_to_post_list}', url_to_latest_post ='${url_to_latest_post}' where id = ${id}`;
        db.query(query, (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        })
    }
}


module.exports = exchange;