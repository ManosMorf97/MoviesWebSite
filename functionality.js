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
		https://stackoverflow.com/questions/14824283/convert-a-2d-javascript-array-to-a-1d-array
		https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
		https://www.codegrepper.com/code-examples/javascript/find+intersection+of+two+arrays+es6
		https://stackoverflow.com/questions/35341696/how-to-convert-map-keys-to-array
*/
//localStorage.clear();
let object ={};
if(localStorage.movie_ratings)
 	object.movie_ratings=new Map(JSON.parse(localStorage.movie_ratings));
else
	object.movie_ratings=new Map();
console.log(object.movie_ratings.keys())

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
	search(object);
});
	function search(object){
		let key=document.getElementById("search_text").value;
		const xhr=new XMLHttpRequest();
		function request(xhr){
			return()=>{
				if (xhr.readyState == 4) { // 4 means request is finished
					if (xhr.status == 200) { // 200 means request succeeded
					    let data=JSON.parse(xhr.responseText);
					    succesful(data,object);
					} else {
					}
				}else{
				}
			}
		}
		xhr.onreadystatechange = request(xhr)
		key=apostropheKey(key);
		xhr.open("post", "http://62.217.127.19:8010/movie", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({keyword:key}));

		function succesful(data,object){
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
						for(let k=0; k<object.movie_ratings.get(data[i].movieId); k++){
							stars[k].classList.add('checked');
						}
						let rating=0;
						stars[j].addEventListener('click',saveRating(stars,j,data[i],object));
					}
					contentArea.appendChild(movie_div);
				}
			}
		
		}
		function saveRating(stars,j,movie,object){
			return ()=>{
				let rating=j+1;
				for(let k=0; k<5; k++){
					if(k<=j)
						stars[k].classList.add('checked');
					else
						stars[k].classList.remove('checked');
				}
				object.movie_ratings.set(movie.movieId,rating);
				localStorage.movie_ratings = JSON.stringify(Array.from(object.movie_ratings.entries()));
			}
		}
	}
	

document.getElementById("interests").addEventListener('click',clickInterests(object));
	/*var users;
	var min_user=null;
	let min=[];
	min.push(Number.MAX_VALUE);
	*/
function clickInterests(object){
	return function step1(){
		movie_array=[...object.movie_ratings.keys()];
		let end=false;
		let bricks=1;
		while(!end){
		    object.users=new Array(bricks);
		    let broken=false;
			for(let i=0; i<bricks; i++){	
				if(!getUsers(movie_array.slice(i*movie_array.length/bricks,(i+1)*movie_array.length/bricks),i,object)){
					broken=true;
					break;
				}
			}
	        if(broken){
	        	bricks++;
	        }else{
	        	end=true;
	        }
			console.log("Great");
			console.log(bricks);
		}
	}
}


async function getUsers(movie_array,index,object){
	try{
		let users_ids=[];
		const xhr= new XMLHttpRequest();
		function request(xhr,object,users_ids,index){
			return ()=>{
				if (xhr.readyState == 4) { // 4 means request is finished
					if (xhr.status == 200) {
						object.users[index]=JSON.parse(xhr.responseText);
						for(const user of object.users[index]){
							users_ids.push(...user.map(x=>x.userId));
						}
					// 200 means request succeeded
					    step2(users_ids,index,object);
					} else {
					}
				}else{
		 		}
			}
		}
		xhr.onreadystatechange = request(xhr,object,users_ids,index);
		xhr.open("post", "http://62.217.127.19:8010/ratings", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({movieList:movie_array}));
		return true;
	}catch(error){
		return false;
	}
}

function step2(users_ids,index,object){
	users_ids=[...new Set(users_ids)];
	let movies=[].concat(...object.users[index])
	console.log("rated_movies")		
	for(let i=0; i<users_ids.length; i++){
		let rated_movies=[];
		for(const element of movies){
			if(element.userId==users_ids[i])
				rated_movies.push(element)
		}
		findCorrelation(rated_movies,i,object);
	}

}

function findCorrelation(rated_movies,i,object){
	let map_rated_movies=new Map();
	for(const element of rated_movies)
		map_rated_movies.set(element.movieId,element.rating)
	let common_movies=getArraysIntersection([...rated_movies.keys()],[...object.movie_ratings.keys()]);
	let my_ratings=[];
	let their_ratings=[];
	for(const movie of common_movies){
		my_ratings.push(movie_ratings.get(movie));
        their_ratings.push(correlated_movies.get(movie))
	}
	//formula in google
	console.log("DONE")
}
function getArraysIntersection(a1,a2){
	return  a1.filter(function(n) { return a2.indexOf(n) !== -1;});
}


