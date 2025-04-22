import { useState } from 'react';
import ComenzarPartidoButton from './ComenzarPartidoButton'; // Asegúrate de que esté importado correctamente

export default function SelectEquipo() {
  const [formacion, setFormacion] = useState([
    { nombre: 'Candela', posiciones: ['Armadora'] },
    { nombre: 'Miranda', posiciones: ['Armadora'] },
    { nombre: 'Florencia', posiciones: ['Central'] },
    { nombre: 'Abril M.', posiciones: ['Opuesta'] },
    { nombre: 'Micaela', posiciones: ['Punta'] },
    { nombre: 'Milena', posiciones: ['Punta'] },
  ]);

  const [banco, setBanco] = useState([
    { nombre: 'Irina', posiciones: ['Punta', 'Central'] },
    { nombre: 'Sol', posiciones: ['Punta'] },
    { nombre: 'Camila', posiciones: ['Central'] },
    { nombre: 'Josefina', posiciones: ['Central'] },
  ]);

  return (
    <div>
      <h1>Selecciona tu Equipo</h1>

      <div>
        <h2>Formación</h2>
        {formacion.map((jugadora, index) => (
          <div key={index}>
            {jugadora.nombre} - {jugadora.posiciones.join(', ')}
          </div>
        ))}
      </div>

      <div>
        <h2>Banco de Suplentes</h2>
        {banco.map((jugadora, index) => (
          <div key={index}>
            {jugadora.nombre} - {jugadora.posiciones.join(', ')}
          </div>
        ))}
      </div>

      <ComenzarPartidoButton formacion={formacion} banco={banco} />
    </div>
  );
}
