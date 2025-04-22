import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SelectEquipo from './SelectEquipo';
import Simulacion from './Simulacion';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SelectEquipo />} />
        <Route path="/simulacion" element={<Simulacion />} />
      </Routes>
    </Router>
  );
}

export default App;
