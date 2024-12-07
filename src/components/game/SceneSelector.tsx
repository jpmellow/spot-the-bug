import React from 'react';
import { Scene } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SceneSelectorProps {
  scenes: Scene[];
  currentSceneId: string | null;
  onSelectScene: (sceneId: string) => void;
}

export const SceneSelector: React.FC<SceneSelectorProps> = ({
  scenes,
  currentSceneId,
  onSelectScene,
}) => {
  const currentIndex = scenes.findIndex(scene => scene.id === currentSceneId);

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : scenes.length - 1;
    onSelectScene(scenes[newIndex].id);
  };

  const goToNext = () => {
    const newIndex = currentIndex < scenes.length - 1 ? currentIndex + 1 : 0;
    onSelectScene(scenes[newIndex].id);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <button
        onClick={goToPrevious}
        className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
        title="Previous scene"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="flex-1">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {scenes.map((scene, index) => (
            <button
              key={scene.id}
              onClick={() => onSelectScene(scene.id)}
              className={`relative aspect-video rounded-lg overflow-hidden transition-all
                ${currentSceneId === scene.id
                  ? 'ring-2 ring-blue-500 scale-105'
                  : 'opacity-60 hover:opacity-100'
                }`}
            >
              <img
                src={scene.image}
                alt={scene.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30">
                <span className="text-white font-medium opacity-0 hover:opacity-100">
                  {index + 1}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={goToNext}
        className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
        title="Next scene"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};