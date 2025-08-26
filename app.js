const gameBoard = document.querySelector("#gameBoard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector('#info-display');
const width = 8;
let playerGo = 'white';
playerDisplay.textContent = 'white';

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, 
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, 
    rook, knight, bishop, queen, king, bishop, knight, rook
]

function createBoard(){
    startPieces.forEach((startPiece,i)=>{
        //add chess board with pieces
        const square = document.createElement('div');
        square.classList.add('square');
        square.innerHTML = startPiece;
        square.firstChild?.setAttribute('draggable', true);
        square.setAttribute('square-id', i);
        gameBoard.append(square);

         //set the color for squares
        const row = Math.floor((63-i)/8)+1;
        if(row % 2 === 0){
            square.classList.add(i % 2 === 0 ? 'beige' : 'brown');
        }else{
            square.classList.add(i % 2 === 0 ? 'brown' : 'beige');
        }

        //set the color for pieces
        if(i<=15){
            square.firstChild.firstChild.classList.add('black');
        }
        if(48<=i){
            square.firstChild.firstChild.classList.add('white');
        }

        reverseIds();


    });
}

createBoard();

const allSquares = document.querySelectorAll('.square');

//add dragging functionality
allSquares.forEach(square =>{
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
});

let startPositionId;
let draggedElement;

function dragStart(e){
    startPositionId = e.target.parentNode.getAttribute('square-id');
    draggedElement = e.target;
}

function dragOver(e){
    e.preventDefault();
}

function dragDrop(e){
    e.stopPropagation();
    const correctGo = draggedElement.firstChild.classList.contains(playerGo);
    const taken = e.target.classList.contains('piece');
    const valid = checkIfValid(e.target);
    const opponentGo = playerGo === 'white' ? 'black' : 'white';
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);
    
    if (correctGo){
        if(takenByOpponent&&valid){
            e.target.parentNode.append(draggedElement);
            e.target.remove();
            checkForWin();
            changePlayer();
            return;
        }
        if(taken && !takenByOpponent){
            infoDisplay.textContent = "you cannot go here";
            setTimeout(()=>infoDisplay.textContent = "", 2000);
            return;
        }
        if(valid){
            e.target.append(draggedElement);
            checkForWin();
            changePlayer();
            return;
        }
    }
    
}

function changePlayer(){
    if(playerGo === 'black'){
        playerGo = 'white';
        playerDisplay.textContent = 'white';
        reverseIds();
    }else{
        playerGo = 'black';
        playerDisplay.textContent = 'black';
        revertIds();
    }
}

function reverseIds(){
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square, i) => 
        square.setAttribute('square-id', (width*width-1)-i));
}

function revertIds(){
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square, i)=>
        square.setAttribute('square-id', i)
    )
}

function pieceNotPlacedAt(squareId){
    return !document.querySelector(`[square-id="${squareId}"]`).hasChildNodes();
}


function checkIfValid(target){
    const targetId = Number(target.getAttribute('square-id')||target.parentNode.getAttribute('square-id'));
    const startId = Number(startPositionId);
    const piece = draggedElement.id;

    switch(piece){
        case 'pawn':
            //starting position for pawns at the beggining of the game
            const starterRow = [8,9,10,11,12,13,14,15];
            //check if pawn is on its starting position
            if (
                starterRow.includes(startId)&&startId+width*2 === targetId&&pieceNotPlacedAt(targetId)&&pieceNotPlacedAt(targetId-8)||
                startId+width === targetId&&pieceNotPlacedAt(targetId)||
                //taking enemy's piece
                startId+width-1 === targetId&&document.querySelector(`[square-id="${startId+width-1}"]`)?.firstChild||
                startId+width+1 === targetId&&document.querySelector(`[square-id="${startId+width+1}"]`)?.firstChild
                ){  
                return true;
            }
            console.log('peace not placed in target id', targetId, 'returns', pieceNotPlacedAt(targetId));
            break;

        case 'knight':
            if(
                Math.abs(startId-targetId) === width-2||
                Math.abs(startId-targetId) === width+2||
                Math.abs(startId-targetId) === 2*width-1||
                Math.abs(startId-targetId) === 2*width+1
            ){
                return true;
            }
            break;
        
        case 'bishop':
            if(
                startId+width+1 === targetId||
                startId+2*width+2 === targetId&&pieceNotPlacedAt(startId+width+1)||
                startId+3*width+3 === targetId&&pieceNotPlacedAt(startId+width+1)&&pieceNotPlacedAt(startId+2*width+2)||
                startId+4*width+4 === targetId&&pieceNotPlacedAt(startId+width+1)&&pieceNotPlacedAt(startId+2*width+2)&&pieceNotPlacedAt(startId+3*width+3)||
                startId+5*width+5 === targetId&&pieceNotPlacedAt(startId+width+1)&&pieceNotPlacedAt(startId+2*width+2)&&pieceNotPlacedAt(startId+3*width+3)&&pieceNotPlacedAt(startId+4*width+4)||
                startId+6*width+6 === targetId&&pieceNotPlacedAt(startId+width+1)&&pieceNotPlacedAt(startId+2*width+2)&&pieceNotPlacedAt(startId+3*width+3)&&pieceNotPlacedAt(startId+4*width+4)&&pieceNotPlacedAt(startId+5*width+5)||
                startId+7*width+7 === targetId&&pieceNotPlacedAt(startId+width+1)&&pieceNotPlacedAt(startId+2*width+2)&&pieceNotPlacedAt(startId+3*width+3)&&pieceNotPlacedAt(startId+4*width+4)&&pieceNotPlacedAt(startId+5*width+5)&&pieceNotPlacedAt(startId+6*width+6)||
                
                startId-width-1 === targetId||
                startId-2*width-2 === targetId&&pieceNotPlacedAt(startId-width-1)||
                startId-3*width-3 === targetId&&pieceNotPlacedAt(startId-width-1)&&pieceNotPlacedAt(startId-2*width-2)||
                startId-4*width-4 === targetId&&pieceNotPlacedAt(startId-width-1)&&pieceNotPlacedAt(startId-2*width-2)&&pieceNotPlacedAt(startId-3*width-3)||
                startId-5*width-5 === targetId&&pieceNotPlacedAt(startId-width-1)&&pieceNotPlacedAt(startId-2*width-2)&&pieceNotPlacedAt(startId-3*width-3)&&pieceNotPlacedAt(startId-4*width-4)||
                startId-6*width-6 === targetId&&pieceNotPlacedAt(startId-width-1)&&pieceNotPlacedAt(startId-2*width-2)&&pieceNotPlacedAt(startId-3*width-3)&&pieceNotPlacedAt(startId-4*width-4)&&pieceNotPlacedAt(startId-5*width-5)||
                startId-7*width-7 === targetId&&pieceNotPlacedAt(startId-width-1)&&pieceNotPlacedAt(startId-2*width-2)&&pieceNotPlacedAt(startId-3*width-3)&&pieceNotPlacedAt(startId-4*width-4)&&pieceNotPlacedAt(startId-5*width-5)&&pieceNotPlacedAt(startId-6*width-6)||

                startId+width-1 === targetId||
                startId+2*width-2 === targetId&&pieceNotPlacedAt(startId+width-1)||
                startId+3*width-3 === targetId&&pieceNotPlacedAt(startId+width-1)&&pieceNotPlacedAt(startId+2*width-2)||
                startId+4*width-4 === targetId&&pieceNotPlacedAt(startId+width-1)&&pieceNotPlacedAt(startId+2*width-2)&&pieceNotPlacedAt(startId+3*width-3)||
                startId+5*width-5 === targetId&&pieceNotPlacedAt(startId+width-1)&&pieceNotPlacedAt(startId+2*width-2)&&pieceNotPlacedAt(startId+3*width-3)&&pieceNotPlacedAt(startId+4*width-4)||
                startId+6*width-6 === targetId&&pieceNotPlacedAt(startId+width-1)&&pieceNotPlacedAt(startId+2*width-2)&&pieceNotPlacedAt(startId+3*width-3)&&pieceNotPlacedAt(startId+4*width-4)&&pieceNotPlacedAt(startId+5*width-5)||
                startId+7*width-7 === targetId&&pieceNotPlacedAt(startId+width-1)&&pieceNotPlacedAt(startId+2*width-2)&&pieceNotPlacedAt(startId+3*width-3)&&pieceNotPlacedAt(startId+4*width-4)&&pieceNotPlacedAt(startId+5*width-5)&&pieceNotPlacedAt(startId+6*width-6)||

                startId-width+1 === targetId||
                startId-2*width+2 === targetId&&pieceNotPlacedAt(startId-width+1)||
                startId-3*width+3 === targetId&&pieceNotPlacedAt(startId-width+1)&&pieceNotPlacedAt(startId-2*width+2)||
                startId-4*width+4 === targetId&&pieceNotPlacedAt(startId-width+1)&&pieceNotPlacedAt(startId-2*width+2)&&pieceNotPlacedAt(startId-3*width+3)||
                startId-5*width+5 === targetId&&pieceNotPlacedAt(startId-width+1)&&pieceNotPlacedAt(startId-2*width+2)&&pieceNotPlacedAt(startId-3*width+3)&&pieceNotPlacedAt(startId-4*width+4)||
                startId-6*width+6 === targetId&&pieceNotPlacedAt(startId-width+1)&&pieceNotPlacedAt(startId-2*width+2)&&pieceNotPlacedAt(startId-3*width+3)&&pieceNotPlacedAt(startId-4*width+4)&&pieceNotPlacedAt(startId-5*width+5)||
                startId-7*width+7 === targetId&&pieceNotPlacedAt(startId-width+1)&&pieceNotPlacedAt(startId-2*width+2)&&pieceNotPlacedAt(startId-3*width+3)&&pieceNotPlacedAt(startId-4*width+4)&&pieceNotPlacedAt(startId-5*width+5)&&pieceNotPlacedAt(startId-6*width+6)
            ){
                return true;
            }
            break;

        case 'rook':
            if(
                startId+width === targetId||
                startId+2*width === targetId&&pieceNotPlacedAt(startId+width)||
                startId+3*width === targetId&&pieceNotPlacedAt(startId+width)&&pieceNotPlacedAt(startId+2*width)||
                startId+4*width === targetId&&pieceNotPlacedAt(startId+width)&&pieceNotPlacedAt(startId+2*width)&&pieceNotPlacedAt(startId+3*width)||
                startId+5*width === targetId&&pieceNotPlacedAt(startId+width)&&pieceNotPlacedAt(startId+2*width)&&pieceNotPlacedAt(startId+3*width)&&pieceNotPlacedAt(startId+4*width)||
                startId+6*width === targetId&&pieceNotPlacedAt(startId+width)&&pieceNotPlacedAt(startId+2*width)&&pieceNotPlacedAt(startId+3*width)&&pieceNotPlacedAt(startId+4*width)&&pieceNotPlacedAt(startId+5*width)||
                startId+7*width === targetId&&pieceNotPlacedAt(startId+width)&&pieceNotPlacedAt(startId+2*width)&&pieceNotPlacedAt(startId+3*width)&&pieceNotPlacedAt(startId+4*width)&&pieceNotPlacedAt(startId+5*width)&&pieceNotPlacedAt(startId+6*width)||

                startId-width === targetId||
                startId-2*width === targetId&&pieceNotPlacedAt(startId-width)||
                startId-3*width === targetId&&pieceNotPlacedAt(startId-width)&&pieceNotPlacedAt(startId-2*width)||
                startId-4*width === targetId&&pieceNotPlacedAt(startId-width)&&pieceNotPlacedAt(startId-2*width)&&pieceNotPlacedAt(startId-3*width)||
                startId-5*width === targetId&&pieceNotPlacedAt(startId-width)&&pieceNotPlacedAt(startId-2*width)&&pieceNotPlacedAt(startId-3*width)&&pieceNotPlacedAt(startId-4*width)||
                startId-6*width === targetId&&pieceNotPlacedAt(startId-width)&&pieceNotPlacedAt(startId-2*width)&&pieceNotPlacedAt(startId-3*width)&&pieceNotPlacedAt(startId-4*width)&&pieceNotPlacedAt(startId-5*width)||
                startId-7*width === targetId&&pieceNotPlacedAt(startId-width)&&pieceNotPlacedAt(startId-2*width)&&pieceNotPlacedAt(startId-3*width)&&pieceNotPlacedAt(startId-4*width)&&pieceNotPlacedAt(startId-5*width)&&pieceNotPlacedAt(startId-6*width)||

                startId+1 === targetId||
                startId+2 === targetId&&pieceNotPlacedAt(startId+1)||
                startId+3 === targetId&&pieceNotPlacedAt(startId+1)&&pieceNotPlacedAt(startId+2)||
                startId+4 === targetId&&pieceNotPlacedAt(startId+1)&&pieceNotPlacedAt(startId+2)&&pieceNotPlacedAt(startId+3)||
                startId+5 === targetId&&pieceNotPlacedAt(startId+1)&&pieceNotPlacedAt(startId+2)&&pieceNotPlacedAt(startId+3)&&pieceNotPlacedAt(startId+4)||
                startId+6 === targetId&&pieceNotPlacedAt(startId+1)&&pieceNotPlacedAt(startId+2)&&pieceNotPlacedAt(startId+3)&&pieceNotPlacedAt(startId+4)&&pieceNotPlacedAt(startId+5)||
                startId+7 === targetId&&pieceNotPlacedAt(startId+1)&&pieceNotPlacedAt(startId+2)&&pieceNotPlacedAt(startId+3)&&pieceNotPlacedAt(startId+4)&&pieceNotPlacedAt(startId+5)&&pieceNotPlacedAt(startId+6)||

                startId-1 === targetId||
                startId-2 === targetId&&pieceNotPlacedAt(startId-1)||
                startId-3 === targetId&&pieceNotPlacedAt(startId-1)&&pieceNotPlacedAt(startId-2)||
                startId-4 === targetId&&pieceNotPlacedAt(startId-1)&&pieceNotPlacedAt(startId-2)&&pieceNotPlacedAt(startId-3)||
                startId-5 === targetId&&pieceNotPlacedAt(startId-1)&&pieceNotPlacedAt(startId-2)&&pieceNotPlacedAt(startId-3)&&pieceNotPlacedAt(startId-4)||
                startId-6 === targetId&&pieceNotPlacedAt(startId-1)&&pieceNotPlacedAt(startId-2)&&pieceNotPlacedAt(startId-3)&&pieceNotPlacedAt(startId-4)&&pieceNotPlacedAt(startId-5)||
                startId-7 === targetId&&pieceNotPlacedAt(startId-1)&&pieceNotPlacedAt(startId-2)&&pieceNotPlacedAt(startId-3)&&pieceNotPlacedAt(startId-4)&&pieceNotPlacedAt(startId-5)&&pieceNotPlacedAt(startId-6)

            ){
                return true;
            }
            break;
        case 'queen':
            if(
                startId+width+1 === targetId||
                startId+2*width+2 === targetId&&pieceNotPlacedAt(startId+width+1)||
                startId+3*width+3 === targetId&&pieceNotPlacedAt(startId+width+1)&&pieceNotPlacedAt(startId+2*width+2)||
                startId+4*width+4 === targetId&&pieceNotPlacedAt(startId+width+1)&&pieceNotPlacedAt(startId+2*width+2)&&pieceNotPlacedAt(startId+3*width+3)||
                startId+5*width+5 === targetId&&pieceNotPlacedAt(startId+width+1)&&pieceNotPlacedAt(startId+2*width+2)&&pieceNotPlacedAt(startId+3*width+3)&&pieceNotPlacedAt(startId+4*width+4)||
                startId+6*width+6 === targetId&&pieceNotPlacedAt(startId+width+1)&&pieceNotPlacedAt(startId+2*width+2)&&pieceNotPlacedAt(startId+3*width+3)&&pieceNotPlacedAt(startId+4*width+4)&&pieceNotPlacedAt(startId+5*width+5)||
                startId+7*width+7 === targetId&&pieceNotPlacedAt(startId+width+1)&&pieceNotPlacedAt(startId+2*width+2)&&pieceNotPlacedAt(startId+3*width+3)&&pieceNotPlacedAt(startId+4*width+4)&&pieceNotPlacedAt(startId+5*width+5)&&pieceNotPlacedAt(startId+6*width+6)||
                
                startId-width-1 === targetId||
                startId-2*width-2 === targetId&&pieceNotPlacedAt(startId-width-1)||
                startId-3*width-3 === targetId&&pieceNotPlacedAt(startId-width-1)&&pieceNotPlacedAt(startId-2*width-2)||
                startId-4*width-4 === targetId&&pieceNotPlacedAt(startId-width-1)&&pieceNotPlacedAt(startId-2*width-2)&&pieceNotPlacedAt(startId-3*width-3)||
                startId-5*width-5 === targetId&&pieceNotPlacedAt(startId-width-1)&&pieceNotPlacedAt(startId-2*width-2)&&pieceNotPlacedAt(startId-3*width-3)&&pieceNotPlacedAt(startId-4*width-4)||
                startId-6*width-6 === targetId&&pieceNotPlacedAt(startId-width-1)&&pieceNotPlacedAt(startId-2*width-2)&&pieceNotPlacedAt(startId-3*width-3)&&pieceNotPlacedAt(startId-4*width-4)&&pieceNotPlacedAt(startId-5*width-5)||
                startId-7*width-7 === targetId&&pieceNotPlacedAt(startId-width-1)&&pieceNotPlacedAt(startId-2*width-2)&&pieceNotPlacedAt(startId-3*width-3)&&pieceNotPlacedAt(startId-4*width-4)&&pieceNotPlacedAt(startId-5*width-5)&&pieceNotPlacedAt(startId-6*width-6)||

                startId+width-1 === targetId||
                startId+2*width-2 === targetId&&pieceNotPlacedAt(startId+width-1)||
                startId+3*width-3 === targetId&&pieceNotPlacedAt(startId+width-1)&&pieceNotPlacedAt(startId+2*width-2)||
                startId+4*width-4 === targetId&&pieceNotPlacedAt(startId+width-1)&&pieceNotPlacedAt(startId+2*width-2)&&pieceNotPlacedAt(startId+3*width-3)||
                startId+5*width-5 === targetId&&pieceNotPlacedAt(startId+width-1)&&pieceNotPlacedAt(startId+2*width-2)&&pieceNotPlacedAt(startId+3*width-3)&&pieceNotPlacedAt(startId+4*width-4)||
                startId+6*width-6 === targetId&&pieceNotPlacedAt(startId+width-1)&&pieceNotPlacedAt(startId+2*width-2)&&pieceNotPlacedAt(startId+3*width-3)&&pieceNotPlacedAt(startId+4*width-4)&&pieceNotPlacedAt(startId+5*width-5)||
                startId+7*width-7 === targetId&&pieceNotPlacedAt(startId+width-1)&&pieceNotPlacedAt(startId+2*width-2)&&pieceNotPlacedAt(startId+3*width-3)&&pieceNotPlacedAt(startId+4*width-4)&&pieceNotPlacedAt(startId+5*width-5)&&pieceNotPlacedAt(startId+6*width-6)||

                startId-width+1 === targetId||
                startId-2*width+2 === targetId&&pieceNotPlacedAt(startId-width+1)||
                startId-3*width+3 === targetId&&pieceNotPlacedAt(startId-width+1)&&pieceNotPlacedAt(startId-2*width+2)||
                startId-4*width+4 === targetId&&pieceNotPlacedAt(startId-width+1)&&pieceNotPlacedAt(startId-2*width+2)&&pieceNotPlacedAt(startId-3*width+3)||
                startId-5*width+5 === targetId&&pieceNotPlacedAt(startId-width+1)&&pieceNotPlacedAt(startId-2*width+2)&&pieceNotPlacedAt(startId-3*width+3)&&pieceNotPlacedAt(startId-4*width+4)||
                startId-6*width+6 === targetId&&pieceNotPlacedAt(startId-width+1)&&pieceNotPlacedAt(startId-2*width+2)&&pieceNotPlacedAt(startId-3*width+3)&&pieceNotPlacedAt(startId-4*width+4)&&pieceNotPlacedAt(startId-5*width+5)||
                startId-7*width+7 === targetId&&pieceNotPlacedAt(startId-width+1)&&pieceNotPlacedAt(startId-2*width+2)&&pieceNotPlacedAt(startId-3*width+3)&&pieceNotPlacedAt(startId-4*width+4)&&pieceNotPlacedAt(startId-5*width+5)&&pieceNotPlacedAt(startId-6*width+6)||


                startId+width === targetId||
                startId+2*width === targetId&&pieceNotPlacedAt(startId+width)||
                startId+3*width === targetId&&pieceNotPlacedAt(startId+width)&&pieceNotPlacedAt(startId+2*width)||
                startId+4*width === targetId&&pieceNotPlacedAt(startId+width)&&pieceNotPlacedAt(startId+2*width)&&pieceNotPlacedAt(startId+3*width)||
                startId+5*width === targetId&&pieceNotPlacedAt(startId+width)&&pieceNotPlacedAt(startId+2*width)&&pieceNotPlacedAt(startId+3*width)&&pieceNotPlacedAt(startId+4*width)||
                startId+6*width === targetId&&pieceNotPlacedAt(startId+width)&&pieceNotPlacedAt(startId+2*width)&&pieceNotPlacedAt(startId+3*width)&&pieceNotPlacedAt(startId+4*width)&&pieceNotPlacedAt(startId+5*width)||
                startId+7*width === targetId&&pieceNotPlacedAt(startId+width)&&pieceNotPlacedAt(startId+2*width)&&pieceNotPlacedAt(startId+3*width)&&pieceNotPlacedAt(startId+4*width)&&pieceNotPlacedAt(startId+5*width)&&pieceNotPlacedAt(startId+6*width)||

                startId-width === targetId||
                startId-2*width === targetId&&pieceNotPlacedAt(startId-width)||
                startId-3*width === targetId&&pieceNotPlacedAt(startId-width)&&pieceNotPlacedAt(startId-2*width)||
                startId-4*width === targetId&&pieceNotPlacedAt(startId-width)&&pieceNotPlacedAt(startId-2*width)&&pieceNotPlacedAt(startId-3*width)||
                startId-5*width === targetId&&pieceNotPlacedAt(startId-width)&&pieceNotPlacedAt(startId-2*width)&&pieceNotPlacedAt(startId-3*width)&&pieceNotPlacedAt(startId-4*width)||
                startId-6*width === targetId&&pieceNotPlacedAt(startId-width)&&pieceNotPlacedAt(startId-2*width)&&pieceNotPlacedAt(startId-3*width)&&pieceNotPlacedAt(startId-4*width)&&pieceNotPlacedAt(startId-5*width)||
                startId-7*width === targetId&&pieceNotPlacedAt(startId-width)&&pieceNotPlacedAt(startId-2*width)&&pieceNotPlacedAt(startId-3*width)&&pieceNotPlacedAt(startId-4*width)&&pieceNotPlacedAt(startId-5*width)&&pieceNotPlacedAt(startId-6*width)||

                startId+1 === targetId||
                startId+2 === targetId&&pieceNotPlacedAt(startId+1)||
                startId+3 === targetId&&pieceNotPlacedAt(startId+1)&&pieceNotPlacedAt(startId+2)||
                startId+4 === targetId&&pieceNotPlacedAt(startId+1)&&pieceNotPlacedAt(startId+2)&&pieceNotPlacedAt(startId+3)||
                startId+5 === targetId&&pieceNotPlacedAt(startId+1)&&pieceNotPlacedAt(startId+2)&&pieceNotPlacedAt(startId+3)&&pieceNotPlacedAt(startId+4)||
                startId+6 === targetId&&pieceNotPlacedAt(startId+1)&&pieceNotPlacedAt(startId+2)&&pieceNotPlacedAt(startId+3)&&pieceNotPlacedAt(startId+4)&&pieceNotPlacedAt(startId+5)||
                startId+7 === targetId&&pieceNotPlacedAt(startId+1)&&pieceNotPlacedAt(startId+2)&&pieceNotPlacedAt(startId+3)&&pieceNotPlacedAt(startId+4)&&pieceNotPlacedAt(startId+5)&&pieceNotPlacedAt(startId+6)||

                startId-1 === targetId||
                startId-2 === targetId&&pieceNotPlacedAt(startId-1)||
                startId-3 === targetId&&pieceNotPlacedAt(startId-1)&&pieceNotPlacedAt(startId-2)||
                startId-4 === targetId&&pieceNotPlacedAt(startId-1)&&pieceNotPlacedAt(startId-2)&&pieceNotPlacedAt(startId-3)||
                startId-5 === targetId&&pieceNotPlacedAt(startId-1)&&pieceNotPlacedAt(startId-2)&&pieceNotPlacedAt(startId-3)&&pieceNotPlacedAt(startId-4)||
                startId-6 === targetId&&pieceNotPlacedAt(startId-1)&&pieceNotPlacedAt(startId-2)&&pieceNotPlacedAt(startId-3)&&pieceNotPlacedAt(startId-4)&&pieceNotPlacedAt(startId-5)||
                startId-7 === targetId&&pieceNotPlacedAt(startId-1)&&pieceNotPlacedAt(startId-2)&&pieceNotPlacedAt(startId-3)&&pieceNotPlacedAt(startId-4)&&pieceNotPlacedAt(startId-5)&&pieceNotPlacedAt(startId-6)
            ){
                return true;
            }
            break;
        
        case 'king':
            if(
                Math.abs(startId-targetId)===1||
                Math.abs(startId-targetId)===width-1||
                Math.abs(startId-targetId)===width||
                Math.abs(startId-targetId)===width+1
            ){
                return true;
            }
            break;

    }   
}


function checkForWin(){
    const kings = Array.from(document.querySelectorAll('#king'));

    if(!kings.some(king=>king.firstChild.classList.contains('white'))){
        infoDisplay.innerHTML = "Black player wins!";
        const allSquares = document.querySelectorAll('.square');
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false));
    }

    if(!kings.some(king=>king.firstChild.classList.contains('black'))){
        infoDisplay.innerHTML = "White player wins!";
        const allSquares = document.querySelectorAll('.square');
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false));
    }
}