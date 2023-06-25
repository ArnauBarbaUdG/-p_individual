class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
        // Inicialització de les variables
        this.cards = null;
        this.firstClick = null;
        this.score = 100;
        this.correct = 0;
        this.name = "";
        this.mostrantError=false;
    }

    preload (){    
        // Càrrega de les imatges
        this.load.image('back', '../resources/back.png');
        this.load.image('cb', '../resources/cb.png');
        this.load.image('co', '../resources/co.png');
        this.load.image('sb', '../resources/sb.png');
        this.load.image('so', '../resources/so.png');
        this.load.image('tb', '../resources/tb.png');
        this.load.image('to', '../resources/to.png');
        this.load.image('button', '../resources/button.png');
    }
    
    create() {
        // Creació de les cartes
        let cartes = ['co', 'co', 'cb', 'cb', 'sb', 'sb', 'so', 'so', 'tb', 'tb', 'to', 'to'];
        
        // Configuració del fons
        this.cameras.main.setBackgroundColor(0xBFFCFF);
        
        // Comprovació de si hi ha una partida guardada
        let l_partida = null;
        if (sessionStorage.idPartida && localStorage.partides) {
            let arrayPartides = JSON.parse(localStorage.partides);
            if (sessionStorage.idPartida < arrayPartides.length) {
                l_partida = arrayPartides[sessionStorage.idPartida];
            }
        }
        
        console.log(l_partida);
        
        if (l_partida) {
            // Si hi ha una partida guardada, es carreguen les dades
            var cartes_d = l_partida.nCartes;
            var espaiX = cartes_d / 2 * 96;
            var espaiY = cartes_d / 2 * 128;
            if (cartes_d > 5) {
                var f = 3;
                var c = 4;
            } else {
                var f = 2;
                var c = cartes_d;
            }
            this.correct = l_partida.correct;
            var restaPunts = l_partida.restaPunts_s;
            var temps = l_partida.temps_s;
            var arraycards = cartes.slice(0, cartes_d * 2);
            arraycards = l_partida.arraycards_s;
            
            // Es mostren les cartes
            let cart = 0;
            for (let i = 0; i < c; i++) {
                for (let j = 0; j < f; j++) {
                    this.add.image(i * 125 + this.cameras.main.centerX - espaiX, j * 150 + this.cameras.main.centerY - espaiY / 2, arraycards[cart]);
                    cart += 1;
                }
            }
            
        } else {
            // Si no hi ha una partida guardada, es carreguen les opcions per defecte
            var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
            var user = sessionStorage.getItem("playerName", "unknown");
            this.name = user;
            
            // Es carreguen les opcions de la partida
            var options_data = JSON.parse(json);
            var cartes_d = options_data.cards;
            var dificultat = options_data.dificulty;
            
            // Es calcula l'espai entre les cartes
            var espaiX = cartes_d / 2 * 96;
            var espaiY = cartes_d / 2 * 128;
            
            if (cartes_d > 5) {
                var f = 3;
                var c = 4;
            } else {
                var f = 2;
                var c = cartes_d;
            }
            
            // Es determinen els punts que es resten i el temps segons la dificultat
            var restaPunts = null;
            var temps = null;
            
            if (dificultat == "easy") {
                restaPunts = 5;
                temps = 2000;
                
            } else if (dificultat == "normal") {
                restaPunts = 10;
                temps = 1000;

            } else {
                restaPunts = 20;
                temps = 500;    
            }
            
            // Es seleccionen les cartes a mostrar i es barregen
			var arraycards = cartes.slice(0, cartes_d * 2);
			arraycards.sort((a, b) => 0.5 - Math.random());
			let cart = 0;
			for (let i = 0; i < c; i++) {
				for (let j = 0; j < f; j++) {
					this.add.image(i * 125 + this.cameras.main.centerX - espaiX, j * 150 + this.cameras.main.centerY - espaiY / 2, arraycards[cart]);
					cart += 1;
				}
			}
		}
		setTimeout(() => {
    // Creació de les cartes
    this.cards = this.physics.add.staticGroup();
    console.log(l_partida);
    let car = 0;
    
    // Es mostren les cartes
    for (let i = 0; i < c; i++) {
        for (let j = 0; j < f; j++) {
            if (l_partida) {
                if (l_partida.cards_s[car] == true) {
                    this.cards.create(i * 125 + this.cameras.main.centerX - espaiX, j * 150 + this.cameras.main.centerY - espaiY / 2, 'back');
                }
            } else {
                this.cards.create(i * 125 + this.cameras.main.centerX - espaiX, j * 150 + this.cameras.main.centerY - espaiY / 2, 'back');
            }
            car++;
        }
    }
    
    let i = 0;
    
    // Es defineixen les accions al clicar sobre les cartes
    this.cards.children.iterate((card) => {
        if (l_partida) {
            while (l_partida.cards_s[i] == false) {
                i++;
            }
            card.card_id = arraycards[i];
            i++;
        } else {
            card.card_id = arraycards[i];
            i++;
        }
        
        card.setInteractive();
        
        card.on('pointerup', () => {
            if (!this.mostrantError) {
                card.disableBody(true, true);
                
                if (this.firstClick) {
                    if (this.firstClick.card_id !== card.card_id) {
                        // Si les cartes no coincideixen, es resten punts
                        this.score -= restaPunts;
                        this.mostrantError = true;
                        
                        setTimeout(() => {
                            // Es tornen a mostrar les cartes
                            this.firstClick.enableBody(false, 0, 0, true, true);
                            card.enableBody(false, 0, 0, true, true);
                            this.mostrantError = false;
                            this.firstClick = null;
                        }, temps);
                        
                        // Si els punts són menors o iguals a zero, s'acaba la partida
                        if (this.score <= 0) {
                            alert("Game Over");
                            loadpage("../");
                        }
                    } else {
                        // Si les cartes coincideixen, s'incrementa el comptador de cartes correctes
                        this.correct++;
                        
                        // Si s'han trobat totes les parelles de cartes, s'acaba la partida
                        if (this.correct >= cartes_d) {
                            alert("Has guanyat amb " + this.score + " punts.");
                            loadpage("../");
                        }
                        
                        this.firstClick = null;
                    }
                } else {
                    // Si és el primer clic sobre una carta, es guarda la carta seleccionada
                    this.firstClick = card;
                }
            }
        }, card);
    });
}, temps);

// Creació del botó per guardar la partida
const button = this.add.sprite(this.cameras.main.centerX, this.cameras.main.height - 150, 'button');
button.scaleX = .45;
button.scaleY = .45;
button.setInteractive();
const buttonText = this.add.text(0, 0, '',);
Phaser.Display.Align.In.Center(buttonText, button);

// Es mostra el nom del jugador
this.add.text(1070, 150, "Jugador: " + this.name, { fontFamily: 'Calibri', fontSize: '2.75rem', fill: '#000' });

// Es defineix l'acció al clicar sobre el botó per guardar la partida
button.on('pointerdown', () => {
    let cards_p = {};
    let i = 0;
    
    // Es guarden les dades de les cartes
    this.cards.children.iterate((card) => {
        cards_p[i] = card.active;
        i++;
    });
    
    // Es guarden les dades de la partida
			let partida = {
				username: user,
				arraycards_s: arraycards,
				nCartes: cartes_d,
				restaPunts_s: restaPunts,
				temps_s: temps,
				cards_s: cards_p,
				correct: this.correct,
				score: this.score,
				infinite: false
			};
			let arrayPartides = [];
			if (localStorage.partides) {
				arrayPartides = JSON.parse(localStorage.partides);
				if (!Array.isArray(arrayPartides)) arrayPartides = [];
			}
			arrayPartides.push(partida);
			localStorage.partides = JSON.stringify(arrayPartides);
			loadpage("../");
		});
	}
}
