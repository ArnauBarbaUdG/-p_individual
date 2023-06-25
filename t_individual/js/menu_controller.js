var menu = new Vue({
	el: "#menu_id",
	data: {
		divided: false,
	},
	created: function () {
		this.divided= false
	},
	methods: {
		divideGame() {
		  // Obtiene el elemento del botón del juego Phaser
		  this.divided = !this.divided
		},
		load() {
		  // Lógica para el botón Load Game
		  loadpage("./html/load.html");
		},
		options() {
		  // Lógica para el botón Options
		  loadpage("./html/options.html");
		},
		scoreboard(){
			loadpage("./html/ranking.html");
		},
		exit() {
		// Lógica para el botón Exit
		  	if (name != ""){
				alert("Leaving " + name + "'s game");
			}
			name = "";
			localStorage.clear();
			loadpage("../index.html");
		},
		mode1() {
		// Lógica para la opción normal
			sessionStorage.clear();
		  	name = prompt("User name");
		  	sessionStorage.setItem("playerName", name);
			loadpage("./html/game_mode1.html");
		},
		mode2() {
		 	// Lógica para la opción 2
			sessionStorage.clear();
		  	name = prompt("User name");
		  	sessionStorage.setItem("playerName", name);
			loadpage("./html/game_mode2.html");
		}
	  }
});