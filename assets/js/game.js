$(document).ready(() => {
	$('#btn').on('click', () => main());
	$('#pX').on('change', () => (players.X = $('#pX').val()));
	$('#pO').on('change', () => (players.O = $('#pO').val()));
});

let board = new Board();
let turn = 'X';
let state = null;
let players = {
	X: 'human',
	O: 'ai',
};
let AIConfig = { X: { maxDepth: 10 }, O: { maxDepth: 10 } };
let turnHistory = [];

function main() {
	if ($('#btn').html() === 'Reset Game') {
		turn = 'X';
		board = new Board();
		turnHistory = [];
		state = null;
		$('#state').html('');
		$('#board').css('display', 'none');
		$('#game-state').html('');
		$('#btn').html('Start Game');
		return;
	}

	$('#board').css('display', 'table');
	$('#btn').html('Reset Game');
	nextTurn();
	handleClick();
}

function nextTurn() {
	renderBoard();

	let win = board.getWinner();
	if (win !== null) {
		if (win === 'tie') {
			let msg = 'Game Draw!';
			state = 'tie';
			$('#state').html(msg);

			console.warn(msg);
		} else {
			let msg = `Player ${win} Win!!`;
			state = 'win';
			$('#state').html(msg);
			console.warn(msg);
		}
		$('#game-state').html('');
		return console.log({
			gameResult: state,
			history: turnHistory,
			players,
			firstTurn: turnHistory[0],
			AIConfig,
			board,
		});
	}

	// make message
	let gameText = `Player [${turn}] ${players[turn]} turn...`;
	$('#state').html(gameText);

	// next turn
	if (players[turn] === 'ai') {
		$('#game-state').html('AI thinking...');
		setTimeout(() => AIMove(), 1000);
	} else {
		$('#game-state').html('Human thinking??');
	}
}

function AIMove() {
	let ai = new AI(turn, board);
	ai.maxDepth = AIConfig[turn].maxDepth;
	let result = ai.getBestMove();
	turnHistory.push({ player: turn, move: result });
	board.move(turn, result.move);
	turn = turn === 'X' ? 'O' : 'X';
	setTimeout(() => nextTurn(), 1);
	return '';
}

function HumanMove(index) {
	if (state !== null || players[turn] !== 'human') return;

	// turn
	board.move(turn, index);
	turn = turn === 'X' ? 'O' : 'X';

	nextTurn();
	return '';
}

function renderBoard() {
	for (let i = 0; i < 9; i++) {
		$(`#box${i}`).html(board.state[i]);
	}
}

function handleClick() {
	for (let i = 0; i < 9; i++) {
		$(`#box${i}`).on('click', (e) => {
			let box = e.target.id.substr(3);
			HumanMove(box);
			renderBoard();
		});
	}
}
