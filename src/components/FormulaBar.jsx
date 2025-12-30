// src/components/FormulaBar.jsx
import React from 'react';

const FormulaBar = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '5px 10px',
      borderBottom: '1px solid #e1e1e1',
      background: 'white',
      gap: '10px'
    }}>
      <span style={{ color: '#888', fontStyle: 'italic', fontWeight: 'bold', fontFamily: 'serif' }}>fx</span>
      <input 
        placeholder="Select a cell..." 
        style={{
          width: '100%',
          padding: '4px 8px',
          border: '1px solid #ccc',
          outline: 'none',
          fontSize: '13px'
        }} 
      />
    </div>
  );
};

// *** EE LINE CHALA IMPORTANT - IDI MISS AYITHE ERROR VASTUNDI ***
export default FormulaBar;