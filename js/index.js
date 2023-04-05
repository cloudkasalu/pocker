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

const lockSreen = ()=>{
  
  const container = document.querySelector("#gameBoard");
  container.requestFullscreen().catch((error) => {
    console.log( `${error}\n`);
  });

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

lockSreen()


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
  let identicalNumbers = false;
  let adjacentNumbers = false;
  
  for(let i = 0; i < arr.length; i++) {
    if(arr[i].number) {
      // Check for identical numbers
      for(let j = i + 1; j < arr.length; j++) {
        if(arr[i].number === arr[j].number) {
          identicalNumbers = true;
          break;
        }
      }
      
      // Check for adjacent numbers
      for(let j = i + 1; j < arr.length; j++) {
        if(arr[i].number + 1 === arr[j].number && arr[i].number !== arr[j].number) {
          adjacentNumbers = true;
          break;
        }
      }
    }
    
    // If both conditions are true, break out of the loop and return true
    if(identicalNumbers && adjacentNumbers) {
      return true;
    }
  }
  
  // If the loop completes without finding both conditions, return false
  return false;
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






