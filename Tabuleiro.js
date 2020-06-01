class Tabuleiro {
    constructor(scene) {
        this.tabuleiro = [];
        for (var i = 0; i < 8; i++)
            this.tabuleiro[i] = new Array(8);

        this.materialsTabuleiro = this.CriarMaterials();
        this.scene = scene;

        if(!Tabuleiro.highlightCasas)
            Tabuleiro.highlightCasas
    }

    CriarTabuleiro() {
        for (var i = 0; i < TamTabuleiro; i++) {
            for (var j = 0; j < TamTabuleiro; j++) {
                this.tabuleiro[i][j] = this.CriarCasa(PosLinInicial + i, 0, PosColInicial + j, this.materialsTabuleiro[(i+j) % 2]);
            }
        }

        var borda1 = BABYLON.MeshBuilder.CreateBox('borda', { height: 0.7, width: 1, depth: 10 }, this.scene);
        var borda2 = BABYLON.MeshBuilder.CreateBox('borda', { height: 0.7, width: 1, depth: 10 }, this.scene);
        var borda3 = BABYLON.MeshBuilder.CreateBox('borda', { height: 0.7, width: 1, depth: 8 }, this.scene);
        var borda4 = BABYLON.MeshBuilder.CreateBox('borda', { height: 0.7, width: 1, depth: 8 }, this.scene);

        borda1.position.y = 0.1;
        borda1.position.z = 4.5;
        borda1.rotation.y = Math.PI / 2;
        borda1.material = this.materialsTabuleiro[2];

        borda2.position.y = 0.1;
        borda2.position.z = -4.5;
        borda2.rotation.y = Math.PI / 2;
        borda2.material = this.materialsTabuleiro[2];

        borda3.position.y = 0.1;
        borda3.position.x = 4.5;
        borda3.material = this.materialsTabuleiro[2];

        borda4.position.y = 0.1;
        borda4.position.x = -4.5;
        borda4.material = this.materialsTabuleiro[2];

        return this.tabuleiro;
    }

    CriarMaterials() {
        var madeiraLightMaterial = new BABYLON.StandardMaterial("MadeiraD", scene);
        madeiraLightMaterial.diffuseTexture = new BABYLON.Texture("Texturas/MadeiraD.jpg", scene);
        madeiraLightMaterial.diffuseTexture.uScale = 1;
        madeiraLightMaterial.diffuseTexture.vScale = 1;

        var madeiraDarkMaterial = new BABYLON.StandardMaterial("MadeiraL", scene);
        madeiraDarkMaterial.diffuseTexture = new BABYLON.Texture("Texturas/MadeiraL.jpg", scene);
        madeiraDarkMaterial.diffuseTexture.uScale = 1;
        madeiraDarkMaterial.diffuseTexture.vScale = 1;

        var madeiraBorda = new BABYLON.StandardMaterial("MadeiraBorda", scene);
        madeiraBorda.diffuseTexture = new BABYLON.Texture("Texturas/MadeiraBorda.jpg", scene);
        madeiraBorda.diffuseTexture.uScale = 1;
        madeiraBorda.diffuseTexture.vScale = 1;

        return [madeiraLightMaterial, madeiraDarkMaterial, madeiraBorda];
    }

    CriarCasa(x, y, z, material) {
        var casa = BABYLON.MeshBuilder.CreateBox('box', { height: 0.5, width: 1, depth: 1 }, this.scene);
        casa.material = material.clone();
        casa.material.id = material.id;
        casa.position.x = x;
        casa.position.y = y;
        casa.position.z = z;

        return casa;
    }
}