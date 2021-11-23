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
*/
/*
	const xhr=new XMLHttpRequest();
	var data=null;
	xhr.onreadystatechange = function() {
	 if (xhr.readyState == 4) { // 4 means request is finished
		 if (xhr.status == 200) { // 200 means request succeeded
		    data=JSON.parse(xhr.responseText);
		 } else {
		 	data=9;
		 }
	 }else{
	 	data=9;
	 }
	};
	xhr.open("post", "http://62.217.127.19:8010/movie", true);
	//https://stackoverflow.com/questions/6396101/pure-javascript-send-post-data-without-a-form
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({keyword:"Toy"}));
	//end of help
	setTimeout(()=>console.log(data),300);
*/
document.getElementById("search").addEventListener('click',()=>{
	let key=document.getElementById("search_text").value;
	const xhr=new XMLHttpRequest();
	var data=null;
	xhr.onreadystatechange = function() {
	 if (xhr.readyState == 4) { // 4 means request is finished
		 if (xhr.status == 200) { // 200 means request succeeded
		    data=JSON.parse(xhr.responseText);
		 } else {
		 }
	 }else{
	 }
	};
	xhr.open("post", "http://62.217.127.19:8010/movie", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({keyword:key}));
	setTimeout(()=>{
		console.log(data);
		if(data){
			var element = document.createElement("link");
			element.setAttribute("rel", "stylesheet");
			element.setAttribute("type", "text/css");
			element.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
			document.getElementsByTagName("head")[0].appendChild(element);
			var contentArea = document.getElementsByTagName("body")[0];
			for(let i=0; i<data.length; i++){
				let movie_div=document.createElement("div");
				movie_div.style.backgroundColor="red";
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
				var stars=[];
				for(let j=0; j<5; j++){
					stars.push(document.createElement("span"));
					document.querySelectorAll("span")[j].classList.add('fa');
					document.querySelectorAll("span")[j].classList.add('fa-star');
					movie_div.appendChild(stars[j]);
				}
				contentArea.appendChild(movie_div);
			}
		}
	},300)
	
}) 