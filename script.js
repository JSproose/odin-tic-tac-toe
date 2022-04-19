const div_content = document.querySelector('.content');
const div_board = document.querySelector('.board');
let player1 = {};
let player2 = {};


function countOccurrences(arr, elem) {
    count = 0;
    for (item of arr) {
        if (item == elem) {
            count++;
        }
    }
    return count;
}

const StartForm = (function() {

    const input_player2X = document.getElementById('player2-X');
    const input_player2O = document.getElementById('player2-O');
    const input_player1X = document.getElementById('player1-X');
    const input_player1O = document.getElementById('player1-O');
    const form = document.querySelector('form');
    const checkForCheck = () => document.querySelector('input[name="player2Tick"]:checked') && document.querySelector('input[name="player1Tick"]:checked');
    const startGame = () => {
        document.querySelector('.start-screen').style.display = "none";
        document.querySelector('.content').style.display = "flex";
        
    }


    input_player1O.addEventListener("change", function() {if (checkForCheck()) input_player2X.checked = true});
    input_player1X.addEventListener("change", function() {if (checkForCheck()) input_player2O.checked = true});
    input_player2O.addEventListener("change", function() {if (checkForCheck()) input_player1X.checked = true});
    input_player2X.addEventListener("change", function() {if (checkForCheck()) input_player1O.checked = true});



    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const FormObject = Object.fromEntries(new FormData(e.target).entries());
        player1 = Player(FormObject.player1, FormObject.player1Tick);
        player2 = Player(FormObject.player2, FormObject.player2Tick);
        startGame();
        DisplayController.displayNames();
        DisplayController.loadBoard();
        
    })



    return {checkForCheck, startGame}

})();



const DisplayController = (function() {

    let turn = "X";
    const h1_player1 = document.querySelector('.player1 h1');
    const h1_player2 = document.querySelector('.player2 h1');

    const displayNames = () => {
        h1_player1.innerText = player1.name;
        h1_player2.innerText = player2.name;
    }

    const changeTurn = () => {
        switch(turn) {
            case "X":
                turn = "O";
                break;
            case "O":
                turn = "X";
                break;
        }
    }

    const displayWin = (winner) => {
        document.querySelector('.game-over').style.display = "flex";
        document.querySelector('.game-over h1').innerText = `${winner.name} Wins!`;
        document.querySelector('.game-over div').addEventListener('click', () => {location.reload()});
    }

    const updateScore = (p1Score, p2Score) => {
        if (p1Score == 5) {
            displayWin(player1);
        } else if (p2Score == 5) {
            displayWin(player2);
        }
        const div_scores = document.querySelector('.scores')
        div_scores.innerText = `${p1Score}  :  ${p2Score}`
    }

    const updateGrid = (e) => {
        let row = e.target.id.slice(1,).split('-')[0];
        let column = e.target.id.slice(1,).split('-')[1];

        if (!e.target.innerText) {
            e.target.classList.add('hidden');
            e.target.innerText = turn;
            GameBoard.addTic(row, column, turn);

            let winner = GameBoard.checkForWin();

            if (winner) {
                if (winner == "draw") {
                    GameBoard.clearBoard();
                    div_content.querySelectorAll('div').forEach(item => {
                        item.removeEventListener('click', updateGrid);
                    });
                    setTimeout(loadBoard, 1000);
                } else {
                    if (player1.tic == winner) {
                        player1.score = player1.score + 1;
                    } else {
                        player2.score = player2.score + 1;
                    }
                    updateScore(player1.score, player2.score);
                    GameBoard.clearBoard();
                    div_content.querySelectorAll('div').forEach(item => {
                        item.removeEventListener('click', updateGrid);
                    });

                    setTimeout(loadBoard, 1000);

                }
            }

            changeTurn();
        }
        
        console.table(GameBoard.getBoard());
    }


    const loadBoard = () => {
        div_board.innerHTML = '';
        for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {

                const div = document.createElement('div');
                div.setAttribute('id', `c${i}-${j}`);
                div_board.appendChild(div);

                div.addEventListener('click', updateGrid);

            }
        }
    }

    return {loadBoard, changeTurn, displayNames, updateScore};

})();

const GameBoard = (function() {
    
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    const clearBoard = () => board = [["", "", ""],["", "", ""],["", "", ""]];

    const checkForWin = () => {
        
        for (row of board) {
            if ((countOccurrences(row, row[0]) == 3) && row[0]) {
                return row[0];
                
            }
        }

        for (i = 0; i < 3; i++) {
            if ((countOccurrences([board[0][i], board[1][i], board[2][i]], board[0][i]) == 3) && board[0][i]) {
                return board[0][i];
            }
        }
    
        if ((countOccurrences([board[0][0], board[1][1], board[2][2]], board[0][0]) == 3) && board[0][0]) {
            return board[0][0];
        }

        if ((countOccurrences([board[0][2], board[1][1], board[2][0]], board[0][2]) == 3) && board[0][2]) {
            return board[0][2]; 
        }

        for (row of board) {
            for (item of row) {
                if (!item) {
                    return false
                }
            }
        }

        return "draw";
    }

    const getBoard = () => board;
    const addTic = (row, column, tic) => {
        board[row][column] = tic;
    };



    return {getBoard, addTic, checkForWin, clearBoard};
})();

const Player = (name, tic) => {
    let score = 0;
    return {name, tic, score};
}






