'use strict'

var fs = require('fs');

module.exports = {
    data : function(req, res, next) {
        var resource = req.path;
        resource = __dirname + resource + '.json';
        console.log("Path: ", req.path);
        fs.readFile(resource, 'utf-8', function(err, contents) {
            if (err) {
                console.log(err.stack);
                return res.status(404).send("Error while getting resource");
            }
            return res.status(200).send(contents);
        });
    },
    user : function(req, res, next) {
        var resource = req.path;
        resource = __dirname + resource + '.json';
        console.log("Path: ", req.path);
        fs.readFile(resource, 'utf-8', function(err, contents) {
            if (err) {
                console.log(err.stack);
                return res.status(404).send("Error while getting resource");
            }
            return res.status(200).send(contents);
        });
    },
    util : function(req, res, next) {
        var resource = req.path;
        resource = __dirname + resource + '.json';
        console.log("Path: ", req.path);
        fs.readFile(resource, 'utf-8', function(err, contents) {
            if (err) {
                console.log(err.stack);
                return res.status(404).send("Error while getting resource");
            }
            return res.status(200).send(contents);
        });
    },
    moves : function(req, res, next) {
        var resource = req.path;
        resource = __dirname + resource + '.json';
        console.log("Path: ", req.path);
        fs.readFile(resource, 'utf-8', function(err, contents) {
            if (err) {
                console.log(err.stack);
                return res.status(404).send("Error while getting resource");
            }
            return res.status(200).send(contents);
        });
    },
    games : function(req, res, next) {
        var resource = req.path;
        resource = __dirname + resource + '.json';
        console.log("Path: ", req.path);
        fs.readFile(resource, 'utf-8', function(err, contents) {
            if (err) {
                console.log(err.stack);
                return res.status(404).send("Error while getting resource");
            }
            return res.status(200).send(contents);
        });
    },
    game : function(req, res, next) {
        var resource = req.path;
        resource = __dirname + resource + '.json';
        console.log("Path: ", req.path);
        fs.readFile(resource, 'utf-8', function(err, contents) {
            if (err) {
                console.log(err.stack);
                return res.status(404).send("Error while getting resource");
            }
            return res.status(200).send(contents);
        });
    },
    view : function(req, res, next) {
        var resource = req.path;
        resource = __dirname + resource;
        console.log("Path: ", req.path);
        fs.readFile(resource, 'utf-8', function(err, contents) {
            if (err) {
                console.log(err.stack);
                return res.status(404).send("Error while getting resource");
            }
            return res.status(200).send(contents);
        });
    }
};
