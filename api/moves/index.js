'use strict';

var express = require('express');

var ctrl = require('./moves.controller');

var router = express.Router();

router.post('/sendChat',        ctrl.sendChat);
router.post('/rollNumber',      ctrl.rollNumber);
router.post('/robPlayer',       ctrl.robPlayer);
router.post('/finishTurn',      ctrl.finishTurn);
router.post('/buyDevCard',      ctrl.buyDevCard);
router.post('/Year_of_Plenty',  ctrl.yearOfPlenty);
router.post('/Road_Building',   ctrl.roadBuilding);
router.post('/Soldier',         ctrl.Soldier);
router.post('/Monopoly',        ctrl.Monopoly);
router.post('/Monument',        ctrl.Monument);
router.post('/buildRoad',       ctrl.buildRoad);
router.post('/buildSettlement', ctrl.buildSettlement);
router.post('/buildCity',       ctrl.buildCity);
router.post('/offerTrade',      ctrl.offerTrade);
router.post('/acceptTrade',     ctrl.acceptTrade);
router.post('/maritimeTrade',   ctrl.maritimeTrade);
router.post('/discardCards',    ctrl.discardCards);


module.exports = router;
