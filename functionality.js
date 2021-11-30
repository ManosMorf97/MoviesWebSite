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
		https://stackoverflow.com/questions/8206988/how-do-i-copy-a-map-into-a-duplicate-map
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

document.getElementById("interests").addEventListener('click',()=>{
	var users;
	var min_user=null;
	var users_ids=[];
	let movie_array=[...movie_ratings.keys()];
	console.log(movie_array);
	let min=[];
	min.push(Number.MAX_VALUE);
	function getUsers(movie_array,resolve,reject){
		let xhr=new XMLHttpRequest();	
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) { // 4 means request is finished
				 if (xhr.status == 200) { // 200 means request succeeded
				 	try{
				 		users=JSON.parse(xhr.responseText);
				 		users_ids=[];
				 		for(let i=0; i<users.length; i++)
				        	users_ids.push(...users[i].map(x=>x.userId));
				        users_ids=[...new Set(users_ids)];
				        step2(resolve);
				 	}catch(err){
				 		reject("Error");
				 	}
				    
				} else {
				 	
				 	//getUsers(movie_array.slice(0,movie_array.length/2),users,min,min_user,users_ids,resolve,reject,false);
				 	//getUsers(movie_array.slice(movie_array.length/2),users,min,min_user,users_ids,resolve,reject,false);
				 }
			}else{
		 	}
		};
		xhr.open("post", "http://62.217.127.19:8010/ratings", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({movieList:movie_array}));
	}
	let end=false;
	let bricks=1;
	while(!end){
		let p=new Promise((resolve,reject)=>{
			for(let i=0; i<bricks; i++){
				getUsers(movie_array.slice(i*movie_array.length/bricks,(i+1)*movie_array.length/bricks),resolve,reject);
			}
			end=true;
			resolve("Success");
		});
		p.then((message)=>{
			end=true;
			console.log(message);
		}).catch((message)=>{
			bricks++;
			end=false;
		});
	}
	

	async function step2(resolve){
		for(let i=0; i<users_ids.length; i++){
			let p=new Promise((resolve2,reject2)=>{
				const xhr=new XMLHttpRequest();
				var rated_movies=null;
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) { // 4 means request is finished
						if (xhr.status == 200) {
							rated_movies=JSON.parse(xhr.responseText);
						// 200 means request succeeded
						    findCorrelation(rated_movies,i);
						    resolve2("success");
						} else {
						 	reject2("Failure");
						}
					}else{
				 	}
				};
				xhr.open("get", "http://62.217.127.19:8010/ratings/"+users_ids[i], true);
				xhr.send();
			});
			p.then((message)=>{
			});
			await p;
		}
		resolve("Success")

	}
	function findCorrelation(rated_movies,i){
		let movie_ratings_array=new Map(movie_ratings);
		let correlated_movies=new Map();
		for(let i=0; i<rated_movies.length; i++){
			correlated_movies.set(rated_movies[i].movieId,rated_movies[i].rating);
		}




	}
	
});




