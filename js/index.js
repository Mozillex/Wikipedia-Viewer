var random = "https://en.wikipedia.org/wiki/Special:Random"; //random page suggested by fCC
var input = document.querySelector("#searchInput");
var output = document.querySelector("#output");
var modal = document.getElementById('modal');
//var modalLinks = {};

function modalUp(e){
	e = e || window.event;
	var target = e.target || e.srcElement;
	modal.style.display = 'block';
	document.getElementById('wvFrame').src = this.getAttribute('href');
}

document.getElementById('closeModal').onclick = function(){
	modal.style.display = 'none';
};

function newSection(data){ // creates a new ElementObject

	let section= document.createElement('div');
	section.setAttribute('class','preview-section');
	var i=0;;
	data.map(x=>{

		let e = document.createElement('div');
		e.setAttribute('class','preview-item');

		let h = document.createElement('h1');
		h.textContent = data[i].title;
		e.appendChild(h);

		let p = document.createElement('p');
		let url = data[i].fullurl;
		p.textContent = data[i].extract;
		p.setAttribute('href',url+'#modal');
		p.setAttribute('name','p'+i);

		p.onclick = modalUp;
		
		console.log('addSource Fx url is: '+ url);

		//p.preventDefault();//should 'p.' be 'this.' ?
		e.appendChild(p);
		section.appendChild(e);

		i++;
	});
	let child = (output.firstChild);
	output.insertBefore(section,child);
}

function wpAPI(){

	var search = input.value;
	console.log(search);

	if (!search){// if field is empty
		alert("Please give me something I can search for.")
		console.log("user entered no data");
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

		newSection(resultObj);
	}

};
var blankGlobe = true;
document.getElementById("header-logo").onclick = function(){
	var src;
	if (blankGlobe){
		src= "img/Wikipedia-Logo-Merged.png";
		blankGlobe = false;
	} else {
		src= "img/Wikipedia-Logo-Blank-Globe.png";
		blankGlobe = true;
	}

	document.getElementById("wikiLogo").setAttribute('src',src);
};


/* document.addEventListener("DOMContentLoaded",function(){
	if (window.location.href.indexOf('#modal')!==-1){
		 document.getElementById('modal').setAttribute('display','block');
		 }
}); */
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
