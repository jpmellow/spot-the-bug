import React from 'react';
import { AdminPanel } from './components/AdminPanel';
import { GameScene } from './components/GameScene';
import { useGameStore } from './store/gameStore';
import { Settings } from 'lucide-react';

function App() {
  const { isAdmin, toggleAdmin, bugs } = useGameStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Spot the Bug</h1>
          <button
            onClick={toggleAdmin}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Toggle Admin Mode"
          >
            <Settings className={isAdmin ? 'text-blue-500' : 'text-gray-500'} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPanel /> : <GameScene />}
        
        {isAdmin && bugs.length > 0 && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Defined Bugs</h2>
            <ul className="space-y-2">
              {bugs.map((bug) => (
                <li key={bug.id} className="p-3 bg-gray-50 rounded">
                  <span className="font-medium">{bug.name}</span>
                  <p className="text-sm text-gray-600 mt-1">{bug.prompt}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;