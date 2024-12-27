const exchange = require('../models/exchangeModel');

const postCreateExchange = (req, res) => {
    const exchangeBody = req.body;
    exchange.Create(exchangeBody, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length == 0) {
            results = {
                message: "Add Exchange Failed",
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

const getGetExchangeById = (req, res) => {
    const id = req.params.id;
    exchange.GetById(id, (err, results) => {
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
    exchange.GetAll(limit, paging, (err, results) => {
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

const putUpdateExchange = (req, res) => {
    const exchangeBody = req.body;
    exchange.Update(exchangeBody, (err, results) => {
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
    putUpdateExchange,
    getGetAll,
    getGetExchangeById,
    postCreateExchange
};