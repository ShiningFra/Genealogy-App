import React, { useState, useEffect } from 'react';
import { addPerson, getPersons } from '../db';

export default function AddPerson({ onChange }) {
  const [name, setName] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    if (!name) return;
    addPerson(name);
    setName('');
    onChange();
  };
  return (
    <form onSubmit={handleSubmit} className="form">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom" />
      <button type="submit">Ajouter Personne</button>
    </form>
  );
}