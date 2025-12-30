import React, { useState } from 'react';
import { 
  Clipboard, Copy, Scissors, 
  Bold, Italic, Underline, 
  AlignLeft, AlignCenter, AlignRight, 
  Type, PaintBucket, 
  Table, Image, ChartBar, 
  Sigma, FunctionSquare, Calculator
} from 'lucide-react';
import './Ribbon.css'; // We will create this CSS file next

const Ribbon = ({ onBoldClick }) => {
  const [activeTab, setActiveTab] = useState('Home');

  const tabs = ['File', 'Home', 'Insert', 'Layout', 'Formulas', 'Data', 'View', 'Help'];

  const renderHomeTab = () => (
    <div className="ribbon-group-container">
      {/* Clipboard Group */}
      <div className="ribbon-group">
        <div className="ribbon-btn-large">
          <Clipboard size={24} color="#107C41" />
          <span>Paste</span>
        </div>
        <div className="ribbon-column">
          <div className="ribbon-btn-small"><Scissors size={14} /> Cut</div>
          <div className="ribbon-btn-small"><Copy size={14} /> Copy</div>
        </div>
        <div className="group-label">Clipboard</div>
      </div>

      <div className="divider"></div>

      {/* Font Group */}
      <div className="ribbon-group">
        <div className="ribbon-row">
           <select className="font-select"><option>Calibri</option><option>Arial</option></select>
           <select className="size-select"><option>11</option><option>12</option></select>
        </div>
        <div className="ribbon-row actions">
          <button className="icon-btn" onClick={onBoldClick} title="Bold"><Bold size={16} /></button>
          <button className="icon-btn" title="Italic"><Italic size={16} /></button>
          <button className="icon-btn" title="Underline"><Underline size={16} /></button>
          <div className="separator"></div>
          <button className="icon-btn" title="Fill Color"><PaintBucket size={16} /></button>
          <button className="icon-btn" title="Text Color"><Type size={16} color="#c00000" /></button>
        </div>
        <div className="group-label">Font</div>
      </div>

      <div className="divider"></div>

      {/* Alignment Group */}
      <div className="ribbon-group">
        <div className="ribbon-row actions">
           <button className="icon-btn"><AlignLeft size={16} /></button>
           <button className="icon-btn"><AlignCenter size={16} /></button>
           <button className="icon-btn"><AlignRight size={16} /></button>
        </div>
        <div className="group-label">Alignment</div>
      </div>
    </div>
  );

  const renderInsertTab = () => (
    <div className="ribbon-group-container">
      <div className="ribbon-btn-large">
        <Table size={24} color="#107C41" />
        <span>Table</span>
      </div>
      <div className="ribbon-btn-large">
        <Image size={24} color="#107C41" />
        <span>Pictures</span>
      </div>
      <div className="ribbon-btn-large">
        <ChartBar size={24} color="#107C41" />
        <span>Charts</span>
      </div>
    </div>
  );

  const renderFormulasTab = () => (
    <div className="ribbon-group-container">
      <div className="ribbon-btn-large">
        <FunctionSquare size={24} color="#107C41" />
        <span>Insert Function</span>
      </div>
      <div className="ribbon-btn-large">
        <Sigma size={24} color="#107C41" />
        <span>AutoSum</span>
      </div>
       <div className="ribbon-btn-large">
        <Calculator size={24} color="#107C41" />
        <span>Calculate Now</span>
      </div>
    </div>
  );

  return (
    <div className="ribbon-container">
      {/* Top Green Bar (Tabs) */}
      <div className="ribbon-tabs">
        <div className="file-tab">File</div>
        {tabs.slice(1).map(tab => (
          <div 
            key={tab} 
            className={`tab-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Ribbon Content Body */}
      <div className="ribbon-body">
        {activeTab === 'Home' && renderHomeTab()}
        {activeTab === 'Insert' && renderInsertTab()}
        {activeTab === 'Formulas' && renderFormulasTab()}
        {/* You can add more tab renders here */}
        {!['Home', 'Insert', 'Formulas'].includes(activeTab) && (
           <div className="empty-tab-message">Features coming soon...</div>
        )}
      </div>
    </div>
  );
};

export default Ribbon;
