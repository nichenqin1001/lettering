describe('Lettering Library', () => {

  it('should create an instance of Lettering', () => {
    expect(lettering).toBeDefined();
    expect(letteringInput).toBeDefined();
  });


  describe('Event Emitter', () => {

    describe('addListener()', () => {

      var testTxt;

      beforeEach((done) => {
        testTxt = '';
        lettering.addListener('afterTyping', () => {
          testTxt = 'afterTyping';
          done();
        });
      });

      it('should do something after add afterTyping event', () => {
        expect(testTxt).toEqual('afterTyping');
      });

    });


  });


});
