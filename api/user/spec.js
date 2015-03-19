var mocks = require('./../../common/mocks.js');
var model = require('./user.model.js');
var _ = require('lodash');

describe("User facade tests", function() {

	describe ("Register new user", function () {

    	it("registers new user", function() {
    		var putUser = mocks.User("user", "pass");
    		model.addUser(putUser.username, putUser.pass);
    		var getUser = model.getUser(putUser.username);
    		expect(getUser.username).toBe(putUser.username);
    		expect(getUser.pass).toBe(putUser.pass);
    		expect(_.isEqual(putUser, getUser)).toBe(true);
  		});
  		
	});
 
});