var expect = chai.expect;
var should = chai.should();


describe('Lettering Library', () => {

  var test, testContent, input;
  var lettering, letteringInput;

  before(() => {
    test = document.getElementById('test');
    testContent = test.innerText;
    console.dir(test);
    input = document.getElementById('test-input');
    inputContent = input.placeholder;
    lettering = new Lettering('#test');
    letteringInput = new Lettering('#test-input');
  })

  it('should create an instance of Lettering', () => {
    should.exist(lettering);
  });

  describe('Check if is input', () => {

    it('should contains two element if is not input', () => {
      expect(test.childElementCount).to.equal(2);
    });

    it('should not contains two element if is input', () => {
      expect(input.childElementCount).to.equal(0);
    });

    it('should contain a span element if is not input element', () => {
      should.exist(test.querySelector('span'));
    });

    it('should contains a caret if is not input element', () => {
      should.exist(test.querySelector('.lettering-caret'));
    });

    it('shoudl render textContent if element is not inpt', () => {
      expect(lettering.string).to.equal(testContent)
    });

    it('should render placeholder if element is input', () => {
      expect(letteringInput.string).to.equal(inputContent);
    });


  })

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

});
