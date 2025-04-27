import React, { useState, useEffect } from 'react';
import { getPersons } from '../db';

export default function PersonList({ refresh }) {
  const [persons, setPersons] = useState([]);
  useEffect(() => { setPersons(getPersons()); }, [refresh]);
  return (
    <div>
      <h3>Personnes</h3>
      <ul>{persons.map(p => <li key={p.id}>{p.name}</li>)}</ul>
    </div>
  );
}