import './App.css';
import { useState } from 'react';

function App() {
	const [data, setData] = useState([
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	]);

  // Initialise

  // AddNumber - add an item

  // Swipe - right, left, up, down

  // Check GameOver

  // Reset

	return (
		<div
      style={style.main}
    >
      {data.map((row, index) => {
        return (
          <div style={{ display: 'flex' }} key={index}>
            {row.map((digit, i) => (
              <Block number={digit} key={i} />
            ))}
          </div>
        );
      })}
		</div>
	);
}

const Block = ({number}) => {
	return (
    <div
      style={style.block}
    >
      {number}
    </div>
  );
}

const style = {
  main: {
    background: "#AD9D8F",
    width: "max-content",
    margin: "auto",
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  block: {
    height: 80,
    width: 80,
    background: "lightgray",
    margin: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 45,
    fontWeight: 800,
    color: "white",
  },
}

export default App;
