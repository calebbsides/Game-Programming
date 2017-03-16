ig.module(
    'game.entities.topdown'
)
.requires(
    'impact.entity'
)
.defines(function(){
    EntityTopdown = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/player.png', 25, 32 ),
        flip: false,
        
        collides: ig.Entity.COLLIDES.NEVER,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,
        
        size: { x:20, y:30},
        offset: { x: 5, y: 0},
        
        maxVel: {x: 100, y: 1000},
        friction: {x: 600, y: 0},
        accelGround: 100,
        accelAir: 50,
        gravityFactor: 0,
        
        deathTimer: null,
        
        startPos: null,
        
        init: function( x, y, settings ) {
            var framesPerRow = 41;
            var row = 0;
            var c = framesPerRow*row;
            
            this.startPos = { x:x , y:y };
            
            this.addAnim( 'idle', 0.5, [0]);
            row++;
            c = framesPerRow*row;
            this.addAnim( 'run', 0.3, [0+c, 1+c, 2+c, 3+c, 4+c, 5+c]);
        
            this.parent( x, y, settings);
        },
        
        update: function() {
            
            var accel = this.standing ? this.accelGround : this.accelAir;

            if(ig.input.state( 'right' ) ) {
                this.vel.x = 50;
                this.flip = false;
            }
            else if(ig.input.state( 'left' ) ) {
                this.vel.x = -50;
                this.flip = true;
            } else this.vel.x = 0;
            
            if(ig.input.state( 'up' ) ) {
                this.vel.y = -50;
            }            
            else if(ig.input.state( 'down' ) ) {
                this.vel.y = 50;
            } else this.vel.y = 0;

            if( this.vel.x != 0  || this.vel.y != 0) this.currentAnim = this.anims.run;
            else this.currentAnim = this.anims.idle;
            
            this.currentAnim.flip.x = this.flip;
            this.parent();
        },
        
        kill: function(){
            this.parent();
            
            ig.game.spawnEntity( EntityPlayer, this.startPos.x, this.startPos.y);
            ig.game.screen.x = 0;
            ig.game.screen.y = 0;
        },
        
        check: function( other ) {
            
        }

    });//entity player

});//defines
