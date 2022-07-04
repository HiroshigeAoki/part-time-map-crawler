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
 //import foo from './popup.mjs';

 //console.log(foo.FA);

//



 
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
  navigator.geolocation.getCurrentPosition(success, error);
    // 取得成功した場合
    function success(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      alert("緯度:"+lat+",経度"+lng);//サイトが開いたときにポップアップで緯度経度を出す。
      const latlng = new google.maps.LatLng(lat, lng);
      console.log("latlngの表示:",lat,lng);
      
      //メソッド呼び出し
      //backendにlatlngを送るメソッド
      //sendCurrentPosition(latlng);

      //ユーザー希望条件を取得して、ネストでbackendに送信する。
      const query = getUserData(latlng);
      console.log("クエリまつりパート２：",query);//OK
      //ユーザー希望条件をbackendに送信するメソッド
      sendUserData(query);


//---


/*
let query = JSON.stringify({ //TODO:クエリーを↑のユーザが選択したものに置き換える。
  "origins": {
      "type": "Point",
      "coordinates": [
          138.4331,
          34.9635
  ]
  },
  "commute": {
      "travelMode": "WALKING",
      "time": '30分'
  },
  "jc":[],
  "jmc": [],
  "preferences": []
});
*/

/*
//backendにlatlngを送るメソッド
function sendCurrentPosition(latlng) {
  const data = JSON.stringify({
    "origins": {
        "type": "Point",
        "coordinates": [
            138.4331,
            34.9635
    ]
    },
    "commute": {
      "travelMode": "WALKING",
      "time": "30分"
    }
  });
  */

  /*
// JSONの取得
let result = fetch("http://localhost:8000/api/jobs/search",
    {
        method: 'POST',
        body: data,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
)
 .then(res => {
        if(res.ok){
            return res.json()
        }
        else{
            return Promise.reject(new Error('エラー、、'))
        }
    })
    
 .then(json => console.log(json));
 

}
*/

      //map作成、中心地設定
      const map = displayMap(latlng);

      //jsonから応募情報を取得する
      //const jsonData = getStoreInfo();
      getStoreInfo(map)
      //位置情報をマーカーして、マーカーを変える。
      //const markers = addMarkers(map, jsonData);
      //募集情報受け取り
      //const storeInfo = workPlaceInfo(jsonData);
      //情報ウィンドウ
      //infoWindow(storeInfo,map,markers);
      //近くの店舗を群で表示
      //clusterMarkers(map, markers);
      //押したピンを中心に
      //addPanToMarker(map, markers);
    
    }
    
    // 位置情報取得に失敗した場合
    function error(error) {
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
   
}


//----------メソッド------
//commutingなどをpopup.jsから受け取るメソッド
function getUserData(latlng){
  //popup.jsから受け取る内容を書こう------------------------------------------------------------------------------------------------------
  /*
    //通勤方法
    const commutingMethod = document.getElementById("commuting_method");
    console.log("^^",commutingMethod.value);
    //通勤時間
    const commutingTime = document.getElementById("commuting_time");
    console.log("jikan",commutingTime.value);
    //勤務時間
    const workTime = document.getElementById("work_time");
    console.log("jikann2",workTime.value);
    //バーの値を出すメソッド
    window.onload = function () {
      const commuTime = document.getElementById("commuting_time");
      const workTime = document.getElementById("work_time");
      // 選択した際のイベント取得
      commuTime.addEventListener('change', (e) => {
        document.getElementsByClassName('badge-warning1')[0].textContent = commuTime.value;
      });
      workTime.addEventListener('change', (e) => {
        document.getElementsByClassName('badge-warning2')[0].textContent = workTime.value;
      });
  
    }
    //職種
    const occupations = [];
    const occupation = document.getElementsByName("occupation");
    for(const occu of occupation){
      if(occu.checked === true){
        //console.log(favo.checked); 
        console.log(occu.value)
        occupations.push(occu.value);
      }
    }
    //こだわり
    const favorite=[];
    const favos = document.getElementsByName("favorite");
      for(const favo of favos){
        if(favo.checked === true){
          //console.log(favo.checked); 
          console.log(favo.value)
          favorite.push(favo.value);
        }
      }
*/

  const commutingMethod = "徒歩";
  const commutingTime = 5;
  const occupations = ["飲食/フード","営業"];
  const favorite = ["高収入","未経験OK"];
  //Search クエリードキュメント: http://localhost:8000/redoc#operation/search_api_jobs_search_post
  let query = JSON.stringify({
    "origins": latlng,
    "commute": {
      "travelMode": commutingMethod,
      "time": commutingTime
    },
    //workTime: workTime,
    "jc": occupations,
    "jmc": [],
    "es": [],
    "preferences": favorite,
  });
  console.log("クエリまつりじゃぁ！：",query);//OK
  return query;
}

//クエリ情報をバックエンドに送るメソッド
function sendUserData(query){
  // JSONの取得
  fetch("http://localhost:8000/api/jobs/search",{
      method: 'POST',
      body: query,
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': ['http://localhost:8000/', 'http://localhost:8080/'] 
      }
  })
  .then(res => {
      if(res.ok){
          return res.json()
      }
      else{
          return res.text().then(err=>
            Promise.reject(new Error(err)))
      }
  })
  .then(json => console.log(json));
}

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

//希望条件に会った店舗情報をjsonから読み込む
function getStoreInfo(map){
  var jsonDataArray1 =[];  
  //JSONファイルから募集情報を取得
  //const jsonData = require('./response_1653970587266.json'); 
  //function(){ß

  
    //fetch('./response_1653970587266.json') // (1) リクエスト送信
    fetch('http://localhost:8000/api/jobs/search') 
    .then(response => response.json()) // (2) レスポンスデータを取得
    .then(jsonDatas => { // (3)レスポンスデータを処理
      let jsonData = jsonDatas;
      //const file_area = document.getElementById('file_area');
      //const ul_element = document.createElement('ul');
  
      
      //fetchを使ってJSONファイルから募集情報を取得
      /*
      fetch("http://localhost:8080/userData.json")
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log("失敗しました");
      });
      */

      const nameArray = [];
      const comentArray = [];
      const salaryArray = [];
      const urlArray = [];
      const latArray = [];
      const lngArray = [];

      console.log("やんね？",jsonData[0].name);//リヴォイス
      console.log(jsonData.length);//20
      const array =[jsonData[0].name ,jsonData[1].name];
      console.log('arrayDETH',array);
      for(let i = 0; i<jsonData.length; i++){
        //店舗名取得
        const name = jsonData[i].name;
        nameArray.push(name);
        
        //店舗からの一言
        const coment = jsonData[i].job_title;
        comentArray.push(coment);

        //給料情報
        const salary = jsonData[i].wages;
        salaryArray.push(salary);

        //募集記事サイトURL
        const url = jsonData[i].url;
        urlArray.push(url);

        //店舗位置情報取得
        const latlng = jsonData[i].loc.coordinates;
        //緯度
        const storeLat = latlng[1];
        //経度
        const storeLng = latlng[0];
        console.log("latlng",storeLat,storeLng);
        latArray.push(storeLat);
        lngArray.push(storeLng);
      }
      //jsonDataArray1.push([nameArray, comentArray, salaryArray, urlArray, latArray, lngArray])
      console.log(nameArray[0]);//理ヴォイス
      console.log('return1',jsonDataArray1[0]);//名前全体の配列が表示される
      
      //console.log("どうかなー",nameArray);
      //console.log("どうかなーながさ",nameArray.length);
      jsonDataArray1.push(nameArray);
      jsonDataArray1.push(comentArray);
      jsonDataArray1.push(salaryArray);
      jsonDataArray1.push(urlArray);
      jsonDataArray1.push(latArray);
      jsonDataArray1.push(lngArray);
      console.log('でるかな〜？',jsonDataArray1);

      //html要素の作成
      const storeInfoHTML = workPlaceInfo(jsonDataArray1);
      //位置情報をマーカーして、マーカーを変える。
      const markers = addMarkers(map,jsonDataArray1);
      //情報ウィンドウ
      infoWindow(storeInfoHTML,map,markers);
      //近くの店舗を群で表示
      clusterMarkers(map, markers);
      //押したピンを中心に
      addPanToMarker(map, markers);

    });
    return jsonDataArray1;

  //const jsonDataArray2 = [];
  //jsonDataArray2.push(jsonDataArray1);
  //console.log('return2',jsonDataArray1);
  //return jsonDataArray1;
}




 
//店舗位置情報から、マーカーを加えるメソッド
function addMarkers(map, jsonData) {
  console.log("確認です",jsonData);
  //jsonData[4]が各店舗の緯度、jsonData[5]が経度
  
  /*
  const locations =[];
  for(let i =0; i <jsonData[4].length; i++){
    const location = jsonData[4][i];
    locations.push(location);
  }
  */

  
  console.log("全体の確認です",jsonData);
  console.log("長さの確認です",jsonData[0]);
  console.log("緯度の確認です",jsonData[0][4]);

  const latlngs =[];
  for(let i =0; i <jsonData[4].length; i++){
    const latlng = {
      lat: jsonData[4][i], 
      lng: jsonData[5][i] 
    }
    latlngs.push(latlng);
    console.log("e--",latlng);
  }
  
  /*
  const locations = {
      sevenNunohashi: { lat: 34.7219493 , lng: 137.717412 },
      sevenBunkyu: { lat: 34.72306492751079, lng: 137.7139628577003 },
      familymartJohoku: { lat: 34.72374625914262, lng: 137.7193468373724 },
  */

  for(const latlng of latlngs){
    console.log("latlng11: ",latlng);
  }
  
  
  const markers =[];
  for(let i=0; i<latlngs.length; i++){
    const latlng = latlngs[i];
    console.log("latlng22: ",latlng);

    const marker = new google.maps.Marker({ // マーカーの追加
      position: latlng, // マーカーを立てる位置を指定
      map: map, // マーカーを立てる地図を指定
      icon: './img/custom_pin.png'
    });
    markers.push(marker);
  }
  return markers;
  //console.log("markers; ",markers[0][0]);

   
  /*
  const markers = [];
  for(let i=0; 1<latlngs.length; i++){
   let locations = latlngs[i];
   //for (const location in locations) {
     console.log("location : ", locations);
     const markerOptions = {
       map: map,
       position: locations[location],
       icon: './img/custom_pin.png'
     }
     const marker = new google.maps.Marker(markerOptions);
     markers.push(marker);
   
   console.log("^^ ",markers);
   return markers;
  }
  */
}

/*
//募集情報を受け取るメソッド(jsバージョン)
function workPlaceInfo(){
  
  const div_node = document.createElement("div");
  const storeName_node = document.createElement("h1");
  const salary_node = document.createElement("p");
  const url_node = document.createElement("p");
  const a_node = document.createElement("a");

  a_node.href = "https://www.shizuoka.ac.jp/";
  
  const title = document.createTextNode("セブン");
  const salary = document.createTextNode("$900");
  const url = document.createTextNode("募集サイトに行く");

  a_node.appendChild(url);
  storeName_node.appendChild(title);
  salary_node.appendChild(salary);
  url_node.appendChild(a_node);
  div_node.appendChild(storeName_node,salary_node,url_node);//,salary,a_node);
  return div_node;
}
*/

//募集情報を受け取るメソッド(HTMLバージョン）
function workPlaceInfo(jsonData){
  //jsonから取得した店舗名が入った配列
  const nameArray = jsonData[0];
  //jsonから取得した店舗からの一言が入った配列
  const comentArray = jsonData[1];
  //jsonから取得した給料情報が入った配列
  const salaryArray = jsonData[2];
  //jsonから取得した募集URLが入った配列
  const urlArray = jsonData[3];

  const storeInfos =[];
  for(let i =0; i< jsonData.length ; i++){
    for(let j =0; j< jsonData[i].length ; j++){
      const storeInfo = 
        '<div id="content">' +
          '<div id="siteNotice">' +
          "</div>" +
          '<h1 style="font-size:20px;" id="firstHeading" class="firstHeading">' +
            jsonData[0][j] +
          '</h1>' +
            '<div id="bodyContent">' +
              '<p><コメント> ' + 
              jsonData[1][j] +
              '</p>' +
              '<p><給料> ' +
              jsonData[2][j] + 
              '</p>' +
              '<p><a href=' +
              jsonData[3][j] +
                ">" +
                "募集サイトに移動する</a>" +
              '</p>' +
            "</div>" +
        "</div>";
        console.log(storeInfo);
      storeInfos.push(storeInfo);
    }
    return storeInfos;
  }
  
  /*
  const storeInfoArray = getStoreInfo();
  console.log("1.1:", storeInfoArray[0]);
  console.log("1.2:", storeInfoArray[1]);
  console.log("1.3:", storeInfoArray[2]);//{storeName1: 'セブン布橋', occupation1: '接客業', salary1: '$50', url1: 'https://www.shizuoka.ac.jp/'}
  
  for(let i=0; i<storeInfoArray.length; i++) {
    storeInfoArray[i];
    console.log("2:", storeInfoArray[i]);
    //for(const storeInfomation in storeInfoArray[i]){
      console.log("3:", storeInfoArray[i]['storeName']);
      const storeInfo = 
        '<div id="content">' +
          '<div id="siteNotice">' +
          "</div>" +
          '<h1 style="font-size:20px;" id="firstHeading" class="firstHeading">' +
            storeInfoArray[i]['storeName'] +
          '</h1>' +
            '<div id="bodyContent">' +
              '<p>ひとこと:' + 
              storeInfoArray[i]['occupation'] +
              '</p>' +
              '<p>給料:' +
              storeInfoArray[i]['salary'] + 
              '</p>' +
              '<p><a href=' +
              storeInfoArray[i]['url'] +
                ">" +
                "募集サイトに移動する</a>" +
              '</p>' +
            "</div>" +
        "</div>";
        console.log(storeInfo);
      storeInfos.push(storeInfo);
    //}
  }
  console.log("last: ", storeInfos);
  return storeInfos;
  */
}

/*
//店舗情報
function getStoreInfo(){
  const storeInfoArray1 = {
    storeName :"セブン布橋",
    occupation :"接客業",
    salary :"$50",
    url :"https://www.shizuoka.ac.jp/",
  };

  const storeInfoArray2 = {
    storeName :"セブン文丘",
    occupation :"接客業",
    salary :"$40",
    url :"https://www.shizuoka.ac.jp/",
  };

  const storeInfoArray3 = {
    storeName :"ファミマ",
    occupation :"接客業",
    salary :"$30",
    url :"https://www.shizuoka.ac.jp/",
  };
  const storeInofArray=[storeInfoArray1,storeInfoArray2,storeInfoArray3];
  return storeInofArray;

}
*/


//情報ウィンドウ
function infoWindow(storeInfo, map, markers){
  //storeInfoには配列形式で、各募集店舗の情報が記載されたHTML要素が入っている。
  //markersには連想配列形式で、各店舗の位置情報が含まれている
  for(let i=0; i<storeInfo.length; i++){
    const info = storeInfo[i];
    console.log("info: ", info);
    console.log("oo",markers[i]['position']);
    
    const iwopts = {
      content: info,
      //maxWidth: 250,
      position: markers[i]['position'],
    };
    
    //for(const marker of markers){
    const infoWindow = new google.maps.InfoWindow(iwopts);
    markers[i].addListener("click", ()=> {
      infoWindow.open({
        anchor: markers[i],
        map,
        shouldFocus: false,
      });
    });
  }
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
      //circle = drawCircle(map, location);
     });
   });
 }




/*
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
 */


 

