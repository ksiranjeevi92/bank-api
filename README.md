# Bank APIs

## Important scripts
### npm run dev -> to start development server
### npm run start to start the production server
### development server will listen on port 8000

## 1. /api/create-account -> to create new bank account
## method POST
### request body 
### {
    "customerId": 1,
    "bankName": "ABC",
    "deposit": 10,
    "accountNumber": "ABC-125"
}

## 2./api/money-transfer -> make new deposit
## method PUT
### request body 
### {
    "deposit": 2000,
    "accountNumber": "ABC-125"
}

## 3./api/balance/<account number> -> to check current balance
## method GET
### request body 
### required account number as url params

## 4./api/history/<account number> -> to check selected account transactions history
## method GET
### request body 
### required account number as url params