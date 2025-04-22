import React, { useState } from "react";
import styled from "styled-components";

// Tipos de datos
type Jugadora = {
  nombre: string;
  posiciones: string[];
};

type Formacion = Jugadora[];

const jugadorasBase: Jugadora[] = [
  { nombre: "Lucía", posiciones: ["Armadora"] },
  { nombre: "Martina", posiciones: ["Punta"] },
  { nombre: "Sofía", posiciones: ["Central"] },
  { nombre: "Camila", posiciones: ["Opuesta"] },
  { nombre: "Valentina", posiciones: ["Central"] },
  { nombre: "Julieta", posiciones: ["Punta"] },
  { nombre: "Agustina", posiciones: ["Líbero"] },
  { nombre: "Emilia", posiciones: ["Armadora"] },
  { nombre: "Paula", posiciones: ["Punta"] },
  { nombre: "Renata", posiciones: ["Central"] },
];

const zonas = ["5", "6", "1", "2", "3", "4"]; // orientación real

const Simulacion: React.FC = () => {
  const [formacion, setFormacion] = useState<Formacion>(jugadorasBase.slice(0, 6));
  const [banco, setBanco] = useState(jugadorasBase.slice(6));
  const [rotacion, setRotacion] = useState(0);
  const [puntosSet, setPuntosSet] = useState<[number, number]>([0, 0]);
  const [historial, setHistorial] = useState<string[]>([]);
  const [setActual, setSetActual] = useState(1);
  const [sets, setSets] = useState<[number, number][]>([]);

  const rotar = () => {
    const nueva = [...formacion];
    const orden = [0, 1, 2, 3, 4, 5];
    const rotada = orden.map((i) => nueva[(i + 5) % 6]);
    setFormacion(rotada);
    setRotacion((prev) => (prev + 1) % 6);
  };

  const cambiarJugadora = (zonaIdx: number, nueva: string) => {
    const jugadora = banco.find((j) => j.nombre === nueva);
    if (!jugadora) return;
    const reemplazada = formacion[zonaIdx];
    const nuevaFormacion = [...formacion];
    nuevaFormacion[zonaIdx] = jugadora;
    setFormacion(nuevaFormacion);
    setBanco([...banco.filter((j) => j.nombre !== nueva), reemplazada]);
  };

  const agregarPunto = (equipo: number, motivo: string) => {
    const nuevos = [...puntosSet];
    nuevos[equipo]++;
    setPuntosSet(nuevos);
    setHistorial([...historial, `Equipo ${equipo + 1}: ${motivo}`]);
  };

  const terminarSet = () => {
    setSets([...sets, puntosSet]);
    setPuntosSet([0, 0]);
    setHistorial([]);
    setSetActual(setActual + 1);
  };

  const [nuevoEquipo, setNuevoEquipo] = useState<{ nombre: string; jugadoras: string[] }>({
    nombre: "",
    jugadoras: [],
  });

  const crearEquipo = () => {
    const nuevas = jugadorasBase.filter((j) => nuevoEquipo.jugadoras.includes(j.nombre));
    setFormacion(nuevas);
    setBanco(jugadorasBase.filter((j) => !nuevoEquipo.jugadoras.includes(j.nombre)));
    setNuevoEquipo({ nombre: "", jugadoras: [] });
    setPuntosSet([0, 0]);
    setHistorial([]);
    setRotacion(0);
  };

  return (
    <Container>
      <Cancha>
        {zonas.map((zona, idx) => (
          <Zona key={zona} area={zona}>
            <JugadoraCard>
              <div>{formacion[idx]?.nombre}</div>
              <small>{formacion[idx]?.posiciones.join("/")}</small>
              <select onChange={(e) => cambiarJugadora(idx, e.target.value)} value="">
                <option value="">Cambiar</option>
                {banco.map((j) => (
                  <option key={j.nombre} value={j.nombre}>
                    {j.nombre} ({j.posiciones.join("/")})
                  </option>
                ))}
              </select>
            </JugadoraCard>
          </Zona>
        ))}
      </Cancha>

      <Panel>
        <h2>Set {setActual}</h2>
        <Marcador>
          <span>Equipo 1: {puntosSet[0]}</span>
          <span>Equipo 2: {puntosSet[1]}</span>
        </Marcador>
        <button onClick={() => agregarPunto(0, "Ataque")}>+1 Equipo 1 (Ataque)</button>
        <button onClick={() => agregarPunto(1, "Bloqueo")}>+1 Equipo 2 (Bloqueo)</button>
        <button onClick={rotar}>Rotar</button>
        <button onClick={terminarSet}>Terminar Set</button>

        <Historial>
          <h3>Historial</h3>
          <ul>
            {historial.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </Historial>

        <h3>Sets anteriores</h3>
        <ul>
          {sets.map((set, i) => (
            <li key={i}>Set {i + 1}: {set[0]} - {set[1]}</li>
          ))}
        </ul>

        <hr />

        <h3>Crear nuevo equipo</h3>
        <input
          type="text"
          placeholder="Nombre del equipo"
          value={nuevoEquipo.nombre}
          onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, nombre: e.target.value })}
        />
        <h4>Seleccionar jugadoras (6)</h4>
        <select
          multiple
          size={6}
          value={nuevoEquipo.jugadoras}
          onChange={(e) =>
            setNuevoEquipo({
              ...nuevoEquipo,
              jugadoras: Array.from(e.target.selectedOptions, (opt) => opt.value),
            })
          }
        >
          {jugadorasBase.map((j) => (
            <option key={j.nombre} value={j.nombre}>
              {j.nombre} ({j.posiciones.join("/")})
            </option>
          ))}
        </select>
        <button disabled={nuevoEquipo.jugadoras.length !== 6} onClick={crearEquipo}>
          ✅ Crear equipo
        </button>
      </Panel>
    </Container>
  );
};

export default Simulacion;

// Styled Components
const Container = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem;
`;

const Cancha = styled.div`
  display: grid;
  grid-template-areas:
    "4 3 2"
    "5 6 1";
  gap: 0.5rem;
  width: 400px;
  height: 300px;
`;

const Zona = styled.div<{ area: string }>`
  grid-area: ${(props) => props.area};
  background: #f0f0f0;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const JugadoraCard = styled.div`
  background: #fff;
  border: 1px solid #999;
  border-radius: 0.5rem;
  padding: 0.5rem;
  text-align: center;
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Historial = styled.div`
  background: #fafafa;
  border: 1px solid #ddd;
  padding: 1rem;
`;

const Marcador = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: bold;
`;


