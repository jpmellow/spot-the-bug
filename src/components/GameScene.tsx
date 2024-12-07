import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { BugModal } from './BugModal';
import { SceneSelector } from './game/SceneSelector';

export const GameScene = () => {
  const {
    scenes,
    currentSceneId,
    setCurrentScene,
    bugs,
    currentBugId,
    setCurrentBug
  } = useGameStore();

  const [showModal, setShowModal] = useState(false);
  const [selectedBug, setSelectedBug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentScene = scenes.find(scene => scene.id === currentSceneId);
  const currentSceneBugs = bugs.filter(bug => bug.sceneId === currentSceneId);

  // Set initial scene and bug when component mounts
  useEffect(() => {
    if (scenes.length > 0 && !currentSceneId) {
      setCurrentScene(scenes[0].id);
    }
  }, [scenes, currentSceneId, setCurrentScene]);

  useEffect(() => {
    if (currentSceneBugs.length > 0 && !currentBugId) {
      setCurrentBug(currentSceneBugs[0].id);
    }
  }, [currentSceneBugs, currentBugId, setCurrentBug]);

  // Clear feedback message after 2 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const clickedBug = currentSceneBugs.find((bug) => isPointInPolygon({ x, y }, bug.coordinates));
    
    if (clickedBug?.id === currentBugId) {
      setSelectedBug(clickedBug.id);
      setShowModal(true);
      setFeedback(null);
    } else {
      setFeedback("Not quite! Try again!");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Move to next bug in current scene
    const currentIndex = currentSceneBugs.findIndex(bug => bug.id === currentBugId);
    const nextIndex = (currentIndex + 1) % currentSceneBugs.length;
    setCurrentBug(currentSceneBugs[nextIndex].id);
  };

  const isPointInPolygon = (
    point: { x: number; y: number },
    polygon: { x: number; y: number }[]
  ) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x;
      const yi = polygon[i].y;
      const xj = polygon[j].x;
      const yj = polygon[j].y;

      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

      if (intersect) inside = !inside;
    }
    return inside;
  };

  const currentBug = currentSceneBugs.find((bug) => bug.id === currentBugId);

  if (scenes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">No scenes available</p>
        <p className="text-gray-500 mt-2">Switch to admin mode to add scenes and bugs</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <SceneSelector
        scenes={scenes}
        currentSceneId={currentSceneId}
        onSelectScene={setCurrentScene}
      />

      {currentScene ? (
        <div className="space-y-6">
          <div className="relative inline-block w-full">
            <img
              src={currentScene.image}
              alt="Bug Scene"
              className="max-w-full w-full cursor-pointer rounded-lg shadow-lg"
              onClick={handleClick}
            />
            {feedback && (
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-lg animate-bounce">
                  {feedback}
                </div>
              </div>
            )}
          </div>
          
          {currentBug && (
            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-lg font-medium text-blue-800">
                {currentBug.prompt}
              </p>
            </div>
          )}

          <BugModal
            isOpen={showModal}
            onClose={handleModalClose}
            bug={currentSceneBugs.find((bug) => bug.id === selectedBug)}
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Select a scene to start playing</p>
        </div>
      )}
    </div>
  );
};