class Scene1 extends Phaser.Scene {
    constructor() {
        super("scene_1")
    }

    init() {
        this.playerId = null
        this.x = null
        this.y = null
        this.ws = new WebSocket("ws://localhost:9090")
        this.ws.onmessage = (message) => {
            const response = JSON.parse(message.data)

            if (response.method === "connect") {
                this.playerId = response.playerId
                this.x = response.x 
                this.y = response.y 
                console.log("Player id set successfully " + this.playerId)
                console.log("Player x " + this.x)
                console.log("Player y " + this.y)
            }
        }
    }

    preload() {
        this.load.image('bg', 'assets/background.png')
        this.load.image('shuriken', 'assets/shuriken.gif')
        this.load.audio('morning', 'assets/morning_mood.mp3')
        this.load.spritesheet('character', 'assets/character.png', {frameWidth: 32, frameHeight: 48})
    }

    create() {
        // Store new player information into database 
        const playerData = {
            'pid': this.playerId,
            'x': this.x,
            'y': this.y
        }
        fetch('http://localhost:3000/players', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerData)
        })
        // .then(r => r.json())
        // .then(data => console.log("Logged new player to database"))


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

        // this.loadBtn = document.createElement('button')
        // this.loadBtn.style = 'padding: 10px'
        // this.loadBtn.innerText = 'Load'

        let userInputElement = this.add.dom(this.sys.canvas.width / 2, this.sys.canvas.height - 50, this.userInput).setDepth(1)
        let submitBtnElement = this.add.dom(this.sys.canvas.width / 2 + 290, this.sys.canvas.height - 50, submitBtn).setDepth(1)
        let itemBtnElement = this.add.dom(this.sys.canvas.width / 2 - 300, this.sys.canvas.height - 50, this.itemBtn).setDepth(1)
        let inventoryLabelElement = this.add.dom(this.sys.canvas.width / 2, this.sys.canvas.height - 150, this.inventoryLabel).setDepth(1)
        let saveBtnElement = this.add.dom(this.sys.canvas.width / 2 - 360, this.sys.canvas.height - 50, this.saveBtn).setDepth(1)
        // let loadBtnElement = this.add.dom(this.sys.canvas.width / 2 + 340, this.sys.canvas.height - 50, this.loadBtn).setDepth(1)

        let areItemsShown = false

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

        submitBtnElement.addListener('click')
        submitBtnElement.on('click', () => {
            if (this.userInput.value !== "") {
                this.player.createSpeechBubble(this.userInput.value)
                const payLoad = {
                    "playerId": this.playerId,
                    "method": "chat",
                    "body": this.userInput.value,
                    "x": this.player.x,
                    "y": this.player.y
                }
                this.ws.send(JSON.stringify(payLoad))
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


        // loadBtnElement.addListener('click')
        // loadBtnElement.on('click', () => {
        //     const playerURL = this.playerId
        //     fetch(`http://localhost:3000/players/${playerURL}`)
        //      .then(r => r.json())
        //      .then(data => {
        //         console.log(data) 
        //         // this.player.setPosition(data.x, data.y)
        //         console.log(data.x)
        //         console.log(data.y)
        //     })
        // })


        this.playerFacing = {
            'left': 'LEFT',
            'right': 'RIGHT',
            'up': 'UP',
            'down': 'DOWN'
        }
        this.currentFacing = this.playerFacing.up
        

        let bg = this.add.sprite(0,0, 'bg')
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


        this.otherPlayers = this.physics.add.group()

        const payLoad = {
            "method": "currentPlayers"
        }
        this.ws.send(JSON.stringify(payLoad))
        this.ws.onmessage = (message) => {
            const response = JSON.parse(message.data)

            if (response.method === "currentPlayers") {
                const playerId = response.playerId
                const x = response.x 
                const y = response.y 
                this.addOtherPlayers({x: x, y: y, playerId: playerId})
            }


            if (response.method === "disconnect") {
                console.log("A player disconnected, inside of scene1.js")
                this.removePlayer(response.playerId)
            } 

            if (response.method === "newPlayer") {
                console.log("a new player joined!")
                this.addOtherPlayers({x: response.x, y: response.y, playerId: response.playerId})
            }

            if (response.method === "updateLocation") {
                this.updateLocation({x: response.x, y: response.y, playerId: response.playerId})
            }

            if (response.method === "receiveChat") {
                this.broadcastMsg({x: response.x, y: response.y, playerId: response.playerId, body: response.body})
            }


        }

        this.createPlayer({scene: this, x: this.x, y: this.y, key: "character", playerId: this.playerId})

        // Add camera to follow main player
        // this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight)
        // this.cameras.main.startFollow(this.player)
        // this.cameras.main.setZoom(2)

        this.bg_sound = this.sound.add('morning', {loop: true, volume: 0.1})
        // this.bg_sound.play()

        this.cursors = this.input.keyboard.createCursorKeys()
        this.talkKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
    }

    update() {
        // this.player.update(this.cursors)

        if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(350)
            this.player.anims.play('right', true)
            this.currentFacing = this.playerFacing.right
            const payLoad = {
                method: "movement",
                "playerId": this.playerId,
                "x": this.player.x,
                "y": this.player.y
            }
            this.ws.send(JSON.stringify(payLoad))
        }
        else if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-350)
            this.player.anims.play('left', true)
            this.currentFacing = this.playerFacing.left
            const payLoad = {
                method: "movement",
                "playerId": this.playerId,
                "x": this.player.x,
                "y": this.player.y
            }
            this.ws.send(JSON.stringify(payLoad))
        }
        else if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-350)
            this.player.anims.play('up', true)
            this.currentFacing = this.playerFacing.up
            const payLoad = {
                method: "movement",
                "playerId": this.playerId,
                "x": this.player.x,
                "y": this.player.y
            }
            this.ws.send(JSON.stringify(payLoad))
        }
        else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(350)
            this.player.anims.play('down', true)
            this.currentFacing = this.playerFacing.down
            const payLoad = {
                method: "movement",
                "playerId": this.playerId,
                "x": this.player.x,
                "y": this.player.y
            }
            this.ws.send(JSON.stringify(payLoad))
                
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


        if (this.player.x >= this.sys.canvas.width - 40) {
            // this.bg_sound.stop()
            this.scene.start("scene_2", {"player_y_pos": this.player.y, "playerId": this.playerId})
        }   


        // this.cameras.main.setZoom(Phaser.Math.Clamp(this.cameras.main.zoom, 1.5, 1.5)
        }


        
        createPlayer(playerInfo) {
            this.player = new Player({scene: this, x: playerInfo.x, y: playerInfo.y, key: "character", playerId: this.playerId})
        }

        addOtherPlayers(playerInfo) {
            const otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, "character")
            otherPlayer.setTint(Math.random() * 0xffffff)
            otherPlayer.setScale(1.5)
            otherPlayer.playerId = playerInfo.playerId
            this.otherPlayers.add(otherPlayer)
        }

        removePlayer(playerId) {
            this.otherPlayers.getChildren().forEach(player => {
                if (player.playerId === playerId) {
                    player.destroy()
                }
            })
        }

        updateLocation(playerInfo) {
            this.otherPlayers.getChildren().forEach(player => {
                if (player.playerId === playerInfo.playerId) {
                    // console.log(player + "moved!")
                    // console.log("New x : " + playerInfo.x)
                    // console.log("New y : " + playerInfo.y)
                    player.setPosition(playerInfo.x, playerInfo.y)
                }
            })
        }

        broadcastMsg(info) {
            this.otherPlayers.getChildren().forEach(player => {
                if (player.playerId !== info.playerId) {

                    // console.log(info.x)
                    // console.log(info.y)
                    // console.log("Msg received: ", info.body)
                    // this.output.innerText = `Msg received from ${info.playerId}: ${info.body}`
                    let bubble = this.add.graphics({x: info.x + 30, y: info.y - 65})
            
                    bubble.fillStyle(0xffffff, 1) 
                    bubble.lineStyle(4, 0x565656, 1)
                    bubble.strokeRoundedRect(0, 0, 150, 40, 16)
                    bubble.fillRoundedRect(0, 0, 150, 40, 16)
            
                    let content = this.add.text(0, 0, info.body, { fontSize: 12, color: 'black', align: 'center', wordWrap: {width: 150 - 20}})
                    let b = content.getBounds()
                    content.setPosition(bubble.x + 150 / 2 - b.width /2, bubble.y + 40 /2 - b.height /2)
            
                    setTimeout(() => {bubble.destroy(); content.destroy()}, 3000)
                
                }
            })
        }
    
    }

