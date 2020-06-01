class Peca {
    static materialPecas = undefined;

    constructor(x, y, jogador, scene) {
        this.scene = scene;
        this.jogador = jogador;
        this.dama = false;
        this.posicaoTabuleiro = new BABYLON.Vector2(x, y);
        this.proximaJogadas = [];

        if (!Peca.materialPecas)
            Peca.materialPecas = this.CriarMaterials();

        this.mesh = this.CriarPeca(PosLinInicial + x, PosYPecas, PosColInicial + y);
    }

    CriarPeca(x, y, z) {
        var peca = BABYLON.MeshBuilder.CreateCylinder('peça', { diameter: 0.9, height: 0.5, tesselation: 64 }, this.scene);
        peca.position.x = x;
        peca.position.y = y;
        peca.position.z = z;

        if (this.jogador == jogadores.Jogador1)
            peca.material = Peca.materialPecas[0];
        else
            peca.material = Peca.materialPecas[1];

        return peca;
    }

    CriarMaterials() {
        var jogador1Material = new BABYLON.StandardMaterial("jogador1", this.scene);
        jogador1Material.diffuseColor = new BABYLON.Color3(0.7, 0, 0);

        var jogador2Material = new BABYLON.StandardMaterial("jogador2", this.scene);
        jogador2Material.diffuseColor = new BABYLON.Color3(0, 0, 0);

        return [jogador1Material, jogador2Material];
    }
}