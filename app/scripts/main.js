/* jshint bitwise:false */

var content = document.getElementsByTagName('canvas')[0].getContext('2d');

var scene = {
  layers: [],
  renderLayer: function (layer) {
    'use strict';
    if (layer.type !== 'tilelayer' || !layer.opacity) {
      return;
    }
    var s = content.canvas.cloneNode(),
      size = scene.data.tilewidth;
    s = s.getContext('2d');
    if (scene.layers.length < scene.data.layers.length) {
      layer.data.forEach(function (titleIndex, i) {
        if (!titleIndex) {
          return;
        }
        var imgX, imgY, sizeX, sizeY,
          tile = scene.data.tilesets[0];
        titleIndex--;
        imgX = (titleIndex % (tile.imagewidth / size)) * size;
        imgY = ~~(titleIndex / (tile.imagewidth / size)) * size;
        sizeX = (i % layer.width) * size;
        sizeY = ~~(i / layer.width) * size;
        s.drawImage(scene.tileset, imgX, imgY, size, size,
          sizeX, sizeY, size, size);
      });
      scene.layers.push(s.canvas.toDataURL());
      content.drawImage(s.canvas, 0, 0);
    }
    else {
      scene.layers.forEach(function (src) {
        var i = document.createElement('img');
        i.src = src;
        content.drawImage(i, 0, 0);
      });
    }
  },
  renderLayers: function (layers) {
    'use strict';
    function isObject(obj) {
      var type = typeof obj;
      return type === 'array';
    }

    layers = isObject(layers) ? layers : this.data.layers;
    layers.forEach(this.renderLayer);
  },
  loadTileset: function (json) {
    'use strict';
    var that = this;
    this.data = json;
    this.tileset = document.createElement('img');
    this.tileset.src = json.tilesets[0].image;
    this.tileset.onload = function(){
      that.renderLayers(that.tileset);
    };
  },
  get: function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        callback(xhr.responseText);
      }
    };
    xhr.open('GET', url, true);
    xhr.send(null);
  },
  load: function (name) {
    'use strict';
    var that = this;
    that.get('./images/' + name + '.json', function(data){
      that.loadTileset(JSON.parse(data));
    });
  }
};

scene.load('mountain');
