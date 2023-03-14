
var main_stack = []
var player_stack = []
var discard_stack = []

const mainStackCard = document.querySelector('.main-stack-card');
const playerStack = document.querySelector('.player-stack');
const discardStack = document.querySelector('.player-discard')

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

window.addEventListener("load", (event) => {
    console.log("page is fully loaded");

    for(var i = 0; i < 3; i++ ){
        let randNum = Math.floor(Math.random()*main_stack.length);
        let randCard = main_stack.filter(card => card.name === main_stack[randNum].name)

        main_stack = main_stack.filter(card => card.name !== main_stack[randNum].name)
        player_stack = player_stack.concat(randCard)

      //   console.log( "player")
      //   console.log( player_stack)
      //   console.log("main")
      //   console.log(main_stack)
    }

    displayPlayerStack()
  });


  displayPlayerStack = ()=>{
   playerStack.innerHTML = player_stack.map( (card) =>{
      return  `<div class="card-container card">
               <img src="${card.src}" alt="${card.name}" id="${card.name}" draggable="true" class="card" >   
               </div>`
      
   }).join('');
  }

  displayDiscardStack = ()=>{

    console.log('working' + discard_stack)
    discardStack.innerHTML = discard_stack.map((card)=>{
      return `<img src="${card.src}" alt="${card.name}" id="${card.name}" draggable="true" class="card" >`
    })
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
   if(   hasWon.hasAdjacentNumbers === true && hasWon.hasIdenticalNumbers === true ){
    alert("You've Won!!! refresh the broswer.")
   }
})


// const card = document.querySelectorAll(".card");
playerStack.addEventListener("dragstart", (e)=>{
  console.log(e.target.dataTransfer)
  if(e.target.classList.contains('card') && player_stack.length === 4){
   dragStart(e)
  }
})

discardStack.addEventListener('dragenter', dragEnter)
discardStack.addEventListener('dragover', dragOver);
discardStack.addEventListener('dragleave', dragLeave);
discardStack.addEventListener('drop', drop);
function dragStart (e){
   console.log('dragstart')
   
   e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
        e.target.classList.add('hide');
    }, 0);
 }

 function dragEnter(e) {
   e.preventDefault();
   e.target.classList.add('drag-over');
}

function dragOver(e) {
   e.preventDefault();
   e.target.classList.add('drag-over');
}

function dragLeave(e) {
   e.target.classList.remove('drag-over');
}


 function drop(e) {
   e.target.classList.remove('drag-over');

   // get the draggable element
   const id = e.dataTransfer.getData('text/plain');

    const discarded_card = player_stack.filter(card => card.name === id)
    if(discarded_card !== 0){
      discard_stack.push(...discarded_card)
    }

    player_stack = player_stack.filter(card=> card.name !== id)

    displayDiscardStack()
    displayPlayerStack()

  //  const draggable = document.getElementById(id);
  //  // add it to the drop target
  //  e.target.appendChild(draggable);

  //  // display the draggable element
  //  draggable.classList.remove('hide');
}







function checkArray(arr) {
   let hasIdenticalNumbers = false;
   let hasAdjacentNumbers = false;
 
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
 
     // Check for adjacent numbers
     for (let j = i + 1; j < arr.length; j++) {
       const otherItem = arr[j];
       const otherItemNumber = otherItem.number;
 
       if (currentItemNumber === otherItemNumber - 1 || currentItemNumber === otherItemNumber + 1) {
         hasAdjacentNumbers = true;
         break;
       }
     }
 
     if (hasIdenticalNumbers && hasAdjacentNumbers) {
       // We found both conditions, so we can stop looping
       break;
     }
   }
  //  console.log({ hasIdenticalNumbers, hasAdjacentNumbers });
 
   return { hasIdenticalNumbers, hasAdjacentNumbers };
 }
 







