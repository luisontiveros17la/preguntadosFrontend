import React, { useState, useEffect } from 'react';
import socket from './sockets';
import './Game.css';

const categoryMapping = {
  culturaGeneral: "general_knowledge",
  videojuegos: "video_games",
  deportes: "sports"
};

const TOTAL_QUESTIONS = 15;

const Game = ({ categoria }) => {
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [questionCount, setQuestionCount] = useState(0);

  const mappedCategory = categoryMapping[categoria] || "general_knowledge";

  // Baraja las opciones mediante el algoritmo Fisher-Yates
  const shuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchQuestion = async () => {
    try {
      // Si ya se contestaron 15 preguntas, no buscar nueva pregunta.
      if (questionCount >= TOTAL_QUESTIONS) return;
      const response = await fetch(`https://the-trivia-api.com/v2/questions?categories=${mappedCategory}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const q = data[0];
        setQuestion(q);
        // Combina la respuesta correcta con las incorrectas y barájalas.
        const allOptions = [q.correctAnswer, ...q.incorrectAnswers];
        setOptions(shuffle(allOptions));
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  useEffect(() => {
    // Al cambiar la categoría, reiniciar contador y puntuación, y cargar la primera pregunta.
    setQuestionCount(0);
    setScore(0);
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoria]);

  // Función que se encarga de extraer el texto en caso de que el valor sea un objeto con clave "text"
  const extractText = (value) => {
    return typeof value === "object" && value.text ? value.text : value;
  };

  const handleAnswer = (selected) => {
    if (!question) return;
    const selectedText = extractText(selected);
    const correctText = extractText(question.correctAnswer);

    if (selectedText === correctText) {
      setScore(prevScore => prevScore + 1);
      setFeedback("¡Correcto!");
    } else {
      setFeedback("¡Incorrecto!");
    }
    // Incrementar el contador de preguntas
    setQuestionCount(prevCount => prevCount + 1);

    // Esperar 1 segundo para mostrar feedback y luego cargar la siguiente pregunta o finalizar
    setTimeout(() => {
      setFeedback("");
      if (questionCount + 1 < TOTAL_QUESTIONS) {
        fetchQuestion();
      } else {
        // Termina el juego (dejamos question en null para mostrar el resultado final)
        setQuestion(null);
      }
    }, 1000);
  };

  return (
    <div className="form-container">
      {questionCount >= TOTAL_QUESTIONS ? (
        <div>
          <h2>Juego Finalizado</h2>
          <p>Has completado {TOTAL_QUESTIONS} preguntas.</p>
          <p>Puntuación final: {score}</p>
        </div>
      ) : (
        <>
          <h2>{categoria} - Pregunta {questionCount + 1} de {TOTAL_QUESTIONS}</h2>
          {question ? (
            <div>
              <p>{extractText(question.question)}</p>
              <div className="button-group">
                {options.map((option, index) => (
                  <button key={index} onClick={() => handleAnswer(option)}>
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
