import { useState } from "react";

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

export default function Simulacion() {
  const [formacion, setFormacion] = useState(jugadorasBase.slice(0, 6));
  const [suplentes, setSuplentes] = useState(jugadorasBase.slice(6));
  const [rotacion, setRotacion] = useState(0);
  const [setActual, setSetActual] = useState(1);
  const [setsAnteriores, setSetsAnteriores] = useState<number[][]>([]);
  const [puntosSet, setPuntosSet] = useState<[number, number]>([0, 0]);
  const [historial, setHistorial] = useState<string[]>([]);
  const [motivoGanado, setMotivoGanado] = useState("");
  const [motivoPerdido, setMotivoPerdido] = useState("");
  const [jugadoraGanadora, setJugadoraGanadora] = useState<string | null>(null);

  const zonas = [
    { area: "z1", nombre: "Zona 1" },
    { area: "z6", nombre: "Zona 6" },
    { area: "z5", nombre: "Zona 5" },
    { area: "z4", nombre: "Zona 4" },
    { area: "z3", nombre: "Zona 3" },
    { area: "z2", nombre: "Zona 2" },
  ];

  // Rotación de jugadoras (1 → 6 → 5 → 4 → 3 → 2 → 1)
  const rotar = () => {
    const nuevaFormacion = [
      formacion[1], // 1 → 6
      formacion[5], // 6 → 5
      formacion[0], // 5 → 4
      formacion[4], // 4 → 3
      formacion[3], // 3 → 2
      formacion[2], // 2 → 1
    ];
    setFormacion(nuevaFormacion);
    setRotacion((r) => (r + 1) % 6);
  };

  // Registrar punto ganado o perdido
  const registrarPunto = (resultado: "ganado" | "perdido") => {
    const descripcion = resultado === "ganado"
      ? `✔ ${puntosSet[0] + 1}-${puntosSet[1]}: ${motivoGanado} ${jugadoraGanadora ?? ""}`
      : `❌ ${puntosSet[0]}-${puntosSet[1] + 1}: ${motivoPerdido}`;
    setHistorial([...historial, descripcion]);
    if (resultado === "ganado") setPuntosSet([puntosSet[0] + 1, puntosSet[1]]);
    else setPuntosSet([puntosSet[0], puntosSet[1] + 1]);
    setMotivoGanado("");
    setMotivoPerdido("");
    setJugadoraGanadora(null);
  };

  // Generar rotación aleatoria
  const generarRotacion = () => {
    const mezcladas = [...jugadorasBase].sort(() => 0.5 - Math.random()).slice(0, 6);
    setFormacion(mezcladas);
    setRotacion(0);
    setPuntosSet([0, 0]);
    setHistorial([]);
  };

  // Cambiar jugadora en una zona
  const cambiarJugadora = (zona: number, nueva: string) => {
    const index = suplentes.findIndex(j => j.nombre === nueva);
    if (index !== -1) {
      // Se encuentra la suplente y se cambia con la jugadora de la cancha
      const suplente = suplentes[index];
      const nuevaFormacion = [...formacion];
      nuevaFormacion[zona] = suplente;
      setFormacion(nuevaFormacion);

      // Actualizar suplentes después de realizar el cambio
      setSuplentes(suplentes.filter((s, i) => i !== index));
    }
  };

  // Agregar jugadora al banco de suplentes
  const agregarSuplente = (jugadora: string) => {
    const index = formacion.findIndex(j => j.nombre === jugadora);
    if (index !== -1) {
      const jugadoraQueSale = formacion[index];
      setSuplentes([...suplentes, jugadoraQueSale]); // Agregar a la suplente
      const nuevaFormacion = [...formacion];
      nuevaFormacion[index] = jugadorasBase.find(j => j.nombre === jugadora) ?? nuevaFormacion[index];
      setFormacion(nuevaFormacion); // Reemplazar la jugadora en la cancha
    }
  };

  return (
    <div className="container">
      <div className="cancha">
        {zonas.map((zona, idx) => (
          <div key={zona.area} className={`zona zona-${zona.area}`}>
            <div className="jugadora-card">
              <div>{formacion[idx]?.nombre}</div>
              <small>{formacion[idx]?.posiciones.join("/")}</small>
              <select onChange={(e) => cambiarJugadora(idx, e.target.value)}>
                <option value="">Seleccionar Suplente</option>
                {suplentes.map(s => <option key={s.nombre} value={s.nombre}>{s.nombre}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
      <div className="panel">
        <h2>Set {setActual}</h2>
        <div>Puntaje: {puntosSet[0]} - {puntosSet[1]}</div>
        <button onClick={rotar}>🔁 Rotar</button>
        <button onClick={generarRotacion}>🎲 Generar Rotación</button>
        <div>
          <h4>Motivo punto ganado</h4>
          <select value={motivoGanado} onChange={(e) => setMotivoGanado(e.target.value)}>
            <option value="">Seleccionar</option>
            {["ACE", "ATAQUE", "BLOQUEO", "TOQUE", "ERROR RIVAL"].map(m => <option key={m}>{m}</option>)}
          </select>
          <h4>Motivo punto perdido</h4>
          <select value={motivoPerdido} onChange={(e) => setMotivoPerdido(e.target.value)}>
            <option value="">Seleccionar</option>
            {["ERROR DE SAQUE", "ERROR DE ATAQUE", "BLOQUEO RIVAL", "ERROR NO FORZADO", "ERROR DE RECEPCION", "ATAQUE RIVAL", "SAQUE RIVAL"].map(m => <option key={m}>{m}</option>)}
          </select>
          <h4>Jugadora destacada</h4>
          <select value={jugadoraGanadora ?? ""} onChange={(e) => setJugadoraGanadora(e.target.value)}>
            <option value="">Ninguna</option>
            {formacion.map(j => <option key={j.nombre}>{j.nombre}</option>)}
          </select>
          <button onClick={() => registrarPunto("ganado")}>✔ Punto Ganado</button>
          <button onClick={() => registrarPunto("perdido")}>❌ Punto Perdido</button>
        </div>
        <div>
          <h3>Historial</h3>
          <ul>{historial.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>
        <div>
          <h4>Suplentes</h4>
          <select onChange={(e) => agregarSuplente(e.target.value)}>
            <option value="">Seleccionar suplente</option>
            {suplentes.map(s => <option key={s.nombre} value={s.nombre}>{s.nombre}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
