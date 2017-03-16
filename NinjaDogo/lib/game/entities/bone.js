ig.module(
	'game.entities.bone'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityBone = ig.Entity.extend({
	size: {x: 16, y: 16},
	
	target: null,
    gravityFactor: 0,
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,
    
    animSheet: new ig.AnimationSheet( 'media/bone.png', 16, 16 ),
	
	init: function( x, y, settings ) {
        this.addAnim( 'idle', 1, [0]);
		this.parent( x, y, settings );
	},
	
	check: function( other ) {
        ig.game.numBones++;
        this.kill();
	}
});

});