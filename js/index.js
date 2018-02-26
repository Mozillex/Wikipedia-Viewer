var random = "https://en.wikipedia.org/wiki/Special:Random"; //random page suggested by fCC
var input = document.querySelector("#searchInput");
var output = document.querySelector("#output");
var modal = document.getElementById('modal');
var closeModal = document.getElementById('closeModal');


function modalUp(e){//displays the modal, and sets it's source to the caller's (a p element created by newSection Fx) href value
	e = e || window.event;
	var target = e.target || e.srcElement;
	modal.style.display = 'block';
	document.getElementById('wvFrame').src = this.getAttribute('href');
}

closeModal.onclick = function(){
	modal.style.display = 'none';
}

var addOn = false;

function newSection(data){ // creates a new ElementObject

	let section= document.createElement('div');
	section.setAttribute('class','preview-section');
	var i=0;
	globeToggle();

	data.map(x=>{

		let e = document.createElement('div');
		e.setAttribute('class','preview-item');

		let h = document.createElement('h1');
		h.textContent = data[i].title;
		e.appendChild(h);

		let p = document.createElement('p');
		let url = data[i].fullurl;
		p.textContent = data[i].extract;
		p.setAttribute('href',url+'#modal');// this sets the href, which will be used by the modalUp Fx to display the modal
		p.setAttribute('name','p'+i);

		p.onclick = modalUp;

		e.appendChild(p);
		section.appendChild(e);

		i++;
	});

	let child = (output.firstChild);
	output.insertBefore(section,child);
	letterGlobe = true;

	if (addOn){
		output.scrollIntoView.behavior='smooth';
		output.scrollIntoView();
	}
	// output.scrollIntoView(addOn);

	addOn = true;
}



var wpAPI = function wpAPI(){

	let search = input.value;
	input.value = '';

	searchInput.blur();
	letterGlobe = undefined;

	if (!search){// if field is empty
		alert("Please give me something I can search for.");
		return;
	}

	let wpParams = {
		endpoint	: "https://en.wikipedia.org/w/api.php",
		options	:	{
			action	: 'query',
			inprop	: 'url',//['info','pageprops','pageimages','images,'categories','']!!
			//rvprop	:	'content',
			format	: 'json',
			formatversion	: '2',
			generator	: 'search',
			origin	:	'*',
			errorformat	: 'raw',
			//list	: 'search',
			gsrsearch	:	search,
			gsrwhat	:	'text',
			prop	:	'extracts|info|images',
			exsentences	: 3,
        	exintro	: "",
        	explaintext	: "",
        	exlimit	: 20
			},
		string : function() {
			let arr = [];
			let options = this.options;
			for (var key in options) {
				arr.push(key + '=' + options[key]);
				}
			let str = this.endpoint +'?'+ arr.join('&');
			return encodeURI(str);
		}
	}

	let uri = wpParams.string();
	console.log('uri = ' + uri);

	let request = new XMLHttpRequest;
	request.open('GET',uri,true);
	request.responseType = 'json';
	request.send();
	request.onload = function(){
		let response = request.response;
		let resultObj = response.query.pages;
		letterGlobe = false;
		newSection(resultObj);// * * * calls the function (newSection) to build the page with the reults * * *
	}
//need to add in an error handler
};

var letterGlobe = true;

var globeToggle = function globeToggle(){

	let image;
	let logo = document.getElementById("wikiLogo");

	if (letterGlobe == undefined){
	 	return;
	 }

	else if (letterGlobe){
		image= "img/Wikipedia-Logo-Blank-Globe.png";
		// letterGlobe = false;
	} else if (!letterGlobe){
		image= "img/Wikipedia-Logo-Merged.png";
		// letterGlobe = true;
	}
	logo.setAttribute('src',image);
	letterGlobe = undefined;
}

//document.getElementById("wikiLogo").onclick = globeToggle;
document.getElementById("search-ctrls").onsubmit = wpAPI;

document.getElementById("wikiLogo").onclick = function(){
	modal.style.display = 'block';
	wvFrame.src = random;
}

//document.getElementById('modal').style.display = block;//.setAttribute('display', 'block');
//document.getElementById('wvFrame').src = random;


/*
	var createCallBack = function(x) {
			var num = 1;
			var callbackID;
			do {
				callbackID = 'callback' + num;
				num++;
				} while (window[callbackID]);
			window[callbackID] = x;
			return callbackID;
	}; */



		 /* * * Constructor to build the callbacks, which process the JSON results */
/* 	return function(x) {
		options.format = 'json';
		options.callback = createCallback(x);
		options.action = 'query';
		var script = document.createElement('script');
		script.src = endpoint + '?' + queryStr(options);
		var output = document.getElementsById('output')[0];
		output.appendChild(script);

	} */
