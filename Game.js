import React, { useState, useEffect } from "react";
import socket from "./sockets";
import "./Game.css";

const TOTAL_QUESTIONS = 15;

const Game = ({ categoria, onRestart }) => {
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [questionCount, setQuestionCount] = useState(0);

  // Solicita una pregunta a la API según la categoría seleccionada
  const fetchQuestion = async () => {
    if (questionCount >= TOTAL_QUESTIONS) return;
    let url = "";
    if (categoria === "videojuegos") {
      // Cambiado para que devuelva específicamente preguntas de videojuegos
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
        // Combina la respuesta correcta con las incorrectas y mezcla las opciones
        const allOptions = [q.correctAnswer, ...q.incorrectAnswers];
        setOptions(shuffle(allOptions));
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  // Función para barajar las opciones (algoritmo Fisher-Yates)
  const shuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    // Reinicia el juego al cambiar la categoría
    setQuestionCount(0);
    setScore(0);
    setFeedback("");
    fetchQuestion();

    // Aquí puedes agregar listeners o emitir eventos vía socket para el modo multijugador.
    // Por ejemplo:
    // socket.on("nuevaPregunta", (data) => { ... });
  }, [categoria]);

  // Extrae el texto (si es objeto con { text: "..." } o cadena)
  const extractText = (value) => {
    return typeof value === "object" && value.text ? value.text : value;
  };

  // Maneja la respuesta del usuario
  const handleAnswer = (selected) => {
    if (!question) return;
    const selectedText = extractText(selected);
    const correctText = extractText(question.correctAnswer);

    if (selectedText === correctText) {
      setScore((prev) => prev + 1);
      setFeedback("¡Correcto!");
      // Aquí podrías emitir por socket la respuesta correcta para el modo multijugador
      // socket.emit("playerAnswer", { correct: true });
    } else {
      setFeedback("¡Incorrecto!");
      // socket.emit("playerAnswer", { correct: false });
    }

    // Espera 1 segundo para mostrar el feedback y luego actualiza el contador
    setTimeout(() => {
      setQuestionCount((prevCount) => {
        const newCount = prevCount + 1;
        setFeedback("");
        if (newCount < TOTAL_QUESTIONS) {
          fetchQuestion();
        } else {
          // Finaliza el juego
          setQuestion(null);
        }
        return newCount;
      });
    }, 1000);
  };

  return (
    <div className="form-container game-container">
      {/* Botón "Regresar" para volver a la selección de categorías */}
      <button className="back-btn" onClick={onRestart}>
        <i className="bi bi-arrow-left"></i> Regresar
      </button>

      {question ? (
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
      ) : (
        <div className="final-screen">
          <h2>Juego Finalizado</h2>
          <p>Categoría jugada: {categoria}</p>
          <p>Contestaste {TOTAL_QUESTIONS} preguntas</p>
          <p>Puntuación final: {score}</p>
          <button className="restart-btn" onClick={onRestart}>
            <i className="bi bi-arrow-left"></i> Regresar
          </button>
        </div>
      )}

      {feedback && <div className="feedback">{feedback}</div>}
    </div>
  );
};

export default Game;
