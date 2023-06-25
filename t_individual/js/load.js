var load_obj = function(){
	// Creem la instància de Vue
	var vue_instance = new Vue({
		el: "#saves_id",
		data: {
			saves: []
		},
		created: function(){
			// Es carreguen les partides guardades
			let arrayPartides = [];
			if(localStorage.partides){
				arrayPartides = JSON.parse(localStorage.partides);
				if(!Array.isArray(arrayPartides)) arrayPartides = [];
			}
			this.saves = arrayPartides;
			console.log(this.saves);
		},
		methods: { 
			// Mètode per carregar una partida guardada
			load: function(i){
				sessionStorage.idPartida = i;
				if(this.saves[i].infinite){
					loadpage("../html/game_mode2.html");
				}
				else{
					loadpage("../html/game_mode1.html");
				}
			}
		}
	});
	return {}; 
}();
