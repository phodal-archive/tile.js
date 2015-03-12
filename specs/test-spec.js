describe("Tile", function () {
    beforeEach(function () {
        jasmine.Ajax.install();
    });
    afterEach(function () {
        jasmine.Ajax.uninstall();
    });

    it("should successful parse", function () {
      var canvas = document.createElement('canvas');
      document.body.appendChild(canvas);

      var c = document.getElementsByTagName('canvas')[0].getContext('2d');

      var s = new tile.Scene(c);
      s.load('mountain')
    });
});

