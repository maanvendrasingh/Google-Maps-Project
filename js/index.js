
var map;
var markers = [];
var infoWindow;
var locationSelect;


function initMap() {
    var pune = {
      lat: 18.5204,
      lng: 73.8567
    };
    map = new google.maps.Map(document.getElementById('map'), {
      center: pune,
      zoom: 13,
    });

    infoWindow = new google.maps.InfoWindow();

    searchStores();
}

function searchStores(){
  var foundStores = [];
  var zipCode = document.getElementById('zip-code-input').value;
  if(zipCode){
    stores.forEach(function(store, imdex){
      var postal = store.address.postalCode;
      if(postal == zipCode){
        foundStores.push(store);
      }
    });
  }
  else{
      foundStores = stores;
  }
  
  clearLocations();
  displayStores(foundStores);
  showStoreMarker(foundStores);
  setOnClickListener();
}


function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}


function displayStores(stores){
  var storesHtml = '';
  stores.forEach(function(store, index){
  var address = store.addressLines;
  var phone = store.phoneNumber;
  storesHtml += `
                <div class="store-container">
                  <div class="store-container-background">
                      <div class="store-info">
                          <div class="store-address">
                              <span>${address[0]}</span>
                              <span>${address[1]}</span>
                          </div>
                          <div class="store-phone-number">${phone}</div>
                      </div>
                      <div class="store-number-container">
                          <div class="store-number">${index+1}</div>
                      </div>
                  </div>
                </div>
                `
  });
    document.querySelector(".stores-list").innerHTML = storesHtml;
}

function setOnClickListener(){
  var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem, index){
      elem.addEventListener('click', function(){
        new google.maps.event.trigger(markers[index], 'click');
      });
  });
}

function showStoreMarker(stores){
  var bounds = new google.maps.LatLngBounds();
    stores.forEach(function(store, index){
      var latlng = new google.maps.LatLng(
        store.coordinates.latitude,
        store.coordinates.longitude
      );
    var name = store.name;
    var address = store.addressLines[0];
    var phone = store.phoneNumber;

    createMarker(latlng, name, address, phone, index);  
    bounds.extend(latlng); 
});
  map.fitBounds(bounds);
}

function createMarker(latlng, name, address, phone, index){
  var html = '';
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: `${index+1}`
  });
  google.maps.event.addListener(marker, 'click', function() {
    html = `
            <div class="marker-container-background">
                <div class="marker-info-box">
                    <span>${name}</span>
                    <div class="marker-address-box">
                        <i class="fas fa-location-arrow"></i>
                        <div>${address}</div>
                    </div>
                    <div class="marker-number-container">
                      <i class="fas fa-phone-alt"></i>
                      <div class="marker-phone-number">${phone}</div>
                    </div>
                </div>
            </div>
          `

    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
    markers.push(marker); 
}