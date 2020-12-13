const { v4: uuidv4 } = require('uuid');
const {writeDataToFile} = require('../utils/utils');
const CustomersData = require('../data/customers.json');
const BankAccounts = require('../data/bankaccounts.json');
const accountTransactions = require('../data/trans-history.json');

function findAll(){
    return new Promise((resolve,reject) => {
        resolve(CustomersData)
    })
}

function findById(id) {
    return new Promise((resolve, reject) => {
        const customer = CustomersData.find((c) => c.id === id)
        resolve(customer)
    })
}

function findByAccountNo(accountNo){
    return new Promise((resolve, reject) => {
        const customerAccount = BankAccounts.find((c) => c.accountNumber == accountNo)
        resolve(customerAccount)
    })
}

function createAccount(data){
    return new Promise((resolve, reject) => {
        const newAccount = {id: uuidv4(), ...data}
        const transaction = {id: uuidv4(), accountNumber: data.accountNumber, transactions: [{deposit: data.deposit, timestamp: new Date()}]}
        BankAccounts.push(newAccount);
        accountTransactions.push(transaction);
        if (process.env.NODE_ENV !== 'test') {
            writeDataToFile('data/bankaccounts.json', BankAccounts);
            writeDataToFile('data/trans-history.json', accountTransactions);
        }
        resolve(newAccount);
    })
}

function newDeposit(accountNo, data) {
    return new Promise((resolve, reject) => {
        const index = BankAccounts.findIndex((p) => p.accountNumber === accountNo);
        const accTansIdx = accountTransactions.findIndex(elm => elm.accountNumber === accountNo);
        const transactions =  accountTransactions[accTansIdx].transactions;
        transactions.push({deposit: data.deposit, timestamp: new Date()})
        accountTransactions[accTansIdx] = {
            accountNo, transactions
        }
        BankAccounts[index] = {accountNo, ...data}
        if (process.env.NODE_ENV !== 'test') {
            writeDataToFile('data/bankaccounts.json', BankAccounts);
            writeDataToFile('data/trans-history.json', accountTransactions);
        }
        resolve( BankAccounts[index])
    })
}

function getHistory(accountNo){
    return new Promise((resolve, reject) => {
        const customerAccount = accountTransactions.find((c) => c.accountNo == accountNo)
        resolve(customerAccount)
    })
}

module.exports = {
    findAll,
    findById,
    findByAccountNo,
    createAccount,
    newDeposit,
    getHistory
}