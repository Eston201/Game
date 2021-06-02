import {Level1} from './level1.js'
// export {Manager}
var LV1 = document.getElementById("Level1")

LV1.onclick = function(){
  document.body.innerHTML = "";
   LV1.style.display = "none"
  const lv1 = new Level1();
}
