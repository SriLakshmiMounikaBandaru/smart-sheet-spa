// src/components/Toolbar.jsx
import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Save, Grid } from 'lucide-react';

const Toolbar = ({ onBoldClick }) => { // <--- Receiving the function here
  return (
    <div style={{
      backgroundColor: '#f3f2f1',
      padding: '8px 15px',
      display: 'flex',
      gap: '10px',
      borderBottom: '1px solid #c8c8c8',
      alignItems: 'center',
      height: '40px'
    }}>
      <button className="icon-btn" title="Save"><Save size={18} /></button>
      
      <div style={{width: 1, height: 24, background: '#ccc', margin: '0 5px'}}></div>
      
      {/* Bold Button with Click Event */}
      <button 
        className="icon-btn" 
        onClick={() => {
          console.log("Bold Button Clicked!"); // Debugging kosam Log
          onBoldClick();
        }} 
        title="Bold (Ctrl+B)"
      >
        <Bold size={18} strokeWidth={3} /> {/* Icon koncham doptu ga */}
      </button>
      
      <button className="icon-btn"><Italic size={18} /></button>
      <button className="icon-btn"><Underline size={18} /></button>
      
      <div style={{width: 1, height: 24, background: '#ccc', margin: '0 5px'}}></div>
      
      <button className="icon-btn"><AlignLeft size={18} /></button>
      <button className="icon-btn"><AlignCenter size={18} /></button>
      <button className="icon-btn"><AlignRight size={18} /></button>
    </div>
  );
};

export default Toolbar;