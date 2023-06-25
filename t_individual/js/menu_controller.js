var menu = new Vue({
	el: "#menu_id",
	data: {
		divided: false,
	},
	created: function () {
		this.divided= false
	},
	methods: {
		// Mètode per dividir el joc
		divideGame() {
		  this.divided = !this.divided
		},
		// Mètode per carregar una partida
		load() {
		  loadpage("./html/load.html");
		},
		// Mètode per accedir a les opcions
		options() {
		  loadpage("./html/options.html");
		},
		// Mètode per accedir al marcador
		scoreboard(){
			loadpage("./html/ranking.html");
		},
		// Mètode per sortir del joc
		exit() {
		  	if (name != ""){
				alert("Leaving " + name + "'s game");
			}
			name = "";
			localStorage.clear();
			loadpage("../index.html");
		},
		// Mètode per iniciar el mode 1 del joc
		mode1() {
			sessionStorage.clear();
		  	name = prompt("User name");
		  	sessionStorage.setItem("playerName", name);
			loadpage("./html/game_mode1.html");
		},
		// Mètode per iniciar el mode 2 del joc
		mode2() {
			sessionStorage.clear();
		  	name = prompt("User name");
		  	sessionStorage.setItem("playerName", name);
			loadpage("./html/game_mode2.html");
		}
	  }
});
