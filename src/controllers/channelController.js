const channel = require('../models/channelModel');

const postCreateChannel = (req, res) => {
    const channelBody = req.body;
    channel.Create(channelBody, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length == 0) {
            results = {
                message: "Add Channel Failed",
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

const getGetChannelById = (req, res) => {
    const id = req.params.id;
    channel.GetById(id, (err, results) => {
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
    channel.GetAll(limit, paging, (err, results) => {
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

const putUpdateChannel = (req, res) => {
    const channelBody = req.body;
    channel.Update(channelBody, (err, results) => {
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
    postCreateChannel,
    getGetChannelById,
    getGetAll,
    putUpdateChannel
};