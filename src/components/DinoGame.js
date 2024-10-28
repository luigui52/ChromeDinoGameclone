import React, { useState, useEffect, useCallback } from 'react';
import './DinoGame.css';

const DinoGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [dinoPosition, setDinoPosition] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState([]);

  // Configuración del juego
  const JUMP_FORCE = 300;
  const GRAVITY = 0.9;
  const GAME_SPEED = 5;
  const OBSTACLE_INTERVAL = 2000;

  // Gestionar el salto
  const jump = useCallback(() => {
    if (!isJumping && !isGameOver) {
      setIsJumping(true);
      setDinoPosition(JUMP_FORCE);
    }
  }, [isJumping, isGameOver]);

  // Manejar las teclas
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.code === 'Space' || e.key === 'ArrowUp') && !gameStarted) {
        setGameStarted(true);
        return;
      }
      if ((e.code === 'Space' || e.key === 'ArrowUp')) {
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump, gameStarted]);

  // Loop principal del juego
  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(() => {
      if (isGameOver) return;

      // Actualizar posición del dinosaurio
      if (isJumping) {
        setDinoPosition((pos) => {
          const newPos = pos - GRAVITY * 5;
          if (newPos <= 0) {
            setIsJumping(false);
            return 0;
          }
          return newPos;
        });
      }

      // Actualizar obstáculos
      setObstacles((currentObstacles) => {
        const updatedObstacles = currentObstacles
          .map((obstacle) => ({
            ...obstacle,
            position: obstacle.position - GAME_SPEED,
          }))
          .filter((obstacle) => obstacle.position > -50);

        // Detectar colisiones
        const collision = updatedObstacles.some(
          (obstacle) =>
            obstacle.position < 60 &&
            obstacle.position > 0 &&
            dinoPosition < 60
        );

        if (collision) {
          setIsGameOver(true);
          if (score > highScore) {
            setHighScore(score);
          }
          clearInterval(gameLoop);
        }

        return updatedObstacles;
      });

      // Actualizar puntuación
      setScore((s) => s + 1);
    }, 20);

    return () => clearInterval(gameLoop);
  }, [gameStarted, isGameOver, isJumping, dinoPosition, score, highScore]);

  // Generar obstáculos
  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const obstacleInterval = setInterval(() => {
      setObstacles((currentObstacles) => [
        ...currentObstacles,
        { position: 800, height: Math.random() * 30 + 30 },
      ]);
    }, OBSTACLE_INTERVAL);

    return () => clearInterval(obstacleInterval);
  }, [gameStarted, isGameOver]);

  // Reiniciar juego
  const resetGame = () => {
    setGameStarted(false);
    setIsGameOver(false);
    setScore(0);
    setDinoPosition(0);
    setIsJumping(false);
    setObstacles([]);
  };

  return (
    <div className="game-container">
      <div className="score-container">
        <div>HI {String(highScore).padStart(5, '0')}</div>
        <div>{String(score).padStart(5, '0')}</div>
      </div>

      <div className="game-area">
        {/* Dinosaurio */}
        <div
          className="dino"
          style={{
            transform: `translateY(-${dinoPosition}px)`,
          }}
        />

        {/* Obstáculos */}
        {obstacles.map((obstacle, index) => (
          <div
            key={index}
            className="obstacle"
            style={{
              left: `${obstacle.position}px`,
              height: `${obstacle.height}px`,
            }}
          />
        ))}

        {!gameStarted && !isGameOver && (
          <div className="start-message">
            <p>Presiona ESPACIO o ↑ para comenzar</p>
          </div>
        )}

        {isGameOver && (
          <div className="game-over">
            <h2>GAME OVER</h2>
            <button className="restart-button" onClick={resetGame}>
              Jugar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DinoGame;