ig.module( 
	'game.main' 
)
.requires(
    'impact.game',
    'game.levels.level1',
    'game.levels.level2',
    'game.levels.level3'
)

.defines(function(){

MyGame = ig.Game.extend({
    
        mapWidth: 0,
        mapHeight: 0,
        tilesize: 16,
    
        numBones: 0,
        lives: 3,
        statText: new ig.Font( 'media/myFont.png' ),
    
	init: function() {
        this.loadLevel( LevelLevel1 );
        
        this.mapWidth = ig.game.backgroundMaps[0].width * ig.game.backgroundMaps[0].tilesize;
        this.mapHeight = ig.game.backgroundMaps[0].height * ig.game.backgroundMaps[0].tilesize;
        
        ig.game.gravity = 100;
        
        ig.input.bind( ig.KEY.W, 'up' );
        ig.input.bind( ig.KEY.A, 'left' );
        ig.input.bind( ig.KEY.S, 'down' );
        ig.input.bind( ig.KEY.D, 'right' );
        
        ig.input.bind( ig.KEY.SPACE, 'jump' );
        ig.input.bind( ig.KEY.MOUSE1, 'attack' );
        ig.input.bind( ig.KEY.MOUSE2, 'switch' );
	},
    
	update: function() {
		this.parent();
        var player = this.getEntitiesByType(EntityPlayer)[0];
        if (player) {
            this.screen.x = player.pos.x - ig.system.width / 2;
            this.screen.y = player.pos.y - ig.system.height / 2;
        }
        
        var topdown = this.getEntitiesByType(EntityTopdown)[0];
        if (topdown) {
            this.screen.x = topdown.pos.x - ig.system.width / 2;
            this.screen.y = topdown.pos.y - ig.system.height / 2;
        }
        
        if(this.lives <= 0) {
            this.lives = 3;
            this.init();
        }
	},
	
	draw: function() {
		this.parent();
        
        var player = this.getEntitiesByType(EntityPlayer)[0];
        
        if(player) {
            this.statText.draw( "LIVES: " + ig.game.lives, 10, 10);
            this.statText.draw( "HEALTH: " + player.health, 10, 30);
            this.statText.draw( "BONES:" + this.numBones + "/5", 10, 50);
        }
        
        var topdown = this.getEntitiesByType(EntityTopdown)[0];
        if (topdown) {
             this.statText.draw( "BONES:" + this.numBones + "/5", 10, 10);
        }
        
	},
});

StartScreen = ig.Game.extend({
    instructText: new ig.Font( 'media/myFont.png' ),
    background: new ig.Image('media/StartScreen.png'), 
        
    init: function() {
        ig.input.bind( ig.KEY.SPACE, 'start'); 
    },
                        
    update: function() { 
        if(ig.input.pressed ('start')){
            ig.system.setGame(MyGame) 
        }                     
        this.parent(); 
    },
            
    draw: function() { 
        this.parent();
        this.background.draw(0,0);
        var x = ig.system.width / 2;
        var y = ig.system.height - 30;
        this.instructText.draw( 'Press Spacebar To Start', x, y, ig.Font.ALIGN.CENTER ); 
    }
});
    
ig.main( '#canvas', StartScreen, 60, 500, 160, 1 );


});

