import React, { useState } from "react";
import { getConfigNavbar } from "./helper";

export function ALRCompositeCalculator() {
    const [minutes, setMinutes] = useState(0);
    const [alr, setAlr] = useState(0);
    const [clr, setClr] = useState(0);
    const [weightALR, setWeightALR] = useState(0.7);
    const [weightCLR, setWeightCLR] = useState(0.3);

    const calculateALR = (mins) => {
        const res = (1 - (mins / 180)).toFixed(3);
        if (alr !== res){
            setAlr(res);

        }
        return res;
    }
    const calculateMinutes = (alr) => (-180 * (alr - 1)).toFixed(0);
    const calculateComposite = (alr, clr, wALR, wCLR) => (wALR * alr + wCLR * clr).toFixed(3);

    return (
        <div className="containerconfig">
            {getConfigNavbar()}
            <h3>ALR & Composite Score Calculator</h3>
            
            <fieldset>
                <h3>ALR Tool 1 ➡️ 1 - (minutes/180) = ALR</h3>
                <label>Minutes Since Last Admit:</label>
                <input
                    className="calculator-input"
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                />
                <p>ALR: {calculateALR(minutes)}</p>
          
                <h3>ALR Tool 2 ➡️ -180(ALR - 1) = minutes</h3>
                <label>ALR Value:</label>
                <input
                    className="calculator-input"
                    type="number"
                    step="0.01"
                    value={alr}
                    onChange={(e) => setAlr(e.target.value)}
                />
                <p>Minutes: {calculateMinutes(alr)}</p>
            </fieldset>
            
            <fieldset>
                <h3>Composite Score</h3>
                <label>ALR:</label>
                <input
                    className="calculator-input"
                    type="number"
                    step="0.01"
                    value={alr}
                    onChange={(e) => setAlr(e.target.value)}
                />
                <label>CLR:</label>
                <input
                    className="calculator-input"
                    type="number"
                    step="0.01"
                    value={clr}
                    onChange={(e) => setClr(e.target.value)}
                />
                <label>Weight for ALR:</label>
                <input
                    className="calculator-input"
                    type="number"
                    step="0.1"
                    value={weightALR}
                    onChange={(e) => setWeightALR(e.target.value)}
                />
                <label>Weight for CLR:</label>
                <input
                    className="calculator-input"
                    type="number"
                    step="0.1"
                    value={weightCLR}
                    onChange={(e) => setWeightCLR(e.target.value)}
                />
                <p>Composite Score: {calculateComposite(alr, clr, weightALR, weightCLR)}</p>
            </fieldset>
        </div>
    );
}

export default ALRCompositeCalculator;
