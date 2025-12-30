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
import Toolbar from './components/Toolbar';
import FormulaBar from './components/FormulaBar';

// STEP 1: DEFINE THE RATING PLUGIN LOGIC 
class RatingPlugin extends FunctionPlugin {
  rating(ast, state) {
    return this.runFunction(
      ast.args,
      state,
      this.metadata('RATING'),
      (ratingValue, maxStars = 5) => {
        // Convert to number and validate
        const rating = Number(ratingValue);
        const max = Number(maxStars);
        
        // Validate input
        if (isNaN(rating) || isNaN(max)) {
          return "Invalid input";
        }
        
        if (rating < 0 || max <= 0) {
          return "Invalid rating";
        }
        
        // Clamp rating between 0 and max
        const clampedRating = Math.max(0, Math.min(rating, max));
        
        // Calculate full and partial stars
        const fullStars = Math.floor(clampedRating);
        const hasHalfStar = clampedRating - fullStars >= 0.5;
        
        // Unicode star characters
        const starFull = '★';
        const starHalf = '⯨'; 
        const starEmpty = '☆';
        
        // Build star string
        let stars = '';
        
        // Add full stars
        for (let i = 0; i < fullStars; i++) {
          stars += starFull;
        }
        
        // Add half star if needed
        if (hasHalfStar) {
          stars += starHalf;
        }
        
        // Add empty stars
        const totalStarsSoFar = fullStars + (hasHalfStar ? 1 : 0);
        for (let i = totalStarsSoFar; i < max; i++) {
          stars += starEmpty;
        }
        
        // Optional: Add numeric rating in parentheses
        // return `${stars} (${clampedRating.toFixed(1)})`;
        return stars;
      }
    );
  }
}

// STEP 2: CONFIGURE RATING PROPERTIES 
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

RatingPlugin.translations = {
  enGB: {
    RATING: 'RATING',
  },
};

// STEP 1: DEFINE THE UPDATED FULLNAME PLUGIN LOGIC 
class FullNamePlugin extends FunctionPlugin {
  fullname(ast, state) {
    return this.runFunction(
      ast.args,
      state,
      this.metadata('FULLNAME'),
      (firstName, lastName) => {
        // CAPITALIZATION ADDED HERE - First letter uppercase, rest lowercase
        const f = firstName || '';
        const l = lastName || '';
        
        // Function to capitalize a name
        const capitalizeName = (name) => {
          if (!name || typeof name !== 'string') return '';
          const trimmed = name.trim();
          if (trimmed.length === 0) return '';
          return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
        };
        
        // Capitalize both names
        const capitalizedFirst = capitalizeName(f);
        const capitalizedLast = capitalizeName(l);
        
        // Return the formatted full name
        return `${capitalizedFirst} ${capitalizedLast}`.trim();
      }
    );
  }
}

// STEP 2: CONFIGURE FULLNAME PROPERTIES 
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

FullNamePlugin.translations = {
  enGB: {
    FULLNAME: 'FULLNAME',
  },
};

// STEP 1: DEFINE THE AGE PLUGIN LOGIC 
class AgePlugin extends FunctionPlugin {
  age(ast, state) {
    return this.runFunction(
      ast.args,
      state,
      this.metadata('AGE'),
      (birthDate, referenceDate = new Date()) => {
        try {
          // Parse dates
          const birth = new Date(birthDate);
          const ref = new Date(referenceDate);
          
          // Validate dates
          if (isNaN(birth.getTime()) || isNaN(ref.getTime())) {
            return "Invalid date";
          }
          
          // Calculate age
          let age = ref.getFullYear() - birth.getFullYear();
          const monthDiff = ref.getMonth() - birth.getMonth();
          
          // Adjust if birthday hasn't occurred yet this year
          if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < birth.getDate())) {
            age--;
          }
          
          // Return the age as a number
          return age;
        } catch (error) {
          return "Invalid input";
        }
      }
    );
  }
}

// STEP 2: CONFIGURE AGE PROPERTIES 
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

AgePlugin.translations = {
  enGB: {
    AGE: 'AGE',
  },
};

// STEP 3: MANUAL REGISTRATION (FOR VERSION 2.6.0) 
HyperFormula.registerFunctionPlugin(RatingPlugin, RatingPlugin.translations);
HyperFormula.registerFunctionPlugin(FullNamePlugin, FullNamePlugin.translations);
HyperFormula.registerFunctionPlugin(AgePlugin, AgePlugin.translations);

console.log("✅ All Plugins Registered Manually for v2.6.0");

// STEP 4: BUILD ENGINE 
const hfInstance = HyperFormula.buildEmpty({
  licenseKey: 'gpl-v3',
  language: 'enGB',
});

console.log("✅ Engine Started with RATING, FULLNAME & AGE functions!");

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
    }
  `;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      
      {/* Add custom styles for stars */}
      <style>{starStyle}</style>
      
      {/* Header */}
      <div className="excel-header" style={{
          backgroundColor: '#107C41', color: 'white', padding: '0 15px', height: '40px',
          display: 'flex', alignItems: 'center', gap: '20px', fontSize: '14px'
      }}>
        <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
          <Grid size={18} /> <b>Excel Clone</b>
        </div>
        <div className="file-menu" style={{display:'flex', gap:'15px', cursor:'pointer', fontSize:'13px'}}>
          <span>File</span><span>Home</span><span>Insert</span><span>Layout</span><span>Formulas</span>
        </div>
      </div>

      <Toolbar onBoldClick={handleBold} />
      <FormulaBar />

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
          
          // Custom renderer for star ratings
          cells={(row, col) => {
            const cellMeta = {};
            const hot = hotRef.current?.hotInstance;
            if (hot) {
              const cellValue = hot.getDataAtCell(row, col);
              // Check if cell contains star characters
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
          <span>Functions: <b>FULLNAME(first, last)</b> | <b>RATING(value, [max=5])</b> | <b>AGE(birthdate, [refdate])</b></span>
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet;
