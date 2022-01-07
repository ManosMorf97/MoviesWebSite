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
		https://www.w3schools.com/cssref/tryit.asp?filename=trycss3_animation-delay
		https://stackoverflow.com/questions/15593850/sort-array-based-on-object-attribute-javascript
		https://www.w3schools.com/jsref/dom_obj_text.asp
		https://stackoverflow.com/questions/596467/how-do-i-convert-a-float-number-to-a-whole-number-in-javascript
*/
var element = document.createElement("link");
element.setAttribute("rel", "stylesheet");
element.setAttribute("type", "text/css");
document.getElementsByTagName("head")[0].appendChild(element);
//element.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");

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

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function warning(text){
	var contentArea=document.getElementById("list");
	removeAllChildNodes(contentArea);
	let h=document.createElement("h1");
	let message=document.createTextNode(text);
	h.appendChild(message);
	h.classList.add('message');
	contentArea.appendChild(h);
}

function successful(data){
	var contentArea=document.getElementById("list");
	removeAllChildNodes(contentArea);
	if(data.length==0){
		warning("The system cannot find the movie,try to type a word of your movie");
		return;
	}
	for(let i=0; i<data.length; i++){
		let movie_div=document.createElement("div");
		movie_div.classList.add("movies");
		for(const props in data[i]){
			if(props=="movieId") continue;
			let movie_info=document.createElement("h1");
			let property=document.createTextNode(data[i][props]);
			movie_info.appendChild(property);
			movie_div.appendChild(movie_info);
		}
		let rating_input=document.createElement("input");
		let rating_value=movie_ratings.get(data[i].movieId)
		if(rating_value)
			rating_input.setAttribute("value",rating_value);
		rating_input.setAttribute("id",data[i].movieId);
		let label=document.createElement("label");
		label.setAttribute("for",rating_input.id);
		movie_div.appendChild(rating_input);
		var ratings=document.createElement("h1");
		let property=document.createTextNode("Ratings");
		ratings.appendChild(property);
		label.appendChild(ratings);
		movie_div.appendChild(label);
		movie_div.appendChild(rating_input);
		rating_input.addEventListener("keyup",saveRating(data[i],rating_input));
		rating_input.style.backgroundColor="#FDFD96"
		contentArea.appendChild(movie_div);
	}	

}

function saveRating(movie,rating_input){
	return ()=>{
		value=rating_input.value;
		if(value<0.5)
			value=0.5
		if(value>5)
			value=5;
		let accepted=[]
		accepted.push(Math.floor(value));
		for(let i=1; i<3; i++)
			accepted.push(accepted[accepted.length-1]+0.5);
		let min=Math.abs(accepted[0]-value);
		let min_index=0;
		for(let i=1; i<3; i++){
			let value_2=Math.abs(accepted[i]-value) 
			if(min>value_2){
				min=value_2;
				min_index=i
			}
		}
		if(accepted[min_index]!=NaN)	
			movie_ratings.set(movie.movieId,accepted[min_index]);
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
	if(key.length<=3){
		warning("Few Information");
		return;
	}
	xhr.open("post", "http://62.217.127.19:8010/movie", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({keyword:key}));



	
});

document.getElementById("interests").addEventListener('click',()=>{
	var users;
	var max_user=[];
	let movie_array=[...movie_ratings.keys()];
	if(movie_array.length==0){
		warning("You did not rate movies")
		return;
	}
	let max;
	let bricks=1;
	let turned_on;
	//let thrown=true;
	warning("Do not worry this will not take more than a minute");
	let span=document.createElement("span");
	span.classList.add('rotation');
	var contentArea=document.getElementById("list");
	contentArea.appendChild(span);
	function step1(){
		let p=new Promise((resolve,reject)=>{
			users=[]
			max=[];
            turned_on=[];
        	turned_on.push(false);
			max.push(-2);
			max_user.push(null);
			getUsers(movie_array,0,resolve);	
		});
		p.then((message)=>{
			step2B();
		})
	}
	step1();
	function step2B(){
		let max2=max[0];
		let max_user2=max_user[0];
		for(let i=1; i<bricks; i++)
			if(max2<max[i]){
				max2=max[i];
				max_user2=max_user[i];
			}
		step3(max_user2);
	}
	
	function getUsers(movie_array,index,resolve){
		const xhr= new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) { // 4 means request is finished
				if (xhr.status == 200) {
					try{
						/*if(thrown){
							thrown=false;
							throw "Exception";
						}*/
						let users_ids=[];
						users[index]=[].concat(...JSON.parse(xhr.responseText));//sort
						users[index].sort((a,b)=>(a.userId > b.userId) ? 1 : ((b.userId > a.userId) ? -1 : 0))
						for(let i=0; i<users[index].length; i++){
							if(i==0||users[index][i].userId>users[index][i-1].userId)
								users_ids.push(users[index][i].userId);
						}
					// 200 means request succeeded
					    step2(users_ids,index);
					    turned_on[index]=true;
					    if(turned_on.filter(x=>!x).length==0)
					    	resolve("Success")
				    }catch(error){
						turned_on.push(false);
						max.push(-2);
						max_user.push(null);
						getUsers(movie_array.slice(0,movie_array.length/2),index,resolve);
						getUsers(movie_array.slice(movie_array.length/2,movie_array.length),turned_on.length-1,resolve);					
					}
				} else {
				}
			}else{
		 	}
		 	
		};
		xhr.open("post", "http://62.217.127.19:8010/ratings", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({movieList:movie_array}));
	}

	function step2(users_ids,index){
		let i=0;
		let j=0;
		while(i<users_ids.length){
			let rated_movies=[];
			while(j<users[index].length&&users[index][j].userId==users_ids[i]){
				rated_movies.push(users[index][j])
				j++;
			}
			findCorrelation(rated_movies,users_ids[i],index);
			i++;
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
		let size=common_movies.length;
		let ratings=[my_ratings,their_ratings]
		let condition=[]
		for(const rating of ratings)
			condition.push(my_ratings.filter(x=>x==my_ratings.reduce((x,y)=>x+y)/size).length<size);
		let r;
		if(condition[0]&&condition[1])
			r=R(my_ratings,their_ratings,size)
		else
			r=cosinesim(my_ratings,their_ratings);
		if(r<0.5)
			return;
		r*=size;
        if(max[index]<r){
        	max[index]=r;
        	max_user[index]=user;
        }
	}
	function R(my_ratings,their_ratings,size){
		let my_ratings_mean=my_ratings.reduce((x,y)=>x+y)/size;
		let their_ratings_mean=their_ratings.reduce((x,y)=>x+y)/size;
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
        return r>1?1:r;

	}
	function cosinesim(my_ratings,their_ratings){
		let sum=0;
		for(let i=0; i<my_ratings.length; i++){
			sum+=my_ratings[i]*their_ratings[i];
		}
		let ratings=[my_ratings,their_ratings];
		let dividor=1;
		for(const rating of ratings){
			rating.unshift(0)
			dividor*=Math.sqrt(rating.reduce((x,y)=>x+Math.pow(y,2)))
			rating.shift()
		}
		return sum/dividor;
	}

	function getArraysIntersection(a1,a2){
    	return  a1.filter(function(n) { return a2.indexOf(n) !== -1;});
	}

	function step3(max_user){
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
			xhr.open("get", "http://62.217.127.19:8010/ratings/"+max_user, true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.send();
	}

	async function showMovies(data){
		data=data.filter(x=>x.rating>=4);
		let correlated_movies=new Array(data.length);
		let turned_on_final=[];
		for(let i=0; i<data.length; i++)
			turned_on_final.push(false);
		let begining=0;
		let ending=1000;
		while(true){
			let promise=showPartialMovies(begining,ending,data,correlated_movies,turned_on_final);
			const response=await promise;
			begining+=1000;
			if(begining>=data.length)
				break;
			ending+=1000;
		}
		successful([].concat(...correlated_movies));
		
	}
	function showPartialMovies(begining,ending,data,correlated_movies,turned_on_final){
		return new Promise((resolve,reject)=>{
			if(ending>data.length)
				ending=data.length
			for(let i=begining; i<ending; i++){
				const xhr= new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) { // 4 means request is finished
						if (xhr.status == 200) {
							correlated_movies[i]=JSON.parse(xhr.responseText);	
							turned_on_final[i]=true
							if(turned_on_final.slice(begining,ending).filter(x=>!x).length==0)
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
	}
});