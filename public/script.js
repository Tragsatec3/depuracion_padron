

    // Capa OSM (OpenStreetMap)
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 40,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Capa Google
    var googleLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&hl=es&z={z}&x={x}&y={y}', {
      maxZoom: 40,
      attribution: '&copy; <a href="https://www.google.com/intl/es/help/terms_maps.html">Google Maps</a>'
    });

    // Capa PNOA (Imágenes aéreas)
    var pnoaLayer = L.tileLayer('https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg', {
      maxZoom: 19,
      attribution: 'CC BY 4.0 scne.es'
    });
    
    // Capa Catastro
    var catastroLayer = L.tileLayer.wms("http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?", {
      layers: 'Catastro',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      attribution: "DIRECCION GENERAL DEL CATASTRO",
      maxZoom: 40
    });
    

    // Capa Callejero IGN
    var callejero = L.tileLayer.wms('http://www.ign.es/wms-inspire/ign-base?', {
      layers: 'IGNBaseTodo',
      format: 'image/png',
      maxZoom: 40,
      transparent: true,
      attribution: '© Instituto Geográfico Nacional'
    });

    // Añadir capas de mapa
    var baseMaps = {
      "Callejero": callejero,
      "Google Maps": googleLayer,
      "Open Street Map": osmLayer,
      "Catastro": catastroLayer,
      "Imagen PNOA": pnoaLayer
    };
    
// Añadir capa de provincia y municipios
var overlay = {
"Provincias": L.geoJson(provincias, { 
  style: { "color": "#EB5B00", "weight": 4, "opacity": 0.8 }
}).addTo(map),
"Municipios": L.geoJson(municipios, { 
  style: { "color": "#3182bd", "weight": 1, "opacity": 3.5 },
  onEachFeature: function(feature, layer) {
    if (feature.properties && feature.properties.D_MUN) {
      layer.bindTooltip(feature.properties.D_MUN, {
        permanent: false,
        direction: "top",
        className: "municipio-css"
      });
    }
  }
}).addTo(map)
};

    L.control.layers(baseMaps, overlay, { position: 'topright' }).addTo(map);
    L.control.scale({ metric: true, imperial: false }).addTo(map);