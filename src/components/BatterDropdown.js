import React, { useContext } from 'react';
import { BaseballDataContext } from './BaseballDataContext';

const BatterDropdown = ({ onSelectBatter, filteredBatters, selectedBatter }) => {
    const { data } = useContext(BaseballDataContext);

    // Extract unique batter names from the data or use filtered batters if available
    const batterNames = filteredBatters.length > 0
        ? [...new Set(filteredBatters)]  // Remove duplicates
        : [...new Set(data.map((row) => row['BATTER']))];  // Remove duplicates

    return (
        <select className="form-select" value={selectedBatter || ''} onChange={(e) => onSelectBatter(e.target.value)}>
            <option value="">Select a batter</option>
            {batterNames.map((batter, index) => (
                <option key={index} value={batter}>
                    {batter}
                </option>
            ))}
        </select>
    );
};

export default BatterDropdown;
