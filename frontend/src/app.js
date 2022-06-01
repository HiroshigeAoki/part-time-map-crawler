/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 //モジュールインポート
 import { Loader } from '@googlemaps/js-api-loader';
 import MarkerClusterer from '@google/markerclustererplus';
 
 //APIキー取得
 const apiOptions = {
    apiKey: "AIzaSyA4jvwp5FVdxzVhl5cZbsNqKN_WjDlQcgw"
 }
 const loader = new Loader(apiOptions);
 
 //メソッド
 loader.load().then(() => {
   console.log('Maps JS API loaded');
   //const latlng = initMap();
   
   //位置情報取得
   getPosition();
  
 });
 
//---------位置情報取得----
if (navigator.geolocation) {
  // Geolocation APIに対応している
}
else {
  // Geolocation APIに対応していない
  alert("この端末では位置情報が取得できません");
}

// 現在地取得処理
function getPosition() {
  // 現在地を取得
  navigator.geolocation.getCurrentPosition(
    // 取得成功した場合
    function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      alert("緯度:"+lat+",経度"+lng);
      const latlng = new google.maps.LatLng(lat, lng);
  
      //メソッド呼び出し
      //map作成、中心地設定
      const map = displayMap(latlng);
      //位置情報をマーカーして、マーカーを変える。
      const markers = addMarkers(map);
      //近くの店舗を群で表示
      clusterMarkers(map, markers);
      //押したピンを中心に
      addPanToMarker(map, markers);

    }
    ,
    // 取得失敗した場合
    function (error) {
      switch(error.code) {
        case 1: //PERMISSION_DENIED
          alert("位置情報の利用が許可されていません");
        break;
    
        case 2: //POSITION_UNAVAILABLE
          alert("現在位置が取得できませんでした");
        break;
    
        case 3: //TIMEOUT
          alert("タイムアウトになりました");
        break;
    
        default:
          alert("その他のエラー(エラーコード:"+error.code+")");
        break;
      }
    }
  ); 
}



//----------メソッド------


 //中心地の設定
 function displayMap(latlng) {
   //const center = latlng;
   const mapOptions = {
     center: latlng ,
     zoom: 15
   };
   const mapDiv = document.getElementById('map');
   return new google.maps.Map(mapDiv, mapOptions);
 }
 
 //店舗位置情報から、マーカーを加えるメソッド
 function addMarkers(map) {
   const locations = {
     sevenNunohashi: { lat: 34.72211251025436, lng: 137.71739606148338 },
     sevenBunkyu: { lat: 34.72306492751079, lng: 137.7139628577003 },
     familymartJohoku: { lat: 34.72374625914262, lng: 137.7193468373724 },
   }

   const markers = [];
   for (const location in locations) {
     const markerOptions = {
       map: map,
       position: locations[location],
       icon: './img/custom_pin.png'
     }
     const marker = new google.maps.Marker(markerOptions);
     markers.push(marker);
   }
   return markers;
 }

 //近いマーカーをまとめて番号で示す
 function clusterMarkers(map, markers) {
   const clustererOptions = { imagePath: './img/m' }
   const markerCluster = new MarkerClusterer(map, markers, clustererOptions);
 }
 
 //押したピンが中央に来るようにパンする
 function addPanToMarker(map, markers) {
   let circle;
   markers.map(marker => {
     marker.addListener('click', event => {
      const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      map.panTo(location);
      if (circle) {
        circle.setMap(null);
      }
      circle = drawCircle(map, location);
     });
   });
 }


 //押したピンの半径800メートルを示す
 function drawCircle(map, location) {
   const circleOptions = {
     strokeColor: '#FF0000',
     strokeOpacity: 0.8,
     strokeWeight: 1,
     map: map,
     center: location,
     radius: 800
   }
   const circle = new google.maps.Circle(circleOptions);
   return circle;
 }


 

