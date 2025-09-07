import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>SomniaConnect</h1>
        <p>Web2 to Web3 Onboarding Platform</p>
        <button onClick={() => console.log('Connect wallet')}>
          Connect Wallet
        </button>
      </header>
    </div>
  );
}

export default App;