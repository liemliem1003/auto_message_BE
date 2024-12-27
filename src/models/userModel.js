const { json } = require('express');
const db = require('../config/db');

const post = {
    Login:(credential, callback) => {
        const password = credential.password
        const username = credential.username
        
        // const query = `SELECT * FROM users WHERE username = '${username}' and password = '${password}'`;
        const query = `SELECT * FROM users WHERE username = ? AND password = ?`
        db.query(query, [username, password], (err, result) =>{
            if(err) return callback(err);
            console.log(result);
            
            callback(null, result)
        });
        
    }
}

module.exports = post;
