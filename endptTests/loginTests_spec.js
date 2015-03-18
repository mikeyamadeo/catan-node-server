var frisby = require('frisby');
frisby.create('Login as Pete')
  .post('http://localhost:8081/user/login', {
  "username": "Pete",
  "password": "pete"
})
 .expectStatus(200)
.toss();