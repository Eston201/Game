import {Level1} from './level1.js'
import {Level2} from './level2.js'
import {Level3} from './level3.js'
// export {Manager}
var LV1 = document.getElementById("Level1");
var LV2 = document.getElementById("Level2");
var LV3 = document.getElementById("Level3");

LV1.onclick = function(){
  document.body.style.cursor = 'none';
  document.getElementById('div').style.display = 'none';
  let lv1 = new Level1();
}
//for later
LV2.onclick = function(){
  document.body.style.cursor = 'none';
   document.getElementById('div').style.display = 'none';
   const lv2 = new Level2();
 }

LV3.onclick = function(){
  document.body.style.cursor = 'none';
  document.getElementById('div').style.display = 'none';
  const lv3 = new Level3();
}
