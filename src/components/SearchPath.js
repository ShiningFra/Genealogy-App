import React, { useState, useEffect } from 'react';
import { getPersons } from '../db';
import { dijkstra } from '../algorithms';

export default function SearchPath() {
  const [persons, setPersons] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [path, setPath] = useState([]);

  useEffect(() => { setPersons(getPersons()); }, []);
  const handle = e => {
    e.preventDefault();
    if (from && to) {
      const result = dijkstra(+from, +to);
      setPath(result);
    }
  };
  return (
    <div>
      <h3>Chemin de parenté</h3>
      <form onSubmit={handle} className="form">
        <select value={from} onChange={e => setFrom(e.target.value)}>
          <option value="">De</option>
          {persons.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={to} onChange={e => setTo(e.target.value)}>
          <option value="">À</option>
          {persons.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button type="submit">Rechercher</button>
      </form>
      {path.length > 0 && (
        <p>Chemin : {path.join(' → ')}</p>
      )}
    </div>
  );
}