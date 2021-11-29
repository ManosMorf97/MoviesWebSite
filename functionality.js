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
		https://stackoverflow.com/questions/27612713/convert-es6-iterable-to-array
		https://www.w3schools.com/jsref/jsref_max_value.asp
		https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
		https://www.youtube.com/watch?v=DHvZLI7Db8E&t=289s
		https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
*/
//localStorage.clear();
let movie_ratings;
if(localStorage.movie_ratings)
 	movie_ratings=new Map(JSON.parse(localStorage.movie_ratings));
else
	movie_ratings=new Map();

function apostropheKey(key){
	let apostrophe=key.indexOf("'");
	if(apostrophe>=0){
		return key.substring(0,apostrophe+1)+"'"+apostropheKey(key.substring(apostrophe+1));
	}else{
		return key;
	}
}

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
	key=apostropheKey(key);
	xhr.open("post", "http://62.217.127.19:8010/movie", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
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
function getData(data,begining,ending,array){
	if (begining>array.length-1){
		return data;
	}
	const xhr=new XMLHttpRequest();	
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) { // 4 means request is finished
			if (xhr.status == 200) { // 200 means request succeeded
			    data.push(JSON.parse(xhr.responseText));
			    console.log(data)
			    getData(data,ending,ending+ending-begining,array);
			} else {
			}
			}else{
		}
	};
	xhr.open("post", "http://62.217.127.19:8010/ratings", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({movieList:array.slice(begining,ending)}));
}

document.getElementById("interests").addEventListener('click',()=>{
	var users=[];
	users.push(null);
	var min_user=[null];
	var users_ids=[];
	let movie_array=[...movie_ratings.keys()];
	console.log(movie_array);
	let min=[]
	min.push(Number.MAX_VALUE);
	function getUsers(movie_array,users,min,min_user,users_ids,resolve,reject,permision){
		const xhr=new XMLHttpRequest();	
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) { // 4 means request is finished
				 if (xhr.status == 200) { // 200 means request succeeded
				    users[0]=JSON.parse(xhr.responseText);
				    users_ids.push(...users[0][0].map(x=>x.userId));
				    console.log(users_ids);
				 } else {
				 	getUsers(movie_array.slice(0,movie_array.length/2),users,min,min_user,users_ids,resolve,reject,false);
				 	getUsers(movie_array.slice(movie_array.length/2),users,min,min_user,users_ids,resolve,reject,false);
				 }
				 if(permision)
					resolve("Success");
			}else{
		 	}
		};
		xhr.open("post", "http://62.217.127.19:8010/ratings", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({movieList:movie_array}));
	}
	let p=new Promise((resolve,reject)=>{
		getUsers(movie_array,users,min,min_user,users_ids,resolve,reject,true);
	});
	p.then((message)=>{
		console.log(message)
		users_ids=[...new Set(users_ids)];
		console.log(users_ids)
		step2(movie_ratings,movie_array,min,min_user,users_ids,0);
	});

	function step2(movie_ratings,movie_array,min,min_user,users_ids,i){
		if(i==users_ids.length) return;
		let p=new Promise((resolve,reject)=>{
			const xhr=new XMLHttpRequest();	
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) { // 4 means request is finished
					if (xhr.status == 200) {
					// 200 means request succeeded
					    findCorrelation(movie_ratings,min,min_user);
					    resolve("success");
					} else {
					 	reject("Failure");
					}
				}else{
			 	}
			};
			xhr.open("get", "http://62.217.127.19:8010/ratings/"+users_ids[i], true);
			xhr.send();
		});
		p.then((message)=>{
			step2(movie_array,min,min_user,users_ids,i+1);
		})

	}
	function findCorrelation(movie_ratings,min,min_user){
		console.log("W")

	}
	
});




