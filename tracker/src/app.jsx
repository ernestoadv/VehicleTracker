import { useState } from "react";
import Map from "./components/map";

function App() {
  const [name, setName] = useState("");
  return (
    <div className="app">
      {/* <h1>Hola React!</h1>
      <div>
        <label htmlFor="name">Nombre: </label>
        <input type="text" />
      </div> */}
      <Map></Map>
    </div>
  );
}

export default App;
