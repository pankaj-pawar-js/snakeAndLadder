import { useState, useEffect } from "react";
import "./App.css";
import {getRandomNumber} from './service';

const SIZE=10;

function Marker(init){
  this.position = init || {x:0,y:0};

  this.move = function(step){
    if((this.position.x + step) > SIZE){
      this.position.y = this.position.y + 1;
      this.position.x = (this.position.x + step)%SIZE;
    } else {
      this.position.x = this.position.x + step;
    }
  }
}


function Huddles(start, end){
  this.start = {x: 1, y:0} || {x:getRandomNumber(SIZE),y:getRandomNumber(SIZE)};
  this.end = {x: 1, y:4} || {x:getRandomNumber(SIZE),y:getRandomNumber(SIZE)};
}


const markerObj = new Marker();
const allHuddles = [ new Huddles()];

console.log("allSnales : ", allHuddles);

function Board(props) {
  const {size} = props;
  const [diceNumber, setDiceNumber] = useState(null);
  const [boardState, setBoardState] = useState( () => {
    const arr = new Array(size).fill([]);
    return arr.map( v => new Array(size).fill({display: ""}) );
  } );

  /*
  {
    display: "",
    type: 'P' | 'S' | 'L' | ""
    pos: {
      start: {x,y},
      end: {x,y}
    }
  }
  
  */

  
  useEffect( () => {
    let mp = {...markerObj.position};
    let newMp = mp;
    if(diceNumber){
      markerObj.move(diceNumber);
      newMp = markerObj.position;
    }

    // if ladder is present
    const cell = boardState[newMp.y][newMp.x];
    if(cell.type === 'L'){
      newMp.y = cell.pos.end.y;
      newMp.x = cell.pos.end.x;
    } else if(cell.type === 'S'){
      newMp.y = cell.pos.start.y;
      newMp.x = cell.pos.start.x;
    }

    setBoardState( (prev) => {
      prev[mp.y][mp.x] = {display: "", type:""};
      prev[newMp.y][newMp.x] = {display : "P", type: "P"};

      return [...prev];
    } );
  }, [diceNumber] );

  // snake and ladder pos
  useEffect( () => {
    setBoardState( (prev) => {

      allHuddles.forEach( (h, i) => {

        let type="S";
        if(h.start.y < h.end.y || (h.start.y === h.end.y && h.start.x < h.end.x)){
          type = "L"
        } 
        
        prev[h.start.y][h.start.x] = {display: `${type}_${i}_start`, type, pos: h};
        prev[h.end.y][h.end.x] ={display:  `${type}_${i}_end`, type, pos: h};
      } );
      

      return [...prev];
    } );
  }, [] );

  const handleClick = (e) => {
    const number = getRandomNumber(6);
    setDiceNumber(1)
  }

  const createBoard = () => {
    const arr= [];

    for(let i=0;i<size;i++){
      const temp = [];
      for(let j=0;j<size;j++){
        temp.push( <span key={`col-${i}-${j}`} className={`cell ${boardState[i][j].type}`}> {boardState[i][j].display} </span>);
      }
      arr.push(<div key={`row-${i}`} className="row">{temp}</div>);
    }
    return arr;
  }

  return (
    <div className="board">
      <h1> Board </h1>
      <div>
        <button onClick={handleClick}>Roll it</button>
        {diceNumber}
      </div>
      {createBoard()}
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <Board size={SIZE}/>
    </div>
  );
}
