import React, { useState, useEffect } from 'react';
import { getPersons, addRelation } from '../db';

export default function AddRelation({ onChange }) {
  const [persons, setPersons] = useState([]);
  const [parentId, setParentId] = useState('');
  const [childId, setChildId] = useState('');

  useEffect(() => { setPersons(getPersons()); }, []);
  const handle = e => {
    e.preventDefault();
    if (parentId && childId && parentId !== childId) {
      addRelation(+parentId, +childId);
      onChange();
    }
  };
  return (
    <form onSubmit={handle} className="form">
      <select value={parentId} onChange={e => setParentId(e.target.value)}>
        <option value="">Parent</option>
        {persons.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <select value={childId} onChange={e => setChildId(e.target.value)}>
        <option value="">Enfant</option>
        {persons.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <button type="submit">Ajouter Relation</button>
    </form>
  );
}