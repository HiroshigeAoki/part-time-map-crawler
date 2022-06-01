"use stricts";
//import "popup.css";

(function() {
  //ユーザの希望条件を取得
  const commutingMethod = document.getElementById("commuting_method");
  const commutingTime = document.getElementById("commuting_time");
  const workTime = document.getElementById("work_time");
  const profession = document.getElementById("profession");
  const favorite = document.getElementById("favorite");
  //ボタンIDを取得して、クリックされたらmap.htmlを開く
  let searchButton = document.getElementById('mybtn');
    searchButton.addEventListener('click', () => {
      open('map.html');
    });
     
})();

