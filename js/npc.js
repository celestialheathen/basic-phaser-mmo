class Npc extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key, config.speech)

        this.scene = config.scene
        this.x = config.x 
        this.y = config.y
        this.key = config.key
        this.speech = config.speech

        config.scene.add.existing(this)
        config.scene.physics.add.existing(this)
        this.body.setImmovable()
        this.setInteractive()

        this.setScale(1.5)
        // this.on('pointerover', this.displayStatus)
    }


    createSpeechBubble() {
        
        let bubble = this.scene.add.graphics({x: this.x + 30, y: this.y - 65})

        bubble.fillStyle(0xffffff, 1) 
        bubble.lineStyle(4, 0x565656, 1)
        bubble.strokeRoundedRect(0, 0, 150, 40, 16)
        bubble.fillRoundedRect(0, 0, 150, 40, 16)

        let content = this.scene.add.text(0, 0, this.speech, { fontSize: 12, color: 'black', align: 'center', wordWrap: {width: 150 - 20}})
        let b = content.getBounds()
        content.setPosition(bubble.x + 150 / 2 - b.width /2, bubble.y + 40 /2 - b.height /2)

        setTimeout(() => {bubble.destroy(); content.destroy()}, 2000)

    }

    // displayStatus() {
    //     let bubble = this.scene.add.graphics({x: 80, y: 80})

    //     bubble.fillStyle(0xffffff, 1) 
    //     bubble.lineStyle(4, 0x565656, 1)
    //     bubble.strokeRoundedRect(0, 0, 250, 250, 16)
    //     bubble.fillRoundedRect(0, 0, 250, 250, 16)
    //     bubble.alpha = 0.3

    //     let content = this.scene.add.text(0, 0, "Chase Senpai, an old but wise man", { fontSize: 16, color: 'black', align: 'center', wordWrap: {width: 250 -20}})
    //     let b = content.getBounds()
    //     content.setPosition(bubble.x + 240 / 2 - b.width /2, bubble.y + 100 /2 - b.height /2)

    //     setTimeout(() => {bubble.destroy(); content.destroy()}, 3000)
    // }

}