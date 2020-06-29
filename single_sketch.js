// Single-sketch example

function removeFromArray(arr,elt){
  for(var i=arr.length-1; i>=0;i--){
    if(arr[i]==elt){                   //linear search for elt, can be optimised 
      arr.splice(i,1);                //splice method removes 1 element starting from index i
    }
  }
}

function heuristic(a,b){
  var d = abs(a.i - b.i) + abs(a.j - b.j);  //manhattan heuristic
  return d;
}

var cols = 50;    //grid size can be user defined if we take these as inputs 
var rows = 27;
var grid = new Array(cols);  //grid data type

var openSet = [];  //set of discovered nodes that need to be expanded 
var closedSet = [];  //nodes that are already expended
var start;  //start node
var end;    //end node
var w,h;    //width and height of each cell in grid
var path=[];   //array of nodes so that we can keep track of the path


function Spot(i,j){     //spot is an object having all properties and methods
  this.i = i;    //i and j are indices
  this.j = j;
  this.f = 0;    //f,g,h scores
  this.g = 0;
  this.h = 0;
  this.neighbors = [];  //array to store all neighbors of a spot
  this.previous=undefined;  //parent of a spot
  this.wall = false;  //wall == obstacle

  if(random(1) < 0.2){
    this.wall = true;   //using randomly generated numbers to add random obstacles
  }

  this.show = function(col){
    fill(col);  //this function adds color to the node on which it is called
    if(this.wall){
      fill(0);    //overwrite the above color with black if it is an obstacle
    }
    noStroke();
    rect(this.i * w,this.j * h,w-1,h-1); //fill color as a rectangle, arguements are the location and dimension in pixel
  }

  this.addNeighbors = function(){   //adds all neighbors of a spot in a very bad way, can optimize, reduce lines of code
    var i = this.i;
    var j = this.j;
    if(i<cols-1){              
    this.neighbors.push(grid[i+1][j]);
    }
    if(j<rows-1){
    this.neighbors.push(grid[i][j+1]);
    }
    if(i>0){
    this.neighbors.push(grid[i-1][j]);
    }
    if(j>0){
    this.neighbors.push(grid[i][j-1]);
    }
    if(i>0 && j>0){
      this.neighbors.push(grid[i-1][j-1]);
    }
    if(i<cols-1 && j>0){
      this.neighbors.push(grid[i+1][j-1]);
    }
    if(i>0 && j<rows-1){
      this.neighbors.push(grid[i-1][j+1]);
    }
    if(i<cols-1 && j<rows-1){
      this.neighbors.push(grid[i+1][j+1]);
    }
  }
}

function setup (){
  createCanvas (1200, 700);  //crates an HTML canvas of black color
  console.log('A*');

  w=width/cols;  //set dimensions of nodes
  h=height/rows;

  //making a 2D array
  for(var i=0; i<cols; i++){
    grid[i]= new Array(rows); //every element is an array
  }

  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      grid[i][j]= new Spot(i,j); //every elem is of Spot type
    }
  }

  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      grid[i][j].addNeighbors(grid); //adding neighbors to all nodes
    }                                //can optimize to add neighbors of required nodes only
  }

  start = grid[0][0]; //set start and end
  end = grid[44][24];
  start.wall = false; //start or end can't be an obstacle
  end.wall = false;

  openSet.push(start);   //add start to openset

console.log(grid);

}



function draw(){   //this goes on looping until noLoop or return happens

  background(0);  //color of canvas 
  
  if (openSet.length > 0){

    var winner = 0;     //winner is the node with lowest f value
    for(var i=0; i< openSet.length; i++){
      if(openSet[i].f < openSet[winner].f){
        winner = i;           //can optimize, remove linearity
      }
    }
  

  var current = openSet[winner];

  if(current===end){         //reached the end
        noLoop();
    console.log("DONE");
  }
  removeFromArray(openSet,current); //now current node will be expanded so removed from the set of nodes to be expanded
  closedSet.push(current); 

  var neighbors = current.neighbors;  //array of neighbors of current
  for(var i = 0; i<neighbors.length; i++){  //loop over all neighbors- this is known as expanding
    var neighbor = neighbors[i];

    if(!closedSet.includes(neighbor) && !neighbor.wall){ //if not obstacle or not already in closed set
      var tempG = current.g +1;    //adding one in diagonal case is not accurate but good approximate measure
      var newPath = false; //true if parent node changes

      if(openSet.includes(neighbor)){
        if(tempG<neighbor.g){  //if new g value is better, keep it and we find a new path
          neighbor.g = tempG;
          newPath = true; //new previous (parent) is found
        }
        else {
          //do nothing, no new path
        }
      }
      else {
        neighbor.g=tempG;  //previous g value doesn't exist here
        newPath=true;
        openSet.push(neighbor); //push neighbor to be expanded 
      }
      if(newPath){
      neighbor.h = heuristic(neighbor,end); //update values if new path is found
      neighbor.f = neighbor.g + neighbor.h;
      neighbor.previous = current;
      }
    }
  }
  }

  else {
     console.log('no solution');
     noLoop();
     return;
     //no solution
  }
  

  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      grid[i][j].show(color(255)); //all nodes white in color on a black canvas
    }
  }

  for(var i=0; i<openSet.length; i++){
    openSet[i].show(color(0,255,0));  //openSet in green
  }

  for(var i=0; i<closedSet.length; i++){
    closedSet[i].show(color(255,0,0)); //closedSet in red
  }

  path = [];
    var temp = current;
    path.push(temp);
    while(temp.previous){ //backtrace the path through parents
      path.push(temp.previous);
      temp=temp.previous;
    }

  for(var i=0; i<path.length; i++){
    path[i].show(color(0,0,255));  //blue path
  }

  noFill();
  stroke(255);

  beginShape();
  for(var i=0; i<path.length; i++){
    vertex(path[i].i * w , path[i].j * h); //line to trace the path, has a bug
  }
  endShape();

  
}
