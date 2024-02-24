import "./App.css";
import MemoryGame from "./MemoryGame";
import githubIcon from "./assets/github-mark.png";

function App() {
  return (
    <>
      <MemoryGame />
      <a
        target="_blank"
        href="https://github.com/Pranay-Tej/react-games"
        title="GitHub"
        style={{ maxWidth: "40px", margin: "1rem auto", display: "block" }}
      >
        <img src={githubIcon} alt="github" style={{ maxWidth: "100%" }} />
      </a>
    </>
  );
}

export default App;
