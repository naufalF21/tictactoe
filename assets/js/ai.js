class AI {
	board = null;
	player = null;
	moves = [];
	maxDepth = 100;

	constructor(player, board) {
		this.player = player;
		this.board = board;
	}

	getBestMove() {
		let minimax = this.minimax(this.board, true, 0);
		let bestScore = -Infinity;
		let filter_depth_0 = this.moves.filter((el) => {
			if (el.depth === 0) bestScore = Math.max(el.score, bestScore);
			return el.depth === 0;
		});
		let filter_best_move = filter_depth_0.filter(
			(el) => el.score >= bestScore
		);

		// if multiple move
		let bestMove =
			filter_best_move[Math.floor(Math.random() * filter_best_move.length)];
		bestMove.instance = this;

		return bestMove;
	}

	minimax(board, isMaximizing, depth) {
		let scores = { win: 1, lose: -1, tie: 0 };

		// terminal check
		let win = board.getWinner();
		if (win !== null) {
			if (win === 'tie') return scores.tie;
			return this.player === win ? scores.win : scores.lose;
		}

		// terminal : check max depth
		if (depth === this.maxDepth) return scores.tie;

		// maximizing
		if (isMaximizing) {
			let bestScore = -Infinity;
			for (let i = 0; i < board.state.length; i++) {
				if (board.state[i] === '') {
					let newBoard = new Board([...board.state]);
					newBoard.move(this.player, i); // isMaximizing = ai instance
					let score = this.minimax(newBoard, false, depth + 1);
					bestScore = Math.max(score, bestScore);
					this.moves.push({ depth, isMaximizing, move: i, score });
				}
			}
			return bestScore;

			//minimizing
		} else {
			let bestScore = Infinity;
			for (let i = 0; i < board.state.length; i++) {
				if (board.state[i] === '') {
					let newBoard = new Board([...board.state]);
					let enemy = this.player === 'X' ? 'O' : 'X';
					newBoard.move(enemy, i);
					let score = this.minimax(newBoard, true, depth + 1);
					this.moves.push({ depth, isMaximizing, move: i, score });
					bestScore = Math.min(score, bestScore);
				}
			}
			return bestScore;
		}
	}
}
