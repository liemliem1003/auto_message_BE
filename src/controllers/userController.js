const user = require('../models/userModel');

const postLogin = (req, res) => {
    const credentials = req.body;
    user.Login(credentials, (err, results) => {
        console.log(123123);
        
        console.log(results);
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (results.length == 0) {
            results = {
                message: "Username or Password is incorrect",
                code: 0
            }
        }else{
            results = {
                message: "Success",
                code: 1
            }
        }
        res.json(results);
    })

};

module.exports = {
    postLogin
};