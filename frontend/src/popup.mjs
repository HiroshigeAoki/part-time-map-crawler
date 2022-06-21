"use stricts";
//import "popup.css";
//import fetch from 'node-fetch';
//import "es6-promise/auto";
//import "fetch-polyfill";

(function() {
  //ボタンIDを取得して、クリックされたらmap.htmlを開く
  let searchButton = document.getElementById('mybtn');
    searchButton.addEventListener('click', () => {
      // const query = get_query(); 
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

      res = search(query);

      console.log(res);
      
      open('map.html');
    });

})();

function get_query(){
  //origins = //ユーザの現在地
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
  //Search クエリードキュメント: http://localhost:8000/redoc#operation/search_api_jobs_search_post
  let query = JSON.stringify({
    //"origins": origins,
    "commute": {
      "travelMode": commutingMethod,
      "time": commutingTime
    },
    //workTime: workTime,
    "jc": occupations,
    "jmc": [],
    "preferences": favorite,
  });
  return query
}

function search(query){
  // JSONの取得
  fetch("http://localhost:8000/api/jobs/search",
  {
      method: 'POST',
      body: query,
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': ['http://localhost:8000/', 'http://localhost:8080/'] 
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