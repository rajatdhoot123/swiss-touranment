var st = require('../app/routes');
var request = require("request");
var str = require('../server')

var base_url = "http://localhost:3000/"

describe("Library Function Test", function() {

  it("returns status code 200", function(done) {
    request.get(base_url, function(error, response) {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});
