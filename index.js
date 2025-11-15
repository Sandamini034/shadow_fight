const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background= new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc: './img/Ice-Background.png', 
})

const shop = new Sprite({
    position:{
        x:850,
        y:300
    },
    imageSrc: './img/Knight-Idle-Sheet.png',
    scale: 2.75,
    frameMax : 4
})

const player =  new Fighter({
    position:{
    x : 0,
    y : 0
},
velocity:{
    x:0,
    y:0
},
offset:{
    x:0,
    y:0
},
imageSrc: './img/Sprites/IDLE.png',
frameMax: 8,
scale: 3.0,
offset:{
    x:120,
    y:150
 },

 Sprites:{
    idle :{
        imageSrc: './img/Sprites/Idle.png',
        frameMax: 8
    },
    run :{
        imageSrc: './img/Sprites/Run.png',
        frameMax: 8,
        
    },
    runb :{
        imageSrc: './img/Sprites/run_backward.png',
        frameMax: 8,
        
    },
    jump :{
        imageSrc: './img/Sprites/Jump.png',
        frameMax: 2,
        
    },fall:{
        imageSrc: './img/Sprites/Fall.png',
        frameMax: 2,
        
    },attack1:{
        imageSrc: './img/Sprites/Attack1.png',
        frameMax: 4,
        
    }
 },attackBox:{
    offset:{
        x:170,
        y:70
    },
    width:100,
    height:50
 }
})

const enemy =  new Fighter({
    position:{
    x : 400,
    y : 100
},
velocity:{
    x:0,
    y:0
},
color: 'blue',
offset:{
    x:-50,
    y:0
},
imageSrc: './img/Sprites_3/Idle.png',
frameMax: 10,
scale: 3.0,
offset:{
    x:120,
    y:130
 },

 Sprites:{
    idle :{
        imageSrc: './img/Sprites_3/Idle.png',
        frameMax: 10
    },
    run :{
        imageSrc: './img/Sprites_3/Run.png',
        frameMax: 8,
        
    },
    run_forward:{
        imageSrc: './img/Sprites_3/Run_forward.png',
        frameMax: 8,
    },
    jump :{
        imageSrc: './img/Sprites_3/Jump.png',
        frameMax: 3,
        
    },fall:{
        imageSrc: './img/Sprites_3/Fall.png',
        frameMax: 3,
        
    },attack1:{
        imageSrc: './img/Sprites_3/Attack.png',
        frameMax: 13,
        
    }
 },
 attackBox:{
    offset:{
        x:-70,
        y:30
    },
    width:100,
    height:50
 }

})

enemy.draw()

console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && player.lastkey === 'a'){
        player.velocity.x = -5
        player.switchSprite('runb')
    }else if(keys.d.pressed && player.lastkey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    }else{
        player.switchSprite('idle')
    }

    //jumping
    if(player.velocity.y < 0){
        player.switchSprite('jump')
    }else if(player.velocity.y > 0){
        player.switchSprite('fall')
    }

    //Enemy movoment
    if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite('run_forward')
    }else if(keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }else{
        enemy.switchSprite('idle')
    }

    //jumping
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    //detect for collision
if(rectangularCollision({
    rectangle1: player,
    rectangle2: enemy
})
    && 
    player.isAttacking && player.framesCurrent === 2
){
    player.isAttacking = false
    enemy.health -= 20
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
}

//if player misses
if(player.isAttacking && player.framesCurrent === 2){
    player.isAttacking = false
}

if(rectangularCollision({
    rectangle1: enemy,
    rectangle2: player
})
    && enemy.isAttacking
){
    enemy.isAttacking = false
    player.health -= 20
    document.querySelector('#playerHealth').style.width = player.health + '%'
}
//end game base on health
if(enemy.health <=0 || player.health <=0){
determineWinner({player, enemy, timerId})
}
}

animate()

window.addEventListener('keydown', (event) =>{
    switch(event.key){
        case 'd':
            keys.d.pressed = true
            player.lastkey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastkey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break


            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastkey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastkey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'ArrowDown':
                enemy.attack()
                break
        
        }
})

window.addEventListener('keyup', (event) =>{
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
        //enemy keys
        switch(event.key){
        case 'ArrowRight':
                keys.ArrowRight.pressed = false
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = false
                break
    }
})