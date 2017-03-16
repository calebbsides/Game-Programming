ig.module(
	'game.entities.enemy'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityEnemy = ig.Entity.extend({
    animSheet: new ig.AnimationSheet( 'media/enemy.png', 25, 32 ),
    size: {x: 20, y:30},
    
    maxVel: {x: 100, y: 100},
    flip: false,
    speed: 14,
    gravityFactor: 0,
    
    health: 10,
    
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,
    
    attackTimer: null,
    
    init: function( x, y, settings ) {
    	this.parent( x, y, settings );
        
        this.attackTimer = new ig.Timer();
        
    	this.addAnim('walk', .07, [0,1,2,3,4,5]);
    },
    
    update: function() {
    	// near an edge? return!
    	if( !ig.game.collisionMap.getTile(
    		this.pos.x + (this.flip ? +4 : this.size.x -4),
    			this.pos.y + this.size.y+1
    		)
    	) {
    		this.flip = !this.flip;
    	}
    	var xdir = this.flip ? -1 : 1;
    	this.vel.x = this.speed * xdir;
    	this.currentAnim.flip.x = this.flip;
        
        if(this.attackTimer.delta() >= 5) {
            this.attackTimer.reset();
            ig.game.spawnEntity( EntityEnemyShuriken , this.pos.x, this.pos.y, {flip:this.flip} );
        }
        
    	this.parent();
    },
    
    handleMovementTrace: function( res ) {
    	this.parent( res );
    	// collision with a wall? return!
    	if( res.collision.x ) {
    		this.flip = !this.flip;
    	}
    },
    
    check: function( other ) {
        if(other.attacking)
            this.kill();
    },
    
    receiveDamage: function(value){
        this.parent(value);
        if(this.health > 0)
    		ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {particles: 2, colorOffset: 1});
    },
    
    kill: function(){
        this.parent();
        ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {colorOffset: 1});
    }
});
    
    EntityEnemyShuriken = ig.Entity.extend({
        size: {x: 8, y: 8},
        animSheet: new ig.AnimationSheet( 'media/flyingShuriken.png', 8, 8 ),
        maxVel: {x: 100, y: 0},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
            
        init: function( x, y, settings ) {
            this.parent( x + (settings.flip ? -4 : 8) , y+16, settings );
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
            other.receiveDamage( 25, this );
            this.kill();
        }
    });//entity shuriken
});
