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

//---------位置情報取得----
if (navigator.geolocation) {
  // Geolocation APIに対応している
}
else {
  // Geolocation APIに対応していない
  alert("この端末では位置情報が取得できません");
}

 //APIキー取得
const apiOptions = {
    apiKey: "AIzaSyA4jvwp5FVdxzVhl5cZbsNqKN_WjDlQcgw"
}
const loader = new Loader(apiOptions);

 //メソッド
loader.load().then(() => {
  console.log('Maps JS API loaded');
  navigator.geolocation.getCurrentPosition(success, error)
  function success(position) {
      const latlng = {"lng": position.coords.longitude, "lat": position.coords.latitude}
      console.log("latlngの表示:",latlng);

      //ユーザー希望条件を取得して、ネストでbackendに送信する。
      const query = getUserData(latlng);
      console.log(JSON.parse(query).origins)
      console.log("クエリ：",query);//OK
      //ユーザー希望条件をbackendに送信するメソッド
      search(query).then(results => {
        console.log("検索結果", results)
        //map作成、中心地設定
        if (results.length > 0){
          const map = createMap(latlng);
          getStoreInfo(map, results)
          //addResults(map, results)
        } else{
          createMap(latlng);
        }
      });
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
});


//----------メソッド------
//commutingなどをpopup.jsから受け取るメソッド
function getUserData(latlng){
    //複数クエリを受け取っている
    let paramsString = window.location.search;
    let searchParams = new URLSearchParams(paramsString);
    let query = JSON.stringify({
        "origins": latlng,
        "commute": {
          "travelMode": searchParams.getAll("commuting_method")[0],
          "time": searchParams.getAll("commuting_time")[0]
        },
        //workTime: workTime,
        "jc": searchParams.getAll("occupation"),
        "jmc": [],
        "es": [],
        "preferences": searchParams.getAll("favorite"),
    });
    return query;
}

//クエリ情報をバックエンドに送るメソッド
async function search(query){
  // JSONの取得
  const response = await fetch("http://localhost:8000/api/jobs/search",{
        method: 'POST',
        body: query,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then(res => {
        if(res.ok){
            console.log("検索成功!")
            return res.json()
        }
        else if(res.status==404){
          alert("選択した条件では見つかりませんでした。")
          return []
        }
        else if(res.status==442){
          alert("検索条件が不正です。("+res.text()+")")
          return []
        }
        else{
            res.text().then(err => {
              console.log(err)
              alert(err)
              throw Prommise.reject(new Error(err))
            })
        }
    })
  const results = await response
  return results
}

//中心地の設定
function createMap(latlng) {
    const mapOptions = {
        center: latlng ,
        zoom: 15
    };
    const mapDiv = document.getElementById('map');
    return new google.maps.Map(mapDiv, mapOptions);
}

//希望条件に会った店舗情報をjsonから読み込む
function getStoreInfo(map, results){
    var JSONArray =[];  
    const nameArray = [];
    const comentArray = [];
    const salaryArray = [];
    const urlArray = [];
    const latArray = [];
    const lngArray = [];

    //console.log("やんね？",results[0].name);//リヴォイス
    //console.log(results.length);//20
    //const array =[results[0].name ,results[1].name];
    //console.log('arrayDETH',array);
    for(let i = 0; i<results.length; i++){
        //店舗名取得
        const name = results[i].name;
        nameArray.push(name);

        //店舗からの一言
        const coment = results[i].job_title;
        comentArray.push(coment);

        //給料情報
        const salary = results[i].wages;
        salaryArray.push(salary);

        //募集記事サイトURL
        const url = results[i].url;
        urlArray.push(url);

        //店舗位置情報取得
        const latlng = results[i].loc.coordinates;
        //緯度
        const storeLat = latlng[1];
        //経度
        const storeLng = latlng[0];
        console.log("latlng",storeLat,storeLng);
        latArray.push(storeLat);
        lngArray.push(storeLng);
  }
    //console.log(nameArray[0]);//理ヴォイス
    //console.log('return1',JSONArray[0]);//名前全体の配列が表示される

    //console.log("どうかなー",nameArray);
    //console.log("どうかなーながさ",nameArray.length);
    JSONArray.push(nameArray);
    JSONArray.push(comentArray);
    JSONArray.push(salaryArray);
    JSONArray.push(urlArray);
    JSONArray.push(latArray);
    JSONArray.push(lngArray);
    //console.log('でるかな〜？',JSONArray);

    //html要素の作成
    const storeInfoHTML = workPlaceInfo(JSONArray);
    //位置情報をマーカーして、マーカーを変える。
    const markers = addMarkers(map,JSONArray);
    //情報ウィンドウ
    infoWindow(storeInfoHTML,map,markers);
    //近くの店舗を群で表示
    clusterMarkers(map, markers);
    //押したピンを中心に
    addPanToMarker(map, markers);
    return JSONArray
}

//店舗位置情報から、マーカーを加えるメソッド
function addMarkers(map, results) {
    console.log("確認です",results);
    //results[4]が各店舗の緯度、results[5]が経度

    console.log("全体の確認です",results);
    console.log("長さの確認です",results[0]);
    console.log("緯度の確認です",results[0][4]);

    const latlngs =[];
    for(let i =0; i <results[4].length; i++){
        const latlng = {
            lat: results[4][i], 
            lng: results[5][i] 
        }
        latlngs.push(latlng);
        console.log("e--",latlng);
    }

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
}

//募集情報を受け取るメソッド(HTMLバージョン）
function workPlaceInfo(results){
  //jsonから取得した店舗名が入った配列
  const nameArray = results[0];
  //jsonから取得した店舗からの一言が入った配列
  const comentArray = results[1];
  //jsonから取得した給料情報が入った配列
  const salaryArray = results[2];
  //jsonから取得した募集URLが入った配列
  const urlArray = results[3];

  const storeInfos =[];
  for(let i =0; i< results.length ; i++){
    for(let j =0; j< results[i].length ; j++){
      const storeInfo = 
        '<div id="content">' +
          '<div id="siteNotice">' +
          "</div>" +
          '<h1 style="font-size:20px;" id="firstHeading" class="firstHeading">' +
            results[0][j] +
          '</h1>' +
            '<div id="bodyContent">' +
              '<p><コメント> ' + 
              results[1][j] +
              '</p>' +
              '<p><給料> ' +
              results[2][j] + 
              '</p>' +
              '<p><a href=' +
              results[3][j] +
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
}


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