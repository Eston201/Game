import {Level1} from './level1.js'
// export {Manager}
var LV1 = document.getElementById("Level1");
var LV2 = document.getElementById("Level2");
var LV3 = document.getElementById("Level3");

LV1.onclick = function(){
  document.getElementById('div').style.display = 'none';
  const lv1 = new Level1();
}
//for later 
// LV2.onclick = function(){
//   document.getElementById('div').style.display = 'none';
//   const lv2 = new Level2();
// }
// LV3.onclick = function(){
//   document.getElementById('div').style.display = 'none';
//   const lv3 = new Level3();
// }
