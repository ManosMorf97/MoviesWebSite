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
		https://stackoverflow.com/questions/8159524/javascript-pushing-element-at-the-beginning-of-an-array
		https://www.w3schools.com/jsref/jsref_shift.asp

*/
//localStorage.clear();
let movie_ratings;
if(localStorage.movie_ratings)
 	movie_ratings=new Map(JSON.parse(localStorage.movie_ratings));
else
	movie_ratings=new Map();
console.log(movie_ratings.keys())

function apostropheKey(key){
	let apostrophe=key.indexOf("'");
	if(apostrophe>=0){
		return key.substring(0,apostrophe+1)+"'"+apostropheKey(key.substring(apostrophe+1));
	}else{
		return key;
	}
}
/*function step3(min_user){
	const xhr= new XMLHttpRequest();
	let data=null;
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) { // 4 means request is finished
				if (xhr.status == 200) {
					data=JSON.parse(xhr.responseText);
					data=[].concat(...data);
					data=data.filter(x=>x.rating>=4);
					console.log(data);
					showMovies(data);
				// 200 means request succeeded
				} else {
				}
			}else{
		 	}
		};
		xhr.open("get", "http://62.217.127.19:8010/ratings/"+min_user, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send();
}

function showMovies(data){
		data=data.filter(x=>x.rating>=4);
		let correlated_movies=new Array(data.length);
		let promise=new Promise((resolve,reject)=>{
			for(let i=0; i<data.length; i++){
				const xhr= new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) { // 4 means request is finished
						if (xhr.status == 200) {
							correlated_movies[i]=JSON.parse(xhr.responseText);
							console.log(correlated_movies[i]);
							if(i==data.length-1)
								resolve("Success");
						// 200 means request succeeded
						} else {
						}
					}else{
				 	}
				};
				xhr.open("get", "http://62.217.127.19:8010/movie/"+data[i].movieId, true);
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.send();
			}

		});
		promise.then((message)=>{
			successful([].concat(...correlated_movies));
		})
		
	}
step3(7047)
*/
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function successful(data){
	var contentArea=document.getElementById("list");
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

document.getElementById("search_results").addEventListener('submit',(e)=>{
	e.preventDefault();
	let key=document.getElementById("search_text").value;
	const xhr=new XMLHttpRequest();
	var data=null;
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) { // 4 means request is finished
			if (xhr.status == 200) { // 200 means request succeeded
			    data=JSON.parse(xhr.responseText);
			    successful(data);
			} else {
			}
		}else{
		}
	};
	key=apostropheKey(key);
	xhr.open("post", "http://62.217.127.19:8010/movie", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({keyword:key}));



	
});

document.getElementById("interests").addEventListener('click',()=>{

	removeAllChildNodes(document.getElementById("list"));
	var users;
	var min_user;
	let movie_array=[...movie_ratings.keys()];
	let min;
	let end=false;
	let bricks=1;
	while(!end){
	    users=new Array(bricks);
		let p=new Promise((resolve,reject)=>{
			min=[];
            min_user=[];
			for(let i=0; i<bricks; i++){
				min.push(0);
				min_user.push(null);	
				if(!getUsers(movie_array.slice(i*movie_array.length/bricks,(i+1)*movie_array.length/bricks),i)){
					reject("Error");
				}
			}
			end=true;
			resolve("Success")
		});
		p.then((message)=>{
			end=true;
			console.log(message);
			console.log(bricks);
		})
		p.catch((message)=>{
			bricks++;
			end=false;
		});
	}
	let min2=min[0];
	let min_user2=min_user[0];
	for(let i=1; i<bricks; i++)
		if(min2<min[i]){
			min2=min[i];
			min_user2=min_user[i];
		}
	console.log(min_user2)
	step3(min_user2);

	
	async function getUsers(movie_array,index){
		try{
			let users_ids=[];
			const xhr= new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) { // 4 means request is finished
					if (xhr.status == 200) {
						users[index]=JSON.parse(xhr.responseText);
						for(const user of users[index]){
							users_ids.push(...user.map(x=>x.userId));
						}
					// 200 means request succeeded
					    step2(users_ids,index);
					} else {
					}
				}else{
			 	}
			};
			xhr.open("post", "http://62.217.127.19:8010/ratings", false);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.send(JSON.stringify({movieList:movie_array}));
			return true;
		}catch(error){
			return false;
		}
	}

	function step2(users_ids,index){
		users_ids=[...new Set(users_ids)];
		console.log(users_ids.length);
		let movies=[].concat(...users[index])
		console.log("rated_movies")
		console.log(movies);		
		for(let i=0; i<users_ids.length; i++){
			let rated_movies=movies.filter(x=>x.userId==users_ids[i]);
			findCorrelation(rated_movies,users_ids[i],index);
		}

	}

	function findCorrelation(rated_movies,user,index){
		let map_rated_movies=new Map();
		rated_movies.forEach(element=>map_rated_movies.set(element.movieId,element.rating))
		let common_movies=getArraysIntersection([...map_rated_movies.keys()],[...movie_ratings.keys()]);
		if(common_movies.length==0) return;
		let my_ratings=[];
		let their_ratings=[];
		common_movies.forEach(function(movie){
			my_ratings.push(movie_ratings.get(movie));
            their_ratings.push(map_rated_movies.get(movie))
		})//formula in google
		let my_ratings_mean=my_ratings.reduce((x,y)=>x+y)/common_movies.length;
		let their_ratings_mean=their_ratings.reduce((x,y)=>x+y)/common_movies.length;
		my_ratings.unshift(0);
		their_ratings.unshift(0);
		let my_ratings_sd=Math.sqrt(my_ratings.reduce((x,y)=>x+Math.pow(y-my_ratings_mean,2)));
		let their_ratings_sd=Math.sqrt(their_ratings.reduce((x,y)=>x+Math.pow(y-their_ratings_mean,2)));
        my_ratings.shift()
        their_ratings.shift()
        let cov=0
        for(let i=0; i<my_ratings.length; i++){
        	cov+=(my_ratings[i]-my_ratings_mean)*(their_ratings[i]-their_ratings_mean);
        }
        let r=cov/(my_ratings_sd*their_ratings_sd);
        if(r<=min[index]){
        	min[index]=r;
        	min_user[index]=user;
        }
       
	}

	function getArraysIntersection(a1,a2){
    	return  a1.filter(function(n) { return a2.indexOf(n) !== -1;});
	}

	function step3(min_user){
		const xhr= new XMLHttpRequest();
		let data=null;
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) { // 4 means request is finished
					if (xhr.status == 200) {
						data=JSON.parse(xhr.responseText);
						showMovies(data);

					// 200 means request succeeded
					} else {
					}
				}else{
			 	}
			};
			xhr.open("get", "http://62.217.127.19:8010/ratings/"+min_user, true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.send();
			console.log("GO")
	}

	function showMovies(data){
		data=data.filter(x=>x.rating>=4);
		let correlated_movies=new Array(data.length);
		let promise=new Promise((resolve,reject)=>{
			for(let i=0; i<data.length; i++){
				const xhr= new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) { // 4 means request is finished
						if (xhr.status == 200) {
							correlated_movies[i]=JSON.parse(xhr.responseText);
							console.log(correlated_movies[i]);
							if(i==data.length-1)
								resolve("Success");
						// 200 means request succeeded
						} else {
						}
					}else{
				 	}
				};
				xhr.open("get", "http://62.217.127.19:8010/movie/"+data[i].movieId, true);
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.send();
			}

		});
		promise.then((message)=>{
			successful([].concat(...correlated_movies));
		})
		
	}
});


