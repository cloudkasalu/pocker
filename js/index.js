// Screen Orientaion

var main_stack = []
var player_stack = []
var discard_stack = []

const mainStackCard = document.querySelector('.main-stack-cards');
const playerStack = document.querySelector('.player-stack');
const discardStack = document.querySelector('.player-discard')

const carddrop = new Audio('./media/carddrop.mp3');
const shuffling = new Audio('./media/shuffling-cards.mp3');

const getData = async () => {
    let response =  await fetch(
        '../data.json'
    )
    let json = await response.json(); 
    let cards = json.cards;
    main_stack = cards
    console.log(cards)
}
getData();

const fullScreen = () =>{

  const mobile = window.matchMedia("(max-width: 786px)");
  console.log(mobile.matches)
  if(mobile.matches){
      const container = document.querySelector("#gameBoard");
      container.requestFullscreen().catch((error) => {
        console.log( `${error}\n`);
      });
      lockSreen()
      console.log("right q")
  }
 document.querySelector('.waiting-board').classList.add("hidden");
}

const lockSreen = ()=>{

const oppositeOrientation = screen.orientation.type.startsWith("portrait")
? "landscape"
: "portrait";
screen.orientation
.lock(oppositeOrientation)
.then(() => {
  console.log(`Locked to ${oppositeOrientation}\n`);
})
.catch((error) => {
  console.log(`${error}\n`) ;
});

}

const playgame = document.querySelector('#playgame');

playgame.addEventListener('click', fullScreen)

window.addEventListener("load", (event) => {

    for(var i = 0; i < 3; i++ ){
        let randNum = Math.floor(Math.random()*main_stack.length);
        let randCard = main_stack.filter(card => card.name === main_stack[randNum].name);

        main_stack = main_stack.filter(card => card.name !== main_stack[randNum].name);
        player_stack = player_stack.concat(randCard)

      //   console.log( "player")
      //   console.log( player_stack)
      //   console.log("main")
      //   console.log(main_stack)
    }



    displayPlayerStack()
    // shuffling.play()
  });


  displayPlayerStack = ()=>{
   playerStack.innerHTML = player_stack.map( (card) =>{
      return  `<div class="card-container card">
               <img src="${card.src}" alt="${card.name}" id="${card.name}" onclick="select(this)" draggable="true" class="card pocker-card" >   
               </div>`
      
   }).join('');
  }

  displayDiscardStack = ()=>{

    console.log('working' + discard_stack)
    discardStack.innerHTML = discard_stack.slice(0,3).map((card)=>{
      return `<img src="${card.src}" alt="${card.name}" id="${card.name}"  draggable="true" class="card pocker-card" >`
    }).join('')
  }

  mainStackCard.addEventListener('click', ()=>{

   let randNum = Math.floor(Math.random()*main_stack.length);
   let randCard = main_stack.filter(card => card.name === main_stack[randNum].name)

   if(player_stack.length < 4){
      main_stack = main_stack.filter(card => card.name !== main_stack[randNum].name)
      player_stack = player_stack.concat(randCard)
   }

  //  console.log(randNum)
  //  console.log(main_stack)
  //  console.log(player_stack)

   displayPlayerStack()

   const hasWon = checkArray(player_stack)
   if( hasWon){
     alert("You've Won!!! refresh the broswer.")
   }
})


let currentCard = null;

function select(card){

  if(player_stack.length === 4){
    if (card == currentCard) {
      const id = card.id;
      const discarded_card = player_stack.filter(card => card.name === id)
      if(discarded_card !== 0){
        discard_stack.push(...discarded_card)
      }
      player_stack = player_stack.filter(card=> card.name !== id)
      displayDiscardStack()
      displayPlayerStack()
      carddrop.play();
      return;
    }
    // Deselect the current button (if any)
    if (currentCard) {
      currentCard.classList.remove("selected-card");
    }
  
    // Select the new button
    card.classList.add("selected-card");
    currentCard = card;
    carddrop.play();
    
  }
}


function checkArray(arr) {
  let hasIdenticalNumbers = false;
  let hasAdjacentNumbers = false;
  let identicalPairs = [];
  let adjacentPairs = [];
  let pairs = {};

  // Find identical pairs
  for (let i = 0; i < arr.length; i++) {
    if (pairs[arr[i].number] === 1) {
      pairs[arr[i].number]++;
      if (Object.values(pairs).filter(pair => pair === 2).length === 2) {
        crush();
        return false;
      } else if (pairs[arr[i].number] === 2) {
        identicalPairs.push(arr[i].number);
      }
    } else {
      pairs[arr[i].number] = 1;
    }
  }

  // Find adjacent pairs
  for (let i = 0; i < arr.length; i++) {
    const currentItem = arr[i];
    const currentItemNumber = currentItem.number;

    for (let j = i + 1; j < arr.length; j++) {
      const otherItem = arr[j];
      const otherItemNumber = otherItem.number;

      if (currentItemNumber === otherItemNumber - 1 || currentItemNumber === otherItemNumber + 1) {
        adjacentPairs.push([currentItemNumber, otherItemNumber]);
      }
    }
  }


  // Check if we found identical and adjacent pairs
  for (let i = 0; i < arr.length; i++) {
    const currentItem = arr[i];
    const currentItemNumber = currentItem.number;

    // Check for identical numbers
    for (let j = i + 1; j < arr.length; j++) {
    const otherItem = arr[j];
    const otherItemNumber = otherItem.number;

    if (currentItemNumber === otherItemNumber) {
        hasIdenticalNumbers = true;
        break;
    }
    }

    if (identicalPairs.indexOf(currentItemNumber) === -1 && adjacentPairs.filter(pair => pair.indexOf(currentItemNumber) !== -1).length === 0) {
      // We found an item that is not part of identical or adjacent pairs, so return false
      return false;
    }else{
        hasAdjacentNumbers = true;
    }
  }

  if (hasIdenticalNumbers && hasAdjacentNumbers) {
       // We found both conditions, so we can stop looping

       console.log(identicalPairs[0])
       console.log(adjacentPairs)
       const identicalNumber = identicalPairs[0]
       const adjacentNumbers = []

       for(let i = 0; i < adjacentPairs.length; i++){
        let currentArray = adjacentPairs[i]
        
        currentArray.forEach(item =>{
            if(item !== identicalNumber){
                adjacentNumbers.push(item)
                console.log(adjacentNumbers)
            }
        })
       }


       let uniqueNums = [...new Set(adjacentNumbers)].slice(0,2);
       console.log(uniqueNums)
       if(((identicalNumber + 1 === uniqueNums[0] || identicalNumber - 1 === uniqueNums[0] ) &&  (identicalNumber + 1 === uniqueNums[1] || identicalNumber - 1 === uniqueNums[1] ))){
        return false;
       }else if(((identicalNumber + 1 === uniqueNums[0] || identicalNumber - 1 === uniqueNums[0] ) ||  (identicalNumber + 1 === uniqueNums[1] || identicalNumber - 1 === uniqueNums[1] ))){
        return true;
       }
       // (identicalNumber + 1 === adjacentNumber &&  indenticalNumber - 1 === adjacentNumber)  return false
       // (identicalNumber + 1 === ajacentNumber || indenticalNumber - 1 === adjacentNumber ) return true
       return true;
     }

  return false;
}


function crush(pairs) {
  console.log("Crash!");
  console.log(pairs)
  // Handle the crash however you want

}

 
 


var elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}






