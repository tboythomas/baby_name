

(function(){
	"use strict";

	window.onload = function(){
		setajax(loadlist,"list");
		document.getElementById("search").onclick = search;
	};

	//create the ajax and send it with the parameter to the serivce page
	function setajax(method,parameter){
		var ajax = new XMLHttpRequest();
		ajax.onload = method;
		ajax.open("GET","https://webster.cs.washington.edu/cse154/babynames.php?type=" + parameter, true);
		ajax.send();
	}

	// load the name list and let users to choose one of them
	function loadlist(){
		var name = this.responseText;
		var list = name.split("\n");
		var temp = document.getElementById("allnames");
		for(var i = 0; i < list.length; i++){
			var choose = document.createElement("option");
			choose.value = list[i];
			choose.innerHTML = list[i];
			temp.appendChild(choose);
		}
		temp.disabled = false;
		document.getElementById("loadingnames").style.display = "none";
	}

	//search the selected name, shows its meaning and population table and
	// celebs that have the same first name 
	function search(){
		var name = document.getElementById("allnames").value;
		name = name.toLowerCase();
		reset();
		setajax(meaning,"meaning&name=" + name);
		if(document.getElementById("genderm").checked){
			var gender = document.getElementById("genderm").value;
		}else{
			var gender = document.getElementById("genderf").value;
		}
		setajax(rank,"rank&name=" + name + "&gender=" + gender);
		setajax(celebs,"celebs&name=" + name +"&gender=" +gender);
		document.getElementById("resultsarea").style.display = "block";
	}

	//before every search, clear the whole page
	function reset(){
		document.getElementById("resultsarea").style.display = "none";
		document.getElementById("meaning").innerHTML = "";
		document.getElementById("graph").innerHTML = "";
		document.getElementById("celebs").innerHTML = "";
		document.getElementById("norankdata").style.display = "none";
		document.getElementById("errors").innerHTML = "";
		hidden("block");
	}

	//hide all the loading gif 
	function hidden(show){
		document.getElementById("loadingmeaning").style.display = show;
		document.getElementById("loadinggraph").style.display = show;
		document.getElementById("loadingcelebs").style.display = show;
	}
	
	//if the name is valid, shows its meaning, and if not,
	// show the error message
	function meaning(){
		if(this.status != 200){
			var error = "please choose a name";
			document.getElementById("resultsarea").style.display = "none";
			document.getElementById("errors").innerHTML = error;
			document.getElementById("errors").style.display = "block";
		}else{
			var para = this.responseText;
			document.getElementById("meaning").innerHTML = para;
			document.getElementById("loadingmeaning").style.display = "none";
		}
	}

	// shows the rank of the population in the table, and if it is not found,
	// show no rank data message
	function rank(){
		document.getElementById("loadinggraph").style.display = "none";
		if(this.status == 410){
			document.getElementById("norankdata").style.display = "block";
		}else{
			var list = this.responseXML.querySelectorAll("rank");
			var row = document.createElement("tr");
			for(var i = 0; i < list.length; i ++){
				var temp = document.createElement("th");
				temp.innerHTML = list[i].getAttribute("year");
				row.appendChild(temp);
			}
			document.getElementById("graph").appendChild(row);
			var row2 = document.createElement("tr");
			for(var i = 0; i < list.length; i ++){
				var temp2 = document.createElement("td");
				var bar = document.createElement("div");
				bar.className = ("bar");
				var ranking = parseInt(list[i].textContent);
				bar.innerHTML = ranking;
				temp2.appendChild(bar);
				if(ranking != 0){
					if(ranking <= 10){
						bar.classList.add("top");
					}else{
					var height = parseInt((1000 - ranking)/4);
					}
				}else{
					var height = 0;
				}
				bar.style.height = height + "px";
				temp2.appendChild(bar);
				row2.appendChild(temp2);
			}
			row2.style.height = 250 + "px";
			document.getElementById("graph").appendChild(row2);
		}
	}

	// take the json object and make it a list of celebs that have the same selected
	// first name
	function celebs(){
		var data = JSON.parse(this.responseText);
		for(var i = 0; i < data.actors.length; i ++){
			var li = document.createElement("li");
			li.innerHTML = data.actors[i].firstName + " " + 
			data.actors[i].lastName + "(" + data.actors[i].filmCount + " films)";
			document.getElementById("celebs").appendChild(li);
		}
		document.getElementById("loadingcelebs").style.display = "none";
	}
})();