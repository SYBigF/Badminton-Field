const express = require('express');
const schedule = require('node-schedule');
const axios = require('axios');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static('pubilc')); // 服务静态文件

app.post('/listRequest', async (req, res) => {
    const myToken = req.body.token;
    const needDay = req.body.date;
    const urlweChatSessionsList = 'https://venuesports.cup.edu.cn/onesports-gateway/wechat-c/api/wechat/memberBookController/weChatSessionsList';
    const method = 'POST';
    const POSTHeaders = {
        'content-type': `application/json`,
        'Connection': `keep-alive`,
        'Accept-Encoding': `gzip,compress,br,deflate`,
        'X-UserToken': myToken,
        'width': `393`,
        'os': `ios`,
        'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.43(0x18002b2f) NetType/WIFI Language/zh_CN`,
        'token': myToken,
        'device-name': `iPhone`,
        'height': `852`,
        'Host': `venuesports.cup.edu.cn`,
        'Referer': `https://servicewechat.com/wx0c12be1936863c75/23/page-frame.html`,
        'os-version': `iOS 17.0`
    };
    const body = {
        "fieldId": "1585555543617818624",
        "isIndoor": "",
        "placeTypeId": "",
        "searchDate": needDay,
        "sportTypeId": "2"
    };
    const bodyStr = JSON.stringify(body);
    var myRequest = {
        url: urlweChatSessionsList,
        method: method,
        headers: POSTHeaders,
        data: bodyStr
    };
    console.log("★1. 按下查询按钮");
    console.log("/listRequest Received myToken:", myToken);
    console.log("/listRequest Received date:", needDay);
    try {
        const response = await axios(myRequest);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

app.post('/orderRequest', async (req, res) => {
    const myToken = req.body.token;
    const places = req.body.places;
    const orderTime = req.body.orderTime;
    const urlweChatSessionsReserve = `https://venuesports.cup.edu.cn/onesports-gateway/business-service/orders/weChatSessionsReserve`;
    const method = 'POST';
    const POSTHeaders = {
        'content-type': `application/json`,
        'Connection': `keep-alive`,
        'Accept-Encoding': `gzip,compress,br,deflate`,
        'X-UserToken': myToken,
        'width': `393`,
        'os': `ios`,
        'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.43(0x18002b2f) NetType/WIFI Language/zh_CN`,
        'token': myToken,
        'device-name': `iPhone`,
        'height': `852`,
        'Host': `venuesports.cup.edu.cn`,
        'Referer': `https://servicewechat.com/wx0c12be1936863c75/23/page-frame.html`,
        'os-version': `iOS 17.1.1`
    };
    body = {
        "number": 2,
        "requestsList": [
            {
                "sessionsId": req.body.places[0].id
            },
            {
                "sessionsId": req.body.places[1].id
            }
        ],
        "siteName": req.body.places[0].placeName,
        "sportTypeName": "羽毛球",
        "sportTypeId": "2",
        "orderUseDate": new Date(req.body.places[0].openDate).setHours(0, 0, 0, 0),
        "fieldId": "1585555543617818624",
        "fieldName": "北校园体育馆"
    };
    const bodyStr = JSON.stringify(body);
    var myRequest = {
        url: urlweChatSessionsReserve,
        method: method,
        headers: POSTHeaders,
        data: bodyStr
    };
    const scheduleJob = async () => {
        console.log("4. 下单！！！");
        try {
            const response = await axios(myRequest);
            res.json(response.data);
            process.exit(0);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    };
    const parts = orderTime.split(':');
    let hour = parseInt(parts[0], 10) - 8;
    if (hour < 0) {
        hour = (hour + 24) % 24;
    }
    const cronFormat = `${parts[2]} ${parts[1]} ${hour} * * *`;
    
    console.log("★2. 按下下单按钮");
    console.log("打印下单的包体:\n", body);

    console.log("★3. 调整时差问题");
    const now = new Date();
    console.log("当前时间:", now.toString());
    console.log("下单时间:", cronFormat);

    schedule.scheduleJob(cronFormat, scheduleJob);
});


const PORT = 3005;
app.listen(PORT, () => {
    console.log(`★0. 启动服务`);
    // console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`复制链接在浏览器中打开 http://localhost:${PORT}/main.html`);
});
