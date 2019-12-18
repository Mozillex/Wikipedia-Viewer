const random = "https://en.wikipedia.org/wiki/Special:Random"; //random page suggested by fCC
const header = document.getElementById("header");
const input = document.querySelector("#searchInput");
const submit = document.getElementById("search-ctrls");
const clear = document.getElementById("clear");
const output = document.querySelector("#output");
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const wikiLogo = document.getElementById("wikiLogo");


function modalUp(e) {//displays the modal, and sets it's source to the caller's (a p element created by newSection Fx) href value
	e = e || window.event;
	var target = e.target || e.srcElement;
	modal.style.display = 'block';
	document.getElementById('wvFrame').src = this.getAttribute('href');
}

closeModal.onclick = function () {
	modal.style.display = 'none';
};

var addOn = false;

function newSection(data) { // creates a new ElementObject
	let ht = window.getComputedStyle(header).getPropertyValue("height");
	clear.style.marginTop = ht;
	let section = document.createElement('div');
	section.setAttribute('class', 'preview-section');
	var i = 0;
	globeToggle();

	data.map(x => {

		let e = document.createElement('div');
		e.setAttribute('class', 'preview-item');

		let h = document.createElement('h1');
		h.textContent = data[i].title;
		e.appendChild(h);

		let p = document.createElement('p');
		let url = data[i].fullurl;
		p.textContent = data[i].extract;
		p.setAttribute('href', url + '#modal');// this sets the href, which will be used by the modalUp Fx to display the modal
		p.setAttribute('name', 'p' + i);

		p.onclick = modalUp;

		e.appendChild(p);
		section.appendChild(e);

		i++;
	});

	let child = output.firstChild;
	output.insertBefore(section, child);
	letterGlobe = true;

	if (addOn) {
		var goTo = document.getElementById("clear");
		goTo.scrollIntoView({ behavior: 'smooth', block: 'end', inline: "end" });
	} else addon = true;

}



var wpAPI = function wpAPI() {

	let search = input.value;
	input.value = '';

	searchInput.blur();
	letterGlobe = undefined;

	if (!search) {// if field is empty
		alert("Please give me something I can search for.");
		return;
	}

	let wpParams = {
		endpoint: "https://en.wikipedia.org/w/api.php",
		options: {
			action: 'query',
			inprop: 'url',//['info','pageprops','pageimages','images,'categories','']!!
			//rvprop	:	'content',
			format: 'json',
			formatversion: '2',
			generator: 'search',
			origin: '*',
			errorformat: 'raw',
			//list	: 'search',
			gsrsearch: search,
			gsrwhat: 'text',
			prop: 'extracts|info|images',
			exsentences: 3,
			exintro: "",
			explaintext: "",
			exlimit: 20
		},
		string: function () {
			let arr = [];
			let options = this.options;
			for (var key in options) {
				arr.push(key + '=' + options[key]);
			}
			let str = this.endpoint + '?' + arr.join('&');
			return encodeURI(str);
		}
	};

	let uri = wpParams.string();
	console.log('uri = ' + uri);

	let request = new XMLHttpRequest();
	request.open('GET', uri, true);
	request.responseType = 'json';
	request.send();
	request.onload = function () {
		let response = request.response;
		let resultObj = response.query.pages;
		letterGlobe = false;
		newSection(resultObj);// * * * calls the function (newSection) to build the page with the reults * * *
	};
	request.onerror = () => alert("Network Error. Please try again.");
};

var letterGlobe = true;

var globeToggle = function globeToggle() {

	let image;

	if (letterGlobe == undefined) {
		return;
	}

	else if (letterGlobe) {
		image = "img/Wikipedia-Logo-Blank-Globe.png";
		// letterGlobe = false;
	} else if (!letterGlobe) {
		image = "img/Wikipedia-Logo-Merged.png";
		// letterGlobe = true;
	}
	wikiLogo.setAttribute('src', image);
	letterGlobe = undefined;
};

submit.onsubmit = (e) => {
	e.preventDefault();
	wpAPI();
};

wikiLogo.onclick = function () {
	modal.style.display = 'block';
	wvFrame.src = random;
};

let ht = window.getComputedStyle(header).getPropertyValue("height");
clear.style.marginTop = ht;