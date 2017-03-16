ig.module(
	'game.entities.leftwalljump'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityLeftwalljump = ig.Entity.extend({
	size: {x: 16, y: 16},
	
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 255, 0, 0.7)',
	
	target: null,
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.ALWAYS,
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
	},
	
	
	check: function( other ) {
        if(other instanceof EntityPlayer) {
            other.vel.y = 0;
            other.vel.x = 0;
            other.climbing = true;
            if( ig.input.pressed('jump') ) {
                other.vel.y = -200;
                other.vel.x = 100;
                other.climbing = false;
            }
        }
	},
	
	
	update: function(){}
});

});