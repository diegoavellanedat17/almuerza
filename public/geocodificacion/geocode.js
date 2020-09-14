var firebaseConfig = {
    apiKey: "AIzaSyBjasCFXiGf7JZAdqlG_lo-7XMwLwUJw0E",
    authDomain: "delifast-7576c.firebaseapp.com",
    databaseURL: "https://delifast-7576c.firebaseio.com",
    projectId: "delifast-7576c",
    storageBucket: "delifast-7576c.appspot.com",
    messagingSenderId: "415819035666",
    appId: "1:415819035666:web:9300f229e79d85c0f6d4cb",
    measurementId: "G-ESS36GVJTN"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
  
  
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
        
        loadAddress(user)
        
        
  
    } else {
      console.log("Is the first time dont redirect or Logout")
        
        window.location = 'public/login.html';
      
    }
  });
  
  
function loadAddress(user) {
    var dir_restaurante=db.collection('restaurantes').where("uid","==",user.uid)
    dir_restaurante.get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
        var address=doc.data().dir
        var area=doc.data().areaServicio
        loadmap(address, area)
        })
    })
}

function loadmap(adr, area){
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/tasks/Locator", 
        "esri/Graphic",
        "esri/geometry/geometryEngine"
      ], function (Map, MapView, Locator, Graphic, geometryEngine) {
        
        var map = new Map({
          basemap: "streets-navigation-vector",
        });

        var view = new MapView({
            container: "viewDiv",  
            map: map,
            zoom: 14
        });

        var locator = new Locator({
          url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        })

        var addressParams = {"singleLine": adr+' Bogota'};
        locator.addressToLocations({address: addressParams}).then(function(evt){          
          if (evt[0].location){
            var point = {
              type: "point",  // autocasts as new Point()
              longitude: evt[0].location.longitude,
              latitude: evt[0].location.latitude
            };  

            var graphic = new Graphic({
                  geometry: point,
                  symbol: {
                    type: "picture-marker",
                    url: "http://127.0.0.1:5501/public/assets/img/logoicon.png",
                    // url: "https://almuerza.co/assets/img/logoicon.png",
                    width: "40px",
                    height: "40px"
                  },
            })

            longitude = evt[0].location.longitude,
            latitude = evt[0].location.latitude,
            view.center = [longitude, latitude] 
            var buffer = geometryEngine.geodesicBuffer(graphic.geometry, area, "kilometers");
            drawBuffer(buffer)
            view.graphics.add(graphic);                
          }        
            
        })
        
        var bufferGraphic;

        function drawBuffer(bufferGeometry) {
          view.graphics.remove(bufferGraphic);
          bufferGraphic = new Graphic({
            geometry: bufferGeometry,
            symbol: {
              type: "simple-fill",
              color: [251, 116, 124, 0.5], // orange, opacity 80%
              outline: {
                color: [255, 255, 255],
                width: 1
              }
            }
          });
          view.graphics.add(bufferGraphic);
          }

      });


}

