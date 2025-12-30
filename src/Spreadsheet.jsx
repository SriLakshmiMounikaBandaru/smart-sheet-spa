import React, { useRef, useState, useCallback } from 'react';
import { HotTable } from '@handsontable/react';
import { Grid } from 'lucide-react';
import 'handsontable/dist/handsontable.full.min.css';

// 1. Handsontable Registry
import { registerAllModules } from 'handsontable/registry';
registerAllModules();

// 2. Import HyperFormula & Necessary Modules
import { HyperFormula, FunctionPlugin, FunctionArgumentType } from 'hyperformula';

// Components
// REMOVED: import Toolbar from './components/Toolbar';  <-- We replaced this
import FormulaBar from './components/FormulaBar';
import Ribbon from './components/Ribbon'; // <--- NEW IMPORT

// ====================================================================
// 📊 EXISTING PLUGIN LOGIC (UNCHANGED)
// ====================================================================

// 1. RATING PLUGIN
class RatingPlugin extends FunctionPlugin {
  rating(ast, state) {
    return this.runFunction(
      ast.args,
      state,
      this.metadata('RATING'),
      (ratingValue, maxStars = 5) => {
        const rating = Number(ratingValue);
        const max = Number(maxStars);
        if (isNaN(rating) || isNaN(max)) return "Invalid input";
        if (rating < 0 || max <= 0) return "Invalid rating";
        const clampedRating = Math.max(0, Math.min(rating, max));
        const fullStars = Math.floor(clampedRating);
        const hasHalfStar = clampedRating - fullStars >= 0.5;
        const starFull = '★';
        const starHalf = '⯨'; 
        const starEmpty = '☆';
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += starFull;
        if (hasHalfStar) stars += starHalf;
        const totalStarsSoFar = fullStars + (hasHalfStar ? 1 : 0);
        for (let i = totalStarsSoFar; i < max; i++) stars += starEmpty;
        return stars;
      }
    );
  }
}

RatingPlugin.pluginName = 'RatingPlugin';
RatingPlugin.implementedFunctions = {
  RATING: {
    method: 'rating',
    parameters: [
      { argumentType: FunctionArgumentType.NUMBER, defaultValue: 0 },
      { argumentType: FunctionArgumentType.NUMBER, defaultValue: 5 }
    ],
  }
};
RatingPlugin.translations = { enGB: { RATING: 'RATING' } };

// 2. FULLNAME PLUGIN
class FullNamePlugin extends FunctionPlugin {
  fullname(ast, state) {
    return this.runFunction(
      ast.args,
      state,
      this.metadata('FULLNAME'),
      (firstName, lastName) => {
        const f = firstName || '';
        const l = lastName || '';
        const capitalizeName = (name) => {
          if (!name || typeof name !== 'string') return '';
          const trimmed = name.trim();
          if (trimmed.length === 0) return '';
          return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
        };
        const capitalizedFirst = capitalizeName(f);
        const capitalizedLast = capitalizeName(l);
        return `${capitalizedFirst} ${capitalizedLast}`.trim();
      }
    );
  }
}

FullNamePlugin.pluginName = 'FullNamePlugin';
FullNamePlugin.implementedFunctions = {
  FULLNAME: {
    method: 'fullname',
    parameters: [
      { argumentType: FunctionArgumentType.STRING },
      { argumentType: FunctionArgumentType.STRING } 
    ],
  }
};
FullNamePlugin.translations = { enGB: { FULLNAME: 'FULLNAME' } };

// 3. AGE PLUGIN
class AgePlugin extends FunctionPlugin {
  age(ast, state) {
    return this.runFunction(
      ast.args,
      state,
      this.metadata('AGE'),
      (birthDate, referenceDate = new Date()) => {
        try {
          const birth = new Date(birthDate);
          const ref = new Date(referenceDate);
          if (isNaN(birth.getTime()) || isNaN(ref.getTime())) return "Invalid date";
          let age = ref.getFullYear() - birth.getFullYear();
          const monthDiff = ref.getMonth() - birth.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < birth.getDate())) {
            age--;
          }
          return age;
        } catch (error) {
          return "Invalid input";
        }
      }
    );
  }
}

AgePlugin.pluginName = 'AgePlugin';
AgePlugin.implementedFunctions = {
  AGE: {
    method: 'age',
    parameters: [
      { argumentType: FunctionArgumentType.STRING },
      { argumentType: FunctionArgumentType.STRING, optionalArg: true }
    ],
  }
};
AgePlugin.translations = { enGB: { AGE: 'AGE' } };

// MANUAL REGISTRATION
HyperFormula.registerFunctionPlugin(RatingPlugin, RatingPlugin.translations);
HyperFormula.registerFunctionPlugin(FullNamePlugin, FullNamePlugin.translations);
HyperFormula.registerFunctionPlugin(AgePlugin, AgePlugin.translations);

console.log("✅ All Plugins Registered Manually");

// BUILD ENGINE
const hfInstance = HyperFormula.buildEmpty({
  licenseKey: 'gpl-v3',
  language: 'enGB',
});

// ====================================================================
// 🖥️ MAIN COMPONENT
// ====================================================================

const Spreadsheet = () => {
  const hotRef = useRef(null);

  const handleBold = useCallback(() => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;
    const selectedRanges = hot.getSelected();
    if (!selectedRanges) {
      alert("Please select a cell first!");
      return;
    }
    hot.suspendRender();
    selectedRanges.forEach(([r1, c1, r2, c2]) => {
      const startRow = Math.min(r1, r2);
      const endRow = Math.max(r1, r2);
      const startCol = Math.min(c1, c2);
      const endCol = Math.max(c1, c2);
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const cellMeta = hot.getCellMeta(r, c);
          const currentClass = cellMeta.className || '';
          const newClass = currentClass.includes('htBold') 
            ? currentClass.replace('htBold', '').trim() 
            : `${currentClass} htBold`.trim();
          hot.setCellMeta(r, c, 'className', newClass);
        }
      }
    });
    hot.render();
    hot.resumeRender();
  }, []);

  // Style for star ratings
  const starStyle = `
    .star-rating {
      color: #FFD700; /* Gold color for stars */
      font-size: 16px;
      letter-spacing: 2px;
    }
    .rating-cell {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      
      {/* CSS Injection for Stars */}
      <style>{starStyle}</style>
      
      {/* 1. NEW TITLE BAR (Green Strip) */}
      <div style={{ 
          backgroundColor: '#107C41', color: 'white', padding: '0 15px', height: '30px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' 
      }}>
          <span>Book1 - Excel Clone</span>
      </div>

      {/* 2. NEW RIBBON (Replaces Old Header & Toolbar) */}
      <Ribbon onBoldClick={handleBold} />

      {/* 3. Formula Bar (Unchanged) */}
      <FormulaBar />

      {/* 4. Grid Area (Unchanged Logic) */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <HotTable
          ref={hotRef}
          startRows={100}
          startCols={26} 
          colWidths={100} 
          rowHeaders={true}
          colHeaders={true}
          height="100%"
          width="100%"
          licenseKey="non-commercial-and-evaluation"
          
          formulas={{ engine: hfInstance }}
          
          manualColumnResize={true} 
          manualRowResize={true}    
          contextMenu={true}        
          autoWrapRow={true}
          autoWrapCol={true}
          outsideClickDeselects={false}
          
          // Custom renderer for star ratings (Preserved)
          cells={(row, col) => {
            const cellMeta = {};
            const hot = hotRef.current?.hotInstance;
            if (hot) {
              const cellValue = hot.getDataAtCell(row, col);
              if (typeof cellValue === 'string' && 
                 (cellValue.includes('★') || cellValue.includes('☆') || cellValue.includes('⭐'))) {
                cellMeta.className = 'star-rating';
                cellMeta.renderer = function(instance, td, row, col, prop, value) {
                  td.innerHTML = `<div class="rating-cell">${value}</div>`;
                  td.style.textAlign = 'center';
                  return td;
                };
              }
            }
            return cellMeta;
          }}
        />
      </div>

      {/* 5. Footer (Unchanged) */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '0 10px', 
        height: '30px', 
        display: 'flex', 
        alignItems:'center', 
        justifyContent: 'space-between',
        borderTop:'1px solid #ddd',
        fontSize: '12px',
        color: '#666'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            background:'white', 
            padding:'3px 15px', 
            fontWeight:'bold', 
            color:'#107C41', 
            borderBottom:'2px solid #107C41', 
            boxShadow:'0 2px 4px rgba(0,0,0,0.1)' 
          }}>
            Sheet1
          </div>
          <span style={{marginLeft:'10px', fontSize:'18px', cursor:'pointer', color:'#666'}}>+</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Functions: <b>FULLNAME</b> | <b>RATING</b> | <b>AGE</b></span>
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet;
