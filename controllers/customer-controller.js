const Customer = require('../models/customer-model');
const {reqBodyParsing, typeCheck} = require('../utils/utils');

//@desc Get All Customers
//@route GET /api/customers
async function getCustomers(req,res) {
    try{
       const customers = await Customer.findAll();
       res.writeHead(200,{'Content-Type': 'application/json'});
      return  res.end(JSON.stringify({"customers": customers}));
    }catch(error){
        console.log(error)
    }
}

//@desc Create New Account 
//@route POST /api/create-account
async function createAccount(req,res){
    try{
        const data = await reqBodyParsing(req);
        const { customerId, deposit, accountNumber } = JSON.parse(data);

        if(!customerId || !deposit){
            res.writeHead(400,{'Content-Type': 'application/json'});
            res.end(JSON.stringify({'message': 'Customer-Id field and Deposit Amount Required'}));
            return
        }

        if(!typeCheck(deposit,'number')){
            res.writeHead(400,{'Content-Type': 'application/json'});
            res.end(JSON.stringify({'message': 'Bad request deposit  should be number'}));
            return
        }

        let customer = await Customer.findById(customerId);
        let account = await Customer.findByAccountNo(accountNumber);

        if(!customer){
            res.writeHead(400,{'Content-Type': 'application/json'});
            res.end(JSON.stringify({'message': 'Customer not exists'}));
            return
        }
        if(account){
            res.writeHead(400,{'Content-Type': 'application/json'});
            res.end(JSON.stringify({'message': 'Account number taken!'}));
            return
        }
        const newAccount =  await Customer.createAccount(JSON.parse(data));
        res.writeHead(201, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify(newAccount));
    }catch(error){
        console.log(error);
        res.writeHead(400,{'Content-Type': 'application/json'});
       return res.end(JSON.stringify({'message': 'Bad request'}));
    }
}

//@desc api for customer money transfer
//@route POST /api/money-transfer
async function moneyTransfer(req,res){
    try{
        const data = await reqBodyParsing(req);
        const {deposit, accountNumber } = JSON.parse(data);

        if(!typeCheck(deposit,'number')){
            res.writeHead(400,{'Content-Type': 'application/json'});
            res.end(JSON.stringify({'message': 'Bad request deposit should be number'}));
            return
        }
        let account = await Customer.findByAccountNo(accountNumber);
        if(!account){
            res.writeHead(400,{'Content-Type': 'application/json'});
            return res.end(JSON.stringify({'message': 'Account number not exist'}));
        }
        const accountData = {
            "customerId": account.customerId,
            "bankName": account.bankName || '',
            "deposit": account.deposit + deposit,
            "accountNumber": accountNumber
        }

        const updatedData = await Customer.newDeposit(accountNumber, accountData);

        res.writeHead(200, {'Content-Type':'application/json'});
        return res.end(JSON.stringify('New deposit sucessfully completed!'));
    }catch(error){
        console.log(error);
        res.writeHead(400,{'Content-Type': 'application/json'});
        res.end(JSON.stringify({'message': 'Bad request'}));
    }
}

async function balance(req,res,accountNo){
    try{
        let account = await Customer.findByAccountNo(accountNo);
        console.log('account', account)
        if(!account){
            res.writeHead(400,{'Content-Type': 'application/json'});
           return res.end(JSON.stringify({'message': 'Given account not exist'}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({"Account Balance": account.deposit}));
    }catch(err){
        console.log(err);
        res.writeHead(500,{'Content-Type': 'application/json'});
        return res.end(JSON.stringify({'message': 'Bad request'}));
    }
}

async function history(req,res,accountNo){
    try{
        let account = await Customer.getHistory(accountNo);
        if(!account){
            res.writeHead(400,{'Content-Type': 'application/json'});
           return res.end(JSON.stringify({'message': 'Given account not exist'}));
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify(account));
    }catch(err){
        console.log(err);
        res.writeHead(500,{'Content-Type': 'application/json'});
        return res.end(JSON.stringify({'message': 'Bad request'}));
    }
}

module.exports = {
    getCustomers,
    createAccount,
    moneyTransfer,
    balance,
    history
}