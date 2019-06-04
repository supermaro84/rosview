/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
            var ip_addr = "localhost";
            var websocket = 'ws://';
            websocket = websocket.concat(ip_addr,':9090');
            
            // setup connection to the ROS server and prepare the topic
            var ros = new ROSLIB.Ros({
            url : websocket
            });
            ros.on('connection', function() { console.log('Connected to websocket server.');});
            ros.on('error', function(error) { console.log('Error connecting to websocket server: ', error); window.alert('Error connecting to websocket server'); });
            ros.on('close', function() { console.log('Connection to websocket server closed.');});
 
      function get_color(points){
          if (points >11000){
             color="green";
         }
         else {
             color="red";
         }
         return color;
      };
      function getStatus(status){
          if (status==true){
              fil="red";
          }
          else{
              fil="yellow";
          }
          return fil;
      }

    //List topics to subscribe
      var gpsDji = new ROSLIB.Topic({
            ros : ros,
            name : '/dji_gps_throttled'
            //messageType : 'sensor_msgs/Imu'
            });
        gpsDji.subscribe(function(message){
        pos="lat: "+message.latitude.toFixed(8)+" lon: "+message.longitude.toFixed(8)+" alt: "+message.altitude.toFixed(8);
        document.getElementById("djigps").innerHTML = pos;
        });
      var gpsVN = new ROSLIB.Topic({
           ros:ros,
           name:'/vn_gps_throttled'
       });  
       gpsDji.subscribe(function(message){
         pos="lat: "+message.latitude.toFixed(8)+" lon: "+message.longitude.toFixed(8)+" alt: "+message.altitude.toFixed(8);
         document.getElementById("vngps").innerHTML = pos;
        });
        
      var imuDji = new ROSLIB.Topic({
            ros : ros,
            name : '/dji_imu_throttled'
            //messageType : 'sensor_msgs/Imu'
      });      
      imuDji.subscribe(function(message){
         pos="x: "+message.orientation.x.toFixed(5)+" y: "+message.orientation.y.toFixed(5)+" z: "+message.orientation.z.toFixed(5)+" w: "+message.orientation.w.toFixed(5);
         document.getElementById("djiimu").innerHTML = pos;
        });
        
      var imuvn = new ROSLIB.Topic({
            ros : ros,
            name : '/vn_imu_throttled'
            //messageType : 'sensor_msgs/Imu'
      });
      imuvn.subscribe(function(message){
         pos="x: "+message.orientation.x.toFixed(5)+" y: "+message.orientation.y.toFixed(5)+" z: "+message.orientation.z.toFixed(5)+" w: "+message.orientation.w.toFixed(5);
         document.getElementById("vnimu").innerHTML = pos;
        });
      
      
      var cloud_v = new ROSLIB.Topic({
          ros:ros,
          name : '/velodyne_points2_throttled'
      });    
      
      cloud_v.subscribe(function(message){
         pointcl=message.width;
         document.getElementById("points_count").innerHTML = pointcl;
         document.getElementById("points_count").style.background = get_color(pointcl);

      });
      
     var recording=0 
     var recordStatus=new ROSLIB.Topic({
          ros:ros,
          name: '/recordstat'
      });
      
      recordStatus.subscribe(function(message){
       recording = message.data;
       document.getElementById('recordingstatus').innerHTML=recording;
       document.getElementById("recordingstatus").style.background = getStatus(recording);
    });  
 
    function init() {
    // Connect to ROS.
    var ros = new ROSLIB.Ros({
      url : websocket
    })
    // Create the main viewer.
     var viewer = new ROS3D.Viewer({
      divID : 'viewer',
      width : 700,
      height : 400,
      antialias : false,
      loader : ROS3D.COLLADA_LOADER_2,
      background: '#A9A9A9'      
    }); 
    var orbit = new ROS3D.OrbitControls({
        scene : viewer.scene,
        camera : viewer.camera
    });
    orbit.zoomOut(65);
    orbit.rotateDown(-0.9);
    orbit.rotateLeft(0.8);
    orbit.update();
    //viewer.addObject(orbit.zoomOut(50));
    viewer.addObject(new ROS3D.Grid());
    // Setup a client to listen to TFs.
    var tfClient = new ROSLIB.TFClient({
      ros : ros,
      angularThres : 0.01,
      transThres : 0.01,
      rate : 5.0,
      fixedFrame : '/velodyne'
    });
    var cloudClient1 = new ROS3D.PointCloud2({
        ros: ros,
        tfClient: tfClient,
        rootObject: viewer.scene,
        topic: '/velodyne_points2_throttled',
        color:'green',
        size: 0.6
    });
  }
      var map, infoWindow;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          //center: {lat: 59, lng: 10},
          zoom:16,
          mapTypeId: 'satellite'
        });
        infoWindow = new google.maps.InfoWindow;
        var observation = 0;
        var polygon = [];
        gpsTopic.subscribe(function(message) {
            var pos = {
              lat: message.latitude,
              lng: message.longitude
            };

          //  observation = observation+1;
          //  if (observation % 10 == 0){
          //      polygon.push(pos);
          //  var flightPath = new google.maps.Polyline({
         // path: polygon,
        //  geodesic: true,
        //  strokeColor: '#FF0000',
        //  strokeOpacity: 1.0,
        //  strokeWeight: 2
       // });

        //flightPath.setMap(map);
                infoWindow.setPosition(pos);
                infoWindow.setContent('OnTrack');
                infoWindow.open(map);
                map.setCenter(pos);
            }          
                       
          , function() {
            handleLocationError(true, infoWindow, map.getCenter());
         });
    
        }
  
  // Can plot on OSM too  
    /*map = new OpenLayers.Map("Map");
    var mapnik         = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);
    map.zoomToMaxExtent();
    var zoom           = 13;
    var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    var position       = new OpenLayers.LonLat(lon, lat).transform( fromProjection, toProjection);
    var position_init       = new OpenLayers.LonLat(lon_i, lat_i).transform( fromProjection, toProjection);
    var markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);
    markers.addMarker(new OpenLayers.Marker(position));
    */
   

