
//Creating the variables
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;
var bgcolor = 100;

function preload(){
  //trex animations
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  //Ground texture
  groundImage = loadImage("ground2.png");
  
  //image of the cloud
  cloudImage = loadImage("cloud.png");
  
  //Loading the images of 6 types of obstacles
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  //Gameover + restart images
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  //Loading the sounds for the game
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  //Creating the screen
  createCanvas(600, 200);
  
  //Creating the trex sprite
  trex = createSprite(50,180,20,50);
  
  //Adding animations to the trex
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  
  //Making the trex half size to suit the game
  trex.scale = 0.5;
  
  //Creating the ground sprite, applying the preloaded image to it andm ake it reset itself when it crosses half of the screen
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //Creating the gameover sprite and applying an image to it
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  //Creating the restart sprite with its image
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  //Scaling both gameover and restart image down so it suits the game better
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  //invisibleGround = createSprite(200,190,400,10);
  //invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  //Changing the collider so the trex doesn't hit the obstacles earlier than needed
  trex.setCollider("rectangle",0,-20,trex.width,trex.height);
 // trex.debug = true;
  //Setting the score to 0 
  score = 0;
  
}

function draw() {
  //Setting the background to a specified variable
  background(bgcolor);
  //displaying score
  text("Score: "+ score, 500,50);
  

  if(gameState === PLAY){
    //Making the gameover and restart images invisible while playing.
    gameOver.visible = false;
    restart.visible = false;
    //change the trex animation
      trex.changeAnimation("running", trex_running);
    //Making the ground scroll infinitely and speeding it up based on the score.
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    //If score is a multiple of 100 and is not equals to 0, the background changes to night mode.
    if(score % 100 === 0 && score>0){  
      //Night mode
      bgcolor = 50;
        
      }
    //If score is a multiple of 200 the background changes to day mode.
    if(score % 200 === 0){
      //Day mode
      bgcolor = 180;

       }
   
  //if the score reaches a multiple of 100 a checkpoint sound effect is played.
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    //Resetting the ground when it passes half of its width.
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    //Making it so the game ends whenever the trex touches an obstacle.
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        //jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  } //Closes the play if statement
  
  // If the gameState is in the end.
   else if (gameState === END) {
      //Displaying both gameOver and restart
      gameOver.visible = true;
      restart.visible = true;
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
      //Stopping the ground and the trex from moving.
      ground.velocityX = 0;
      trex.velocityY = 0
      
      //set lifetime of the game objects so that they are never destroyed
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     
     //Stopping the obstacles and clouds.
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
     
     //If the restart image is clicked
     if(mousePressedOver(restart)){
       //The game resets
       reset();
     }
   }
  
 
  //stop trex from falling down
  trex.collide(ground);
  //Logging the gameState stage
  console.log(gameState);
  //Drawing all the created sprites.
  drawSprites();
}




function spawnObstacles(){
  //If frameCount reaches a multiple of 60,
 if (frameCount % 60 === 0){
   //An obstacle is created and making it scroll towards the left.
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
 if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function reset(){
  //Changing the gameState to play, making the gameOver and restart images invisible again and delete any remaining clouds and obstacles, and resetting the score to 0.
 gameState = PLAY; 
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}

