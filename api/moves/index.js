'use strict';

var express = require('express');
var movesVerifier = require('./moves.verification.js');

var ctrl = require('./moves.controller');

var router = express.Router();

//Turn Methods
//router.use('/rollNumber', movesVerifier.validatePlayersTurn);
router.post('/rollNumber',      ctrl.rollNumber);
//router.use('/robPlayer', movesVerifier.validatePlayersTurn);
router.post('/robPlayer',       ctrl.robPlayer);
//router.use('/finishTurn', movesVerifier.validatePlayersTurn);
router.post('/finishTurn',      ctrl.finishTurn);
//router.use('/buyDevCard', movesVerifier.validatePlayersTurn);
router.post('/buyDevCard',      ctrl.buyDevCard);
//router.use('/Year_of_Plenty', movesVerifier.validatePlayersTurn);
router.post('/Year_of_Plenty',  ctrl.yearOfPlenty);
//router.use('/Road_Building', movesVerifier.validatePlayersTurn);
router.post('/Road_Building',   ctrl.roadBuilding);
//router.use('/Soldier', movesVerifier.validatePlayersTurn);
router.post('/Soldier',         ctrl.Soldier);
//router.use('/Monopoly', movesVerifier.validatePlayersTurn);
router.post('/Monopoly',        ctrl.Monopoly);
//router.use('/Monument', movesVerifier.validatePlayersTurn);
router.post('/Monument',        ctrl.Monument);
//router.use('/buildRoad', movesVerifier.validatePlayersTurn);
router.post('/buildRoad',       ctrl.buildRoad);
//router.use('/buildSettlement', movesVerifier.validatePlayersTurn);
router.post('/buildSettlement', ctrl.buildSettlement);
//router.use('/buildCity', movesVerifier.validatePlayersTurn);
router.post('/buildCity',       ctrl.buildCity);
//router.use('/offerTrade', movesVerifier.validatePlayersTurn);
router.post('/offerTrade',      ctrl.offerTrade);
//router.use('/maritimeTrade', movesVerifier.validatePlayersTurn);
router.post('/maritimeTrade',   ctrl.maritimeTrade);

//Non-turn Methods
router.post('/discardCards',    ctrl.discardCards);
router.post('/acceptTrade',     ctrl.acceptTrade);
router.post('/sendChat',         ctrl.sendChat);

module.exports = router;
