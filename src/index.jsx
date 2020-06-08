import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }

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
        const step = this.state.stepNumber;
        const history = this.state.history.slice(0, step + 1);
        const xIsNext = this.state.xIsNext;
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
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc =
                move
                    ? `Go to move #${move}`
                    : `Restart Game`;
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });
        const status =
            winner
                ? `WINNER: ${winner}`
                : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

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