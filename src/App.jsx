import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import TranscendentalHero from "./components/TranscendentalHero";
import Trustedby from "./components/tustedby";
import Services from "./components/services";
import Ourwork from "./components/ourwork";
import Teams from "./components/teams";
function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  return (
    <div className="dark:bg-black relative">
      <Navbar theme={theme} setTheme={setTheme} />
      <TranscendentalHero />
      <Trustedby />
      <Services />
      <Ourwork />
      <Teams/>
      
    </div>
  );
}

export default App;