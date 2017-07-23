var st = require('../server');


var base_url = "http://localhost:3000/"

describe("Check Login Page", function() {
  describe("GET /", function(){

   it("returns status code 200", function() {
    st.get(base_url, function(error, res, body) {
      expect(res.statusCode).toBe(200);

      done();

    });
   });

   it("returns Hello World", function(done) {
    st.get(base_url, function(error, res, body) {
      expect(body).toBe("Hello World");
      done();
    });
  });
 })
})

/*var base_url = "http://localhost:3000/"
describe("Hello World Server", function() {
  describe("GET /", function() {
    it("returns status code 200", function() {
      st.get(base_url, function(req, res) {
        res.status(200);
        expect(res.status).toBe(200);
      });
    });
  });
});*/
/*describe("A suite is just a function", function() {
  var a

  it("and so is a spec", function() {
    a = 7;
    a = a + 5
    expect(a).toBe(12);
  });
});
*/
/*describe("userTournament", function() {

  beforeEach(function() {
    tape = jasmine.createSpyObj('tape', ['play', 'pause', 'stop', 'rewind']);

    tape.play();
    tape.pause();
    tape.rewind(0);
  });

  it("creates spies for each requested function", function() {
    expect(tape.play).toBeDefined();
    expect(tape.pause).toBeDefined();
    expect(tape.stop).toBeDefined();
    expect(tape.rewind).toBeDefined();
  });

  it("tracks that the spies were called", function() {
    expect(tape.play).toHaveBeenCalled();
    expect(tape.pause).toHaveBeenCalled();
    expect(tape.rewind).toHaveBeenCalled();
    expect(tape.stop).not.toHaveBeenCalled();
  });

  it("tracks all the arguments of its calls", function() {
    expect(tape.rewind).toHaveBeenCalledWith(0);
  });
});*/
