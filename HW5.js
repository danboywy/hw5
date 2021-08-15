//Haojie Zheng
//Haojie_zheng@student.uml.edu
//08/15/2021


//change to 100 tiles
pieces= [
	{"letter":"A", "value":1, "amount":9},
	{"letter":"B", "value":3, "amount":2},
	{"letter":"C", "value":3, "amount":2},
	{"letter":"D", "value":2, "amount":4},
	{"letter":"E", "value":1, "amount":12},
	{"letter":"F", "value":4, "amount":2},
	{"letter":"G", "value":2, "amount":3},
	{"letter":"H", "value":4, "amount":2},
	{"letter":"I", "value":1, "amount":9},
	{"letter":"J", "value":8, "amount":1},
	{"letter":"K", "value":5, "amount":1},
	{"letter":"L", "value":1, "amount":4},
	{"letter":"M", "value":3, "amount":2},
	{"letter":"N", "value":1, "amount":6},
	{"letter":"O", "value":1, "amount":8},
	{"letter":"P", "value":3, "amount":2},
	{"letter":"Q", "value":10, "amount":1},
	{"letter":"R", "value":1, "amount":6},
	{"letter":"S", "value":1, "amount":4},
	{"letter":"T", "value":1, "amount":6},
	{"letter":"U", "value":1, "amount":4},
	{"letter":"V", "value":4, "amount":2},
	{"letter":"W", "value":4, "amount":2},
	{"letter":"X", "value":8, "amount":1},
	{"letter":"Y", "value":4, "amount":2},
	{"letter":"Z", "value":10, "amount":1},
  {"letter":"_", "value": 2,"amount":2}
]//"creator":"Ramon Meza"

var drawntile = [];
var totalscore = 0;

//Start
$(document).ready(function() {
  //Drop number in holder
  $("#scrabble-tile-holder").droppable();
  set_15_boxes();
  set_holder();
});

//Submit word button
$("#next").click(function(){
  next()
  total_score()
});
//Reset
$("#reset").click(function(){
  reset()
  
});

//Create 15 boxes for one row scrabble.
function set_15_boxes(){
  for (var i = 0; i < 15; i++) {
      $('div#line').append("<div id=empty_space"+i+"></div"); 
  }

  //Set boxes size and make it droppable.
  var board_boxes = $("[id^='empty_space']");
  board_boxes.width(64);
  board_boxes.height(100);
  board_boxes.droppable({ 
      drop: function( event, ui) {
        box_pos = $(this).position();
        //Set auto drop in middle of box
        //Once the tile is placed on the Scrabble board, it can not be moved
        $("#"+ui.draggable.attr("id")).draggable("disable").css({top: box_pos.top + 20, left: box_pos.left+7, position:'absolute'});
      }, 
  });
  
}

//Drop 7 tiles in holder
function set_holder() {
  var pieces;
  for (var i = 0; i < 7; i++) {
    pieces = draw_piece();
      drawntile.push(pieces);
      //Add image
      tile_img(pieces, i);
  }
}

//Draw tile random from bag
function draw_piece() {
  var counttile = count_tile();
  var rand = Math.floor(Math.random() * counttile) + 1;
  //Only draw when there is piece in the bag
  if (counttile > 0) {
    for(var x in pieces) {
    rand = rand - pieces[x].amount;
      if (rand <= 0) {
        pieces[x].amount = pieces[x].amount - 1;
          //Show remaining tile
          counttile = counttile - 1;
          $("#remaining_tiles").text(counttile);
          return pieces[x];
      }
    }
  } 
  else {
    alert("No more tile in the bag.");
    location.reload();
  }
}

//Count tile
function count_tile() {
  var t = 0;
  for(var x in pieces){
    t = t + pieces[x].amount;
  }
  return t;
}

//Drop img
function tile_img(tile_info, tile_number){
  if (tile_info.letter == "_") {
    img_letter_name = "Blank";
    $('div#scrabble-tile-holder').append("<div class=tile id=\"tile"+tile_number+"\"> <img src=\"Scrabble_Tiles/Scrabble_Tile_"+ img_letter_name +".jpg\" style=\"width:"+ 50 +"px;height:"+ 50 +"\"></div>");
  }
  else{
    $('div#scrabble-tile-holder').append("<div class=tile id=\"tile"+tile_number+"\"> <img src=\"Scrabble_Tiles/Scrabble_Tile_"+ tile_info.letter +".jpg\" style=\"width:"+ 50 +"px;height:"+50+"\"></div>");
  }
  $('#tile'+tile_number).draggable({
    //Snap the img to one row scrabble
    snap: "[id ='line']",
    snapTolerance: 5,
    revert: "invalid",
    stop: function(event, ui) {
      //Calculate score
      calculate_score();
    }
  })
}

//Calculate the score
function calculate_score(){
  var score = 0;
  var doublescore=false;
  for(var i in drawntile){
    var tile = $("#tile"+i);
    
    for (var j = 0; j < 15; j++) {
      var box = $("#empty_space"+j);
      if (tile_is_in_box(tile.position(), box.position())) {
        //Double_word_score
        if(j == 2|| j==12){
          //double whole word
          doublescore = true;
          score = score + drawntile[i].value;
          //Double_letter_score
        } else if(j == 6|| j==8){
          score = score + (drawntile[i].value * 2);
        } else {
          score = score + drawntile[i].value;
        }
      }
    }
  } 
  //double whole word
  if(doublescore){
    score=score*2;
  }
  $("#score").text(score);
}

// check the tile is in the box
function tile_is_in_box(tile_pos, box_pos){
  var top_dif = tile_pos.top - box_pos.top;
  var left_dif = tile_pos.left - box_pos.left;
  if(top_dif >= -20 && top_dif <= 20 && left_dif >= -20 && left_dif <= 20) {
    return true;
  } else {
    return false;
  }
}

//Totle Score
function total_score() {
  $("#score").text();
  totalscore = totalscore + parseInt($("#score").text());
  //Total 
  $("#total_score").text(totalscore); 
  //Reset score
  $("#score").text(0);
}

//Next button
function next() {
  for(var i in drawntile){
    var tile = $("#tile"+i);
    for (var j = 0; j < 15; j++) {
      var box = $("#empty_space"+j);
      //Remove the tile that is in board box
      if (tile_is_in_box(tile.position(), box.position())) { 
        $("#tile"+i).remove();
        //Replace the tile
        piece = draw_piece();
        drawntile[i] = piece;
        tile_img(piece, i);
      }
    }
  }
}

//Reset button
function reset(){
  window.location.reload(false);
}
