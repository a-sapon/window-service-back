const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
// const http = require('request');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send(process.env.CHAT_ID);
});

app.post('/submit', async (req, res, next) => {
  try {
    const fields = [
      '<b>Имя</b>: ' + req.body.name,
      '<b>Телефон</b>: ' + req.body.tel,
      '<b>Тип окна</b>: ' + req.body.windowType,
      '<b>Высота</b>: ' + req.body.height,
      '<b>Ширина</b>: ' + req.body.width,
      '<b>Цена</b>: ' + req.body.price,
    ];

    let msg = '';
    fields.forEach((field) => {
      msg += field + '\n';
    });

    msg = encodeURI(msg);

    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage?chat_id=${process.env.CHAT_ID}&parse_mode=html&text=${msg}`
    );
    if (response.status === 200) {
      res.status(200).json({ status: 'ok', message: 'Успешно отправлено!' });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Произошла ошибка! Попробуйте еще раз или перезвоните нам.',
      });
    }

    // http.post(
    //   `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage?chat_id=${process.env.CHAT_ID}&parse_mode=html&text=${msg}`,
    //   function (error, response, body) {
    //     console.log('error:', error);
    //     console.log('statusCode:', response && response.statusCode);
    //     console.log('body:', body);
    //     if (response.statusCode === 200) {
    //       res
    //         .status(200)
    //         .json({ status: 'ok', message: 'Успешно отправлено!' });
    //     }
    //     if (response.statusCode !== 200) {
    //       res
    //         .status(400)
    //         .json({
    //           status: 'error',
    //           message:
    //             'Произошла ошибка! Попробуйте еще раз или перезвоните нам.',
    //         });
    //     }
    //   }
    // );
  } catch (err) {
    next(err);
  }
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server is running on port ${port}`);