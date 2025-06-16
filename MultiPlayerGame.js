import React, { useState, useEffect } from "react";
import socket from "./sockets";
import "./Game.css"; // Se utilizan los mismos estilos que en el Game unificado

const TOTAL_QUESTIONS = 15;

const MultiPlayerGame = ({ categoria, jugador, onRestart }) => {
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);

  // Estados para el temporizador
  const [startTime, setStartTime] = useState(null);
  const [playerTime, setPlayerTime] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [result, setResult] = useState(null);

  // Al iniciar el juego, obtenemos la primera pregunta y registramos el tiempo inicial.
  useEffect(() => {
    fetchQuestion();
    setStartTime(Date.now());
    // En este punto puedes emitir un evento 'joinGame' para que el servidor sepa que este jugador se unió al modo 1vs1.
    socket.emit("joinGame", { jugador, categoria });
  }, [categoria]);

  // Función para solicitar una pregunta a la API según la categoría
  const fetchQuestion = async () => {
    if (questionCount >= TOTAL_QUESTIONS) return;
    let url = "";
    if (categoria === "videojuegos") {
      url = "https://the-trivia-api.com/v2/questions?categories=video_games&limit=1";
    } else if (categoria === "deportes") {
      url = "https://the-trivia-api.com/v2/questions?categories=sports&limit=1";
    } else {
      url = "https://the-trivia-api.com/v2/questions?categories=general_knowledge&limit=1";
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        const q = data[0];
        setQuestion(q);
        const allOptions = [q.correctAnswer, ...q.incorrectAnswers];
        setOptions(shuffle(allOptions));
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  // Algoritmo de barajado (Fisher‑Yates)
  const shuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Función para extraer el texto (ya sea un objeto con { text } o un string)
  const extractText = (value) => {
    return typeof value === "object" && value.text ? value.text : value;
  };

  // Manejo de la respuesta de una pregunta
  const handleAnswer = (selected) => {
    if (!question) return;
    const selectedText = extractText(selected);
    const correctText = extractText(question.correctAnswer);
    if (selectedText === correctText) {
      setScore(prev => prev + 1);
      setFeedback("¡Correcto!");
    } else {
      setFeedback("¡Incorrecto!");
    }

    // Espera 1 segundo para borrar el feedback y avanzar a la siguiente pregunta
    setTimeout(() => {
      setFeedback("");
      setQuestionCount(prevCount => {
        const newCount = prevCount + 1;
        if (newCount < TOTAL_QUESTIONS) {
          fetchQuestion();
        } else {
          // Finaliza el juego: se calcula el tiempo total y se emite al servidor el resultado
          const finishTime = Date.now();
          const totalTime = ((finishTime - startTime) / 1000).toFixed(2);
          setPlayerTime(totalTime);
          setGameFinished(true);
          // Se emite el evento "finishGame" con el tiempo total y la puntuación
          socket.emit("finishGame", { jugador, time: totalTime, score });
        }
        return newCount;
      });
    }, 1000);
  };

  // Escucha el evento "gameResult" emitido por el servidor que compara los tiempos de ambos jugadores
  useEffect(() => {
    socket.on("gameResult", (data) => {
      // data: { players: [{ jugador, time, score }], winner: <nombre o "tie"> }
      setResult(data);
    });
    return () => {
      socket.off("gameResult");
    };
  }, []);

  return (
    <div className="form-container game-container">
      {/* Botón para regresar a la selección de categoría */}
      <button className="back-btn" onClick={onRestart}>
        <i className="bi bi-arrow-left"></i> Regresar
      </button>

      {/* Durante el juego se muestran las preguntas; al finalizar se muestran los resultados */}
      { !gameFinished && question ? (
        <>
          <p className="question-text">{extractText(question.question)}</p>
          <div className="button-group">
            {options.map((option, idx) => (
              <button key={idx} onClick={() => handleAnswer(option)}>
                {extractText(option)}
              </button>
            ))}
          </div>
        </>
      ) : gameFinished && result ? (
        <div className="final-screen">
          <h2>Juego Finalizado</h2>
          <p>Categoría jugada: {categoria}</p>
          <p>Tus 15 preguntas respondidas: {score} aciertos</p>
          <p>Tu tiempo: {playerTime} segundos</p>
          <br />
          {result.winner === jugador ? (
            <p>¡Ganaste! Eres el más rápido.</p>
          ) : result.winner === "tie" ? (
            <p>Empate de tiempos.</p>
          ) : (
            <p>Perdiste, {result.winner} fue más rápido.</p>
          )}
          <button className="restart-btn" onClick={onRestart}>
            <i className="bi bi-arrow-left"></i> Regresar
          </button>
        </div>
      ) : gameFinished ? (
        <div className="final-screen">
          <h2>Esperando resultados del oponente...</h2>
        </div>
      ) : (
        <div>
          <h2>Cargando pregunta...</h2>
        </div>
      )}

      {feedback && <div className="feedback">{feedback}</div>}

      {/* Se muestra el score en tiempo real (opcional) */}
      <div className="score-container">
        <strong>Puntuación: {score}</strong>
      </div>
    </div>
  );
};

export default MultiPlayerGame;
