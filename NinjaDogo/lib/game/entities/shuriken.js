ig.module(
	'game.entities.shuriken'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityShuriken = ig.Entity.extend({
	size: {x: 16, y: 16},
	
	target: null,
    gravityFactor: 0,
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,
    
    animSheet: new ig.AnimationSheet( 'media/shuriken.png', 16, 16 ),
	
	init: function( x, y, settings ) {
        this.addAnim( 'idle', 1, [0]);
		this.parent( x, y, settings );
	},
	
	check: function( other ) {
        if(other.availableWeapons != other.maxWeaopns) 
            other.availableWeapons++;
        other.currentWeapon = 3;
        this.kill();
	}
});

});