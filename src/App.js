import React, { useEffect, useState } from 'react';
import { initDB } from './db';
import AddPerson from './components/AddPerson';
import AddRelation from './components/AddRelation';
import PersonList from './components/PersonList';
import SearchPath from './components/SearchPath';
import './styles.css';

function App() {
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    async function init() { await initDB(); setRefresh(r => r+1); }
    init();
  }, []);
  return (
    <div className="container">
      <h1>Arbre Généalogique</h1>
      <AddPerson onChange={() => setRefresh(r => r+1)} />
      <AddRelation onChange={() => setRefresh(r => r+1)} />
      <PersonList refresh={refresh} />
      <SearchPath />
    </div>
  );
}

export default App;