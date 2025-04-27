// Construction de la liste d'adjacence
import { getPersons, getRelations } from './db';

function buildGraph() {
  const persons = getPersons();
  const relations = getRelations();
  const adj = {};
  persons.forEach(p => { adj[p.id] = []; });
  relations.forEach(r => {
    adj[r.parent_id].push({ to: r.child_id, weight: 1 });
    adj[r.child_id].push({ to: r.parent_id, weight: 1 });
  });
  return { adj, persons };
}

// Dijkstra
export function dijkstra(startId, endId) {
  const { adj, persons } = buildGraph();
  const dist = {}, prev = {};
  const Q = new Set(Object.keys(adj).map(id => parseInt(id)));
  Q.forEach(v => { dist[v] = Infinity; prev[v] = null; });
  dist[startId] = 0;
  while (Q.size) {
    let u = [...Q].reduce((a,b) => dist[a] < dist[b] ? a : b);
    Q.delete(u);
    if (u === endId) break;
    adj[u].forEach(({ to, weight }) => {
      const alt = dist[u] + weight;
      if (alt < dist[to]) {
        dist[to] = alt;
        prev[to] = u;
      }
    });
  }
  // Reconstruction du chemin
  const path = [];
  let u = endId;
  while (prev[u] !== null) {
    path.unshift(u);
    u = prev[u];
  }
  if (u === startId) path.unshift(startId);
  return path.map(id => persons.find(p => p.id === id).name);
}

// Bellman-Ford (détection de cycles)
export function bellmanFord(startId) {
  const { adj } = buildGraph();
  const dist = {}, prev = {};
  Object.keys(adj).forEach(v => { dist[v] = Infinity; prev[v] = null; });
  dist[startId] = 0;
  const nodes = Object.keys(adj);
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes.forEach(u => {
      adj[u].forEach(({ to, weight }) => {
        if (dist[u] + weight < dist[to]) {
          dist[to] = dist[u] + weight;
          prev[to] = u;
        }
      });
    });
  }
  // Check cycle
  const cycle = [];
  nodes.forEach(u => {
    adj[u].forEach(({ to, weight }) => {
      if (dist[u] + weight < dist[to]) cycle.push({ u, to });
    });
  });
  return { dist, prev, cycle };
}

// Prim et Kruskal pour un arbre couvrant minimal
export function prim() {
  const { adj } = buildGraph();
  const nodes = Object.keys(adj).map(n => parseInt(n));
  const inTree = new Set([nodes[0]]);
  const edges = [];
  while (inTree.size < nodes.length) {
    let minEdge = null;
    inTree.forEach(u => adj[u].forEach(e => {
      if (!inTree.has(e.to) && (!minEdge || e.weight < minEdge.weight)) {
        minEdge = { from: u, to: e.to, weight: e.weight };
      }
    }));
    edges.push(minEdge);
    inTree.add(minEdge.to);
  }
  return edges;
}

export function kruskal() {
  const { adj } = buildGraph();
  const nodes = Object.keys(adj).map(n => parseInt(n));
  const parent = {}; nodes.forEach(v => parent[v] = v);
  function find(u) { return parent[u] === u ? u : (parent[u] = find(parent[u])); }
  function unite(u,v) { parent[find(v)] = find(u); }
  const allEdges = [];
  nodes.forEach(u => adj[u].forEach(e => { if (u < e.to) allEdges.push({ from: u, to: e.to, weight: e.weight }); }));
  allEdges.sort((a,b) => a.weight - b.weight);
  const tree = [];
  allEdges.forEach(e => {
    if (find(e.from) !== find(e.to)) {
      unite(e.from, e.to);
      tree.push(e);
    }
  });
  return tree;
}