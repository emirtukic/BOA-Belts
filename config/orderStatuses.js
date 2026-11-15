const STATUSES = [
  { id: 'novo', label: 'Novo' },
  { id: 'u_obradi', label: 'U obradi' },
  { id: 'poslano', label: 'Poslano' },
  { id: 'zavrseno', label: 'Završeno' },
  { id: 'otkazano', label: 'Otkazano' }
];

const LABELS = STATUSES.reduce((map, s) => ({ ...map, [s.id]: s.label }), {});

module.exports = { STATUSES, LABELS };
