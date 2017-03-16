ig.module(
	'game.entities.trampoline'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityTrampoline = ig.Entity.extend({
	size: {x: 16, y: 16},
	
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 255, 0, 0.7)',
	
	target: null,
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.NEVER,
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
	},
	
	check: function( other ) {
        other.vel.y = -420;
	},
	
	
	update: function(){}
});

});