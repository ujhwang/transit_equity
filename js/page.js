const gra = function(min, max) {
    return Math.random() * (max - min) + min;
}

const init = function(){
	let items = document.querySelectorAll('section');
	for (let i = 0; i < items.length; i++){
		items[i].style.background = "#080C16";
	}
}

init();


// Common attributes/

// Color set
const color_3class = ["#fffacf", "#e69191", "#b55353", "#a780d9", "#fffbcf", "#e69291", "#663d9c", "#a781d9", "#fffccf"]

const color_3class_darker = []
color_3class.forEach((item, i) => {
    color_3class_darker.push(d3.hsv(item).darker(4).formatHex())
});

const color_3class_14 = {
    'A1': color_3class[0],
    'A2': color_3class[1],
    'A3': color_3class[2],
    'B1': color_3class[3],
    'B2': color_3class[4],
    'B3': color_3class[5],
    'C1': color_3class[6],
    'C2': color_3class[7],
    'C3': color_3class[8],
};

//Convert dropdown into nice looking css
NiceSelect.bind(document.getElementById("demandEqu"));