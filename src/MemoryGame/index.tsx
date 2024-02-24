import { useState } from "react";
import Board from "./Board";

function MemoryGame() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gridSize, setGridSize] = useState(4);

  //   const handleIncrease = () => {
  //     setGridSize((prev) => prev + 2);
  //   };

  //   const handleDecrease = () => {
  //     setGridSize((prev) => prev - 2);
  //   };

  return (
    <>
      <h3 style={{ textAlign: "center" }}>Memory Game</h3>

      {isGameStarted ? (
        <Board gridSize={gridSize} setIsGameStarted={setIsGameStarted} />
      ) : (
        <div className="gameSettings">
          <div className="difficultyLevel">
            <button
              className={gridSize === 2 ? "active" : ""}
              onClick={() => setGridSize(2)}
            >
              Easy (<span>{`${2} * ${2}`}</span>)
            </button>
            <button
              className={gridSize === 4 ? "active" : ""}
              onClick={() => setGridSize(4)}
            >
              Medium (<span>{`${4} * ${4}`}</span>)
            </button>
            <button
              className={gridSize === 6 ? "active" : ""}
              onClick={() => setGridSize(6)}
            >
              Hard (<span>{`${6} * ${6}`}</span>)
            </button>
          </div>
          {/* <button onClick={handleDecrease} disabled={gridSize === 2}>
            // ➖ //{" "}
          </button>
          <button onClick={handleIncrease} disabled={gridSize === 6}>
            // ➕ //{" "}
          </button> */}
          <br />
          <button className="start" onClick={() => setIsGameStarted(true)}>
            Start Game
          </button>
        </div>
      )}
    </>
  );
}

export default MemoryGame;
