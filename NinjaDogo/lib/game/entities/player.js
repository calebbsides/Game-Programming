ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity'
)
.defines(function(){
    EntityPlayer = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/player.png', 25, 32 ),
        flip: false,
        
        collides: ig.Entity.COLLIDES.NEVER,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,
        
        size: { x:20, y:30},
        offset: { x: 5, y: 0},
        health: 100,
        
        swimming: false,
        climbing: false,
        attacking: false,
        availableWeapons: 1,
        currentWeapon: 1,
        maxWeapon: 3,
        
        jump: 100,
        maxVel: {x: 100, y: 1000},
        friction: {x: 600, y: 0},
        accelGround: 100,
        accelAir: 50,
        
        deathTimer: null,
        
        startPos: null,
        
        init: function( x, y, settings ) {
            var framesPerRow = 41;
            var row = 0;
            var c = framesPerRow*row;
            
            this.startPos = { x:x , y:y };
            
            this.addAnim( 'idle', 0.5, [0, 1, 2, 3]);
            row++;
            c = framesPerRow*row;
            this.addAnim( 'run', 0.3, [0+c, 1+c, 2+c, 3+c, 4+c, 5+c]);
            row++;
            c = framesPerRow*row;
            this.addAnim( 'jump', 0.5, [0+c, 1+c, 2+c]);
            this.addAnim( 'fall', 0.5, [3+c, 4+c]);
            row++;
            c = framesPerRow*row;
            this.addAnim( 'kick', 0.1, [0+c, 1+c, 2+c, 3+c, 4+c]);
            row++;
            c = framesPerRow*row;
            this.addAnim( 'slice', 0.2, [0+c, 1+c]);
            row++;
            c = framesPerRow*row;
            this.addAnim( 'throw', 0.1, [0+c, 1+c]);
            row++;
            c = framesPerRow*row;
            this.addAnim( 'climb', 0.3, [0+c, 1+c]);
            this.addAnim( 'swim', 0.5, [2+c, 3+c, 4+c]);
        
            this.parent( x, y, settings);
        },
        
        update: function() {
            
            var accel = this.standing ? this.accelGround : this.accelAir;

            if( !this.climbing && ig.input.state( 'right' ) ) {
                this.accel.x = accel;
                this.flip = false;
            }
            else if( !this.climbing && ig.input.state( 'left' ) ) {
                this.accel.x = -accel;
                this.flip = true;
            }
            else this.accel.x = 0;
            
            if(ig.game.getEntityByName("water")) {
                if( this.touches(ig.game.getEntityByName("water")) ) {
                    ig.game.gravity = -200;
                    this.jump = -50;
                    this.swimming = true;
                } else {
                    ig.game.gravity = 200;
                    this.jump = 100;
                    this.swimming = false;
                }
            }
            
            if( (this.standing || this.swimming) && ig.input.pressed( 'jump' ) ) this.vel.y = -this.jump;
            
            if( this.availableWeapons > 1 && ig.input.pressed( 'switch' ) ) {
                this.currentWeapon++;
                if(this.currentWeapon > this.availableWeapons) this.currentWeapon = 1;
            }
            
            if( ig.input.pressed( 'attack' ) )  {
                this.anims.kick.rewind();
                this.anims.slice.rewind();
                this.anims.throw.rewind();
                if(this.currentWeapon == 3) 
                    ig.game.spawnEntity("EntityFlyingShuriken", this.pos.x, this.pos.y, {flip:this.flip} );
                this.attacking = true;
            }
            
            if( this.climbing && ig.input.pressed('up') ) {
               this.pos.y -= 5; 
            }
            
            
            if( this.anims.kick.loopCount > 0 )  {
                this.attacking = false;
            } else if( this.anims.slice.loopCount > 0 )  {
                this.attacking = false;
            } else if( this.anims.throw.loopCount > 0 ) {
                this.attacking = false;
            }
            
            if(this.attacking) {
                switch(this.currentWeapon) {
                        case(1): 
                            this.currentAnim = this.anims.kick;
                            break;
                        case(2): 
                            this.currentAnim = this.anims.slice;
                            break;
                        case(3):
                            this.currentAnim = this.anims.throw;
                            break;
                            
                }
            }
            else if(this.swimming) this.currentAnim = this.anims.swim;
            else if(this.climbing) this.currentAnim = this.anims.climb;
            else if(this.vel.y < 0 ) this.currentAnim = this.anims.jump;
            else if(this.vel.y > 0) this.currentAnim = this.anims.fall;
            else if( this.vel.x != 0 ) this.currentAnim = this.anims.run;
            else this.currentAnim = this.anims.idle;
            
            this.currentAnim.flip.x = this.flip;
            this.parent();
        },
        
        kill: function(){
            this.parent();
            ig.game.lives--;
            
            
            ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y);
            ig.game.spawnEntity( EntityPlayer, this.startPos.x, this.startPos.y);
            ig.game.screen.x = 0;
            ig.game.screen.y = 0;
        },
        
        receiveDamage: function(amount, from){
            ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {particles: 2, colorOffset: 1});
            this.parent(amount, from);
        },
        
        check: function( other ) {
            
        }

    });//entity player
    
    EntityFlyingShuriken = ig.Entity.extend({
        size: {x: 8, y: 8},
        animSheet: new ig.AnimationSheet( 'media/flyingShuriken.png', 8, 8 ),
        maxVel: {x: 200, y: 0},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
            
        init: function( x, y, settings ) {
            this.parent( x + (settings.flip ? -4 : 8) , y+8, settings );
            this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.addAnim( 'flying', 0.1, [0, 1] );
        },
        
        handleMovementTrace: function( res ) {
            this.parent( res );
            if( res.collision.x || res.collision.y ){
                this.kill();
            }
        },
        
        check: function( other ) {
            other.receiveDamage( 3, this );
            this.kill();
        }
    });//entity shuriken
    
    EntityDeathExplosion = ig.Entity.extend({
        lifetime: 1,
        callBack: null,
        particles: 25,
        
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            for(var i = 0; i < this.particles; i++)
                ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
            this.idleTimer = new ig.Timer();
        },
        
        update: function() {
            if( this.idleTimer.delta() > this.lifetime ) {
                this.kill();
                if(this.callBack)
                    this.callBack();
                return;
            }
        }
    });
    
    EntityDeathExplosionParticle = ig.Entity.extend({
        size: {x: 2, y: 2},
        maxVel: {x: 160, y: 200},
        lifetime: 2,
        fadetime: 1,
        bounciness: 0,
        vel: {x: 100, y: 30},
        friction: {x:100, y: 0},
        collides: ig.Entity.COLLIDES.LITE,
        colorOffset: 0,
        totalColors: 7,
        animSheet: new ig.AnimationSheet( 'media/blood.png', 2, 2 ),
        
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            var frameID = Math.round(Math.random()*this.totalColors);
            this.addAnim( 'idle', 0.2, [frameID] );
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
        },
        update: function() {
            if( this.idleTimer.delta() > this.lifetime ) {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime,
                1, 0
            );
            this.parent();
        }
    });

});//defines
