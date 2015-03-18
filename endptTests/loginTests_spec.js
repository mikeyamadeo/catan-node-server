var frisby = require('frisby');
//temporary trial test
frisby.create('Login as Pete')
  .post('http://localhost:8081/user/login', {
  "username": "Pete",
  "password": "pete"
})
 .expectStatus(200)
.toss();
