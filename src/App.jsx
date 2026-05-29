import { useEffect, useMemo, useState } from 'react';

const API_URL = '/api/wc-matches';

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadMatches() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const data = await response.json();

        if (active) {
          setMatches(data.matches || []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'No se pudieron cargar los partidos');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMatches();

    return () => {
      active = false;
    };
  }, []);

  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));
  }, [matches]);

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">React Demo</p>
          <h1>Todos los partidos de la Copa del Mundo</h1>
          <p className="subtitle">Listado completo de los partidos de la WC con marcador cuando ya se jugó.</p>
        </div>
        <div className="status-pill">{loading ? 'Cargando...' : 'Listo'}</div>
      </section>

      <section className="results-card">
        <div className="results-heading">
          <h2>Partidos de la WC</h2>
          <span className="results-meta">{!loading ? `${sortedMatches.length} partidos cargados` : 'Cargando datos...'}</span>
        </div>

        {error && <div className="empty-state">{error}</div>}

        {!error && loading && <div className="empty-state">Consultando la API...</div>}

        {!error && !loading && sortedMatches.length === 0 && (
          <div className="empty-state">No hay partidos disponibles.</div>
        )}

        {!error && !loading && sortedMatches.map((match) => {
          const homeTeam = match.homeTeam?.name || 'Equipo local';
          const awayTeam = match.awayTeam?.name || 'Equipo visitante';
          const homeScore = match.score?.fullTime?.home;
          const awayScore = match.score?.fullTime?.away;
          const scoreText = homeScore !== undefined && awayScore !== undefined ? `${homeScore} - ${awayScore}` : 'Pendiente';

          return (
            <article className="match-card" key={match.id}>
              <div className="match-side">
                <div className="team-badge">{homeTeam.split(' ').map(word => word[0]).join('').slice(0, 3).toUpperCase()}</div>
                <div>
                  <div className="team-name">{homeTeam}</div>
                  <div className="match-date">Local</div>
                </div>
              </div>

              <div className="match-center">
                <div className="match-status">{match.status}</div>
                <div className="match-date">{formatDate(match.utcDate)}</div>
                <div className="match-date">{scoreText}</div>
                <div className="match-date">{match.stage || 'Partido'}</div>
              </div>

              <div className="match-side right">
                <div style={{ textAlign: 'right' }}>
                  <div className="team-name">{awayTeam}</div>
                  <div className="match-date">Visitante</div>
                </div>
                <div className="team-badge">{awayTeam.split(' ').map(word => word[0]).join('').slice(0, 3).toUpperCase()}</div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default App;
