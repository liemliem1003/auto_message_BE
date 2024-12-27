const schedule = require('node-schedule');

// Biến lưu job hiện tại
let currentJob = null;

function scheduleDaily(clientTime, taskFunction) {
    if (currentJob) {
        currentJob.cancel();
    }

    const rule = new schedule.RecurrenceRule();
    rule.hour = clientTime.hour;
    rule.minute = clientTime.minute;

    currentJob = schedule.scheduleJob(rule, taskFunction);

    console.log(`Lịch trình hàng ngày được đặt: ${rule.hour}:${rule.minute}`);
}

function myTask() {
    console.log("Chạy task vào: " + new Date());
}

const clientTime = { hour: 14, minute: 30 }; // Chạy vào 14:30 hàng ngày

scheduleDaily(clientTime, myTask);

setTimeout(() => {
    const newClientTime = { hour: 15, minute: 0 };
    scheduleDaily(newClientTime, myTask);
}, 5000); 
