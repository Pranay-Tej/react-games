import { useEffect, useRef, useState } from "react";

const grid = [
  [1, 2],
  [1, 2],
];

function MemoryGameBoard() {
  const firstActiveElement = useRef<HTMLDivElement | null>(null);
  const secondActiveElement = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timerRef = useRef<any>(null);
  const clearedCells = useRef(new Set<string>());
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCellClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    // console.log('before', clearedCells.current);
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
    } else {
      const firstElem = firstActiveElement.current;
      secondActiveElement.current = elem;
      if (firstElem.innerText !== elem.innerText) {
        timerRef.current = setTimeout(() => {
          firstElem.classList.remove("active");
          elem.classList.remove("active");
          firstActiveElement.current = null;
          secondActiveElement.current = null;
        }, 1000);
      } else {
        const firstCellId = firstActiveElement.current?.getAttribute("id");

        firstCellId && clearedCells.current.add(firstCellId);
        cellId && clearedCells.current.add(cellId);

        firstActiveElement.current = null;
        secondActiveElement.current = null;
      }
    }

    if (clearedCells.current.size === grid.length * grid[0].length) {
      setIsGameOver(true);
    }
    // console.log('after', clearedCells.current);
  };

  return (
    <div>
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

      {isGameOver && <p>Victory!</p>}
    </div>
  );
}

export default MemoryGameBoard;
