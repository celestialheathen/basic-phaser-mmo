class Player extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key, config.playerId)
       
        this.scene = config.scene

        config.scene.physics.add.existing(this)
        // this.body.setCollideWorldBounds(true)

        // this.body.setImmovable()  Commented out due to in scene1 able to walk through other npc and enemies
        config.scene.add.existing(this)
        this.setScale(1.5)

        // this.hp = new HealthBar({scene: this.scene, x: -8, y: -25})

    }

    createSpeechBubble(msg) {
        
        let bubble = this.scene.add.graphics({x: this.x + 30, y: this.y - 65})

        bubble.fillStyle(0xffffff, 1) 
        bubble.lineStyle(4, 0x565656, 1)
        bubble.strokeRoundedRect(0, 0, 150, 40, 16)
        bubble.fillRoundedRect(0, 0, 150, 40, 16)

        let content = this.scene.add.text(0, 0, msg, { fontSize: 12, color: 'black', align: 'center', wordWrap: {width: 150 - 20}})
        let b = content.getBounds()
        content.setPosition(bubble.x + 150 / 2 - b.width /2, bubble.y + 40 /2 - b.height /2)

        setTimeout(() => {bubble.destroy(); content.destroy()}, 2000)

    }

    // update(cursors) {
    //     if (cursors.right.isDown) {
    //         this.body.setVelocityX(350)
    //         this.anims.play('right', true)
    //         // const payLoad = {
    //         //     method: "update",
    //         //     "clientId": this.clientId,
    //         //     "x": this.x,
    //         //     "y": this.y
    //         // }
    //         // this.ws.send(JSON.stringify(payLoad))
    //     }
    //     else if (cursors.left.isDown) {
    //         this.body.setVelocityX(-350)
    //         this.anims.play('left', true)
    //         // const payLoad = {
    //         //     method: "update",
    //         //     "clientId": this.clientId,
    //         //     "x": this.x,
    //         //     "y": this.y
    //         // }
    //         // this.ws.send(JSON.stringify(payLoad))
    //     }
    //     else if (cursors.up.isDown) {
    //         this.body.setVelocityY(-350)
    //         this.anims.play('up', true)
    //         // const payLoad = {
    //         //     method: "update",
    //         //     "clientId": this.clientId,
    //         //     "x": this.x,
    //         //     "y": this.y
    //         // }
    //         // this.ws.send(JSON.stringify(payLoad))
    //     }
    //     else if (cursors.down.isDown) {
    //         this.body.setVelocityY(350)
    //         this.anims.play('down', true)
    //         // const payLoad = {
    //         //     method: "update",
    //         //     "clientId": this.clientId,
    //         //     "x": this.x,
    //         //     "y": this.y
    //         // }
    //         // this.ws.send(JSON.stringify(payLoad))
                
    //     } else {
    //         this.body.setVelocity(0)
    //     }

    //     this.hp.x = this.body.x
    //     this.hp.y = this.body.y
    // }

}