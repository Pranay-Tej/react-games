import { useEffect, useRef, useState } from "react";

type BoardProps = {
  gridSize: number;
  setIsGameStarted: (val: boolean) => void;
};

const getFrontDiv = (element: HTMLDivElement) => {
  return element.querySelector<HTMLDivElement>(".front");
};

function Board(props: BoardProps) {
  const { gridSize } = props;

  const [grid, setGrid] = useState<number[][]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timerRef = useRef<any>(null);
  const clearedCells = useRef(new Set<string>());
  const [isGameOver, setIsGameOver] = useState(false);

  const setupPuzzle = () => {
    // create elements, each element has two instances
    const elements = [];
    for (let i = 0; i < (gridSize * gridSize) / 2; i++) {
      elements.push(i + 1);
      elements.push(i + 1);
    }

    // jumble grid
    for (let i = elements.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [elements[i], elements[j]] = [elements[j], elements[i]];
    }

    // fill grid with elements in n/n matrix format
    const newGrid = [];
    for (let i = 0; i < gridSize; i++) {
      const row = [];
      for (let j = 0; j < gridSize; j++) {
        row.push(elements[i * gridSize + j]);
      }
      newGrid.push(row);
    }

    setGrid(newGrid);
  };

  useEffect(() => {
    setupPuzzle();
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCellClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    // console.log("before", clearedCells.current);
    const activeCardsBeforeClick =
      document.querySelectorAll<HTMLDivElement>(".active");

    // console.log(activeCardsBeforeClick);

    if (activeCardsBeforeClick.length === 2) {
      return;
    }

    const currentElement = event.currentTarget;
    const cellId = currentElement.getAttribute("id");
    if (!cellId) {
      return;
    }
    if (clearedCells.current.has(cellId)) {
      return;
    }

    // add the textContent only when clicking
    // so user can't inspect hidden card value in the dev tools
    const [i, j] = cellId.split("-");
    const currentElementFrontDiv = getFrontDiv(currentElement);
    if (currentElementFrontDiv) {
      currentElementFrontDiv.innerText = String(grid[Number(i)][Number(j)]);
    }

    currentElement.classList.add("active");

    if (activeCardsBeforeClick.length === 0) {
      currentElement.classList.add("firstElement");
      return;
    }

    // actiCards.length === 1
    const firstCard = activeCardsBeforeClick[0];
    const secondCard = currentElement;

    const firstCardId = firstCard.getAttribute("id");
    const secondCardId = secondCard.getAttribute("id");

    // check if clicking on the same card again
    if (firstCardId === secondCardId) {
      return;
    }

    const firstCardValue = getFrontDiv(firstCard)?.innerText;
    const secondCardValue = getFrontDiv(secondCard)?.innerText;
    // console.log({
    //   firstCard,
    //   secondCard,
    //   firstCardValue,
    //   secondCardValue,
    // });

    // equal case
    if (
      firstCardValue &&
      secondCardValue &&
      firstCardValue === secondCardValue
    ) {
      firstCard.classList.add("clear");
      secondCard.classList.add("clear");
      if (firstCardId) {
        clearedCells.current.add(firstCardId);
      }
      if (secondCardId) {
        clearedCells.current.add(secondCardId);
      }
      if (clearedCells.current.size === gridSize * gridSize) {
        setIsGameOver(true);
      }
    }

    // runs in both equal and non equal cases
    timerRef.current = setTimeout(() => {
      const activeCards = document.querySelectorAll<HTMLDivElement>(".active");
      activeCards.forEach((card) => {
        card.classList.remove("active");
        card.classList.remove("firstElement");
        const cardFrontDiv = getFrontDiv(card);
        if (cardFrontDiv && !card.classList.contains("clear")) {
          cardFrontDiv.innerText = "";
        }
      });
    }, 600);
  };

  return (
    <div className="boardUi">
      <div>
        <div className="board">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="gridRow">
              {row.map((_, colIndex) => (
                <div
                  id={`${rowIndex}-${colIndex}`}
                  key={`${rowIndex}-${colIndex}`}
                  className="cell"
                  onClick={handleCellClick}
                >
                  <div className="back"></div>
                  <div className="front"></div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ margin: "1rem auto", maxWidth: "200px" }}>
          {isGameOver && (
            <div>
              <p>Victory!</p>
            </div>
          )}
          <button onClick={() => props.setIsGameStarted(false)}>Restart</button>
        </div>
      </div>
    </div>
  );
}

export default Board;
