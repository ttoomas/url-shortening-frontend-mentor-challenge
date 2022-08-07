// HEADER - HAMBURGER ANIMATION

const header__toggle = document.querySelector(".header__toggle");
const body = document.querySelector("body");
const header = document.querySelector(".header");
const fadeElems = document.querySelectorAll(".has-fade")

header__toggle.addEventListener("click", () =>{
	if (header.classList.contains("open")){
		header.classList.remove("open");
		body.classList.remove("noscroll");
		header__toggle.classList.remove("open");
		fadeElems.forEach(function(element){
			element.classList.remove('fade-in');
			element.classList.add('fade-out');
		});
	}
	else{
		header.classList.add("open");
		body.classList.add("noscroll");
		header__toggle.classList.add("open");
		fadeElems.forEach(function(element){
			element.classList.remove('fade-out');
			element.classList.add('fade-in');
		});
	}
});


// LINKS
const inputField = document.querySelector(".short__input");
var button = document.querySelector(".short__button");

const linkContainer = document.querySelector(".link__container");


inputField.addEventListener("keyup", dataLoad);
button.addEventListener("click", dataLoad);

function dataLoad(e){
	if(e&&e.keyCode === 13){
		// console.log('entered');
		requestData(inputField.value);
	}
	else if(e.type=="click"){
		// console.log('clicked');
		requestData(inputField.value);
	}
}

function requestData(){
	const linkInput = inputField.value;
	// console.log(linkInput);

	fetch(`https://api.shrtco.de/v2/shorten?url=${linkInput}`)
	.then(res => res.json())
	.then(data => linkInfo(data))
}

function linkInfo(data){
	console.log(data);
	inputField.value = "";
	const shortPart = document.querySelector('.short__part');

	if(data.error_code == "1"){
		// console.log('error number 1 - no URL parameter');
		
		shortPart.classList.add('no-link-error');
		shortPart.classList.remove('no-valid-error');
	}
	else if(data.error_code == "2"){
		// console.log('error number 2 - not valid URL link')
		
		shortPart.classList.remove('no-link-error');
		shortPart.classList.add('no-valid-error');
	}
	else{
		// console.log("successful shortening of the URL link");
		shortPart.classList.remove('no-link-error');
		shortPart.classList.remove('no-valid-error');

			const shortLink = data.result.short_link;
			const originalLink = data.result.original_link;
			const shortLinkSub = shortLink.substring(shortLink.lastIndexOf('/') + 1);
			let idShortLink = 'id' + shortLinkSub;

			var apiDataLinks = `
				<div class="link__item">
					<p class="link__item__original">${originalLink}</p>
					<div class="link__bx">
						<a href="https://${shortLink}" id="${idShortLink}" class="link__item__short">${shortLink}</a>
						<button id="button${idShortLink}" onclick="copyButton('${idShortLink}')" class="link__item__button copy">Copy</button>
						</div>
				</div>
			`;
			// <button id="del${idShortLink}" onclick="deleteButton('${idShortLink}')" class="link__item__button copy" style="background: red;">Delete</button>

			const apiShortLink = `${data.result.short_link}`

			linkContainer.insertAdjacentHTML('afterbegin', apiDataLinks);

			// Add margin to first shorted link
			linkContainer.style.margin="1.5rem 0 0 0";

			// Local Storage load data
			const key = apiDataLinks;
			localStorage.setItem(originalLink, key);
	}
}

// Local Storage get items
for (let i = 0; i < localStorage.length; i++){
	const key = localStorage.key(i);
	const value = localStorage.getItem(key);
	// console.log(value);
	linkContainer.insertAdjacentHTML('afterbegin', value);

	// Add margin to first shorted link
	linkContainer.style.margin="1.5rem 0 0 0";
}

// Local Storage delete item
// function deleteButton(){
// 	console.log('click');

// 	for (let i = 0; i < localStorage.length; i++){
// 		const key = localStorage.key(i);
// 		const value = localStorage.removeItem(key);
// 	}
// }


// COPY TO CLIPBOARD
function copyButton(id){
	const shortLink = document.querySelector('#' + id);
	navigator.clipboard.writeText(shortLink.innerText);
	// Add and remove class for clicked button
	const button = document.querySelector("#button" + id);
	button.innerHTML = `Copied!`
	button.classList.add('copied');
	button.classList.remove('copy');
}
