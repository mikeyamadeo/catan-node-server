var mocks = require('./../../common/mocks.js');
var model = require('./user.model.js');
var _ = require('lodash');

var testUser = mocks.User("user1", "pass");

describe("User facade tests", function() {

    	it("adds a new user and gets it by username", function() {
        //expect(testUser.username).toBe("shdh");
    		model.addUser(testUser.username, testUser.pass, function (err) {
          console.log("err");
          expect(err).toBe(null);
        });

    		model.getUserByUsername(testUser.username, function (err, getUser) {
          expect(err).toBe(null);
          expect(getUser.username).toBe(testUser.username);
          expect(getUser.pass).toBe(testUser.pass);
          expect(_.isEqual(testUser, getUser)).toBe(true);
        });

        model.getUserByUsername("blah", function (err, getUser) {
          expect(err).not.toBe(null);
          expect(getUser).toBe(null);
        });
    		
  		});

      it("gets the user by id", function() {

        var getUser;

        model.getUserByUsername(testUser.username, function (err, getUser) {
          expect(err).toBe(null);
          expect(getUser).not.toBe(null);

          model.getUserById(getUser.id, function (err, user) {
            expect(err).toBe(null);
            expect(user).not.toBe(null);
            expect(_.isEqual(user, getUser)).toBe(true);
            expect(user.id).toEqual(666);//getUser.id);
          });

        });
        
      });

      it("validates user", function() {

        model.validateUser(testUser.username, "", function (err, result) {
          expect(err).toBe(null);
          expect(result).toBe(false);
        });

        model.validateUser("blah", "", function (err, result) {
          expect(err).not.toBe(null);
          expect(result).toBe(false);
        });

        model.validateUser(testUser.username, testUser.pass, function (err, result) {
          expect(err).toBe(null);
          expect(result).toBe(true);
        });
        
      });
  		
 
});