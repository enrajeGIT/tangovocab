import { useEffect, useState } from "react";
import { auth } from "./lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  const [user, setUser] = useState<any>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (!user) {
    return (
      <div style={styles.container}>
        {mode === "login" ? (
          <>
            <Login onSuccess={() => setMode("login")} />
            <p>
              Pas encore de compte ?{" "}
              <button onClick={() => setMode("signup")}>Créer un compte</button>
            </p>
          </>
        ) : (
          <>
            <Signup onSuccess={() => setMode("login")} />
            <p>
              Déjà inscrit ?{" "}
              <button onClick={() => setMode("login")}>Se connecter</button>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Bienvenue, {user.email} 👋</h1>
      <button onClick={handleLogout} style={styles.logoutBtn}>
        🔒 Se déconnecter
      </button>

      {/* Ici tu peux afficher ton quiz */}
      <p>🎯 Quiz ici bientôt…</p>
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
  logoutBtn: {
    backgroundColor: "#eee",
    border: "1px solid #ccc",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    marginBottom: "1rem",
  },
};

export default App;
