import { useEffect, useState } from "react";
import { vocabulaire } from "./vocabulaire";
//ceci est la branche de test
type Mot = {
  mot: string;
  transcription: string;
  traduction: string;
};

function App() {
  const [question, setQuestion] = useState<Mot | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showTranscription, setShowTranscription] = useState(false);
  const [answered, setAnswered] = useState(false);

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
    } else {
      setFeedback(`❌ Mauvaise réponse.\nBonne réponse : ${question.traduction}`);
    }

    setAnswered(true);
  };

  const lireMot = (mot: string) => {
    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(mot);
      utterance.lang = "ja-JP";
      utterance.rate = 0.9;
      const voices = speechSynthesis.getVoices();
      const jaVoice = voices.find((v) => v.lang === "ja-JP");
      if (jaVoice) utterance.voice = jaVoice;
      speechSynthesis.speak(utterance);
    };

    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = () => speak();
    } else {
      speak();
    }
  };

  return (
    
    <div style={styles.container}>
      <h1 style={styles.title}>Quiz Japonais 🇯🇵</h1>
    <p style={{ fontSize: "0.8rem", color: "#888" }}>
      🔥 Environnement Firebase : {import.meta.env.VITE_FIREBASE_PROJECT_ID}
    </p>
      {question && (
        <div style={styles.quizCard}>
          <h2 style={styles.word}>{question.mot}</h2>

          <div style={styles.controls}>
            <button onClick={() => lireMot(question.mot)} style={styles.controlBtn}>
              🔊
            </button>
            <button
              onClick={() => setShowTranscription(!showTranscription)}
              style={styles.controlBtn}
            >
              {showTranscription ? "Masquer" : "Transcription"}
            </button>
          </div>

          {/* Zone de transcription avec transition douce */}
          <div style={styles.transcriptionContainer}>
            <p style={{ ...styles.transcription, opacity: showTranscription ? 1 : 0 }}>
              {question.transcription}
            </p>
          </div>

          <div style={styles.options}>
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                disabled={answered}
                style={{
                  ...styles.optionBtn,
                  backgroundColor:
                    answered && option === question.traduction
                      ? "#d4edda"
                      : answered
                      ? "#f8d7da"
                      : "#fff",
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Boîte de feedback fixe sur 2 lignes */}
          <div style={styles.feedbackBox}>
            <pre style={styles.feedback}>
              {feedback || "\n"}{/* assure une hauteur de 2 lignes */}
            </pre>
          </div>

          <div style={styles.nextArea}>
            {answered ? (
              <button style={styles.nextBtn} onClick={generateQuestion}>
                ➡️ Question suivante
              </button>
            ) : (
              <span style={{ visibility: "hidden" }}>Question suivante</span>
            )}
          </div>
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
  quizCard: {
    backgroundColor: "#f9f9f9",
    padding: "2rem",
    borderRadius: "1rem",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    minHeight: "600px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  word: {
    fontSize: "3rem",
    marginBottom: "1rem",
    color: "#333",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "0.5rem",
  },
  controlBtn: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    backgroundColor: "#eee",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
  },
  transcriptionContainer: {
    height: "2rem",
    marginBottom: "1rem",
    transition: "opacity 0.3s ease-in-out",
  },
  transcription: {
    fontSize: "1.2rem",
    color: "#555",
    margin: 0,
    transition: "opacity 0.3s ease-in-out",
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
    minHeight: "3.5rem",
  },
  feedbackBox: {
    height: "2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  feedback: {
    fontSize: "1rem",
    whiteSpace: "pre-line",
    color: "#222",
    fontWeight: "bold",
    margin: 0,
  },
  nextArea: {
    marginTop: "1rem",
    minHeight: "3rem",
  },
  nextBtn: {
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
