import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {

    const { onClick, value } = props;

    return (
        <button
            className="square"
            onClick={onClick}
        >
            {value}
        </button>
    );
}

function Board(props) {

    const { squares, onClick } = props;

    const renderSquare = function (i) {
        return (
            <Square
                value={squares[i]}
                onClick={() => onClick(i)}
            />
        );
    }

    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                }
            ],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        console.log("state", this.state);
        const { stepNumber: step, xIsNext } = this.state;
        const history = this.state.history.slice(0, step + 1);
        const current = history[history.length - 1];
        const squares = [...current.squares];

        if (calculateWinner(squares) || squares[i]) return;

        squares[i] = xIsNext ? "X" : "O";
        this.setState(
            {
                history: [...history, { squares }],
                stepNumber: history.length,
                xIsNext: !xIsNext,
            }
        );
    }

    jumpTo(stepNumber) {
        this.setState(
            {
                stepNumber,
                xIsNext: (stepNumber % 2) === 0,
            }
        );
    }

    render() {
        const { stepNumber, xIsNext } = this.state;
        const history = this.state.history.slice(0, stepNumber + 1);
        const current = history[stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc =
                move
                    ? `Go to move #${move}`
                    : `Restart Game`;
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {
                            move === 9 || (move === stepNumber && winner)
                                ? `Final Result`
                                : desc
                        }
                    </button>
                </li>
            );
        });
        const status =
            winner
                ? `WINNER: ${winner}`
                : stepNumber === 9
                    ? `IT'S A TIE!`
                    : `Next player: ${xIsNext ? 'X' : 'O'}`;

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }

}

// ReactDOM render:

ReactDOM
    .render(
        <Game />,
        document.getElementById('root')
    );

function calculateWinner(squares) {
    const lineCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lineCombinations.length; i++) {
        const [a, b, c] = lineCombinations[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

}