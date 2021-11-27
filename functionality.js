/*
	Links that helped me
		//https://stackoverflow.com/questions/6396101/pure-javascript-send-post-data-without-a-form
		setRequestHeader
		JSON.stringify
		https://stackoverflow.com/questions/9862167/positioning-div-element-at-center-of-screen/25416403
		https://stackoverflow.com/questions/15843391/div-height-set-as-percentage-of-screen
		https://stackoverflow.com/questions/12196885/text-flowing-out-of-div
		https://www.w3schools.com/howto/howto_css_star_rating.asp
		https://intellipaat.com/community/21064/how-to-change-an-elements-class-with-javascript
		https://stackoverflow.com/questions/7266069/adding-external-stylesheet-using-javascript
		https://stackoverflow.com/questions/59524026/content-shifts-slightly-on-page-reload-with-chrome
		https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
		https://stackoverflow.com/questions/34581440/text-extends-outside-button-html
		https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
		https://stackoverflow.com/questions/16206322/how-to-get-js-variable-to-retain-value-after-page-refresh
		https://stackoverflow.com/questions/28918232/how-do-i-persist-a-es6-map-in-localstorage-or-elsewhere
		https://stackoverflow.com/questions/8336812/way-to-insert-text-having-apostrophe-into-a-sql-table
*/

const xhr=new XMLHttpRequest();
	var data=null;
	xhr.onreadystatechange = function() {
	 if (xhr.readyState == 4) { // 4 means request is finished
		 if (xhr.status == 200) { // 200 means request succeeded
		    data=JSON.parse(xhr.responseText);
		    console.log(data);
		 } else {
		 }
	 }else{
	 }
	};
	xhr.open("post", "http://62.217.127.19:8010/ratings", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({movieList:[4306]}));

//localStorage.clear();
let movie_ratings;
if(localStorage.movie_ratings)
 	movie_ratings=new Map(JSON.parse(localStorage.movie_ratings));
else
	movie_ratings=new Map();

document.getElementById("search_results").addEventListener('submit',(e)=>{
	e.preventDefault();
	let key=document.getElementById("search_text").value;
	const xhr=new XMLHttpRequest();
	var data=null;
	xhr.onreadystatechange = function() {
	 if (xhr.readyState == 4) { // 4 means request is finished
		 if (xhr.status == 200) { // 200 means request succeeded
		    data=JSON.parse(xhr.responseText);
		    succesful(data);
		 } else {
		 }
	 }else{
	 }
	};
	xhr.open("post", "http://62.217.127.19:8010/movie", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	let apostrophe=key.indexOf("'");
	if(apostrophe>=0){
		key=key.substring(0,apostrophe+1)+"'"+key.substring(apostrophe+1);
	}
	xhr.send(JSON.stringify({keyword:key}));

	function succesful(data){
		var contentArea=document.getElementById("list");
		function removeAllChildNodes(parent) {
		    while (parent.firstChild) {
		        parent.removeChild(parent.firstChild);
		    }
		}
		removeAllChildNodes(document.getElementById("list"));
		console.log(data);
		if(data){
			var element = document.createElement("link");
			element.setAttribute("rel", "stylesheet");
			element.setAttribute("type", "text/css");
			element.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
			document.getElementsByTagName("head")[0].appendChild(element);
			for(let i=0; i<data.length; i++){
				let movie_div=document.createElement("div");
				movie_div.classList.add("movies");
				for(const props in data[i]){
					let movie_info=document.createElement("h1");
					let property=document.createTextNode(data[i][props]);
					movie_info.appendChild(property);
					movie_div.appendChild(movie_info);
				}
				var ratings=document.createElement("h1");
				let property=document.createTextNode("Ratings");
				ratings.appendChild(property);
				movie_div.appendChild(ratings);
				let stars=[];
				for(let j=0; j<5; j++){
					stars.push(document.createElement("span"));
					stars[j].classList.add('fa');
					stars[j].classList.add('fa-star');
					movie_div.appendChild(stars[j]);
				}
				for(let j=0; j<5; j++){
					for(let k=0; k<movie_ratings.get(data[i].movieId); k++){
						stars[k].classList.add('checked');
					}
					let rating=0;
					stars[j].addEventListener('click',saveRating(stars,j,data[i]));
				}
				contentArea.appendChild(movie_div);
			}
		}
	
	}
	function saveRating(stars,j,movie){
		return ()=>{
			let rating=j+1;
			for(let k=0; k<5; k++){
				if(k<=j)
					stars[k].classList.add('checked');
				else
					stars[k].classList.remove('checked');
			}
			movie_ratings.set(movie.movieId,rating);
			localStorage.movie_ratings = JSON.stringify(Array.from(movie_ratings.entries()));
		}
	}
});

