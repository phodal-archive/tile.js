/* jshint bitwise:false */

var content = document.getElementsByTagName('canvas')[0].getContext('2d');
var scene = {
  layers: [],
  renderLayer: function (layer) {
    'use strict';
    // data: [array of tiles, 1-based, position of sprite from top-left]
    // height: integer, height in number of sprites
    // name: "string", internal name of layer
    // opacity: integer
    // type: "string", layer type (tile, object)
    // visible: boolean
    // width: integer, width in number of sprites
    // x: integer, starting x position
    // y: integer, starting y position
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
    this.data = json;
    this.tileset = document.createElement('img');
    this.tileset.src = json.tilesets[0].image;
    this.tileset.onload = $.proxy(this.renderLayers, this);
  },
  load: function (name) {
    'use strict';
    return $.ajax({
      url: './images/' + name + '.json',
      dataType: 'JSON',
      type: 'get'
    }).done($.proxy(this.loadTileset, this));
  }
};

scene.load('mountain');
