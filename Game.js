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

  // Función para consultar la API según la categoría
  const fetchQuestion = async () => {
    if (questionCount >= TOTAL_QUESTIONS) return;
    let url = "";
    if (categoria === "videojuegos") {
      // Consulta para preguntas de videojuegos
      url = "https://the-trivia-api.com/v2/questions?categories=entertainment&subcategories=video_games&limit=1";
    } else if (categoria === "deportes") {
      url = "https://the-trivia-api.com/v2/questions?categories=sports&limit=1";
    } else {
      // Por defecto: cultura general
      url = "https://the-trivia-api.com/v2/questions?categories=general_knowledge&limit=1";
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        const q = data[0];
        setQuestion(q);
        // Combina la respuesta correcta con las incorrectas y baraja las opciones
        const allOptions = [q.correctAnswer, ...q.incorrectAnswers];
        setOptions(shuffle(allOptions));
      }
    } catch (error) {
      console.error("Error al obtener la pregunta:", error);
    }
  };

  // Algoritmo de Fisher-Yates para barajar
  const shuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Reinicia el contador y la puntuación cada vez que cambia la categoría,
  // y carga la primera pregunta
  useEffect(() => {
    setQuestionCount(0);
    setScore(0);
    setFeedback("");
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoria]);

  // Si el valor es un objeto { text: "..." } lo extrae, sino lo retorna tal cual
  const extractText = (value) => {
    return typeof value === "object" && value.text ? value.text : value;
  };

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
    // Actualiza el contador de preguntas
    const nextCount = questionCount + 1;
    setQuestionCount(nextCount);
    // Después de 1 segundo, limpia el feedback y carga la siguiente pregunta o finaliza
    setTimeout(() => {
      setFeedback("");
      if (nextCount < TOTAL_QUESTIONS) {
        fetchQuestion();
      } else {
        // Finaliza el juego
        setQuestion(null);
      }
    }, 1000);
  };

  return (
    <div className="form-container">
      {questionCount >= TOTAL_QUESTIONS && question === null ? (
        <div>
          <h2>Juego Finalizado</h2>
          <p>Has completado {TOTAL_QUESTIONS} preguntas.</p>
          <p>Puntuación final: {score}</p>
          <button onClick={onRestart}>Regresar al inicio</button>
        </div>
      ) : (
        <>
          <h2>
            {categoria} - Pregunta {questionCount + 1} de {TOTAL_QUESTIONS}
          </h2>
          {question ? (
            <div>
              <p>{extractText(question.question)}</p>
              <div className="button-group">
                {options.map((option, idx) => (
                  <button key={idx} onClick={() => handleAnswer(option)}>
                    {extractText(option)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p>Cargando pregunta...</p>
          )}
          <div style={{ marginTop: "20px" }}>
            <strong>Puntuación: {score}</strong>
          </div>
          {feedback && <div style={{ marginTop: "10px" }}>{feedback}</div>}
        </>
      )}
    </div>
  );
};

export default Game;
