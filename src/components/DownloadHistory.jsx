import React, { useState, useEffect } from 'react';

const HISTORY_KEY = 'pindrop_history';

export function DownloadHistory({ onSelect }) {
  const [history, setHistory] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  const removeItem = (timestamp) => {
    const updated = history.filter(item => item.timestamp !== timestamp);
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        style={styles.toggleBtn}
        aria-label="Show download history"
      >
        📋 History
      </button>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Download History</h3>
        <button onClick={() => setShow(false)} style={styles.closeBtn}>✕</button>
      </div>
      {history.length === 0 ? (
        <p style={styles.empty}>No downloads yet</p>
      ) : (
        <>
          <ul style={styles.list}>
            {history.map((item) => (
              <li key={item.timestamp} style={styles.item}>
                <div style={styles.itemContent} onClick={() => onSelect && onSelect(item)}>
                  <strong style={styles.itemTitle}>{item.title}</strong>
                  <span style={styles.itemDate}>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
                <div style={styles.itemActions}>
                  <button
                    onClick={() => removeItem(item.timestamp)}
                    style={styles.removeBtn}
                    title="Remove from history"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button onClick={clearHistory} style={styles.clearBtn}>Clear all</button>
        </>
      )}
    </div>
  );
}

const styles = {
  toggleBtn: {
    background: '#1e1e24',
    border: '1px solid #2a2a30',
    borderRadius: '30px',
    padding: '8px 16px',
    color: '#a09fad',
    fontSize: '14px',
    fontFamily: 'DM Sans, sans-serif',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    zIndex: 1000,
  },
  container: {
    position: 'fixed',
    bottom: '80px',
    left: '20px',
    width: '300px',
    maxHeight: '400px',
    background: '#111113',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backdropFilter: 'blur(10px)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#f0eff2',
    fontFamily: 'Syne, sans-serif',
    margin: 0,
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#666675',
    fontSize: '18px',
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    color: '#666675',
    fontSize: '14px',
    padding: '20px 0',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    maxHeight: '280px',
    overflowY: 'auto',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #1e1e24',
  },
  itemContent: {
    flex: 1,
    cursor: 'pointer',
    overflow: 'hidden',
  },
  itemTitle: {
    display: 'block',
    fontSize: '13px',
    color: '#f0eff2',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemDate: {
    fontSize: '11px',
    color: '#666675',
  },
  itemActions: {
    display: 'flex',
    gap: '6px',
  },
  removeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#666675',
    fontSize: '16px',
    cursor: 'pointer',
  },
  clearBtn: {
    background: 'rgba(230,0,35,0.1)',
    border: '1px solid rgba(230,0,35,0.3)',
    borderRadius: '8px',
    padding: '8px',
    color: '#ff6b8a',
    fontSize: '13px',
    fontFamily: 'DM Sans, sans-serif',
    cursor: 'pointer',
  },
};