const post = require('../models/postModel');


const postCreatePost = (req, res) => {
    const postBody = req.body;
    post.Create(postBody, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length == 0) {
            results = {
                message: "CreatePost Failed",
                code: 0
            }
        } else {
            results = {
                message: "Success",
                code: 1
            }
        }
        res.json(results);
    })
};
const getGetPostById = (req, res) => {
    const id = req.params.id;
    post.GetById(id, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!results || results.length === 0) {
            return res.json({
                message: "No return",
                code: 0
            });
        } else {
            return res.json({
                contents: results, // Nếu muốn giữ lại dữ liệu
                message: "Success",
                code: 1
            });
        }
    });
}
const getGetAll = (req, res) => {
    const limit = req.query.limit;
    const paging = req.query.paging;
    post.GetAll(limit, paging, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!results || results.length === 0) {
            return res.json({
                message: "No return",
                code: 0
            });
        } else {
            return res.json({
                contents: results, // Nếu muốn giữ lại dữ liệu
                message: "Success",
                code: 1
            });
        }
    })
}
const putUpdatePost = (req, res) => {
    const postBody = req.body;
    post.Update(postBody, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!results || results.length === 0) {
            return res.json({
                message: "Failed",
                code: 0
            });
        } else {
            return res.json({
                message: "Success",
                code: 1
            });
        }
    })
}
module.exports = {
    postCreatePost,
    getGetPostById,
    getGetAll,
    putUpdatePost
};