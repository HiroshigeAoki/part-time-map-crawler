//"use stricts";
//import "popup.css";
//import fetch from 'node-fetch';
//import "es6-promise/auto";
//import "fetch-polyfill";

 //モジュールインポート
 //import { Loader } from '@googlemaps/js-api-loader';
//import MarkerClusterer from '@google/markerclustererplus';

(function() {
  //ボタンIDを取得して、クリックされたらmap.htmlを開く
  let searchButton = document.getElementById('mybtn');
    searchButton.addEventListener('click', () => {
    //ユーザの希望条件を取得
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
  
  let query =[commutingMethod,commutingTime,workTime,occupations,favorite];
  console.log("クエリまつり:",query);

    open('map.html');
  });

})();