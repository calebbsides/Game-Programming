ig.module(
	'game.entities.sword'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntitySword = ig.Entity.extend({
	size: {x: 5, y: 16},
	
	target: null,
    gravityFactor: 0,
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,
    
    animSheet: new ig.AnimationSheet( 'media/sword.png', 5, 16 ),
	
	init: function( x, y, settings ) {
        this.addAnim( 'idle', 1, [0]);
		this.parent( x, y, settings );
	},
	
	check: function( other ) {
        if(other.availableWeapons != other.maxWeapons)
            other.availableWeapons++;
        other.currentWeapon = 2;
        this.kill();
	}
});

});