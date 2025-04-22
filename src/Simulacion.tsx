import { useState } from "react";
import './styles.css';

// Datos base de las jugadoras
const jugadorasBase = [
  { nombre: "Candela", posiciones: ["Armadora"] },
  { nombre: "Miranda", posiciones: ["Armadora"] },
  { nombre: "Florencia", posiciones: ["Central", "Opuesta"] },
  { nombre: "Abril M.", posiciones: ["Opuesta"] },
  { nombre: "Micaela", posiciones: ["Punta"] },
  { nombre: "Milena", posiciones: ["Punta"] },
  { nombre: "Irina", posiciones: ["Punta", "Central"] },
  { nombre: "Sol", posiciones: ["Punta"] },
  { nombre: "Camila", posiciones: ["Central"] },
  { nombre: "Josefina", posiciones: ["Central"] },
  { nombre: "Abril S.", posiciones: ["Punta"] },
  { nombre: "Julieta A", posiciones: ["Punta", "Líbero"] },
  { nombre: "Julieta S", posiciones: ["Opuesta", "Líbero"] },
  { nombre: "Carolina", posiciones: ["Punta", "Líbero"] },
  { nombre: "Flavia", posiciones: ["Punta", "Líbero"] },
  { nombre: "Agustina", posiciones: ["Punta"] },
];

export default function Simulador() {
  const [formacion, setFormacion] = useState(jugadorasBase.slice(0, 6)); // Formacion inicial
  const [rotacion, setRotacion] = useState(0); // Control de rotación
  const [setActual, setSetActual] = useState(1); // Set actual
  const [puntosSet, setPuntosSet] = useState<[number, number]>([0, 0]); // Puntaje
  const [historial, setHistorial] = useState<string[]>([]); // Historial de puntos
  const [motivoGanado, setMotivoGanado] = useState(""); // Motivo punto ganado
  const [motivoPerdido, setMotivoPerdido] = useState(""); // Motivo punto perdido
  const [jugadoraGanadora, setJugadoraGanadora] = useState<string | null>(null); // Jugadora ganadora

  const zonas = [
    { area: "z1", nombre: "Zona 1" },
    { area: "z6", nombre: "Zona 6" },
    { area: "z5", nombre: "Zona 5" },
    { area: "z4", nombre: "Zona 4" },
    { area: "z3", nombre: "Zona 3" },
    { area: "z2", nombre: "Zona 2" },
  ];

  // Función para rotar las jugadoras en sentido horario
  const rotar = () => {
    const nueva = [
      formacion[5], // 2 → 1
      formacion[0], // 1 → 6
      formacion[1], // 6 → 5
      formacion[2], // 5 → 4
      formacion[3], // 4 → 3
      formacion[4], // 3 → 2
    ];
    setFormacion(nueva);
    setRotacion((r) => (r + 1) % 6); // Ciclo de rotaciones
  };

  // Función para registrar un punto ganado o perdido
  const registrarPunto = (resultado: "ganado" | "perdido") => {
    const descripcion =
      resultado === "ganado"
        ? `✔ ${puntosSet[0] + 1}-${puntosSet[1]}: ${motivoGanado} ${jugadoraGanadora ?? ""}`
        : `❌ ${puntosSet[0]}-${puntosSet[1] + 1}: ${motivoPerdido}`;
    setHistorial([...historial, descripcion]);
    if (resultado === "ganado") setPuntosSet([puntosSet[0] + 1, puntosSet[1]]);
    else setPuntosSet([puntosSet[0], puntosSet[1] + 1]);
    setMotivoGanado("");
    setMotivoPerdido("");
    setJugadoraGanadora(null);
  };

  return (
    <div className="container">
      {/* Título */}
      <div className="titulo">
        <h1>KIWIS</h1>
      </div>

      <div className="cancha">
        {/* Mapeo de zonas en la cancha */}
        {zonas.map((zona, idx) => (
          <div key={zona.area} className={`zona zona-${zona.area}`}>
            <div className="jugadora-card">
              <div>{formacion[idx]?.nombre}</div>
              <small>{formacion[idx]?.posiciones.join("/")}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2>Set {setActual}</h2>
        <div>Puntaje: {puntosSet[0]} - {puntosSet[1]}</div>

        {/* Botón de rotación */}
        <button onClick={rotar}>🔁 Rotar</button>

        {/* Motivos para los puntos */}
        <div>
          <h4>Motivo punto ganado</h4>
          <select value={motivoGanado} onChange={(e) => setMotivoGanado(e.target.value)}>
            <option value="">Seleccionar</option>
            {["ACE", "ATAQUE", "BLOQUEO", "TOQUE", "ERROR RIVAL"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <h4>Motivo punto perdido</h4>
          <select value={motivoPerdido} onChange={(e) => setMotivoPerdido(e.target.value)}>
            <option value="">Seleccionar</option>
            {[
              "ERROR DE SAQUE",
              "ERROR DE ATAQUE",
              "BLOQUEO RIVAL",
              "ERROR NO FORZADO",
              "ERROR DE RECEPCION",
              "ATAQUE RIVAL",
              "SAQUE RIVAL",
            ].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <h4>Jugadora destacada</h4>
          <select value={jugadoraGanadora ?? ""} onChange={(e) => setJugadoraGanadora(e.target.value)}>
            <option value="">Ninguna</option>
            {formacion.map((j) => (
              <option key={j.nombre}>{j.nombre}</option>
            ))}
          </select>

          {/* Botones para registrar puntos */}
          <button onClick={() => registrarPunto("ganado")}>✔ Punto Ganado</button>
          <button onClick={() => registrarPunto("perdido")}>❌ Punto Perdido</button>
        </div>

        {/* Historial de puntos */}
        <div>
          <h3>Historial</h3>
          <ul>{historial.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
