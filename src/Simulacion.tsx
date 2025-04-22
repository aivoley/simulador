import { useState } from "react";
import './styles.css';

// Datos base
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
  const [formacion, setFormacion] = useState([]);
  const [suplentes, setSuplentes] = useState([]);
  const [setActual, setSetActual] = useState(1);
  const [puntosSet, setPuntosSet] = useState<[number, number]>([0, 0]);
  const [historial, setHistorial] = useState<string[]>([]);

  const zonas = [
    { area: "z1", nombre: "Zona 1" },
    { area: "z6", nombre: "Zona 6" },
    { area: "z5", nombre: "Zona 5" },
    { area: "z4", nombre: "Zona 4" },
    { area: "z3", nombre: "Zona 3" },
    { area: "z2", nombre: "Zona 2" },
  ];

  const crearEquipoManual = (jugadorasSeleccionadas: string[]) => {
    const equipo = jugadorasBase.filter(j => jugadorasSeleccionadas.includes(j.nombre));
    setFormacion(equipo.slice(0, 6));
    setSuplentes(equipo.slice(6));
  };

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
  };

  const registrarPunto = (resultado: "ganado" | "perdido") => {
    const descripcion = resultado === "ganado"
      ? `✔ ${puntosSet[0] + 1}-${puntosSet[1]}`
      : `❌ ${puntosSet[0]}-${puntosSet[1] + 1}`;
    setHistorial([...historial, descripcion]);
    if (resultado === "ganado") setPuntosSet([puntosSet[0] + 1, puntosSet[1]]);
    else setPuntosSet([puntosSet[0], puntosSet[1] + 1]);
  };

  return (
    <div className="container">
      {/* Título y Logo */}
      <div className="titulo">
        <h1>KIWIS</h1>
        <img src="src
/png-transparent-kiwifruit-kiwi-fruit-s-cartoon-fruit-eye.png" alt="Fruta Kiwi" style={{ width: "50px", height: "50px" }} />
      </div>

      {/* Crear Equipo Manual */}
      {formacion.length === 0 ? (
        <div className="crear-equipo">
          <h2>Crear Equipo Manualmente</h2>
          <select multiple onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, option => option.value);
            crearEquipoManual(selected);
          }}>
            {jugadorasBase.map(j => (
              <option key={j.nombre} value={j.nombre}>{j.nombre}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className="cancha">
          {/* Cancha */}
          {zonas.map((zona, idx) => (
            <div key={zona.area} className={`zona zona-${zona.area}`}>
              <div className="jugadora-card">
                <div>{formacion[idx]?.nombre}</div>
                <small>{formacion[idx]?.posiciones.join("/")}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="panel">
        <h2>Set {setActual}</h2>
        <div>Puntaje: {puntosSet[0]} - {puntosSet[1]}</div>
        <button onClick={rotar}>🔁 Rotar</button>

        <div>
          <h3>Historial</h3>
          <ul>{historial.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
