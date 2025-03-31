    $(document).ready(function() {
        // Obtener parámetros de la URL
        function getQueryParam(param) {
          const urlParams = new URLSearchParams(window.location.search);
          return urlParams.get(param);
        }
    
        const address = getQueryParam('address');
        const lat = parseFloat(getQueryParam('lat')) || 41.6644;
        const lng = parseFloat(getQueryParam('lng')) || -2.5458;  
        const x = parseFloat(getQueryParam('x'));                
        const y = parseFloat(getQueryParam('y'));                
        const zoom = parseInt(getQueryParam('zoom')) || 9;
    
        
        let frozenCoords = false;
    
        if (!isNaN(x) && !isNaN(y)) {
          var wgsCoords = proj4('+proj=utm +zone=30 +datum=ETRS89 +units=m +no_defs', 'EPSG:4326', [x, y]);
          map = L.map('map').setView([wgsCoords[1], wgsCoords[0]], zoom);
        } else {
          map = L.map('map').setView([lat, lng], zoom);
        }
  
      // Obtener información de la parcela
      map.on('click', function (e) {
        const url = `/api/proxy?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&LAYERS=Catastro&QUERY_LAYERS=Catastro&INFO_FORMAT=text/xml&SRS=EPSG:4326&BBOX=${map.getBounds().toBBoxString()}&WIDTH=${map.getSize().x}&HEIGHT=${map.getSize().y}&X=${Math.floor(e.containerPoint.x)}&Y=${Math.floor(e.containerPoint.y)}`;
  
        fetch(url)
          .then(response => response.text())
          .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
  
            const enlace = xmlDoc.getElementsByTagName("a")[0];
            const referenciaCatastral = enlace?.textContent || "No disponible";
           
            const rc1 = referenciaCatastral.substring(0, 7);
            const rc2 = referenciaCatastral.substring(7);
  
            const sedeElectronicaUrl = `https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCListaBienes.aspx?RC1=${rc1}&RC2=${rc2}&RC3=&RC4=&esBice=&RCBice1=&RCBice2=&DenoBice=&pest=rc&final=&RCCompleta=${referenciaCatastral}&from=OVCBusqueda&tipoCarto=nuevo&ZV=NO&ZR=NO&anyoZV=&strFechaVR=&tematicos=&anyotem=`;
  
            const popupContent = `
                <strong>Referencia catastral:</strong>
                <a href="${sedeElectronicaUrl}" target="_blank">${referenciaCatastral}</a>
            `;
  
            L.popup()
                .setLatLng(e.latlng)
                .setContent(popupContent)
                .openOn(map);
          })
          .catch(error => console.error('Error en GetFeatureInfo:', error));
      });
      // Actualizar coordenadas al mover el ratón
      function updateCoordinates(e) {
        if (frozenCoords) return;
        var lat = e.latlng.lat;
        var lng = e.latlng.lng;
        var etrsCoords = proj4('EPSG:4326', '+proj=utm +zone=30 +datum=ETRS89 +units=m +no_defs', [lng, lat]);
        
        $('#xCoord').text(etrsCoords[0].toFixed(2));
        $('#yCoord').text(etrsCoords[1].toFixed(2));
      }
  
      map.on('mousemove', updateCoordinates);
  
      // Congelar y descongelar coordenadas
      map.on('click', function(e) {
        frozenCoords = !frozenCoords;
        if (!frozenCoords) updateCoordinates(e);
      });
  
      // Copiar coordenadas X al portapapeles
      $('#copyXButton').on('click', function() {
        const xCoord = $('#xCoord').text();
        navigator.clipboard.writeText(xCoord).then(() => {
          alert('¡Coordenada X copiada al portapapeles!');
        }).catch(err => {
          console.error('Error al copiar al portapapeles: ', err);
        });
      });
  
      // Copiar coordenadas Y al portapapeles
      $('#copyYButton').on('click', function() {
        const yCoord = $('#yCoord').text();
        navigator.clipboard.writeText(yCoord).then(() => {
          alert('¡Coordenada Y copiada al portapapeles!');
        }).catch(err => {
          console.error('Error al copiar al portapapeles: ', err);
        });
      });
    });
