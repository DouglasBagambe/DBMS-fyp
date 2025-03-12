import React from 'react';

const AnalyticsPage = () => {
  const vehicleData = [
    { id: 1, vehicleNumber: 'UG1234A', driverName: 'John Doe', status: 'Active', incidents: 2 },
    { id: 2, vehicleNumber: 'UG5678B', driverName: 'Jane Smith', status: 'Inactive', incidents: 1 },
    { id: 3, vehicleNumber: 'UG9012C', driverName: 'Michael Brown', status: 'Active', incidents: 0 },
  ];

  return (
    <div style={{ backgroundColor: '#f4fdf4', minHeight: '100vh', padding: '20px' }}>
      <header
        style={{
          backgroundColor: '#2e7d32',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          marginBottom: '20px',
        }}
      >
        <h1>Driver Distraction Recognition - Analytics Page</h1>
      </header>

      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#2e7d32' }}>Overview</h2>
        <p>Analyze driver behavior, monitor vehicle performance, and identify safety concerns.</p>
      </section>

      <section>
        <h2 style={{ color: '#2e7d32' }}>Vehicle & Driver Details</h2>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '5px',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <thead style={{ backgroundColor: '#2e7d32', color: 'white' }}>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Vehicle Number</th>
              <th style={styles.th}>Driver Name</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Incidents</th>
            </tr>
          </thead>
          <tbody>
            {vehicleData.map((vehicle, index) => (
              <tr key={vehicle.id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={styles.td}>{vehicle.id}</td>
                <td style={styles.td}>{vehicle.vehicleNumber}</td>
                <td style={styles.td}>{vehicle.driverName}</td>
                <td style={styles.td}>{vehicle.status}</td>
                <td style={styles.td}>{vehicle.incidents}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const styles = {
  th: {
    padding: '10px',
    textAlign: 'left',
  },
  td: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
  rowEven: {
    backgroundColor: '#f9f9f9',
  },
  rowOdd: {
    backgroundColor: '#ffffff',
  },
};

export default AnalyticsPage;
