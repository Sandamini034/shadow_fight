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
        y:400
    },
    imageSrc: './img/Knight-Idle-Sheet.png',
    scale: 0.1,
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
        
    },
    takeHit:{
        imageSrc: './img/Sprites/Take Hit - white silhouette.png',
        frameMax: 4,
        
    },
    death:{
        imageSrc: './img/Sprites/Death.png',
        frameMax: 6,
        
    }
 },attackBox:{
    offset:{
        x:-50,
        y:200 
    },
    width:180,
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
    x:-150,
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
        
    },takeHit:{
        imageSrc: './img/Sprites_3/Get hit.png',
        frameMax: 3,
    },
    death:{
        imageSrc: './img/Sprites_3/Death.png',
        frameMax: 18,
        
    }
 },
 attackBox:{
    offset:{
        x:-100,
        y:150
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
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0,0,canvas.width, canvas.height)
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

    //detect for collision & enemy gets hit
if(rectangularCollision({
    rectangle1: player,
    rectangle2: enemy
})
    && 
    player.isAttacking && player.framesCurrent === 3
){
    enemy.takeHit()
    player.isAttacking = false
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
}

//if player misses
if(player.isAttacking && player.framesCurrent === 3){
    player.isAttacking = false
}

//this where our player gets hit
if(rectangularCollision({
    rectangle1: enemy,
    rectangle2: player
})
    && enemy.isAttacking && enemy.framesCurrent ===4
){
    player.takeHit()
    enemy.isAttacking = false
    document.querySelector('#playerHealth').style.width = player.health + '%'
}

//if enemy misses
if(enemy.isAttacking && enemy.framesCurrent === 4){
    enemy.isAttacking = false
}

//end game base on health
if(enemy.health <=0 || player.health <=0){
determineWinner({player, enemy, timerId})
}
}

animate()

window.addEventListener('keydown', (event) =>{
   if(!player.dead){
   
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
        }
    }

    if(!enemy.dead){
        switch(event.key){
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