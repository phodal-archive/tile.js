$(function() {
  var c = $("canvas")[0].getContext("2d");

  var scene = {
    layers: [],
    renderLayer: function(layer) {
      // data: [array of tiles, 1-based, position of sprite from top-left]
      // height: integer, height in number of sprites
      // name: "string", internal name of layer
      // opacity: integer
      // type: "string", layer type (tile, object)
      // visible: boolean
      // width: integer, width in number of sprites
      // x: integer, starting x position
      // y: integer, starting y position
      if (layer.type !== "tilelayer" || !layer.opacity) { return; }
      var s = c.canvas.cloneNode(),
        size = scene.data.tilewidth;
      s = s.getContext("2d");
      if (scene.layers.length < scene.data.layers.length) {
        layer.data.forEach(function(tile_idx, i) {
          if (!tile_idx) { return; }
          var img_x, img_y, s_x, s_y,
            tile = scene.data.tilesets[0];
          tile_idx--;
          img_x = (tile_idx % (tile.imagewidth / size)) * size;
          img_y = ~~(tile_idx / (tile.imagewidth / size)) * size;
          s_x = (i % layer.width) * size;
          s_y = ~~(i / layer.width) * size;
          s.drawImage(scene.tileset, img_x, img_y, size, size,
            s_x, s_y, size, size);
        });
        scene.layers.push(s.canvas.toDataURL());
        c.drawImage(s.canvas, 0, 0);
      }
      else {
        scene.layers.forEach(function(src) {
          var i = document.createElement('img');
          i.src = src;
          c.drawImage(i, 0, 0);
        });
      }
    },
    renderLayers: function(layers) {
      function isObject(obj) {
        return typeof obj === 'array';
      }

      layers = isObject(layers) ? layers : this.data.layers;
      layers.forEach(this.renderLayer);
    },
    loadTileset: function(json) {
      this.data = json;
      this.tileset = document.createElement('img');
      this.tileset.src = json.tilesets[0].image;
      this.tileset.onload = $.proxy(this.renderLayers, this);
    },
    load: function(name) {
      return $.ajax({
        url: "./images/" + name + ".json",
        dataType: "JSON",
        type: 'get'
      }).done($.proxy(this.loadTileset, this));
    }
  };

  scene.load("mountain");
});
