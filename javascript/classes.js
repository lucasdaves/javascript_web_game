class unidade {
	constructor(hp, def, atq, velAtq, velMov, alcance, sprite, x, y, largura, altura, lado, custo, tipo) {
		this.hp = hp;
		this.def = def;
		this.hpMax = hp;
		this.atq = atq;
		this.velAtq = velAtq;
		this.velAtqMax = velAtq;
		this.velMov = velMov;
		this.velMovOriginal = velMov;
		this.velMovMax = velMov
		this.alcance = alcance;
		this.sprite = sprite;
		this.x = x;
		this.y = y;
		this.antesAtq = Date.now();
		this.antesMov = Date.now();
		this.largura = largura;
		this.altura = altura;
		this.lado = lado;
		this.custo = custo;
		this.tipo = tipo;
		this.stun = false;
		this.velocidade = false;
	}

	static guerreiro(lado){
		if(lado == 1) return new unidade(Math.round(60 * upgrade.boostHp), 1.25, Math.round(12 * upgrade.boostAtq), 1.0, 100, 50, imagemGuerreiro, 200, 500, 100, 200, lado, 20, "guerreiro");
		if(lado == 2) return new unidade(Math.round(60 * dificuldade.boostHp), 1.25, Math.round(12 * dificuldade.boostAtq), 1.0, 100, 50, imagemGuerreiroInimigo, 1380, 500, 100, 200, lado, 20, "guerreiro");
	}
		
	static arqueiro(lado){
		if(lado == 1) return new unidade(Math.round(50 * upgrade.boostHp), 1.1, Math.round(10 * upgrade.boostAtq), 1.4, 100, 250, imagemArqueiro, 200, 500, 100, 200, lado, 30, "arqueiro");
		if(lado == 2) return new unidade(Math.round(50 * dificuldade.boostHp), 1.1, Math.round(10 * dificuldade.boostAtq), 1.4, 100, 250, imagemArqueiroInimigo, 1380, 500, 100, 200, lado, 30, "arqueiro");
	}
	
	static mago(lado){
		if(lado == 1) return new unidade(Math.round(40 * upgrade.boostHp), 1, Math.round(15 * upgrade.boostAtq), 1.2, 100, 200, imagemMago, 200, 500, 100, 200, lado, 40, "mago");
		if(lado == 2) return new unidade(Math.round(40 * dificuldade.boostHp), 1, Math.round(15 * dificuldade.boostAtq), 1.2, 100, 200, imagemMagoInimigo, 1380, 500, 100, 200, lado, 40, "mago");
	}
	
	ataque(){
		var x = Math.random();
		var min = Math.ceil(this.atq-1);
		var max = Math.floor(this.atq+1);

		if(x <= 0.1) return 0;
		else if (x > 0.05 && x <= 0.90) return Math.floor(Math.random() * (max - min)) + min;
		else return (Math.floor(Math.random() * (max - min)) + min)*2;
	}
	
	movimenta(){
		var agora = Date.now();
		var delta = (agora - this.antesMov)/1000;
		this.antesMov = agora;
		var distancia = this.velMov * delta;
		if(this.lado == 1) this.x += distancia;
		if(this.lado == 2) this.x -= distancia;
	}
	
	unidadeMovimenta(i, jog1, jog2) {
		if (this.lado == 1) {
			if (jog1.vet.length > 1 && i > 0 && this.x + this.largura >= jog1.vet[i - 1].x) {
				this.velMov = jog1.vet[i - 1].velMov;
				this.antesMov = Date.now();
			} 
			else if (jog1.vet.length >= 1 && jog2.vet.length >= 1 && this.x + this.largura + this.alcance >= jog2.vet[0].x) {
				this.velMov = 0;
				this.unidadeColide(jog2,'unidade');
				this.antesMov = Date.now();
			} 
			else if (this.x + this.largura + this.alcance >= jog2.x) {
				this.velMov = 0;
				this.unidadeColide(jog2,'torre');
				this.antesMov = Date.now();
			}
			else {
				this.velMov = this.velMovOriginal;
				this.movimenta();
				this.antesAtq = Date.now();
			}
		}
		
		if (this.lado == 2) {
			if (jog2.vet.length > 1 && i > 0 && this.x<= jog2.vet[i - 1].x + jog2.vet[i - 1].largura) {
				this.velMov = jog2.vet[i - 1].velMov;
				this.antesMov = Date.now();
			}
			else if (jog1.vet.length >= 1 && jog2.vet.length >= 1 && this.x - this.alcance<= jog1.vet[0].x + jog1.vet[0].largura) {
				this.velMov = 0;
				this.unidadeColide(jog1,'unidade');
				this.antesMov = Date.now();
			} 
			else if (this.x - this.alcance <= jog1.x + jog1.largura) {
				this.velMov = 0;
				this.unidadeColide(jog1,'torre');
				this.antesMov = Date.now();
			} 
			else {
				this.velMov = this.velMovOriginal;
				this.movimenta();
				this.antesAtq = Date.now();
			}
		}
	}

	unidadeMostraHP() {
		if (this.hp >= this.hpMax) this.hp = this.hpMax;
		if (this.hp > 0) {
			var percent = (this.hp / this.hpMax);
			ctx.font = "20px Verdana";
			ctx.fillStyle = "#ff0000";
			ctx.fillRect(this.x+25, this.y-20, 50, 10);
			ctx.fillStyle = "#00ff00";
			ctx.fillRect(this.x+25, this.y-20, 50 * percent, 10);
		}

		if(this.lado == 1){
			if (recarga.duracaoVelocidade > 0 && this.velocidade == true){
				ctx.fillStyle = "#f0ffff";
				ctx.drawImage(imagemVelocidade, this.x+15, this.y-50, 30, 30);
			}

			if (recarga.duracaoCura > 0){
				ctx.fillStyle = "#00ACEE";
				ctx.fillRect(this.x+25, this.y-20, 50 * percent, 10);
				ctx.drawImage(imagemCura, this.x-20, this.y-30, 30, 30);
				ctx.drawImage(imagemAura, this.x-20, this.y+110,150,150);
			}
		}

		if(this.lado == 2){
			if (recarga.duracaoParalisa > 0 && this.stun == true){
				ctx.fillStyle = "#ffff00";
				ctx.fillRect(this.x+25, this.y-20, 50 * percent, 10);
				ctx.drawImage(imagemParalisa, this.x + (this.largura-20), this.y-30, 40, 40);
				ctx.drawImage(imagemStun, this.x-25, this.y+60,150,170);
			}

			if (recarga.duracaoExplosao > 0){
				ctx.fillStyle = "#ff8c00";
				ctx.fillRect(this.x+25, this.y-20, 50 * percent, 10);
				ctx.drawImage(imagemExplosao, this.x + (this.largura-20), this.y-60, 40, 40);
				ctx.drawImage(imagemFogo, this.x-30, this.y+130, 150, 100);
			}
		}
	}

	unidadeColide(jog,tipo) {
		var agora = Date.now();
		var intervalo = 1000/this.velAtq;
		var delta = agora - this.antesAtq;
		if (delta > intervalo) {
			this.antesAtq = agora;
			if(this.tipo == "guerreiro"){
				espadaSom.currentTime = 0;
				espadaSom.play();
			}
			if(this.tipo == "arqueiro"){
				flechaSom.currentTime = 0;
				flechaSom.play();
			}
			if(this.tipo == "mago"){
				cajadoSom.currentTime = 0;
				cajadoSom.play();
			}
			if(tipo == "unidade") {
				unidade.unidadeAnimaSangue(jog);
				jog.vet[0].unidadeDanificada(this.ataque());
			}
			else if(tipo == "torre") {
				jog.torreDanificada(this.ataque());
			}
		}	
	}

	unidadeDestruida(x , jog1, jog2) {
		if (this.lado == 1 && this.hp<= 0) {
			document.getElementById("sangueAliado").style.display = "none";
			document.getElementById("sangueInimigo").style.display = "none";
			morteSom.currentTime = 0;
			morteSom.play();
			jog2.mana += this.custo/2;
			jog1.vet.splice(x, 1);
		} 
			
		else if (this.lado == 2 && this.hp<= 0) {
			document.getElementById("sangueAliado").style.display = "none";
			document.getElementById("sangueInimigo").style.display = "none";
			morteSom.currentTime = 0;
			morteSom.play();
			jog1.mana += this.custo/2;
			if (this.tipo == "mago") recarga.mago = 0;
			else if (this.tipo == "guerreiro") recarga.guerreiro = 0;
			else if (this.tipo == "arqueiro") recarga.arqueiro = 0;
			jog2.vet.splice(x, 1);
		}
	}

	unidadeDanificada(x) {
		this.hp = Math.floor(this.hp -= (x/this.def));
		var a = x;
		var b = Math.floor(x/this.def);
		var c = this.hp;
		var d = this.hpMax;
		console.log("Unidade " + this.tipo + "HP: " + d + "/" + c + " Recebido: " + b);
		console.log("-------------------------------------");
	}
		
	unidadeDesenha() {ctx.drawImage(this.sprite, this.x, this.y);}

	static unidadeAnimaSangue(jog) {
		var xAleatorio = jog.vet[0].x + (jog.vet[0].largura * Math.random() - 40);
		var yAleatorio = jog.vet[0].y + (jog.vet[0].altura * Math.random() - 40);
		if(jog.vet[0].lado == 1) var sangue = document.getElementById("sangueAliado");
		if(jog.vet[0].lado == 2) var sangue = document.getElementById("sangueInimigo");

		sangue.style.left = xAleatorio;
		sangue.style.top = yAleatorio;
		sangue.style.display = "block";
	}
}

class estrutura {
	constructor(hp, atq, mana, velAtq, alcance, x, y, largura, altura, lado) {
		this.hp = hp;
		this.hpMax = 200;
		this.regenHp = 1;
		this.mana = mana;
		this.atq = atq;
		this.velAtq = velAtq;
		this.velAtqMax = this.velAtqMax;
		this.alcance = alcance;
		this.x = x;
		this.y = y;
		this.largura = largura;
		this.altura = altura;
		this.lado = lado;
		this.antes = Date.now();
		this.manaMax = 200;
		this.vet = [];
		this.vetMax = 5;
		this.level = 1;
		this.levelMax = 21;
	}
	
	habilidades(x, jog) {
		if (x == "velocidade" && this.mana >= 40 && recarga.habilidadeVelocidade === 0) {
			if(recarga.duracaoVelocidade == 0) recarga.duracaoVelocidade = 15;
			this.mana -= 40;
			recarga.habilidadeVelocidade = 20;
			
			for (var i = 0; i<jog.vet.length; i++) {
				if (typeof jog.vet[i] != 'undefined') {
					jog.vet[i].velocidade = true;
					jog.vet[i].velMov += 50;
					jog.vet[i].velMovOriginal += 50;
					jog.vet[i].velAtq = jog.vet[i].velAtq * 1.5;
				}
			}

			var duracao = setInterval(function() {
				if (--recarga.duracaoVelocidade <= 0) {clearInterval(duracao);}
			}, 1000);

			var desacelera = setTimeout(function() {
				for (var i = 0; i<jog.vet.length; i++) {
					if (typeof jog.vet[i] != 'undefined') {
						jog.vet[i].velocidade = false;
						jog.vet[i].velMov = jog.vet[i].velMovMax;
						jog.vet[i].velMovOriginal = jog.vet[i].velMovMax;
						jog.vet[i].velAtq = jog.vet[i].velAtqMax;
					}	
				}
			}, 15000);
		}

		else if (x == "paralisa" && this.mana >= 30 && recarga.habilidadeParalisa === 0) {
			if(recarga.duracaoParalisa == 0) recarga.duracaoParalisa = 5;
			this.mana -= 30;
			recarga.habilidadeParalisa = 20;

			for (var i = 0; i<jog.vet.length; i++) {
				if (typeof jog.vet[i] != 'undefined') {
					jog.vet[i].stun = true;
					jog.vet[i].velMov = 0;
					jog.vet[i].velMovOriginal = 0;
					jog.vet[i].velAtq = 0;
				}
			}

			var duracao = setInterval(function() {
				if (--recarga.duracaoParalisa <= 0) {clearInterval(duracao);}
			}, 1000);

			var paralisa = 	setTimeout(function() {
				for (var i = 0; i<jog.vet.length; i++) {
					if (typeof jog.vet[i] != 'undefined') {
						jog.vet[i].stun = false;
						jog.vet[i].velMov = jog.vet[i].velMovMax;
						jog.vet[i].velMovOriginal = jog.vet[i].velMovMax;
						jog.vet[i].velAtq = jog.vet[i].velAtqMax;
					}	
				}
			}, 5000);
		}

		else if (x == "explosao" && this.mana >= 50 && recarga.habilidadeExplosao === 0) {
			if(recarga.duracaoExplosao == 0) recarga.duracaoExplosao = 10;
			this.mana -= 50;
			recarga.habilidadeExplosao = 30;
			
			var explosao = setInterval(function() {
				for (var i = 0; i<jog.vet.length; i++) {if (typeof jog.vet[i] != 'undefined') {jog.vet[i].hp -= Math.round(jog.vet[i].hpMax*0.1);}}
				if (--recarga.duracaoExplosao <= 0) {clearInterval(explosao);}
			}, 500);}
			
		else if (x == "cura" && this.mana >= 60 && recarga.habilidadeCura === 0) {
			if(recarga.duracaoCura == 0) recarga.duracaoCura = 60;
			this.mana -= 60;
			recarga.habilidadeCura = 60;
			
			var cura = setInterval(function() {
				for (var i = 0; i<jog.vet.length; i++) {if (typeof jog.vet[i] != 'undefined' && jog.vet[i].hp < jog.vet[i].hpMax) {jog.vet[i].hp += Math.round(jog.vet[i].hpMax*0.1);}}
				if (--recarga.duracaoCura <= 0) {clearInterval(cura);}
			}, 500);}
	}

	torreAtaca() {
		if (this.lado == 1 && this.hp > 50 && this.x + this.largura + this.alcance >= jogador2.vet[0].x) {
			var agora = Date.now();
			var intervalo = 1000/this.velAtq;
			var delta = agora - this.antes;
			if (delta > intervalo) {
				this.antes = agora;
				canhaoSom.currentTime = 0;
				canhaoSom.play();
				unidade.unidadeAnimaSangue(jogador2);
				jogador2.vet[0].unidadeDanificada(this.atq);
			}
		} 
		
		else if (this.lado == 2 && this.hp > 50 && this.x - this.alcance<= jogador1.vet[0].x + jogador1.vet[0].largura) {
			var agora = Date.now();
			var intervalo = 1000/this.velAtq;
			var delta = agora - this.antes;
			if (delta > intervalo) {
				this.antes = agora;
				canhaoSom.currentTime = 0;
				canhaoSom.play();
				unidade.unidadeAnimaSangue(jogador1);
				jogador1.vet[0].unidadeDanificada(this.atq);
			}
		}
	}

	torreDestruida() {
		if (this.lado == 1) {
			if (this.hp > 100) torreAliada.src = "imagem/torreAliada.png"; 
			else if (this.hp<= 100 && this.hp > 50) torreAliada.src = "imagem/torreAliada1.png";
			else if (this.hp > 0 && this.hp<= 50) torreAliada.src = "imagem/torreAliada2.png";
			else if (this.hp<= 0) document.getElementById('derrota').style.display = 'block';
		} 
		else if (this.lado == 2) {
			if (this.hp > 100) torreInimiga.src = "imagem/torreInimiga.png"; 
			else if (this.hp<= 100 && this.hp > 50) torreInimiga.src = "imagem/torreInimiga1.png"; 
			else if (this.hp > 0 && this.hp<= 50) torreInimiga.src = "imagem/torreInimiga2.png"; 
			else if (this.hp<= 0) document.getElementById('vitoria').style.display = 'block';
		}
	}

	torreDanificada(x) {this.hp -= x;}

	mostraVida(x, y) {
		ctx.font = "50px Verdana";
		ctx.fillStyle = "#141427";
		if (this.hp<= 0) this.hp = 0;
		else if (this.hp >= this.hpMax) this.hp = this.hpMax;
		ctx.fillText(this.hp, x, y);
	}

	mostraMana(x, y) {
		ctx.font = "50px Verdana";
		ctx.fillStyle = "#141427";
		if (this.mana<= 0) this.mana = 0; 
		else if (this.mana >= this.manaMax) this.mana = this.manaMax;
		ctx.fillText(this.mana, x, y);
	}
	
	mostraLevel(x, y) {
		ctx.font = "50px Verdana";
		ctx.fillStyle = "#141427";
		if (this.level < this.levelMax) ctx.fillText(this.level, x, y);
		else ctx.fillText("MAX", x-40, y);
	}

	mostraHorda(x,y) {
		if(dificuldade.fase >= 1){
			ctx.drawImage(imagemHorda, 1400, 150);
			ctx.font = "30px Verdana";
			ctx.fillStyle = "#141427";
			ctx.fillText(dificuldade.fase, x, y);
		}
	}

	geraRecursos(x) {
		if (this.hp > 50 && this.hp<this.hpMax) {this.hp += this.regenHp;}
		if (this.mana<this.manaMax) {this.mana += x;}
	}

	insereUnidade(x) {
		this.vet.push(x);
		this.mana -= x.custo;
		if (x.lado == 1 && x.tipo == "mago") recarga.mago = x.custo / 2 - upgrade.boostR;
		else if (x.lado == 1 && x.tipo == "guerreiro") recarga.guerreiro = x.custo / 2 - upgrade.boostR;
		else if (x.lado == 1 && x.tipo == "arqueiro") recarga.arqueiro = x.custo / 2 - upgrade.boostR;
	}
}

class dificuldade {
	static facil(x) {
		this.fase = 1;
		this.mana = 2;
		this.tempo = 6000;
		this.boostHp = 1;
		this.boostAtq = 1;
		x.atq = 8;
		x.velAtq = 1.4;
		
	setInterval(this.geraInimigo, this.tempo, x);

		var a = setInterval(function(){
			dificuldade.fase++;
			dificuldade.tempo = dificuldade.tempo/1.1;
			dificuldade.boostHp += 0.1;
			dificuldade.boostAtq += 0.1;
			if(dificuldade.fase >= 8) {clearInterval(a);}
		},30000);
	}

	static medio(x) {
		this.fase = 1;
		this.mana = 4;
		this.tempo = 5000;
		this.boostHp = 1;
		this.boostAtq = 1;
		x.atq = 10;
		x.velAtq = 1.6;

        setInterval(this.geraInimigo, this.tempo, x);
        
		var a = setInterval(function(){
			dificuldade.fase++;
			dificuldade.tempo = dificuldade.tempo/1.1;
			dificuldade.boostHp += 0.1;
			dificuldade.boostAtq += 0.1;
			if(dificuldade.fase >= 12) {clearInterval(a);}
		},20000);
	}

	static dificil(x) {
		this.fase = 1;
		this.mana = 6;
		this.tempo = 4000;
		this.boostHp = 1;
		this.boostAtq = 1;
		x.atq = 12;
		x.velAtq = 2;
        
        setInterval(this.geraInimigo, this.tempo, x);
        
		var a = setInterval(function(){
			dificuldade.fase++;
			dificuldade.tempo = dificuldade.tempo/1.1;
			dificuldade.boostHp += 0.1;
			dificuldade.boostAtq += 0.1;
			if(dificuldade.fase >= 16) {clearInterval(a);}
		},10000);
	}

	static horda(x) {
		this.fase = 1;
		this.mana = 5;
		this.tempo = 6000;
		this.boostHp = 1;
		this.boostAtq = 1;
		x.atq = 50;
		x.velAtq = 1;

        setInterval(this.geraInimigo, this.tempo, x);
        
		setInterval(function(){
			dificuldade.fase++;
			dificuldade.tempo = dificuldade.tempo/1.1;
			dificuldade.boostHp += 0.1;
			dificuldade.boostAtq += 0.1;
		},20000);
	}

	static geraInimigo(x) {
		if (x.vet.length<= x.vetMax) {
			var op = Math.floor(Math.random() * 3) + 1;
			if (op == 1 && x.mana >= 20) x.insereUnidade(unidade.guerreiro(2));
			if (op == 2 && x.mana >= 30) x.insereUnidade(unidade.arqueiro(2));
			if (op == 3 && x.mana >= 40) x.insereUnidade(unidade.mago(2));
		}
	}
}

class recarga {
	static inicializa(){
		this.mago = 0;
		this.guerreiro = 0;
		this.arqueiro = 0;
		this.habilidadeParalisa = 0;
		this.habilidadeVelocidade = 0;
		this.habilidadeExplosao = 0;
		this.habilidadeCura = 0;
		this.duracaoExplosao = 0;
		this.duracaoCura = 0;
		this.duracaoParalisa = 0;
		this.duracaoVelocidade = 0;
	}
	
	static atualizaRecarga() {
		if (this.mago > 0) this.mago--;
		else this.mago = 0;
		
		if (this.guerreiro > 0) this.guerreiro--; 
		else this.guerreiro = 0;
		
		if (this.arqueiro > 0) this.arqueiro--;
		else this.arqueiro = 0;
		
		if (this.habilidadeExplosao > 0) this.habilidadeExplosao--; 
		else this.habilidadeExplosao = 0;
		
		if (this.habilidadeCura > 0) this.habilidadeCura--;
		else this.habilidadeCura = 0;

		if (this.habilidadeVelocidade > 0) this.habilidadeVelocidade--;
		else this.habilidadeVelocidade = 0;

		if (this.habilidadeParalisa > 0) this.habilidadeParalisa--;
		else this.habilidadeParalisa = 0;
	}

	static mostraRecarga() {
		ctx.font = "30px Verdana";
		ctx.fillStyle = "#ff0000";
		
		if (this.guerreiro > 0) {
			botaoGuerreiro.src = "imagem/botaoGuerreiroRecarga.png";
			ctx.fillText(this.guerreiro, 370, 150);
		} 
		else {botaoGuerreiro.src = "imagem/botaoGuerreiro.png";}
		
		if (this.arqueiro > 0) {
			botaoArqueiro.src = "imagem/botaoArqueiroRecarga.png";
			ctx.fillText(this.arqueiro, 470, 150);
		} 
		else {botaoArqueiro.src = "imagem/botaoArqueiro.png";}
		
		if (this.mago > 0) {
			botaoMago.src = "imagem/botaoMagoRecarga.png";
			ctx.fillText(this.mago, 570, 150);
		} 
		else {botaoMago.src = "imagem/botaoMago.png";}

		if (this.habilidadeParalisa > 0) {
			botaoParalisa.src = "imagem/botaoParalisaRecarga.png";
			ctx.fillText(this.habilidadeParalisa, 670, 150);
		}
		else {botaoParalisa.src = "imagem/botaoParalisa.png";}

		if (this.habilidadeVelocidade > 0) {
			botaoVelocidade.src = "imagem/botaoVelocidadeRecarga.png";
			ctx.fillText(this.habilidadeVelocidade, 770, 150);
		} 
		else {botaoVelocidade.src = "imagem/botaoVelocidade.png";}

		if (this.habilidadeExplosao > 0) {
			botaoExplosao.src = "imagem/botaoExplosaoRecarga.png";
			ctx.fillText(this.habilidadeExplosao, 870, 150);
		} 
		else {botaoExplosao.src = "imagem/botaoExplosao.png";}
		
		if (this.habilidadeCura > 0) {
			botaoCura.src = "imagem/botaoCuraRecarga.png";
			ctx.fillText(this.habilidadeCura, 970, 150);
		} 
		else {botaoCura.src = "imagem/botaoCura.png";}

	}
}

class upgrade{
	static inicializa(){
		this.custo = 20;
		this.boostHp = 1;
		this.boostAtq = 1;
		this.boostMp = 200;
		this.boostR = 0;
	}
	
	static levelUp(jog) {
		if (jog.mana >= this.custo && jog.level<jog.levelMax) {
			jog.level++;
			jog.mana -= this.custo;
			if (jog.level % 1 === 0) {
				this.boostHp += 0.1;
				this.boostAtq += 0.1;
			}
			if (jog.level % 2 === 0) jog.velAtq += 0.1;
			if (jog.level % 3 === 0) this.boostMp += 1;
			if (jog.level % 4 === 0) {
				this.custo += 20;
				jog.atq += 1;
			}
			if (jog.level % 5 === 0) this.boostR += 2;
		}
	}
	
	static mostraUpgrade(jog) {
		if (jog.mana >= this.custo && jog.level<jog.levelMax) botaoUpgrade.src = "imagem/up.png"; 
		else botaoUpgrade.src = "imagem/upON.png";

		if (jog.level<jog.levelMax) {
			ctx.font = "30px Verdana";
			ctx.fillStyle = "#141427";
			ctx.fillText(upgrade.custo, 275, 215);
		}
	}
}