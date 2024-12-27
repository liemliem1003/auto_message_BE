const { json } = require('express');
const db = require('../config/db');
const SeleniumForBybit = require('../AI/selenium');
const schedule = require('node-schedule');

const post = {
    Create: (postBody, callback) => {

        const { post_contents, publish_time, status, channel_id, post_title } = postBody

        // const query = `SELECT * FROM users WHERE username = '${username}' and password = '${password}'`;
        const query = `INSERT INTO posts (post_contents, publish_time, status, channel_id, post_title) VALUES (?, ?, ?, ?, ?)`;
        db.query(query, [post_contents, publish_time, status, channel_id, post_title], (err, result) => {
            if (err) return callback(err);
            PublishPostOnTelegram(result.insertId, callback);
            callback(null, result)
        });
    },
    GetById: (id, callback) => {
        const query = `SELECT * from posts where id = (?)`;
        db.query(query, id, (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        })
    },
    GetAll: (limit, paging, callback) => {
        const offset = paging * limit;
        const countQuery = `SELECT COUNT(*) AS total FROM posts`;
        db.query(countQuery, (err, countResult) => {
            if (err) return callback(err);

            const totalRecords = countResult[0].total;
            const totalPages = Math.ceil(totalRecords / limit);
            const query = `SELECT * FROM posts ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
            db.query(query, (err, result) => {
                if (err) return callback(err);
                callback(null, { data: result, totalPages: totalPages });
            });
        });
    },
    Update: (postBody, callback) => {
        const { post_title, post_contents, channel_id, status, publish_time, id } = postBody;
        const query = `Update posts set post_title ='${post_title}', post_contents = '${post_contents}', channel_id ='${channel_id}', status = ${status}, publish_time = '${publish_time}' where id = ${id}`;
        db.query(query, (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        })
    }
}

const axios = require('axios');

// function PublishPostOnTelegram(postId, callback) {
//     const query = `SELECT * FROM posts WHERE id = ${postId}`;
//     db.query(query, (err, result) => {
//         if (err) return callback(err);
//         const post = result[0];
//         if (!post || !post.publish_time) {
//             console.log("Publish time not available.");
//             return;
//         }

//         const publishTime = convertToDate(post.publish_time); // Hàm convertToDate cần được định nghĩa
//         const currentTime = new Date();
//         const timeDifference = publishTime - currentTime;

//         if (timeDifference < 0) {
//             console.log("Publish time has already passed.");
//             return;
//         }

//         console.log(`Post will be published in ${timeDifference / 1000} seconds.`);

//         const channel_id = post.channel_id;
//         const queryChannel = `SELECT * FROM channels WHERE id = ${channel_id}`;

//         db.query(queryChannel, (err, result) => {
//             if (err) return callback(err);
//             const channel_telegram_id = result[0].channel_id;

//             setTimeout(async () => {
//                 var token = "7595483489:AAGak9jImk9voGjXiNOVqL4EO02_26q2HD8";
//                 var url = "https://api.telegram.org/bot" + token + "/sendMessage";
//                 var seleniumResult = await SeleniumForBybit();
//                 var requestURL = `${url}?chat_id=${channel_telegram_id}&text=${encodeURIComponent(seleniumResult)}&parse_mode=html`;

//                 // Sử dụng axios để gửi request
//                 axios.get(requestURL)
//                     .then(response => {
//                         var telegram_post_id = "https://t.me/" + response.data.result.sender_chat.username + "/" + response.data.result.message_id
//                         const queryUpdate = `update posts set status = 2, telegram_post_id = '${telegram_post_id}', post_contents ='${seleniumResult}' where id = ${postId}`
//                         db.query(queryUpdate, (err, result) => {
//                             if (err) return callback(err);
//                         })
//                     })
//                     .catch(error => {
//                         console.error("Error:", error.response ? error.response.data : error.message);
//                     });
//             }, timeDifference);
//         });
//     });
// }

function PublishPostOnTelegram(postId) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM posts WHERE id = ${postId}`;
        db.query(query, (err, result) => {
            if (err) return reject(err); // Nếu có lỗi trong query, trả về lỗi

            const post = result[0];
            if (!post || !post.publish_time) {
                console.log("Publish time not available.");
                return reject(new Error("Publish time not available."));
            }

            const publishTime = convertToDate(post.publish_time); // Hàm convertToDate cần được định nghĩa
            const currentTime = new Date();
            const timeDifference = publishTime - currentTime;

            if (timeDifference < 0) {
                console.log("Publish time has already passed.");
                return reject(new Error("Publish time has already passed."));
            }

            console.log(`Post will be published in ${timeDifference / 1000} seconds.`);

            const channel_id = post.channel_id;
            const queryChannel = `SELECT * FROM channels WHERE id = ${channel_id}`;

            db.query(queryChannel, (err, result) => {
                if (err) return reject(err); // Nếu có lỗi trong query, trả về lỗi

                const channel_telegram_id = result[0].channel_id;

                setTimeout(async () => {
                    var token = "7595483489:AAGak9jImk9voGjXiNOVqL4EO02_26q2HD8";
                    var url = "https://api.telegram.org/bot" + token + "/sendMessage";
                    var seleniumResult = await SeleniumForBybit();
                    var requestURL = `${url}?chat_id=${channel_telegram_id}&text=${encodeURIComponent(seleniumResult)}&parse_mode=html`;

                    // Sử dụng axios để gửi request
                    axios.get(requestURL)
                        .then(response => {
                            var telegram_post_id = "https://t.me/" + response.data.result.sender_chat.username + "/" + response.data.result.message_id;
                            const queryUpdate = `UPDATE posts SET status = 2, telegram_post_id = '${telegram_post_id}', post_contents ='${seleniumResult}' WHERE id = ${postId}`;

                            db.query(queryUpdate, (err, result) => {
                                if (err) return reject(err); // Nếu có lỗi trong query update, trả về lỗi
                                resolve(result); // Nếu thành công, trả về kết quả
                            });
                        })
                        .catch(error => {
                            console.error("Error:", error.response ? error.response.data : error.message);
                            reject(error); // Nếu có lỗi trong việc gửi request, trả về lỗi
                        });
                }, timeDifference);
            });
        });
    });
}



let currentJob = null;

function ScheduleDaily(timeToPublish, task) {
    if (currentJob) {
        currentJob.cancel();
    }

    const rule = new schedule.RecurrenceRule();
    rule.hour = timeToPublish.hour;
    rule.minute = timeToPublish.minute;
    currentJob = schedule.scheduleJob(rule, task);
}

ScheduleDaily({hour: 21, minute: 15}, Task)

const time = { hour: 21, minute: 30 };
const timeBetween2Posts = 1
async function getAllChannels() {
    const query = `SELECT * FROM channels where status =1`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) return reject(err); // Trả về lỗi
            resolve(result); // Trả về dữ liệu
        });
    });
}
async function Task() {
    var channels;
    try {
        const result = await getAllChannels(); // Chờ kết quả trả về
        channels = result;
    } catch (err) {
        console.error("Error fetching channels:", err);
        return;
    }

    // Dùng Promise.all để chạy các yêu cầu đồng thời (nếu cần)
    const promises = channels.map(async (item, i) => {
        var today = new Date();
        // today.setHours(today.getHours() + 7);
        today.setHours(0, 0, 0, 0);
        today.setHours(today.getHours() + time.hour );

        today.setMinutes(today.getMinutes() + time.minute + timeBetween2Posts * i);

        let postBody = {
            post_contents: await SeleniumForBybit(), // Chờ SeleniumForBybit
            publish_time: today,
            status: 1,
            channel_id: item.id,
            post_title: "Auto Post"
        };

        const query = `INSERT INTO posts (post_contents, publish_time, status, channel_id, post_title) VALUES (?, ?, ?, ?, ?)`;

        // Sử dụng Promise để xử lý db.query bất đồng bộ
        return new Promise((resolve, reject) => {
            console.log(postBody);
            
            db.query(query, [postBody.post_contents,postBody.publish_time,postBody.status,postBody.channel_id,postBody.post_title], (err, result) => {
                if (err) {
                    reject(err); // Trả về lỗi nếu có
                } else {
                    // Đảm bảo PublishPostOnTelegram được gọi sau khi db.query thành công
                    PublishPostOnTelegram(result.insertId)
                        .then(() => resolve(result)) 
                        .catch((err) => reject(err)); 
                }
            });
        });
    });

    try {
        // Chờ tất cả các công việc đồng thời trong map
        const results = await Promise.all(promises);
        console.log("Tất cả các bài viết đã được đăng:", results);
    } catch (err) {
        console.error("Lỗi trong khi đăng bài:", err);
    }
}

// Task()

function convertToDate(publishTime) {
    return new Date(publishTime);
}

module.exports = post;