const back = "../resources/back.png";
const items_easy = ["../resources/cb.png","../resources/co.png","../resources/sb.png","../resources/so.png"];
const items_medium = ["../resources/cb.png","../resources/co.png","../resources/sb.png","../resources/so.png","../resources/tb.png","../resources/to.png"];
const items_hard = ["../resources/cb.png","../resources/co.png","../resources/sb.png","../resources/so.png","../resources/tb.png","../resources/to.png","../resources/tt.png","../resources/cp.png"];

var game = new Vue({
	el: "#game_id",
	data: {
		username:'',
		current_card: [],
		items: [],
		num_cards_opc: 2,
		num_cards: 2,
		bad_clicks: 0,
		difficulty: 'easy'
	},
	setDifficulty: function (difficulty) {
			this.difficulty = difficulty;
		switch (difficulty) {
		case 'easy':
			this.items = items_easy.slice(); // Copiem l'array
		break;
		case 'medium':
			this.items = items_medium.slice(); // Copiem l'array
		break;
		case 'hard':
			this.items = items_hard.slice(); // Copiem l'array
		break;
		default:
			this.items = items_easy.slice(); // Copiem l'array
		}
	}
	created: function(){
		this.username = sessionStorage.getItem("username","unknown");
		this.setDifficulty(this.difficulty);
		this.items = items.slice(); // Copiem l'array
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
		this.items = this.items.concat(this.items); // Dupliquem els elements
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		this.num_cards = this.num_cards_opc;
		for (var i = 0; i < this.items.length; i++){
			this.current_card.push({done: false, texture: this.items[i]});
		}
		setTimeout(() => {
			for (var i = 0; i < this.current_card.length; i++){
				if (!this.current_card[i].done) {
					Vue.set(this.current_card, i, {done: false, texture: back});
				}
			}
		}, 1000);
	},
	methods: {
		clickCard: function(i){
			if (!this.current_card[i].done && this.current_card[i].texture === back)
				Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
		}

		setTime: function () {
			switch (this.difficulty) {
			case 'easy':
				return 1000;
			case 'medium':
				return 5000;
			case 'hard':
				return 10000;
			default:
				return 1000;
			}
		},
		
	watch: {
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
		score_text: function(){
			return 100 - this.bad_clicks * 20;
		}
	}
});







