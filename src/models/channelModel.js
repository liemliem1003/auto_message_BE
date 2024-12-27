const db = require('../config/db');

const channel = {
    Create: (channelBody, callback) => {
        const { channel_name, channel_id, status } = channelBody;
        const query = `INSERT INTO channels (channel_name, channel_id, status) VALUES (?, ?, ?)`;
        db.query(query, [channel_name, channel_id, status], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    },
    GetById: (id, callback) => {
        const query = `SELECT * from channels where id = (?)`;
        db.query(query, id, (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        })
    },
    GetAll: (limit, paging, callback) => {
        const offset = paging * limit;
        const countQuery = `SELECT COUNT(*) AS total FROM channels`;
        db.query(countQuery, (err, countResult) => {
            if (err) return callback(err);

            const totalRecords = countResult[0].total;
            const totalPages = Math.ceil(totalRecords / limit);
            const query = `SELECT * FROM channels ORDER BY id DESC LIMIT ${limit} OFFSET ${offset} `;
            console.log(query, [limit, offset]);
            db.query(query, (err, result) => {
                if (err) return callback(err);
                callback(null, { data: result, totalPages: totalPages });
            });
        });
    },
    Update: (channelBody, callback) => {
        const { status, channel_id, channel_name, id} = channelBody;
        console.log(channelBody);
        
        const query = `Update channels set status ='${status}', channel_id = '${channel_id}', channel_name ='${channel_name}' where id = ${id}`;
        console.log(query);
        
        db.query(query, (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        })
    }
};

module.exports = channel;
