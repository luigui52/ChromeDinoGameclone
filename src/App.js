import React from 'react';
import './App.css';

// Importamos el componente DinoGame (asegúrate de crear este archivo)
import DinoGame from './components/DinoGame';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Chrome Dino Game</h1>
        <DinoGame />
      </header>
    </div>
  );
}

export default App;