'use strict';


var _ = require('lodash');
var gameHelpers = require('../game/game.helpers');
var model = require('./moves.model');
var gameModel = require('../game/game.model');
var helper = require('./moves.controller.helper');
var async = require('async');

/**
 * Example of getting access to required models:
 *
 * var Model = require('../model');
 * var MovesModel = require('./moves.model');
 */
var MovesModel = require('./moves.model');
var GameModel = require('../game/game.model');

var MovesController = {
  /** CREATE **/

  /**
   * @desc store a chat message & return a response
   * @method sendChat
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  sendChat: function(req, res, next) {
    console.log("Are we here -- controller");
    var data = req.body;
    var gameId = 0;
    var playerId = data.playerIndex;
    var message = data.content;
    MovesModel.addChat(gameId, playerId, message, function(err, game) {
        if (err) {
            console.log(err); 
            next(); 
        }
        console.log(game);
        res.json(game.game);
    });
    
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
        - add chat object to the chat object array
    */

    console.log(req.body);
  },
  /**
   * @desc get rolled number and based on the 
   * number, change the game state and distribute
   * resources to players and return a response
   * @method rollNumer
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  rollNumber: function(req, res, next) {
    var gameId = req.game;

    GameModel.getModel(gameId, function(err, model) {
      var players = model.game.players;
      var map = model.game.map;
      var bank = model.game.bank;
      var numberRolled = req.body.number;


      if (numberRolled == 7) {
        MovesModel.rollNumber(gameId, "Discarding", players, function(err, game) {
          return res.status(200).json(game.game);
        });
      }
      else {

        //hexes that have the chit number that was rolled
        var hotHexes = map.hexes.filter(function(hex, i) {
          return hex.number == numberRolled;
        });
        //use cities to determine if player has property on hothexes
        //add to resources if so.
        GameModel.getCities(req.game, function(err, cities) {
          //for each hex that the has the number chit rolled

          hotHexes.forEach(function(hex) {
            // cities = cities.length !== 0 ? cities : [{ owner: 0, location:{ y: -1,x: -1} }];
            cities.forEach(function(city) {
              if (gameHelpers.locationIsEqual(hex.location, city.location)) {
                var player = gameHelpers.getPlayerFromPlayers(players, city.id);
                var resources = player.resources;
                var amount = 0;

                //only add resources if they are available
                if (gameHelpers.resourceIsAvailable(bank, hex.resource, 2)) {
                  amount = 2;
                } else {
                  amount = bank[hex.resource];
                }
                gameHelpers.addToPlayersResources(hex.resource, amount, resources);
              }
            });

          });

          //do it all over again with settlements
          GameModel.getSettlements(req.game, function(err, settlements) {

            hotHexes.forEach(function(hex) {
              settlements = settlements.length !== 0 ? settlements : [{ owner: 0, location:{ y: -1,x: -1} }];
              settlements.forEach(function(settlement) {
                if (gameHelpers.locationIsEqual(hex.location, settlement.location)) {
                  var player = gameHelpers.getPlayerFromPlayers(players, settlement.id);
                  var resources = player.resources;
                  var amount = 0;

                  //only add resources if they are available
                  if (gameHelpers.resourceIsAvailable(bank, hex.resource, 1)) {
                    amount = 1;
                  }
                  gameHelpers.addToPlayersResources(hex.resource, amount, resources);
                }
              });
            });

            MovesModel.rollNumber(gameId, "Playing", players, function(err, game) {
                return res.status(200).json(game.game);
              });
          });//end of get settlements
        });
      }

    });
    
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
          check that the player index matches the current player index
          verify that the number is valid
          if (number is not 7)
            create array of users/ resources
            find resource hexes with same number
            find settlements that border those hexes
              for each settlement
                add one to the user/resource total in the array
            find cities that border those hexes
              for each city
                add two to the user/resource total stored in the array
            for each resource, get total and verify that there are enough resources in bank
              if available
                give cards to players
            change game state to 'playing'
          else
            change state to 'discarding'
    */
  },
  /**
   * @desc gets a rob player request and updates
   * player resources based on the request and returns
   * a response
   * @method robPlayer
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  robPlayer: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
        check that player index matches the current player
        check that location is not the current robber location
        if victim index is valid and is not the current player
          get victim player's resource card hand
          while (card is not stolen)
            get random resource
              if resource total is greater than zero
                set card stolen flag to true
                subtract one resource from victim
                add one resource to current player
              else
                mark resource as being checked
        change state to 'playing'
    */
    var gameId = req.game;
    var playerId = req.body.playerIndex;
    var victimId = req.body.victimIndex;
    var location = req.body.location;
    GameModel.getModel(gameId, function(err, model) {
      var players = model.game.players;
      MovesModel.getRobber(gameId, function(err, robber) {
        
        if (gameHelpers.locationIsEqual(location, robber)) {
          return res.status(403).json("robber is already in that location young homie");
        } else {
          var resourceTypes = ["wood", "wheat", "sheep", "ore", "brick"];
          var victim = gameHelpers.getPlayerFromPlayers(players, victimId);
          var vResources = victim.resources;

          var victimHasResources = resourceTypes.every(function(type) {
            return vResources[type] > 0;
          });

          if (victimHasResources) {
            var allResources = [];

            //create an array weighted by number of each type
            resourceTypes.forEach(function(type) {
              allResources = allResources.concat(gameHelpers.fillArrayWithValue(vResources[type], type))
            });

            var random = Math.floor(Math.random() * allResources.length);

            MovesModel.robPlayer(gameId, location, playerId, victimId, allResources[random], "playing", function(err, result) {
              if (err) {
                return res.status(400).send(err.message);
              } else if (!result) {
                  return res.status(500).send("Server Error");
              } else {
                  return res.status(200).json(result.game);
              }
            });

          } else {
            return res.status(400).json("this young homie is poor. no resources to rob. soz");
          }

        }

      })
    });
  },



  /**
   * @desc recieves a finish turn request and updates
   * the turn tracker accordingly
   * @method finishTurn
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  finishTurn: function(req, res, next) {
    console.log("I'm in finishTurn",req.game);
    MovesModel.finishTurn(req.game, req.body.playerIndex, function(err, game) {
        if (err) {
            console.log(err); 
            return next(); 
        }
        res.json(game.game);
    });

    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
        check that player index is current player index
        if game state is playing
          increment current player index (mod 4)
          set game state to rolling
        else if game state is first turn
          increment current player index
          if current player index is 4
            decrement current player index and change state to second turn
        else if game state is second turn
          decrement current player index
          if current player index is < 0
            set current player index to 0
            change game state to rolling
    */
  },
   /**
   * @desc receives a request to buy a dev card and
   * checks if the requester is the current player, the
   * requester has enough resources, and the dev card
   * deck is not empty
   * @method buyDevCard
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  buyDevCard: function(req, res, next) {
    var gameId = req.game;
    var playerId = req.body.playerIndex;

    GameModel.getGame(gameId, function(err, game) {
      var deck = game.deck;
      var cardTypes = ['yearOfPlenty', 'soldier', 'roadBuilding', 'monument', 'monopoly'];
      var random = 0;

      var cardsInDeck = cardTypes.every(function(type) {
        return deck[type] > 0;
      });

      if (!cardsInDeck) {
        return res.json("no dev cards left to purchase");
      } else {
        //create an array weighted by number of each type
        var allCards = [];
        cardTypes.forEach(function(type) {
          allCards = allCards.concat(gameHelpers.fillArrayWithValue(deck[type], type))
        })

        //get random value based on array length
        var random = Math.floor(Math.random() * allCards.length);
        MovesModel.buyDevCard(gameId, playerId, allCards[random], function(err, result) {
          return res.status(200).json(result.game);
        });
      }


    });

  },
  /**
   * @desc receives a request to play a year of plenty card and
   * checks to see that the requester is the current player, 
   * the requester has a year of plenty card, that card was not 
   * bought that same turn, and the user hasn't used another
   * dev card that turn and returns a response
   * @method yearOfPlenty
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  yearOfPlenty: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
        check to make sure player index is the same as current player index
        check to make player owns card
        check to make sure card was not bought that turn and has not already been played
        check to make sure both resources are available from the bank
        if true for all of the above
          decrement resources from bank and add to player
    */
    var body = req.body;
    var gameId = req.game;
    var index = body.playerIndex;
    var first = body.resource1;
    var second = body.resource2;
    async.series([
        function(callback) {
            model.getPlayedDevCard(gameId, index, function(err, playedDevCard) {
                if (err) {
                    return callback(err);
                } else if (playedDevCard) {
                    return callback(new Error("You have already played a dev card"));
                }
                return callback(null)
            });
        },
        function(callback) {
            model.getBank(gameId, function(err, bank) {
                if (err) {
                    return callback(err);
                } else if (!bank) {
                    return callback(new Error("Bank does not exist"));
                }
                console.log("first: ", first, "second: ", second);
                if ((first === second && bank[first] > 1) || 
                    (bank[first] > 0 && bank[second] > 0)) {
                    return callback(null);
                } else {
                    return callback(new Error("Not enough resources in bank"));
                }
            });
        },
        function(callback) {
            model.getDevCards(gameId, index, 'oldDevCards', function(err, devCards) {
                if (err) {
                    return callback(err);
                } else if (!devCards) {
                    return callback(new Error("Dev Cards do not exist"));
                }
                if (devCards.yearOfPlenty > 0) {
                    return callback(null);
                } else {
                    return callback(new Error("No year of plenty dev card"));
                }
            });
        },
        function(callback) {
            model.yearOfPlenty(gameId, index, first, second, function(err, game) {
                if (err) {
                    return callback(err);
                } else if (!game) {
                    return callback(new Error("Game does not exist"));
                }
                return callback(null, game);
            });
        }
    ], function(err, result) {
        if (err) {
            return res.status(400).send(err.message);
        }
        return res.status(200).json(result.pop().game);
    });
  },
  /**
   * @desc receives a request to play a road building card and 
   * verifies that the actiono is valid and sends a response
   * @method roadBuilding
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  roadBuilding: function(req, res, next) {
      var body = req.body;
      var index = body.playerIndex;
      var first = body.spot1;
      var second = body.spot2;
      var gameId = req.game;
      async.waterfall([
          function(callback) {
            
              model.getDevCards(gameId, index, 'oldDevCards', function(err, cardList) {
                  if (err) {
                      return callback(err);
                  }
                  if (!cardList) {
                      return callback(new Error("Dev cards do not exist"));
                  } else if (cardList.roadBuilding > 0) {
                      return callback(null);
                  } else {
                      return callback(new Error("Insufficient cards"));
                  }
              });
          },
          function(callback) {
              model.getPlayedDevCard(gameId, index, function(err, played) {
                  if (err) {
                      return callback(err);
                  }
                  if (played) {
                      return callback(new Error("You have already played a dev card " + 
                          "this turn"));
                  } else {
                      return callback(null);
                  }
              });
          },
          function(callback) {
              helper.verifyRoadsAvailable(req.game, req.body.playerIndex, 2, function (err, roadsAvail) {
                if (err) {
                      return callback(err); 
                } else if (!roadsAvail) {
                    return callback(new Error("Player doesn't have any roads left"));
                }
                return callback(null);
            });
          },
          function(callback) {
              helper.verifyRoadLocation(req.game, req.body.playerIndex, first, second, function (err, locationVerified) {
                if (err) {
                      return callback(err); 
                } else if (!locationVerified) {
                    return callback(new Error("This road location is not acceptable"));
                }
                return callback(null);
            });
          },
          function(callback) {
              model.roadBuilding(gameId, index, first, second,
                  function(err, game) { 
                    if (err) {
                        return callback(err);
                    }
                    if (!game) {
                        return callback(new Error("Game does not exist"));
                    } else {
                        return callback(null, game);
                    }
              });
          }],
          function(err, result) {
              if (err) {
                  return res.status(400).send(err.message);
              } else if (!result) {
                  return res.status(500).send("Server Error");
              } else {
                  return res.status(200).json(result.game);
              }
          });
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
        check to make sure player index is current player
        check to make sure that the card was not bought that turn, and hasn't already been played
        check to make sure player has two roads
        check to make sure that both spots are available
        (spot 1 must be connected to one of the player's other roads, and spot two must be in an available spot after spot one has been placed)
        if all of the above is true
          add roads to map
          remove roads from player
          mark card as used
          run longest road algorithm
    */
  },
  /**
   * @desc gets a request to play a soldier card, validates
   * the request and sends a response after performing the action
   * @method Soldier
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  Soldier: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
        check to make sure player index is current player
        check to make sure that the card was not bought that turn, and hasn't already been played
        check to make sure victim is not current player
        check to make sure location is not robber's current location
        if all of the above is true
          see rob player function
          increment player soldier count
    */
    var body = req.body;
    var index = body.playerIndex;
    var victim = body.victimIndex;
    var location = body.location;
    var gameId = req.game;
    async.waterfall([
        function(callback) {
            model.getDevCards(gameId, index, 'oldDevCards', function(err, cardList) {
                if (err) {
                    return callback(err);
                }
                if (!cardList) {
                    return callback(new Error("Dev cards do not exist"));
                } else if (cardList.soldier > 0) {
                    return callback(null);
                } else {
                    return callback(new Error("Insufficient soldier cards"));
                }
            });
        },
        function(callback) {
            model.getPlayedDevCard(gameId, index, function(err, played) {
                if (err) {
                    return callback(err);
                }
                if (played) {
                    return callback(new Error("You have already played a dev card " + 
                        "this turn"));
                } else {
                    return callback(null);
                }
            });
        },
        function(callback) {
            if (index == victim) {
                return callback(new Error("You are not allowed to rob yourself"));
            } else {
                return callback(null);
            }
        },
        function(callback) {
            model.getRobber(gameId, function(err, robber) {
                if (err) {
                    return callback(err);
                }
                if (!robber) {
                    return callback(new Error("Robber does not exist"));
                } else if (robber.x === location.x && robber.y === location.y) {
                    return callback(new Error("The robber must be placed at a new " +
                        "location"));
                } else {
                    return callback(null);
                }
            });
        },
        function(callback) {
            model.getResources(gameId, victim, function(err, resources) {
                if (err) {
                    return callback(err);
                } else if (!resources) {
                    return callback(new Error("Resources do not exist"));
                } else {
                    if (resources.brick > 0) {
                        return callback(null, 'brick');
                    } else if (resources.ore > 0) {
                        return callback(null, 'ore');
                    } else if (resources.sheep > 0) {
                        return callback(null, 'sheep');
                    } else if (resources.wheat > 0) {
                        return callback(null, 'wheat');
                    } else if (resources.wood > 0) {
                        return callback(null, 'wood');
                    } else {
                        return callback(new Error("Victim does not have any " + 
                            "resources"));
                    }
                }
            });
        },
        function(resource, callback) {
            console.log(gameId);
            model.soldier(gameId, location, index, victim, resource, 'Playing',
                function(err, game) { 
                if (err) {
                    return callback(err);
                }
                if (!game) {
                    return callback(new Error("Game does not exist"));
                } else {
                    return callback(null, game);
                }
            });
        }],
        function(err, result) {
            if (err) {
                return res.status(400).send(err.message);
            } else if (!result) {
                return res.status(500).send("Server Error");
            } else {
                return res.status(200).json(result.game);
            }
        });
  },
  /**
   * @desc gets a request to play a monopoly card, validates
   * the request and sends a response after performing the action
   * @method Monopoly
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  Monopoly: function(req, res, next) {

    var gameId = req.game;
    var resourceType = req.body.resource;
    var playerId = req.body.playerIndex;

    GameModel.getModel(gameId, function(err, model) {
      var players = model.game.players;
      var player = gameHelpers.getPlayerFromPlayers(players, playerId);
      var amount = 0;

      if (player.oldDevCards[resourceType] > 0 && !player.playedDevCard) {
        
        //loop through players and reduce resources of resource type to zero
        players.forEach(function(user) {
          if (user.id !== playerId) {
            amount += user.resources[resourceTpe];
            user.resources[resourceType] = 0;
          }
        });
         
        //increment current player's resource
        player.resources[resourceType] += amount;

        MovesModel.monopoly(gameId, playerId, players, function(err, result) {
          if (err) {
            return res.status(400).send(err.message);
          } else if (!result) {
            return res.status(500).send("Server Error");
          } else {
            return res.status(200).json(result.game);
          }
        });

      } else {
        return res.status(400).json("player either needs to wait a turn or already has playerd a dev card");
      }

    });

  },
  /**
   * @desc gets a request to play a monument card, validates
   * the request and sends a response after performing the action
   * @method Monument
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  Monument: function(req, res, next) {
    MovesModel.monument(req.game, req.body.playerIndex, function(err, result) {
      if (err) {
        return res.status(400).send(err.message);
      } else if (!result) {
        return res.status(500).send("Server Error");
      } else {
        return res.status(200).json(result.game);
      }
    });
  },
  /**
   * @desc gets a request to build a road, validates
   * the request and sends a response after performing the action
   * @method buildRoad
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  buildRoad: function(req, res, next) {

    console.log("Building a road",req.game);
    req.body.roadLocation = helper.normalizeEdge(req.body.roadLocation);

    async.series([
        function(callback) {
            helper.verifyRoadsAvailable(req.game, req.body.playerIndex, 1, function (err, roadsAvail) {
                if (err) {
                      return callback(err); 
                } else if (!roadsAvail) {
                    return callback(new Error("Player doesn't have any roads left"));
                }
                return callback(null);
            });
        },
        function(callback) {
            MovesModel.getResources(req.game, req.body.playerIndex, function (err, resources) {
                if (err) {
                      return callback(err); 
                } else if (resources["brick"] < 1 && resources["wood"] < 1 && req.body.free === false) {
                      return callback(new Error("Player doesn't have enough resources"));
                }
                return callback(null);
            });
            
        },
        function(callback) {
            helper.verifyRoadLocation(req.game, req.body.playerIndex, req.body.roadLocation, null, function (err, locationVerified) {
                if (err) {
                      return callback(err); 
                } else if (!locationVerified) {
                    return callback(new Error("This road location is not acceptable"));
                }
                return callback(null);
            });
        },
        function(callback) {
            MovesModel.buildRoad(req.game, req.body.playerIndex, req.body.roadLocation, req.body.free, function(err, game) {
                if (err) {
                      return callback(err); 
                }
                console.log("road built");
                return callback(null, game);
            });
        }
    ], function(err, result) {
        if (err) {
            return res.status(400).send(err.message);
        }
        return res.status(200).json(result.pop().game);
    });
    /*
          run longest road algorithm
    */
  },
  /**
   * @desc gets a request to build a settlement, validates
   * the request and sends a response after performing the action
   * @method buildSettlement
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  buildSettlement: function(req, res, next) {

    console.log("Building a settlement",req.game);

    req.body.vertexLocation = helper.normalizeVertex(req.body.vertexLocation);


    async.series([
      /*
        function(callback) {
            helper.verifyRoadsAvailable(req.game, req.body.playerIndex, function (err, roadsAvail) {
                if (err) {
                      return callback(err); 
                } else if (!roadsAvail) {
                    return callback(new Error("Player doesn't have any roads left"));
                }
                return callback(null);
            });
        },
        function(callback) {
            if (req.body.free === true)
                return callback(null);
            MovesModel.getResources(req.game, req.body.playerIndex, function (err, resources) {
                if (err) {
                      return callback(err); 
                } else if (resources["brick"] < 1 && resources["wood"] < 1) {
                      return callback(new Error("Player doesn't have enough resources"));
                }
                return callback(null);
            });
        },
        function(callback) {
            helper.verifyRoadLocation(req.game, req.body.playerIndex, req.body.roadLocation, null, function (err, locationVerified) {
                if (err) {
                      return callback(err); 
                } else if (!locationVerified) {
                    return callback(new Error("This road location is not acceptable"));
                }
                return callback(null);
            });
        },
        */
        function(callback) {
            MovesModel.buildSettlement(req.game, req.body.playerIndex, req.body.vertexLocation, req.body.free, function(err, game) {
                if (err) {
                      return callback(err); 
                }
                console.log("settlement built");
                return callback(null, game);
            });
        }
    ], function(err, result) {
        if (err) {
            return res.status(400).send(err.message);
        }
        return res.status(200).json(result.pop().game);
    });
    /*
        verify availablity of resources and settlement pieces
        verify settlement location
    */
  },
  /**
   * @desc gets a request to build a city, validates
   * the request and sends a response after performing the action
   * @method buildCity
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  buildCity: function(req, res, next) {
    console.log("Building a city",req.game);

    req.body.vertexLocation = helper.normalizeVertex(req.body.vertexLocation);


    async.series([
      /*
        function(callback) {
            helper.verifyRoadsAvailable(req.game, req.body.playerIndex, function (err, roadsAvail) {
                if (err) {
                      return callback(err); 
                } else if (!roadsAvail) {
                    return callback(new Error("Player doesn't have any roads left"));
                }
                return callback(null);
            });
        },
        function(callback) {
            if (req.body.free === true)
                return callback(null);
            MovesModel.getResources(req.game, req.body.playerIndex, function (err, resources) {
                if (err) {
                      return callback(err); 
                } else if (resources["brick"] < 1 && resources["wood"] < 1) {
                      return callback(new Error("Player doesn't have enough resources"));
                }
                return callback(null);
            });
        },
        function(callback) {
            helper.verifyRoadLocation(req.game, req.body.playerIndex, req.body.roadLocation, null, function (err, locationVerified) {
                if (err) {
                      return callback(err); 
                } else if (!locationVerified) {
                    return callback(new Error("This road location is not acceptable"));
                }
                return callback(null);
            });
        },
        */
        function(callback) {
            MovesModel.buildCity(req.game, req.body.playerIndex, req.body.vertexLocation, function(err, game) {
                if (err) {
                      return callback(err); 
                }
                console.log("city built");
                return callback(null, game);
            });
        }
    ], function(err, result) {
        if (err) {
            return res.status(400).send(err.message);
        }
        return res.status(200).json(result.pop().game);
    });
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
        verify player
        verify availablity of resources and city pieces
        verify city location

    */
  },
  /**
   * @desc gets a request to offer a domestic trade, validates
   * the request and sends a response after performing the action
   * @method offerTrade
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  offerTrade: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
        verify player
        verify receiver is not player
        verify player resources
        if above is valid, set as trade offer

    */
    var body = req.body;
    var gameId = req.game;
    var index = body.playerIndex;
    var offer = body.offer;
    var receiver = body.receiver;
    async.series([
        function(callback) {
            if (index == receiver) {
                return callback(new Error("You cannot trade with yourself"));
            } else {
                return callback(null);
            }
        },
        function(callback) {
          var noResource = true;
            model.getResources(gameId, index, function(err, resource) {
                if (err) {
                    return callback(err);
                } else if (!resource) {
                    return callback(new Error("Resources do not exist"));
                } else if (offer.brick <=0 && offer.ore <=0 && offer.sheep <=0 &&
                    offer.wheat <=0 && offer.wood <=0) {
                    return callback(new Error("No resources allocated to receive"));
                } else {
                    if (offer.brick < 0) {
                      noResource = false;
                      if (!(resource.brick >= Math.abs(offer.brick)))
                        return callback(new Error("You don't have the resources to trade"));
                    }
                    if (offer.ore < 0) {
                      noResource = false;
                      if (!(resource.ore >= Math.abs(offer.ore)))
                        return callback(new Error("You don't have the resources to trade"));
                    } 
                    if (offer.sheep < 0) {
                      noResource = false;
                      if (!(resource.sheep >= Math.abs(offer.sheep)))
                        return callback(new Error("You don't have the resources to trade"));
                    } 
                    if (offer.wheat < 0) {
                      noResource = false;
                      if (!(resource.wheat >= Math.abs(offer.wheat)))
                        return callback(new Error("You don't have the resources to trade"));
                    } 
                    if (offer.wood < 0) {
                      noResource = false;
                      if (!(resource.wood >= Math.abs(offer.wood)))
                        return callback(new Error("You don't have the resources to trade"));
                    }
                    if (noResource) {
                        return callback(new Error("You didn't allocate any resources to send"));
                    }
                    noResource = true;
                    return callback(null);
                }
            });
        },
        function(callback) {
            model.offerTrade(gameId, index, offer, receiver, function(err, game) {
                if (err) {
                    return callback(err);
                } else if (!game) {
                    return callback(new Error("Game does not exist"));
                }
                return callback(null, game);
            });
        }
    ], function(err, result) {
        if (err) {
            return res.status(400).send(err.message);
        }
        return res.status(200).json(result.pop().game);
    });
  },
  /**
   * @desc gets a request to accept a trade, validates
   * the request and sends a response after performing the action
   * @method acceptTrade
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  acceptTrade: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
        verify receiving player
        verify receiving player's cards
        if above is true and willAccept
          transfer cards
          set trade offer to null
    */
    var body = req.body;
    var gameId = req.game;
    var index = body.playerIndex;
    var acceptance = body.willAccept;
    async.waterfall([
        function(callback) {
            model.getTradeOffer(gameId, function(err, offer) {
                if (err) {
                    return callback(err);
                } else if (acceptance == false) {
                    return callback(null, false, offer)
                } else if (!offer) {
                    return callback(new Error("There is no trade offer"));
                } else {
                    return callback(null, acceptance, offer);
                }
            });
        },
        function(acceptance, offer, callback) {
            model.getResources(gameId, offer.receiver, function(err, resource) {
                if (err) {
                    return callback(err);
                } else if (acceptance == false) {     
                    return callback(null, false, offer);
                } else if (!resource) {
                    return callback(new Error("Resources do not exist"));
                } else {
                    _.forOwn(offer.offer, function(value, key) {
                        if (value < 0) {
                            if (Math.abs(value) > resource[key]) {
                                return callback(new Error("You don't have the " + 
                                    "resources to trade"));
                            }
                        }
                    });
                    return callback(null, acceptance, offer);
                }
            });
        },
        function(acceptance, offer, callback) {
            if (!acceptance) {
                return callback(null, null);
            }
            model.getResources(gameId, offer.sender, function(err, resources) {
                if (err) {
                    return callback(err);
                } else if (!resources) {
                    return callback(new Error("Resources do not exist"));
                } else {
                    _.forOwn(offer.offer, function(value, key) {
                        if (value > 0) {
                            if (value > resources[key]) {
                                return callback(new Error("Sender doesn't have " +
                                    "sufficient resources to trade"));
                            }
                        }
                    });
                    var resourceList = [{
                        player : offer.sender,
                        resourceMap : {
                            brick : offer.offer.brick * -1,
                            ore : offer.offer.ore * -1,
                            sheep : offer.offer.sheep * -1,
                            wheat : offer.offer.wheat * -1,
                            wood : offer.offer.wood * -1
                        }
                    },
                    {
                        player : offer.receiver,
                        resourceMap : offer.offer    
                    }];
                    return callback(null, acceptance, resourceList);
                }
            });
        },
        function(acceptance, resourceList, callback) {
            model.acceptTrade(gameId, index, acceptance, resourceList, function(err, game) {
                if (err) {
                    return callback(err);
                } else if (!game) {
                    return callback(new Error("Game does not exist"));
                }
                return callback(null, game);
            });
        }
    ],
    function(err, result) {
            if (err) {
                return res.status(400).send(err.message);
            } else if (!result) {
                return res.status(500).send("Server Error");
            } else {
                return res.status(200).json(result.game);
            }
    });
  },
  /**
   * @desc gets a request to offer a maritime trade, validates
   * the request and sends a response after performing the action
   * @method maritimeTrade
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  maritimeTrade: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
        verify player
        verify player owns port and gets ratio (?)
        verify availablility of output resource
        verify player has enough input resource
        if above is true
          transfer resources
    */

     var body = req.body;
     var gameId = req.game;
     var index = body.playerIndex;
     var input = body.inputResource;
     var output = body.outputResource;
    var ratio = body.ratio;  
    async.waterfall([
       function(callback) {
         model.getOwnedPorts(gameId, index,  function(err, ports) {
            if (err) {
             return callback(err);
            } else if (!ports) {
             return callback(new Error("Ports don't exist"));
            } else {
                var validPort = _.find(function(port) {
                    if ((ratio === 2 && port.resource === output) ||
                        (ratio === 3 && port.resource == undefined) ||
                        (ratio === 4)) {
                        return true;
                    } else {
                        return false;
                    }
                });
                if (validPort || ratio === 4) {
                    return callback(null);
                } else {
                    return callback(new Error("Invalid Trade"));
                }     
            }
         });
       },
        function(callback) {
            model.getResources(gameId, index, function(err, resources) {
                if (err) {
                    return callback(err);
                } else if (!resources) {
                    return callback(new Error("Resources do not exist"));
                } else {
                    if (resources[input] < ratio) {
                        return callback(new Error("Insufficient Resources"));
                    } else {
                        return callback(null);
                    }
                }
            });
        },
        function(callback) {
            model.maritimeTrade(gameId, index, ratio, input, output, 
                function(err, game) {
                if (err) {
                   return callback(err);
                } else if (!game) {
                   return callback(new Error("Game does not exist"));
                }
                return callback(null, game);
            });
        }
     ], function(err, result) {
            if (err) {
                return res.status(400).send(err.message);
            } else if (!result) {
                return res.status(500).send("Server Error");
            } else {
                return res.status(200).json(result);
            }
        });
  },
  /**
   * @desc gets a request to discard cards, validates
   * the request and sends a response after performing the action
   * @method discardCards
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  discardCards: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
        verify player has not already discarded cards this turn
        verify that total number of resources is half of all resource cards owned
        verify that player has resource cards
        if above is true
          move resources to bank
          mark player as having discarded cards

        if all players have discarded cards
          set game state to playing

    */
    var body = req.body;
    var gameId = req.game;
    var index = body.playerIndex;
    var discardedCards = body.discardedCards;
    async.waterfall([
        function(callback) {
            model.getStatus(gameId, function(err, status) {
                if (err) {
                    console.log(err.stack);
                    return callback(err);
                } else if (status === 'Discarding') {
                    return callback(null);
                } else {
                    return callback(new Error("Game is not in discard phase"));
                }
            });
        },
        function(callback) {
            model.getPlayedDevCard(gameId, index, function(err, played) {
                if (err) {
                    console.log(err.stack);
                    return callback(err);
                } else if (played) {
                    return callback(new Error("This player has already discarded"));
                } else {
                    return callback(null);    
                }
            });
        },
        function(callback) {
            model.getResources(gameId, index, function(err, resources) {
                if (err) {
                    console.log(err.stack);
                    return callback(err);
                } else if (!resources) {
                    return callback(new Error("Resources do not exist"));
                } else {
                    var totalDiscard = helper.countResources(discardedCards);
                    var totalHand = helper.countResources(resources);
                    console.log(totalHand, totalDiscard);
                    if (Math.floor(totalHand / 2) === totalDiscard) {
                        return callback(null, resources);
                    } else if (totalHand < 8) {
                        return callback(new Error("This players does not have more " +
                            "than 7 cards"));
                    } else {
                        return callback(new Error("You are not discarding the " + 
                            "correct number of resources"));
                    } 
                }
            });
        },
        function(hand, callback) {
            _.forOwn(discardedCards, function(value, key) {
                if (value > hand[key]) {
                    return callback(new Error("This player has insufficient " +
                        "resources to perform this discard"));
                }
            });
            return callback(null);
        },
        function(callback) {
            model.getPlayers(gameId, function(err, players) {
                if (err) {
                    return callback(err);
                } else if (!players) {
                    return callback(new Error("Players do not exist"));
                } else {
                    var found = players.filter(function(player) {
                        if (player.playerIndex != index && player.playedDevCard == false
                            && helper.countResources(player.resources) > 7) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    if (found && found.length > 0) {
                        console.log(found);
                        return callback(null, 'Discarding');
                    } else {
                        return callback(null, 'Robbing');
                    }
                }
            });
        },
        function(status, callback) {
            var discard = {
                brick : discardedCards.brick * -1,
                ore : discardedCards.ore * -1,
                sheep : discardedCards.sheep * -1,
                wheat : discardedCards.wheat * -1,
                wood : discardedCards.wood * -1
            };
            model.discardCards(gameId, index, discard, status, 
                function(err, game) {
                    if (err) {
                        return callback(err);
                    }
                    if (game) {
                        return callback(null, game);
                    } else {
                        return callback(new Error("Game does not exist"));
                    }
            });
        }],
        function(err, result) {
            if (err) {
                res.status(400).send(err.message);
            } else {
                res.status(200).json(result.game);
            }
        });
  },

};

module.exports = MovesController;
