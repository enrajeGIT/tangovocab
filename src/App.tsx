import { useEffect, useState } from "react";
import { vocabulaire } from "./vocabulaire";

type Mot = {
  mot: string;
  transcription: string;
  traduction: string;
};

function App() {
  const [question, setQuestion] = useState<Mot | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showTranscription, setShowTranscription] = useState(false);
  const [answered, setAnswered] = useState(false);

  const lireMot = (mot: string) => {
    const utterance = new SpeechSynthesisUtterance(mot);
    utterance.lang = "ja-JP";
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  const generateQuestion = () => {
    const mot = vocabulaire[Math.floor(Math.random() * vocabulaire.length)];
    const mauvaises = vocabulaire
      .filter((m) => m.traduction !== mot.traduction)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((m) => m.traduction);
    const allOptions = [...mauvaises, mot.traduction].sort(() => 0.5 - Math.random());

    setQuestion(mot);
    setOptions(allOptions);
    setFeedback(null);
    setShowTranscription(false);
    setAnswered(false);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswer = (choix: string) => {
    if (!question || answered) return;

    if (choix === question.traduction) {
      setFeedback("✅ Bonne réponse !");
      setScore((prev) => prev + 1);
    } else {
      setFeedback(`❌ Mauvaise réponse. C'était : ${question.traduction}`);
    }

    setAnswered(true);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Quiz Japonais 🇯🇵</h1>
      <p style={styles.score}>Score : {score}</p>

      {question && (
        <div style={styles.quizCard}>
          <h2 style={styles.word}>{question.mot}</h2>

          <button onClick={() => lireMot(question.mot)} style={styles.soundBtn}>
            🔊 Écouter le mot
          </button>

          <button
            onClick={() => setShowTranscription(!showTranscription)}
            style={styles.transcriptionBtn}
          >
            {showTranscription ? "Masquer transcription" : "Voir transcription"}
          </button>

          {showTranscription && (
            <p style={styles.transcription}>{question.transcription}</p>
          )}

          <div style={styles.options}>
            {options.map((option, idx) => (
              <button
                key={idx}
                style={{
                  ...styles.optionBtn,
                  backgroundColor:
                    answered && option === question.traduction
                      ? "#d4edda"
                      : answered
                      ? "#f8d7da"
                      : "#fff",
                }}
                onClick={() => handleAnswer(option)}
                disabled={answered}
              >
                {option}
              </button>
            ))}
          </div>

          {feedback && <div style={styles.feedback}>{feedback}</div>}

          {answered && (
            <button style={styles.nextBtn} onClick={generateQuestion}>
              ➡️ Question suivante
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "2rem",
    maxWidth: "600px",
    margin: "auto",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  score: {
    fontSize: "1.2rem",
    marginBottom: "1rem",
  },
  quizCard: {
    backgroundColor: "#f8f8f8",
    padding: "2rem",
    borderRadius: "1rem",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  word: {
    fontSize: "3rem",
    marginBottom: "1rem",
    color: "#333",
  },
  soundBtn: {
    marginBottom: "0.5rem",
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    border: "none",
    backgroundColor: "#e0e0ff",
    borderRadius: "0.5rem",
    cursor: "pointer",
  },
  transcriptionBtn: {
    background: "#eee",
    border: "none",
    padding: "0.5rem 1rem",
    marginBottom: "0.5rem",
    marginLeft: "0.5rem",
    cursor: "pointer",
    fontSize: "1rem",
    borderRadius: "0.5rem",
  },
  transcription: {
    fontSize: "1.2rem",
    marginBottom: "1rem",
    color: "#555",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  optionBtn: {
    padding: "1rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid #ccc",
    cursor: "pointer",
    backgroundColor: "#fff",
  },
  feedback: {
    marginTop: "1rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#222",
  },
  nextBtn: {
    marginTop: "1rem",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
  },
};

export default App;
