/* tile.js main */

// Base function.
var tile = function() {
  // Add functionality here.
  return true;
};

var get = function (url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      callback(xhr.responseText);
    }
  };
  xhr.open('GET', url, true);
  xhr.send(null);
};

function Scene(content) {
  this.layers = [];
  var that = this;

  this.renderLayer = function (layer) {
    if (layer.type !== 'tilelayer' || !layer.opacity) {
      return;
    }
    var s = content.canvas.cloneNode(),
      size = that.data.tilewidth;
    s = s.getContext('2d');
    if (that.layers.length < that.data.layers.length) {
      layer.data.forEach(function (tileIndex, i) {
        if (!tileIndex) {
          return;
        }
        var imgX, imgY, sizeX, sizeY,
          tile = that.data.tilesets[0];
        tileIndex--;
        imgX = (tileIndex % (tile.imagewidth / size)) * size;
        imgY = ~~(tileIndex / (tile.imagewidth / size)) * size;
        sizeX = (i % layer.width) * size;
        sizeY = ~~(i / layer.width) * size;
        s.drawImage(that.tileset, imgX, imgY, size, size, sizeX, sizeY, size, size);
      });
      that.layers.push(s.canvas.toDataURL());
      content.drawImage(s.canvas, 0, 0);
    }
    else {
      that.layers.forEach(function (src) {
        var i = document.createElement('img');
        i.src = src;
        content.drawImage(i, 0, 0);
      });
    }
  };

  this.renderLayers = function (layers) {
    function isObject(obj) {
      var type = typeof obj;
      return type === 'array';
    }

    layers = isObject(layers) ? layers : this.data.layers;
    layers.forEach(this.renderLayer);
  };

  this.loadTileset = function (json) {
    var that = this;
    this.data = json;
    this.tileset = document.createElement('img');
    this.tileset.src = json.tilesets[0].image;
    this.tileset.onload = function () {
      that.renderLayers(that.tileset);
    };
  };

  this.load = function (name) {
    var that = this;
    get('./images/' + name + '.json', function (data) {
      that.loadTileset(JSON.parse(data));
    });
  };
}

tile.Scene = Scene;

// Version.
tile.VERSION = '0.0.0';


// Export to the root, which is probably `window`.
root.tile = tile;
