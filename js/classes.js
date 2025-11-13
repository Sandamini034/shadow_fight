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
        Sprites
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
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking 
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.frameHold = 5
        this.Sprites = Sprites

        for (const sprite in this.Sprites){
            Sprites[sprite].image = new Image()
            Sprites[sprite].image.src = Sprites[sprite].imageSrc
        }
    }

    update(){
        this.draw()
        this.animateFrames()

         //attack boxes
       
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        //gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0; 
            this.position.y = 330
        }else this.velocity.y +=gravity
    }

    attack(){
        this.isAttacking = true
        setTimeout(() =>{
            this.isAttacking = false
        }, 100)
    }

    switchSprite(sprite){
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
        }
    }
}
