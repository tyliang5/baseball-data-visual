import React, { useContext } from 'react';
import { BaseballDataContext } from './BaseballDataContext';

const PitcherDropdown = ({ onSelectPitcher, filteredPitchers, selectedPitcher }) => {
    const { data } = useContext(BaseballDataContext);

    // extract unique pitcher names from the data or use filtered pitchers if available
    const pitcherNames = filteredPitchers.length > 0
        ? [...new Set(filteredPitchers)]  // remove duplicates
        : [...new Set(data.map((row) => row['PITCHER']))];  // remove duplicates

    return (
        <select className="form-select" value={selectedPitcher || ''} onChange={(e) => onSelectPitcher(e.target.value)}>
            <option value="">Select a pitcher</option>
            {pitcherNames.map((pitcher, index) => (
                <option key={index} value={pitcher}>
                    {pitcher}
                </option>
            ))}
        </select>
    );
};

export default PitcherDropdown;
