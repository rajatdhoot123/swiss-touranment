var rt = require('../server/controller/tournament')

describe("Library Function Test", function() {
it("Returns Total Players", function(cb){
    rt.getCurrentPlayers(1,19,function(error,result){
      expect(result.length).toBeGreaterThan(-1);
      expect(error).toBe(null);
      cb();
    })
  })
})
