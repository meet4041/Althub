const express = require('express');
const financialaid_route = express();
const bodyParser = require("body-parser");

financialaid_route.use(bodyParser.json());
financialaid_route.use(bodyParser.urlencoded({ extended: true }));
financialaid_route.use(express.static('public'));

const financialaid_controller = require("../controllers/financialaidController");

financialaid_route.post('/addFinancialAid', financialaid_controller.AddFinancialAid);
financialaid_route.get('/getFinancialAid', financialaid_controller.getFinancialAid);
financialaid_route.get('/getFinancialAidByInstitute/:institutename', financialaid_controller.getFinancialAidByInstitute);
financialaid_route.delete('/deleteFinancialAid/:id', financialaid_controller.deleteFinancialAid);
financialaid_route.post('/editFinancialAid', financialaid_controller.editFinancialAid);

module.exports = financialaid_route;