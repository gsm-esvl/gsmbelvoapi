const express = require("express");
const app = express();
const port = process.env.PORT || 1337;
const bodyParser = require('body-parser');
const moment = require('moment');
const belvo = require('belvo').default;

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Fill in your Belvo API keys - https://dashboard.belvo.co
BELVO_SECRET_ID = process.env.BELVO_SECRET_ID
BELVO_SECRET_PASSWORD = process.env.BELVO_SECRET_PASSWORD
// Use `sandbox` to test with Belvo's Sandbox environment
// Use `production` to go live
BELVO_ENV = process.env.BELVO_ENV || 'sandbox'
BELVO_ENV_URL = process.env.BELVO_ENV === 'sandbox' ? 'https://sandbox.belvo.co' : 'https://api.belvo.co'

const client = new belvo(
    "a5b72632-8463-4b1a-88f7-00aecf4d9ef3",
    "gYsFwox03JJmU@3NkX5opr_JNLVMoE6eMc2HiPxz*sKXW2CImSkv#@59Q*SMzZ5O",
    "https://api.belvo.co"
);

app.get("/token", function (req, res) {
    client.connect().then(function () {
        client.widgetToken
            .create()
            .then((response) => {
                res.json(response);
            })
            .catch((error) => {
                res.status(500).send({
                    message: error.message,
                });
            });
    });
});

// Request an access token to be used when loading the Widget
// https://developers.belvo.co/docs/connect-widget#section--3-generate-an-access_token-
app.get("/get_token", (req, res, next) => {
    client.connect()
        .then(() => {
            client.widgetToken.create()
                .then((response) => {
                    res.json(response);
                })
                .catch((error) => {
                    res.status(500).send({
                        message: error.message
                    });
                });
        });
});

app.post("/accounts", (req, res, next) => {
    const { link_id } = req.body;
    client.connect()
        .then(() => {
            client.accounts.retrieve(link_id)
                .then((response) => {
                    res.json(response);
                })
                .catch(function (error) {
                    res.status(500).send({
                        message: error.message
                    });
                });
        });
});

app.post("/transactions", (req, res, next) => {
    const { link_id } = req.body;
    const date_from = moment().subtract(30, "days").format('YYYY-MM-DD');
    const date_to = moment().format('YYYY-MM-DD');

    client.connect()
        .then(function () {
            client.transactions.retrieve(link_id, date_from, { dateTo: date_to })
                .then((response) => {
                    res.json(response);
                })
                .catch((error) => {
                    console.log('error', error)
                    res.status(500).send({
                        message: error.message
                    });
                });
        });
});


app.post("/balances", (req, res, next) => {
    const { link_id } = req.body;
    const date_from = moment().subtract(30, "days").format('YYYY-MM-DD');
    const date_to = moment().format('YYYY-MM-DD');

    client.connect()
        .then(function () {
            client.balances.retrieve(link_id, date_from, { dateTo: date_to })
                .then((response) => {
                    res.json(response);
                })
                .catch((error) => {
                    console.log('error', error)
                    res.status(500).send({
                        message: error.message
                    });
                });
        });
});

app.post("/owners", (req, res, next) => {
    const { link_id } = req.body;

    client.connect()
        .then(function () {
            client.owners.retrieve(link_id)
                .then((response) => {
                    res.json(response);
                })
                .catch((error) => {
                    console.log('error', error)
                    res.status(500).send({
                        message: error.message
                    });
                });
        });
});


app.listen(port, () => console.log(`Server running on port ${port}!`))


// const express = require("express");
// const app = express();
// const belvo = require("belvo").default;

// app.get("/token", function (req, res) {
//   var client = new belvo(
//     "720d9cb0-3b15-4ccc-971a-66a1f3a18b90",
//     "I2YTCfpMaTiLqS3lSmTD38MapF5UsdUOBTXUdEDfRNuDtAoo14D3QA5xp*sTJrrS",
//     "https://sandbox.belvo.co"
//   );

//   client.connect().then(function () {
//     client.widgetToken
//       .create()
//       .then((response) => {
//         res.json(response);
//       })
//       .catch((error) => {
//         res.status(500).send({
//           message: error.message,
//         });
//       });
//   });
// });

// app.listen(3000, () => {
//   console.log("El servidor está inicializado en el puerto 3000");
// });
