class Scene2 extends Phaser.Scene {
    constructor() {
        super("scene_2")
    }

    init(data) {
        this.y = data.player_y_pos
        this.playerId = data.playerId
        console.log(this.playerId)
    }

    preload() {
        this.load.spritesheet('character', 'assets/character.png', {frameWidth: 32, frameHeight: 48})

        this.load.spritesheet('knight', 'assets/knight.png', {frameWidth: 32, frameHeight: 48})
        this.load.spritesheet('oldman', 'assets/oldman.png', {frameWidth: 32, frameHeight: 56})
        this.load.spritesheet('archer', 'assets/archer_f.png', {frameWidth: 32, frameHeight: 48})
        this.load.spritesheet('whitemage', 'assets/whitemage.png', {frameWidth: 32, frameHeight: 48})

        this.load.image('background', 'assets/background1.png')
        this.load.image('xpotion', 'assets/xpotion.gif')
        this.load.image('echoherbs', 'assets/echoherbs.gif')
        this.load.image('bronzeshield', 'assets/bronzeshield.gif')
        this.load.image('giantaxe', 'assets/giantaxe.gif')
        this.load.image('crystalmail', 'assets/crystalmail.gif')

        this.load.image('shuriken', 'assets/shuriken.gif')
        // this.load.audio('aog', 'assets/aog.mp3')
        // this.load.audio('requiem', 'assets/requiem.mp3')

    }

    create() {

        // Create chatbox input text field and submit button
        this.userInput = document.createElement('input')
        this.userInput.type = "text"
        this.userInput.style = 'width: 500px; padding: 10px'
        
        let submitBtn = document.createElement('button')
        submitBtn.style = 'padding: 10px'
        submitBtn.innerText = "..."

        this.itemBtn = document.createElement('button')
        this.itemBtn.style = 'padding: 10px'
        this.itemBtn.innerText = 'Items'

        this.saveBtn = document.createElement('button')
        this.saveBtn.style = 'padding: 10px'
        this.saveBtn.innerText = 'Save'

        this.inventoryLabel = document.createElement('label')
        this.inventoryLabel.style = 'padding: 10px; width: 450px; color: white; border: 1px solid black'
        this.inventoryLabel.innerText = ''

        let userInputElement = this.add.dom(this.sys.canvas.width / 2, this.sys.canvas.height - 50, this.userInput).setDepth(1)
        let submitBtnElement = this.add.dom(this.sys.canvas.width / 2 + 290, this.sys.canvas.height - 50, submitBtn).setDepth(1)
        let itemBtnElement = this.add.dom(this.sys.canvas.width / 2 - 300, this.sys.canvas.height - 50, this.itemBtn).setDepth(1)
        let inventoryLabelElement = this.add.dom(this.sys.canvas.width / 2, this.sys.canvas.height - 150, this.inventoryLabel).setDepth(1)
        let saveBtnElement = this.add.dom(this.sys.canvas.width / 2 - 360, this.sys.canvas.height - 50, this.saveBtn).setDepth(1)

        let areItemsShown = false

        // submitBtnElement.addListener('click')
        // submitBtnElement.on('click', () => {
        //     if (this.userInput.value !== "") {
        //         this.player.createSpeechBubble(this.userInput.value)
        //         const payLoad = {
        //             "playerId": this.playerId,
        //             "method": "chat",
        //             "body": this.userInput.value,
        //             "x": this.player.x,
        //             "y": this.player.y
        //         }
        //         this.ws.send(JSON.stringify(payLoad))
        //     }           
        // })

        itemBtnElement.addListener('click')
        itemBtnElement.on('click', () => {
            if (areItemsShown === false) {
                fetch('http://localhost:3000/items')
                .then(r => r.json())
                .then(items => items.forEach((item) => {
                    this.inventoryLabel.textContent += item.name + " "
                }))
                areItemsShown = !areItemsShown
            } else {
                areItemsShown = !areItemsShown
                this.inventoryLabel.textContent = ""
            }
        })

        saveBtnElement.addListener('click') 
        saveBtnElement.on('click', () => {
            const newData = {
                "x": this.player.x,
                "y": this.player.y
            }
            const playerURL = this.playerId
            fetch(`http://localhost:3000/players/${playerURL}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData)
            })
            .then(r => r.json())
            .then(data => {console.log(playerURL, this.player.x, this.player.y)})
        })

        this.playerFacing = {
            'left': 'LEFT',
            'right': 'RIGHT',
            'up': 'UP',
            'down': 'DOWN'
        }
        this.currentFacing = this.playerFacing.up


        let bg = this.add.sprite(0,0, 'background')
        bg.setOrigin(0, 0)
        bg.displayWidth = this.sys.canvas.width
        bg.displayHeight = this.sys.canvas.height
        this.scale.displaySize.setAspectRatio(bg.displayWidth/bg.displayHeight.height)
        this.scale.refresh()

        this.anims.create({key: 'idle', frames: this.anims.generateFrameNames('character', {start: 0, end: 0})})
        this.anims.create({key: 'down', frames: this.anims.generateFrameNames('character', {start: 0, end: 3})})
        this.anims.create({key: 'left', frames: this.anims.generateFrameNames('character', {start: 4, end: 7})})
        this.anims.create({key: 'right', frames: this.anims.generateFrameNames('character', {start: 8, end: 11})})
        this.anims.create({key: 'up', frames: this.anims.generateFrameNames('character', {start: 12, end: 15})})

        this.anims.create({key: 'oldman-idle', frames: this.anims.generateFrameNames('oldman', {start: 0, end: 0})})
        this.anims.create({key: 'oldman-down', frames: this.anims.generateFrameNames('oldman', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'oldman-left', frames: this.anims.generateFrameNames('oldman', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'oldman-right', frames: this.anims.generateFrameNames('oldman', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'oldman-up', frames: this.anims.generateFrameNames('oldman', {start: 12, end: 15}), repeat: -1, frameRate: 5})        
        
        this.anims.create({key: 'knight-idle', frames: this.anims.generateFrameNames('knight', {start: 0, end: 0})})
        this.anims.create({key: 'knight-down', frames: this.anims.generateFrameNames('knight', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'knight-left', frames: this.anims.generateFrameNames('knight', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'knight-right', frames: this.anims.generateFrameNames('knight', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'knight-up', frames: this.anims.generateFrameNames('knight', {start: 12, end: 15}), repeat: -1, frameRate: 5})
        
        this.anims.create({key: 'archer-idle', frames: this.anims.generateFrameNames('archer', {start: 0, end: 0})})
        this.anims.create({key: 'archer-down', frames: this.anims.generateFrameNames('archer', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'archer-left', frames: this.anims.generateFrameNames('archer', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'archer-right', frames: this.anims.generateFrameNames('archer', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'archer-up', frames: this.anims.generateFrameNames('archer', {start: 12, end: 15}), repeat: -1, frameRate: 5})
       
        this.anims.create({key: 'whitemage-idle', frames: this.anims.generateFrameNames('whitemage', {start: 0, end: 0})})
        this.anims.create({key: 'whitemage-down', frames: this.anims.generateFrameNames('whitemage', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'whitemage-left', frames: this.anims.generateFrameNames('whitemage', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'whitemage-right', frames: this.anims.generateFrameNames('whitemage', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'whitemage-up', frames: this.anims.generateFrameNames('whitemage', {start: 12, end: 15}), repeat: -1, frameRate: 5})
    

        this.item1 = new Item({scene: this, key: "xpotion"})
        this.item2 = new Item({scene: this, key: "echoherbs"})
        this.item3 = new Item({scene: this, key: "bronzeshield"})
        this.item4 = new Item({scene: this, key: "giantaxe"})
        this.item5 = new Item({scene: this, key: "crystalmail"})

        this.player = new Player({scene: this, x: 60, y: this.y, key: "character", playerId: this.playerId})

        this.groupOfNpcs = this.add.group()
        this.groupOfItems = this.add.group()


        this.oldman = new Npc ({scene: this, x: 740, y: 450, key: "oldman", speech: "What are you doing in these parts, young man?"})
        this.knight = new Npc ({scene: this, x: 300, y: 450, key: "knight", speech: "Hey there..."})
        this.archer = new Npc ({scene: this, x: 400, y: 500, key: "archer", speech: "It's dangerous to go alone...."})
        this.whitemage = new Npc ({scene: this, x: 600, y: 200, key: "whitemage", speech: "Be careful with your items....."})

        this.groupOfNpcs.add(this.knight)
        this.groupOfNpcs.add(this.oldman)
        this.groupOfNpcs.add(this.archer)
        this.groupOfNpcs.add(this.whitemage)

        this.groupOfItems.add(this.item1)
        this.groupOfItems.add(this.item2)
        this.groupOfItems.add(this.item3)
        this.groupOfItems.add(this.item4)
        this.groupOfItems.add(this.item5)


        this.timedNpcEvent = this.time.addEvent({
            delay: 3000,
            callback: this.randomNpcMovement,
            callbackScope: this,
            loop: true
        })

        this.cursors = this.input.keyboard.createCursorKeys()
        this.talkKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)


        // this.bg_sound = this.sound.add('requiem', {loop: true, volume: 0.1})
        // this.bg_sound.play()

        this.physics.add.collider(this.player, this.groupOfNpcs, (player, group) => {
            if (this.input.keyboard.checkDown(this.talkKey, 2000)) {
                group.createSpeechBubble()

                fetch(`http://localhost:3000/items/`, {
                    method: "DELETE"
                })         
            } 
        })



        this.physics.add.overlap(this.player, this.groupOfItems, (player, group) => {

            fetch('http://localhost:3000/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({'pid': this.playerId, 'name': group.key})
            })
            .then(r => r.json())
            .then(data => {
                console.log("Item successfully logged to db")
            })
    
            group.destroy()
        })

    }

    update() {

        if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(350)
            this.player.anims.play('right', true)
            this.currentFacing = this.playerFacing.right

        }
        else if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-350)
            this.player.anims.play('left', true)
            this.currentFacing = this.playerFacing.left

        }
        else if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-350)
            this.player.anims.play('up', true)
            this.currentFacing = this.playerFacing.up


        }
        else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(350)
            this.player.anims.play('down', true)
            this.currentFacing = this.playerFacing.down

                
        } else {
            this.player.body.setVelocity(0)
        }

        if (this.input.keyboard.checkDown(this.attackKey, 1000)) {
            switch (this.currentFacing) {
                case 'LEFT':
                    this.shuriken = this.add.sprite(this.player.x, this.player.y, 'shuriken')
                    this.add.existing(this.shuriken)
                    this.physics.world.enable(this.shuriken)
                    this.shuriken.body.setVelocityX(-400)
                    break;
                case 'RIGHT':
                    this.shuriken = this.add.sprite(this.player.x, this.player.y, 'shuriken')
                    this.add.existing(this.shuriken)
                    this.physics.world.enable(this.shuriken)
                    this.shuriken.body.setVelocityX(400)
                    break;
                case 'UP':
                    this.shuriken = this.add.sprite(this.player.x, this.player.y, 'shuriken')
                    this.add.existing(this.shuriken)
                    this.physics.world.enable(this.shuriken)
                    this.shuriken.body.setVelocityY(-400)
                    break;
                case 'DOWN':
                    this.shuriken = this.add.sprite(this.player.x, this.player.y, 'shuriken')
                    this.add.existing(this.shuriken)
                    this.physics.world.enable(this.shuriken)
                    this.shuriken.body.setVelocityY(400)
                    break;
            }
        }

        if (this.player.y <= 50) {
            // this.bg_sound.stop()
            this.scene.start("scene_3", {"player_x_pos": this.player.x, "playerId": this.playerId})
        }  

        // this.cameras.main.setZoom(Phaser.Math.Clamp(this.cameras.main.zoom, 1.5, 1.5))

    }

    randomNpcMovement() {
        this.groupOfNpcs.getChildren().forEach(npc => {
            const randNumber = Math.floor((Math.random() * 4) + 1)

            switch (randNumber) {
                case 1: 
                    npc.anims.play(`${npc.key}-right`)
                    npc.body.setVelocityX(30)          
                    break;
                case 2:
                    npc.anims.play(`${npc.key}-left`)
                    npc.body.setVelocityX(-30) 
                    break;
                case 3:
                    npc.anims.play(`${npc.key}-up`)
                    npc.body.setVelocityY(-30) 
                    break;
                case 4:
                    npc.anims.play(`${npc.key}-down`)
                    npc.body.setVelocityY(30)        
                    break;
                default: 
                    npc.anims.play(`${npc.key}-idle`)
                    npc.body.setVelocityX(0)
            }

            setTimeout( () => {
                npc.body.setVelocityX(0)
                npc.body.setVelocityY(0)
            }, 500)

        })
        }

}


