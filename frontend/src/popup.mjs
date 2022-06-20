"use stricts";
//import "popup.css";
//import fetch from 'node-fetch';
//import "es6-promise/auto";
//import "fetch-polyfill";

(function() {
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
  
  
  
    //  
  let userData2 = {
    commutingMethod: commutingMethod,
    commutingTime: commutingTime,
    workTime: workTime,
    occupation: occupations,
    favorite: favorite,
  };

  let userData ={
    name: 'sugiyama',  
  };
  

  /*
  
*/

/*
let length;
if(occupation.length<favorite.length){
  length = favorite.length;
}else{
  length = occupation.length;
}
//for(let i=0; i<length; i++){
  let blob1 = new Blob([commutingMethod.value],{type:"text/plan"});
  let blob2 = new Blob([commutingTime.value],{type:"text/plan"});
  let blob3 = new Blob([workTime.value],{type:"text/plan"});
  let link = document.createElement('a');
  link.href = URL.createObjectURL(blob1);
  link.href = URL.createObjectURL(blob2);
  link.href = URL.createObjectURL(blob3);
  link.download = 'userData.json';
  
//}
link.click();
*/
 
  //ボタンIDを取得して、クリックされたらmap.htmlを開く
  let searchButton = document.getElementById('mybtn');
    searchButton.addEventListener('click', () => {

      

      //const fetch = require('node-fetch');
      //-------------------------------------
      fetch('http://localhocst:8000/api/jobs/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: "piroshige aoki",
          gender: 1,
          age: 99,
          address: 'ほげふが住所',
          tel: '09011112222',
          })
      });
      //-------------------------------------

      /*
    //postData(userData);
    //function postData(userData){
      //fetch('http://localhocst:8080/userData.json', {
      fetch('http://localhocst:8000/api/jobs/search', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      .then(response => response.json())
      .then(userData => {
        console.log('Success:', userData);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    //}
    */


      /*
      const post = new XMLHttpRequest();
      post.open('POST','http://localhocst:8080/app.js');
      //post.open('POST','http://localhost:8080/userData.json');
      post.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
      post.send(currentPosition); 
      */
      open('map.html');
    });


    //const data = { username: 'example' };

    
     
})();