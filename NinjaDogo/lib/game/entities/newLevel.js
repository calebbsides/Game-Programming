ig.module(
	'game.entities.newLevel'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityNewLevel = ig.Entity.extend({
	size: {x: 16, y: 16},
	
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 255, 0, 0.7)',
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.NEVER,
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
	},
	
	check: function( other ) {
        if(other instanceof EntityPlayer && ig.game.numBones == 5) {
              if( this.level ) {
                   var levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function( m, l, a, b ) {
                   return a.toUpperCase() + b;
              });
                   ig.game.loadLevelDeferred( ig.global['Level'+levelName] );
              }
        }
        ig.game.numBones = 0;
    },
	
	
	update: function(){}
});

});