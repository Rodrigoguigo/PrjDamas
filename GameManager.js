class GameManager {
    constructor(scene) {
        this.scene = scene;
        this.matrizTabuleiro = null;
        this.matrizPecas = [];
        this.proximasJogadas = [];
        this.jogadorAtual = jogadores.Jogador1;
        this.pecaSelecionada = undefined;
        this.highlightPeca = new BABYLON.HighlightLayer("highlightPeça", scene);
        this.highlightPecaSel = new BABYLON.HighlightLayer("highlightPeçaSelecionada", scene);
        this.highlightPecaRem = new BABYLON.HighlightLayer("highlightPeçaRemovida", scene);
        this.highlightCasas = new BABYLON.HighlightLayer("highlightCasas", scene);
    }

    // Criação do ambiente inicial
    CriarAmbienteInicial() {
        let tabuleiro = new Tabuleiro();
        this.matrizTabuleiro = tabuleiro.CriarTabuleiro();

        for (var i = 0; i < TamTabuleiro; i++) {
            this.matrizPecas[i] = new Array(8);
        }

        // Criação das peças do jogador 1
        let jogador = jogadores.Jogador1;
        for (var i = 0; i < 3; i++) {
            for (var j = i % 2; j < TamTabuleiro; j += 2) {
                let peca = new Peca(i, j, jogador, this.scene);
                this.matrizPecas[i][j] = peca;
                this.VincularEventosPeca(peca);
            }
        }

        // Criação das peças do jogador 2
        jogador = jogadores.Jogador2;
        for (var i = 7; i > 4; i--) {
            for (var j = i % 2; j < TamTabuleiro; j += 2) {
                let peca = new Peca(i, j, jogador, this.scene);
                this.matrizPecas[i][j] = peca;
                this.VincularEventosPeca(peca);
            }
        }

        this.GerarJogadasPossiveis(this.jogadorAtual);
    }

    //Método utilizado para criar ambientes para testes
    CriarAmbienteTeste() {
        let tabuleiro = new Tabuleiro();
        this.matrizTabuleiro = tabuleiro.CriarTabuleiro();

        for (var i = 0; i < TamTabuleiro; i++) {
            this.matrizPecas[i] = new Array(8);
        }

        // Criação das peças do jogador 1
        let jogador = jogadores.Jogador1;
        let peca = new Peca(7, 1, jogador, this.scene);
        this.matrizPecas[7][1] = peca;
        this.VincularEventosPeca(peca);

        this.matrizPecas[7][1].TransformarEmDama();
        this.VincularEventosPeca(peca);

        // Criação das peças do jogador 2
        jogador = jogadores.Jogador2;
        peca = new Peca(1, 1, jogador, this.scene);
        this.matrizPecas[1][1] = peca;
        this.VincularEventosPeca(peca);

        peca = new Peca(5, 1, jogador, this.scene);
        this.matrizPecas[5][1] = peca;
        this.VincularEventosPeca(peca);

        peca = new Peca(4, 2, jogador, this.scene);
        this.matrizPecas[4][2] = peca;
        this.VincularEventosPeca(peca);

        peca = new Peca(2, 2, jogador, this.scene);
        this.matrizPecas[2][2] = peca;
        this.VincularEventosPeca(peca);

        peca = new Peca(1, 5, jogador, this.scene);
        this.matrizPecas[1][5] = peca;
        this.VincularEventosPeca(peca);

        peca = new Peca(5, 5, jogador, this.scene);
        this.matrizPecas[5][5] = peca;
        this.VincularEventosPeca(peca);

        peca = new Peca(4, 4, jogador, this.scene);
        this.matrizPecas[4][4] = peca;
        this.VincularEventosPeca(peca);

        peca = new Peca(2, 4, jogador, this.scene);
        this.matrizPecas[2][4] = peca;
        this.VincularEventosPeca(peca);

        peca = new Peca(6, 6, jogador, this.scene);
        this.matrizPecas[6][6] = peca;
        this.VincularEventosPeca(peca);

        this.GerarJogadasPossiveis(this.jogadorAtual);
    }

    // Método para trocar de turno
    TrocarTurno() {
        if (this.jogadorAtual == jogadores.Jogador1)
            this.jogadorAtual = jogadores.Jogador2;
        else
            this.jogadorAtual = jogadores.Jogador1;

        //Removendo todos os highlights e peça selecionada
        this.highlightPeca.removeAllMeshes();
        this.highlightPecaSel.removeAllMeshes();
        this.highlightCasas.removeAllMeshes();
        this.highlightPecaRem.removeAllMeshes();
        this.pecaSelecionada = undefined;

        // Ao finalizar um turno, é gerado todas as jogadas possíveis para o jogador
        this.GerarJogadasPossiveis(this.jogadorAtual)
    }

    // Método para vincular os eventos de hover e click na peça
    VincularEventosPeca(pecaObj) {
        let mesh = pecaObj.mesh;

        mesh.actionManager = new BABYLON.ActionManager(this.scene);
        // registrar Evento de hover na peça para dar um highlight ao passar pela peça, branco caso possua movimento válido, vermleho caso não tenha
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, () => {
            if (pecaObj.jogador == this.jogadorAtual && !this.highlightPeca.hasMesh(mesh) && !this.highlightPecaSel.hasMesh(mesh)) {
                if (pecaObj.proximaJogadas && pecaObj.proximaJogadas.length > 0)
                    this.highlightPeca.addMesh(mesh, BABYLON.Color3.White());
                else
                    this.highlightPeca.addMesh(mesh, BABYLON.Color3.Red());
            }
        }));

        // registrar evento de sair do hover da peça, removendo o highlight
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, () => {
            if (this.highlightPeca.hasMesh(mesh))
                this.highlightPeca.removeMesh(mesh);
        }));

        // registrar evento de click na peça, dando um highlight verde para peça selecionada e vinculando os eventos da jogada nas peças em que é possível se movimentar
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
            if (pecaObj.jogador == this.jogadorAtual && pecaObj.proximaJogadas && pecaObj.proximaJogadas.length > 0) {
                if (!this.pecaSelecionada || this.pecaSelecionada != pecaObj) {
                    this.highlightPeca.removeAllMeshes();
                    this.highlightPecaSel.removeAllMeshes();

                    this.highlightPecaSel.addMesh(mesh, BABYLON.Color3.Green());

                    if (this.pecaSelecionada)
                        this.DesvincularEventosCasa(this.pecaSelecionada);

                    this.pecaSelecionada = pecaObj;

                    this.VincularEventosCasa(pecaObj);
                }
                else {
                    this.highlightPeca.removeAllMeshes();
                    this.highlightPecaSel.removeAllMeshes();
                    this.DesvincularEventosCasa(this.pecaSelecionada);
                    this.pecaSelecionada = undefined;
                }
            }
        }))
    }

    // Método para vincular os eventos de hover e click nas casas
    VincularEventosCasa(pecaObj) {
        if (pecaObj.proximaJogadas && pecaObj.proximaJogadas.length > 0) {
            // forEach para cada jogada que a peça pode realizar
            pecaObj.proximaJogadas.forEach((jog) => {
                let casaObj = this.matrizTabuleiro[jog.objetivo.x][jog.objetivo.y];

                casaObj.material.diffuseColor = new BABYLON.Color3(0, 1, 0);

                casaObj.actionManager = new BABYLON.ActionManager(this.scene);
                // registrar evento para colocar um highlight nas casas visitadas e peças removidas na jogada ao colocar o mouse em cima da casa
                casaObj.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, () => {
                    if (!this.highlightCasas.hasMesh(casaObj))
                        this.highlightCasas.addMesh(casaObj, BABYLON.Color3.Green());

                    jog.listaMovimentos.forEach((mov) => {
                        let casa = this.matrizTabuleiro[mov.x][mov.y];
                        if (!this.highlightCasas.hasMesh(casa))
                            this.highlightCasas.addMesh(casa, BABYLON.Color3.Green());
                    });

                    jog.pecasRemovidas.forEach((peca) => {
                        if (!this.highlightPecaRem.hasMesh(peca.mesh))
                            this.highlightPecaRem.addMesh(peca.mesh, BABYLON.Color3.Red());
                    });
                }));

                // registrar evento de remover os highlights ao tirar o mouse de cima
                casaObj.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, () => {
                    this.highlightCasas.removeAllMeshes();
                    this.highlightPecaRem.removeAllMeshes();
                }));

                // registrar evento para andar até a casa e remover as peças ao clicar na casa
                casaObj.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
                    this.matrizPecas[pecaObj.posicaoTabuleiro.x][pecaObj.posicaoTabuleiro.y] = undefined;
                    this.matrizPecas[jog.objetivo.x][jog.objetivo.y] = pecaObj;

                    pecaObj.posicaoTabuleiro = new BABYLON.Vector2(jog.objetivo.x, jog.objetivo.y);
                    pecaObj.mesh.position = new BABYLON.Vector3(casaObj.position.x, pecaObj.mesh.position.y, casaObj.position.z);
                    this.DesvincularEventosCasa(pecaObj);

                    jog.pecasRemovidas.forEach((peca) => {
                        this.matrizPecas[peca.posicaoTabuleiro.x][peca.posicaoTabuleiro.y] = undefined;
                        peca.mesh.dispose();
                    })
                    
                    
                    if((pecaObj.posicaoTabuleiro.x == TamTabuleiro - 1 && pecaObj.jogador == jogadores.Jogador1) || (pecaObj.posicaoTabuleiro.x == 0 && pecaObj.jogador == jogadores.Jogador2)){
                        pecaObj.TransformarEmDama();
                        this.VincularEventosPeca(pecaObj);
                    }

                    this.TrocarTurno();
                }));
            })
        }
    }

    // Método para descinvular os eventos de hover e click das caixas
    DesvincularEventosCasa(pecaObj) {
        if (pecaObj.proximaJogadas && pecaObj.proximaJogadas.length > 0) {
            this.highlightCasas.removeAllMeshes();
            this.highlightPecaRem.removeAllMeshes();

            pecaObj.proximaJogadas.forEach((jog) => {
                let casaObj = this.matrizTabuleiro[jog.objetivo.x][jog.objetivo.y];
                casaObj.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                casaObj.actionManager = new BABYLON.ActionManager(this.scene);
            });
        }
    }

    // Método para gerar todas as jogadas possíveis no turno
    GerarJogadasPossiveis(jogador) {
        let maxPecasRemovidas = 0; // Variável para definir a quantidad maxima de peças que podem ser removidas em uma jogada

        // forEach para gerar a movimentação possível de cada peça
        this.matrizPecas.forEach((linha) => {
            linha.forEach((pecaObj) => {
                if (pecaObj && jogador == pecaObj.jogador) {
                    // Gerar as jogadas possíveis para essa peça
                    let jogadas = [];
                    if (pecaObj.dama)
                        jogadas = this.GerarProximosMovimentosDama(pecaObj, pecaObj.posicaoTabuleiro, undefined, [], true);
                    else
                        jogadas = this.GerarProximosMovimentos(pecaObj, pecaObj.posicaoTabuleiro, 0, []);

                    pecaObj.proximaJogadas = jogadas;

                    // Caso a quantidade de peças que essa peça pode remover é maior que o valor maximo atual, atualiza o valor maximo para o dessa peça
                    if (jogadas && jogadas.length > 0 && jogadas[0].pecasRemovidas.length > maxPecasRemovidas) {
                        maxPecasRemovidas = jogadas[0].pecasRemovidas.length;
                    }
                }
            });
        });

        // Novo forEach para remover as jogadas que removem uma quantida menor que o maximo
        this.matrizPecas.forEach((linha) => {
            linha.forEach((pecaObj) => {
                if (pecaObj && jogador == pecaObj.jogador) {
                    // Se o número de peças que a peça pode remover é menor que o máximo, remover jogada
                    if (pecaObj.proximaJogadas && pecaObj.proximaJogadas.length > 0 && pecaObj.proximaJogadas[0].pecasRemovidas.length < maxPecasRemovidas)
                        pecaObj.proximaJogadas = [];
                }
            })
        });
    }

    // Método para gerar movimentos para peças comuns
    GerarProximosMovimentos(pecaObj, posAtual, qtdMov, pecasRemovidas) {
        let listaJogadas = [];
        let maxPecasRemovidas = 0;

        // for para gerar as jogadas de cada peça
        for (var i = -1; i <= 1; i += 2) {
            for (var j = -1; j <= 1; j += 2) {
                let direcao = new BABYLON.Vector2(i, j);    // Direção em que a peça vai se movimentar
                let x = posAtual.x + direcao.x, y = posAtual.y + direcao.y;
                let dirValida = ((direcao.x > 0 && pecaObj.jogador == jogadores.Jogador1) || (direcao.x < 0 && pecaObj.jogador == jogadores.Jogador2)); // Validar se peça pode se movimentar para este lado

                //Se movimento está dentro do tabuleiro
                if (x >= 0 && x < TamTabuleiro && y >= 0 && y < TamTabuleiro) {
                    // Se for o primeiro movimento e o campo está vazio, apenas adiciona a jogada a lista
                    if (!this.matrizPecas[x][y] && dirValida && qtdMov == 0)
                        listaJogadas.push(new Jogadas(new BABYLON.Vector2(x, y)));
                    // Se o campo possui uma peça inimiga, verificar se o campo atrás esta livre, se estiver adicionar jogada a lista
                    else if (this.matrizPecas[x][y] && this.matrizPecas[x][y].jogador != pecaObj.jogador && !pecasRemovidas.includes(this.matrizPecas[x][y]) && x + direcao.x >= 0 && x + direcao.x < TamTabuleiro && y + direcao.y >= 0 && y + direcao.y < TamTabuleiro) {
                        let x2 = x + direcao.x;
                        let y2 = y + direcao.y;
                        // Validando se posição está dentro do tabuleiro e se campo está vazio
                        if (x2 >= 0 && x2 < TamTabuleiro && y2 >= 0 && y2 < TamTabuleiro && !this.matrizPecas[x2][y2]) {
                            let jogadas = [new Jogadas(new BABYLON.Vector2(x2, y2))];
                            jogadas[0].pecasRemovidas.push(this.matrizPecas[x][y]);
                            let pecasRemovidasAux = pecasRemovidas.slice();
                            pecasRemovidasAux.push(this.matrizPecas[x][y]);
                            // Caso removido uma peça, verificar recursivamente se é possível remover outra peça na nova posição
                            let proximaJogadas = this.GerarProximosMovimentos(pecaObj, new BABYLON.Vector2(x2, y2), qtdMov + 1, pecasRemovidasAux);

                            // Caso encontrado mais peças para remover, adicionar a lista de movimentos da jogada
                            if (proximaJogadas && proximaJogadas.length > 0) {
                                let jogadaOriginal = jogadas[0].clone();
                                jogadas = [];

                                proximaJogadas.forEach((jog) => {
                                    jogadaOriginal.objetivo = jog.objetivo;
                                    jogadaOriginal.pecasRemovidas = jogadaOriginal.pecasRemovidas.concat(jog.pecasRemovidas);
                                    jogadaOriginal.listaMovimentos = jogadaOriginal.listaMovimentos.concat(jog.listaMovimentos);
                                    jogadas.push(jogadaOriginal);
                                });
                            }

                            listaJogadas = listaJogadas.concat(jogadas);

                            // Se a quantidade de peças removidas for maior que o maximo atual, atualizar o maximo atual para corresponder
                            jogadas.forEach((jog) => {
                                if (jog.pecasRemovidas.length > maxPecasRemovidas) {
                                    maxPecasRemovidas = jog.pecasRemovidas.length;
                                }
                            });
                        }
                    }
                }
            }
        }

        let listaFiltrada = [];
        // forEach para filtrar apenas as jogadas que removem o maximo possível
        listaJogadas.forEach((jog) => {
            if (jog.pecasRemovidas.length == maxPecasRemovidas) {
                listaFiltrada.push(jog);
            }
        });

        return listaFiltrada;
    }

    // Método para gerar movimentos para damas
    GerarProximosMovimentosDama(pecaObj, posAtual, direcaoObj, pecasRemovidas, movIni) {
        let listaJogadas = [];
        let maxPecasRemovidas = 0;
        let movValido = movIni;

        console.log(pecasRemovidas);

        for (var i = -1; i <= 1; i += 2) {
            for (var j = -1; j <= 1; j += 2) {
                let direcao = new BABYLON.Vector2(i, j);    //Direção em que a peça vai se movimentar
                let pecasRemovidasDir = [];
                let x = posAtual.x + direcao.x, y = posAtual.y + direcao.y;
                let houvePecaRemovida = false;

                while (x >= 0 && x < TamTabuleiro && y >= 0 && y < TamTabuleiro && (!direcaoObj || (direcaoObj.x == direcao.x && direcaoObj.y == direcao.y))) {
                    if (!this.matrizPecas[x][y] || (this.matrizPecas[x][y] && this.matrizPecas[x][y].jogador != pecaObj.jogador)) {
                        let novaJogada = new Jogadas(new BABYLON.Vector2(x, y));
                        novaJogada.pecasRemovidas = novaJogada.pecasRemovidas.concat(pecasRemovidasDir);

                        if (this.matrizPecas[x][y] && this.matrizPecas[x][y].jogador != pecaObj.jogador) {
                            let pecaRem = this.matrizPecas[x][y];
                            x += direcao.x;
                            y += direcao.y;

                            if (x < 0 || x >= TamTabuleiro || y < 0 || y >= TamTabuleiro || this.matrizPecas[x][y] || pecasRemovidas.includes(pecaRem))
                                break;

                            novaJogada = new Jogadas(new BABYLON.Vector2(x, y));
                            novaJogada.pecasRemovidas.push(pecaRem);
                            novaJogada.pecasRemovidas = novaJogada.pecasRemovidas.concat(pecasRemovidasDir);
                            pecasRemovidasDir.push(pecaRem);
                            pecasRemovidas.push(pecaRem);
                            houvePecaRemovida = true;
                            movValido = true;

                            if (novaJogada.pecasRemovidas.length > maxPecasRemovidas)
                                maxPecasRemovidas = novaJogada.pecasRemovidas.length;
                        }

                        if (movValido) {
                            listaJogadas.push(novaJogada);

                            if (houvePecaRemovida) {
                                let jogadasRot1 = this.GerarProximosMovimentosDama(pecaObj, new BABYLON.Vector2(x, y), new BABYLON.Vector2(direcao.x, -direcao.y), pecasRemovidas.slice(), false);
                                let jogadasRot2 = this.GerarProximosMovimentosDama(pecaObj, new BABYLON.Vector2(x, y), new BABYLON.Vector2(-direcao.x, direcao.y), pecasRemovidas.slice(), false);

                                jogadasRot1.forEach((jog) => {
                                    if (jog.pecasRemovidas.length > 0) {
                                        let novaJog = novaJogada.clone();
                                        novaJog.objetivo = jog.objetivo;
                                        novaJog.listaMovimentos = novaJog.listaMovimentos.concat(jog.listaMovimentos);
                                        novaJog.pecasRemovidas = novaJog.pecasRemovidas.concat(jog.pecasRemovidas);

                                        if (novaJog.pecasRemovidas.length > maxPecasRemovidas)
                                            maxPecasRemovidas = novaJog.pecasRemovidas.length;

                                        listaJogadas.push(novaJog);
                                    }
                                });

                                jogadasRot2.forEach((jog) => {
                                    if (jog.pecasRemovidas.length > 0) {
                                        let novaJog = novaJogada.clone();
                                        novaJog.objetivo = jog.objetivo;
                                        novaJog.listaMovimentos = novaJog.listaMovimentos.concat(jog.listaMovimentos);
                                        novaJog.pecasRemovidas = novaJog.pecasRemovidas.concat(jog.pecasRemovidas);

                                        if (novaJog.pecasRemovidas.length > maxPecasRemovidas)
                                            maxPecasRemovidas = novaJog.pecasRemovidas.length;

                                        listaJogadas.push(novaJog);
                                    }
                                });
                            }
                        }

                        x += direcao.x;
                        y += direcao.y;
                    }
                    else
                        break;
                }
            }
        }

        let listaFiltrada = [];
        // forEach para filtrar apenas as jogadas que removem o maximo possível
        listaJogadas.forEach((jog) => {
            if (jog.pecasRemovidas.length == maxPecasRemovidas) {
                listaFiltrada.push(jog);
            }
        });

        return listaFiltrada
    }
}