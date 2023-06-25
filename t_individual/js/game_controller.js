var gameObj = function (){
	// Definició de les imatges
	const back = "../resources/back.png";
	const items = ["../resources/cb.png","../resources/co.png","../resources/sb.png",
	"../resources/so.png","../resources/tb.png","../resources/to.png"];
	// Comprovació de si hi ha una partida guardada
	let l_partida = null;
	if (sessionStorage.idPartida && localStorage.partides){
		let arrayPartides = JSON.parse(localStorage.partides);
		if (sessionStorage.idPartida < arrayPartides.length)
			l_partida = arrayPartides[sessionStorage.idPartida];
	}
	var vueInstance = new Vue({
		el: "#game_id",
		data: {
			username:'',
			current_card: [],
			items: [],
			num_cards: 2,
			bad_clicks: 0
		},
		created: function(){
			// Si hi ha una partida guardada, es carreguen les dades
			if (l_partida){
				this.username = l_partida.username;
				this.current_card = l_partida.current_card;
				this.items = l_partida.items;
				this.num_cards = l_partida.num_cards;
				this.bad_clicks = l_partida.bad_clicks;
			}
			else{
				// Si no hi ha una partida guardada, es carreguen les opcions per defecte
				this.username = sessionStorage.getItem("username","unknown");
				// Es seleccionen les cartes a mostrar i es barregen
				this.items = items.slice(); 
				this.items.sort(function(){return Math.random() - 0.5}); 
				this.items = this.items.slice(0, this.num_cards);
				// Es duplica l'array de cartes i es torna a barrejar
				this.items = this.items.concat(this.items); 
				this.items.sort(function(){return Math.random() - 0.5}); 
				for (var i = 0; i < this.items.length; i++){
					this.current_card.push({done: false, texture: back});
				}
			}
			sessionStorage.clear();
		},
		methods: {
			// Mètode per mostrar la carta seleccionada
			clickCard: function(i){
				if (!this.current_card[i].done && this.current_card[i].texture === back)
					Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
			},
			// Mètode per guardar la partida al servidor
			save: function(){
				fetch("../php/save.php", {
					method: "POST",
					body: JSON.stringify({
						name: this.username,
						score: this.score_text
					}),
					headers: {
						"Content-type": "application/json"
					}
				}).then(response => response.json()).then(json => {
					alert(json.score);
					this.local_save();
				})
				.catch((error) => {
					alert('Error:', error);
					this.local_save();
				});
			},
			// Mètode per guardar la partida localment
			local_save: function(){
				let partida = {
					username: this.username,
					current_card: this.current_card,
					items: this.items,
					num_cards: this.num_cards,
					bad_clicks: this.bad_clicks
				}
				let arrayPartides = [];
				if(localStorage.partides){
					arrayPartides = JSON.parse(localStorage.partides);
					if(!Array.isArray(arrayPartides)) arrayPartides = [];
				}
				arrayPartides.push(partida);
				localStorage.partides = JSON.stringify(arrayPartides);
				loadpage("../");
			}
		},
		watch: {
			// Es vigila si les cartes seleccionades coincideixen
			current_card: function(value){
				if (value.texture === back) return;
				var front = null;
				var i_front = -1;
				for (var i = 0; i < this.current_card.length; i++){
					if (!this.current_card[i].done && this.current_card[i].texture !== back){
						if (front){
							if (front.texture === this.current_card[i].texture){
								front.done = this.current_card[i].done = true;
								this.num_cards--;
							}
							else{
								Vue.set(this.current_card, i, {done: false, texture: back});
								Vue.set(this.current_card, i_front, {done: false, texture: back});
								this.bad_clicks++;
								break;
							}
						}
						else{
							front = this.current_card[i];
							i_front = i;
						}
					}
				}			
			}
		},
		computed: {
			// Es calcula la puntuació actual
			score_text: function(){
				return 100 - this.bad_clicks * 20;
			}
		}
	});
	return {};
}();




