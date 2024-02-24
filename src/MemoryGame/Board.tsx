import { useEffect, useRef, useState } from "react";

type BoardProps = {
  gridSize: number;
  setIsGameStarted: (val: boolean) => void;
};

function Board(props: BoardProps) {
  const { gridSize } = props;

  const [grid, setGrid] = useState<number[][]>([]);
  const firstActiveElement = useRef<HTMLDivElement | null>(null);
  const secondActiveElement = useRef<HTMLDivElement | null>(null);
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
    console.log("before", clearedCells.current);
    if (firstActiveElement.current && secondActiveElement.current) {
      return;
    }
    const elem = event.currentTarget;
    const cellId = elem.getAttribute("id");
    if (cellId && clearedCells.current.has(cellId)) {
      return;
    }
    // console.log(elem);

    elem.classList.add("active");

    if (!firstActiveElement.current) {
      firstActiveElement.current = elem;
      firstActiveElement.current.classList.add("firstElement");
    } else {
      secondActiveElement.current = elem;
      console.log(firstActiveElement.current);
      console.log(secondActiveElement.current);

      if (firstActiveElement.current?.innerText !== elem.innerText) {
        timerRef.current = setTimeout(() => {
          firstActiveElement.current?.classList.remove("active");
          secondActiveElement.current?.classList.remove("active");
          firstActiveElement.current?.classList.remove("firstElement");
          firstActiveElement.current = null;
          secondActiveElement.current = null;
        }, 600);
      } else {
        const firstCellId = firstActiveElement.current?.getAttribute("id");

        firstCellId && clearedCells.current.add(firstCellId);
        cellId && clearedCells.current.add(cellId);

        firstActiveElement.current?.classList.remove("firstElement");

        firstActiveElement.current = null;
        secondActiveElement.current = null;
      }
    }

    if (clearedCells.current.size === grid.length * grid[0].length) {
      setIsGameOver(true);
    }
    console.log("after", clearedCells.current);
  };

  return (
    <div className="boardUi">
      <div>
        <div className="board">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="gridRow">
              {row.map((element, colIndex) => (
                <div
                  id={`${rowIndex}-${colIndex}`}
                  key={`${rowIndex}-${colIndex}`}
                  className="cell"
                  onClick={handleCellClick}
                >
                  <div className="back"></div>
                  <div className="front">{element}</div>
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
