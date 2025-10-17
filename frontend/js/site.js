(function(){
function initTheme(){
const sel=document.querySelector('#themeSelect');
if(!sel) return;
sel.addEventListener('change',()=>{
document.documentElement.setAttribute('data-theme', sel.value);
localStorage.setItem('zy_theme', sel.value);
});
const saved=localStorage.getItem('zy_theme');
if(saved){
document.documentElement.setAttribute('data-theme', saved);
sel.value=saved;
}
}
document.addEventListener('DOMContentLoaded', initTheme);
})();
