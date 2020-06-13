const icons = document.getElementsByTagName('img');
var length = icons.length;

for(var i=0; i<length; i++){
    icons[i].addEventListener('mouseover', (e) => {
        let str = e.target.src;
        e.target.src = str.replace("Out.png", "Over.png");
    });
    
    icons[i].addEventListener('mouseout', (e) => {
        let str = e.target.src;
        e.target.src = str.replace("Over.png", "Out.png");
    });
}



