// An example of using the MQA.EventUtil to hook into the window load event and execute the defined
// function passed in as the last parameter. You could alternatively create a plain function here and
// have it executed whenever you like (e.g. <body onload="yourfunction">).
 
MQA.EventUtil.observe(window, 'load', function() {

  // create an object for options
  var options = {
    elt: document.getElementById('map'),       // ID of map element on page
    zoom: 12,                                  // initial zoom level of the map
    latLng: { lat: 49.017222, lng: 12.096944 },  // center of map in latitude/longitude
    mtype: 'map',                              // map type (map, sat, hyb); defaults to map
    bestFitMargin: 0,                          // margin offset from map viewport when applying a bestfit on shapes
    zoomOnDoubleClick: true                    // enable map to be zoomed in when double-clicking
  };

  // construct an instance of MQA.TileMap with the options object
  var tileMap = new MQA.TileMap(options);
  window.map = tileMap;

  // download the modules
  MQA.withModule('largezoom', 'viewoptions', 'geolocationcontrol', 'insetmapcontrol', 'mousewheel', function() {
   
    // add the Large Zoom control
    map.addControl(
      new MQA.LargeZoom(),
      new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5,5))
    );

    // add the Map/Satellite toggle button
    map.addControl(new MQA.ViewOptions());
   
    // add the Geolocation button
    map.addControl(
      new MQA.GeolocationControl(),
      new MQA.MapCornerPlacement(MQA.MapCorner.TOP_RIGHT, new MQA.Size(10,50))
    );
   
    // add the small Inset Map with custom options
    map.addControl(
      new MQA.InsetMapControl({
        size: { width: 150, height: 125 },
        zoom: 3,
        mapType: 'map',
        minimized: true
      }),
      new MQA.MapCornerPlacement(MQA.MapCorner.BOTTOM_RIGHT)
    );
   
    // enable zooming with your mouse
    map.enableMouseWheelZoom();
  });
  
  MQA.EventManager.addListener(map, 'move', eventRaised);

  function eventRaised(event) {
    var ul = map.getBounds().ul;
    var lr = map.getBounds().lr;
    var bbox = ul.getLongitude() + "," + lr.getLatitude() + "," + lr.getLongitude() + "," + ul.getLatitude();
    var url = "http://overpass-api.de/api/map?bbox=" + bbox;
    
    console.log(url);
    
    var x = new XMLHttpRequest();
    x.open("GET", url, true);
    x.onreadystatechange = function () {
      if (x.readyState == 4 && x.status == 200)
      {
        var doc = x.responseXML;
        console.log(doc);
      }
    };
    x.send(null);
  }
});

