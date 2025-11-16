class Sprite {
    constructor({position, imageSrc, scale = 1, frameMax = 1,offset={x:0,y:0}}) {   
        this.position = position
        this.width = 50
        this.height = 200
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.frameMax = frameMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.frameHold = 50
        this.offset = offset
    }

    draw(){
        c.drawImage(
            this.image, 
            this.framesCurrent * this.image.width / this.frameMax , 
            0,
            this.image.width/this.frameMax,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width/this.frameMax) * this.scale, 
            this.image.height * this.scale
        )
    }

    animateFrames(){
        this.framesElapsed++

        if(this.framesElapsed % this.frameHold === 0){   
        if(this.framesCurrent < this.frameMax - 1){
        this.framesCurrent++
        }else{
            this.framesCurrent = 0
        }
    }
}

    update(){
        this.draw()
        this.animateFrames()
}
}

class Fighter extends Sprite {
    constructor({
        position, 
        velocity, 
        color= 'red', 
        imageSrc,
        scale = 1,
        frameMax = 1,
        offset = {x:0,y:0},
        Sprites,
        attackBox = {offset:{},width:undefined,height:undefined}

    }) {
        super({
            position,
             imageSrc, 
             scale, 
             frameMax,
             offset
            })
       
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastkey
        this.attackBox = {
            position:{
                x:this.position.x,
                y:this.position.y
            } ,
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.isAttacking 
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.frameHold = 5
        this.Sprites = Sprites
        this.dead = false
        this.hasHit = false

        for (const sprite in this.Sprites){
            Sprites[sprite].image = new Image()
            Sprites[sprite].image.src = Sprites[sprite].imageSrc
        }
    }

    update(){
        this.draw()
        if (!this.dead)
        this.animateFrames()

         //attack boxes
       
         this.attackBox.position.x = (this.position.x - this.offset.x) + this.attackBox.offset.x
         this.attackBox.position.y = (this.position.y - this.offset.y) + this.attackBox.offset.y
         
        
        //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        //gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0; 
            this.position.y = 330
        }else this.velocity.y +=gravity
    }

    attack(){
        this.switchSprite('attack1')
        this.isAttacking = true
        this.hasHit = false
    }

    takeHit(){
            this.health -= 10

            if(this.health <= 0){
                this.switchSprite('death')
                    }else{
                        this.switchSprite('takeHit')
                    }
                }

    switchSprite(sprite){
        if(this.image === this.Sprites.death.image){
            if(this.framesCurrent === this.Sprites.death.frameMax -1)
            this.dead = true
            return
        }

        //overriding all other animations with the attack animation
        if(this.image === this.Sprites.attack1.image &&
            this.framesCurrent < this.Sprites.attack1.frameMax -1)
            return

         //override when fighter gets hit
         if(this.image === this.Sprites.takeHit.image && 
            this.framesCurrent < this.Sprites.takeHit.frameMax -1
        )
            retutrn

        switch(sprite){
            case 'idle':
                if (this.image !== this.Sprites.idle.image){
                    this.image = this.Sprites.idle.image
                    this.frameMax = this.Sprites.idle.frameMax
                    this.framesCurrent = 0
                }
                break;
            case 'run':
                if (this.image !== this.Sprites.run.image){
                    this.image = this.Sprites.run.image
                    this.frameMax = this.Sprites.run.frameMax
                    this.framesCurrent = 0
                }
                break;
                case 'runb':
                    if (this.image !== this.Sprites.runb.image){
                        this.image = this.Sprites.runb.image
                        this.frameMax = this.Sprites.runb.frameMax
                        this.framesCurrent = 0
                    }
                    break;
                    case 'run_forward':
                        if (this.image !== this.Sprites.run_forward.image){
                            this.image = this.Sprites.run_forward.image
                            this.frameMax = this.Sprites.run_forward.frameMax
                            this.framesCurrent = 0
                        }
                        break;   
            case 'jump':
                if (this.image !== this.Sprites.jump.image){
                    this.image = this.Sprites.jump.image
                    this.frameMax = this.Sprites.jump.frameMax
                    this.framesCurrent = 0
                }
                break;

                case 'fall':
                    if (this.image !== this.Sprites.fall.image){
                        this.image = this.Sprites.fall.image
                        this.frameMax = this.Sprites.fall.frameMax
                        this.framesCurrent = 0
                    }
                    break;

                    case 'attack1':
                        if (this.image !== this.Sprites.attack1.image){
                            this.image = this.Sprites.attack1.image
                            this.frameMax = this.Sprites.attack1.frameMax
                            this.framesCurrent = 0
                        }

                        if (this.framesCurrent === this.frameMax - 1) {
                            this.isAttacking = false
                            this.hasHit = false         // ensure the next attack is fresh
                        }
                        break;
                    
                        case 'takeHit':
                            if (this.image !== this.Sprites.takeHit.image){
                                this.image = this.Sprites.takeHit.image
                                this.frameMax = this.Sprites.takeHit.frameMax
                                this.framesCurrent = 0
                            }
                            break;

                            case 'death':
                                if (this.image !== this.Sprites.death.image){
                                    this.image = this.Sprites.death.image
                                    this.frameMax = this.Sprites.death.frameMax
                                    this.framesCurrent = 0
                                }
                                break;
        }
    }
}
