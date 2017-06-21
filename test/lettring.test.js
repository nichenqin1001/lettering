var expect = chai.expect;
var should = chai.should();

var test = document.getElementById('test');
var input = document.getElementById('input');

var lettering = new Lettering('#test');
console.log(lettering);
var letteringInput = new Lettering('#test-input');
console.log(letteringInput);

describe('Lettering Library', () => {

  it('should create an instance of Lettering', () => {
    should.exist(lettering);
  });

  describe('Event Emitter', () => {

    describe('addListener()', () => {

      var testTxt;

      beforeEach(() => {
        testTxt = '';
      });

      it('should do something after type end', (done) => {
        lettering.addListener('afterTyping', () => {
          testTxt = 'afterTyping';
          done();
          expect(testTxt).to.be.equal('afterTyping');
        });
      }).timeout(5000);

      it('should do something after backspace', (done) => {
        lettering.backspace();
        lettering.addListener('afterBackspace', () => {
          testTxt = 'afterBackspace';
          done();
          expect(testTxt).to.be.equal('afterBackspace');
        });
      }).timeout(5000);

    });


  });

  describe('chack input', () => {

  })


});
