const http = require('http');
const {getCustomers, createAccount, moneyTransfer, balance, history} = require('./controllers/customer-controller');


//@desc root level function to create http server.
const server = http.createServer(function(req,res) {
    if(req.url === '/api/customers' && req.method === 'GET'){
        getCustomers(req,res);
    }else if(req.url === '/api/create-account'&& req.method === 'POST'){
        createAccount(req,res)
    }else if(req.url === '/api/money-transfer' && req.method === 'PUT'){
        moneyTransfer(req,res)
    }else if(req.url.match(/\/api\/balance\/\w+/) && req.method === 'GET'){
        let accountNo = req.url.split('/')[3]
        balance(req,res,accountNo)
    }else if(req.url.match(/\/api\/history\/\w+/) && req.method === 'GET'){
        let accountNo = req.url.split('/')[3]
        history(req,res,accountNo)
    }
});

const PORT = process.env.port || 8000;

server.listen(PORT, function(){
    console.log('server listining in port '+PORT)
})