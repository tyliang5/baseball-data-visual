import React, { useState, useEffect } from 'react';
import BaseballField2D from './components/BaseballField2D';
import BatterDropdown from './components/BatterDropdown';
import PitcherDropdown from './components/PitcherDropdown';
import StatsTable from './components/StatsTable';
import Warning from './components/Warning';
import { readBaseballData } from './utils/readBaseballData';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [battedBallData, setBattedBallData] = useState([]);
  const [selectedBatter, setSelectedBatter] = useState(null);
  const [selectedPitcher, setSelectedPitcher] = useState(null);
  const [selectedContactType, setSelectedContactType] = useState(null);
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [filteredPitchers, setFilteredPitchers] = useState([]);
  const [filteredBatters, setFilteredBatters] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [resetState, setResetState] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/BattedBallData.xlsx');
        const file = await response.blob();
        const parsedData = await readBaseballData(file);
        setBattedBallData(parsedData);
      } catch (error) {
        console.error('Error loading the Excel file:', error);
      }
    };

    fetchData();
  }, []);

  const handleBatterSelect = (batterName) => {
    setSelectedBatter(batterName);
    setResetState(false);

    const pitchers = battedBallData
      .filter((row) => row['BATTER'] === batterName)
      .map((row) => row['PITCHER']);
    setFilteredPitchers([...new Set(pitchers)]);

    updateDisplayData(batterName, selectedPitcher, selectedContactType, selectedOutcome);
    if (selectedPitcher && !pitchers.includes(selectedPitcher)) {
      setSelectedPitcher(null);
    }
  };

  const handlePitcherSelect = (pitcherName) => {
    setSelectedPitcher(pitcherName);
    setResetState(false);

    const batters = battedBallData
      .filter((row) => row['PITCHER'] === pitcherName)
      .map((row) => row['BATTER']);
    setFilteredBatters([...new Set(batters)]);

    updateDisplayData(selectedBatter, pitcherName, selectedContactType, selectedOutcome);
    if (selectedBatter && !batters.includes(selectedBatter)) {
      setSelectedBatter(null);
    }
  };

  const handleContactTypeSelect = (contactType) => {
    setSelectedContactType(contactType);
    updateDisplayData(selectedBatter, selectedPitcher, contactType, selectedOutcome);
  };

  const handleOutcomeSelect = (outcome) => {
    setSelectedOutcome(outcome);
    updateDisplayData(selectedBatter, selectedPitcher, selectedContactType, outcome);
  };

  const resetSelections = () => {
    setSelectedBatter(null);
    setSelectedPitcher(null);
    setSelectedContactType(null);
    setSelectedOutcome(null);
    setFilteredBatters([]);
    setFilteredPitchers([]);
    setDisplayData([]);
    setResetState(true);
  };

  const updateDisplayData = (batterName, pitcherName, contactType, outcome) => {
    let filteredData = battedBallData;

    if (batterName) {
      filteredData = filteredData.filter((row) => row['BATTER'] === batterName);
    }

    if (pitcherName) {
      filteredData = filteredData.filter((row) => row['PITCHER'] === pitcherName);
    }

    if (contactType) {
      filteredData = filteredData.filter((row) => determineContactType(row['LAUNCH_ANGLE']) === contactType);
    }

    if (outcome) {
      filteredData = filteredData.filter((row) => row['PLAY_OUTCOME']?.toLowerCase() === outcome.toLowerCase());
    }

    setDisplayData(filteredData);
    setNoResults(filteredData.length === 0); // if results are empty show no results message
  };

  const determineContactType = (launchAngle) => {
    if (launchAngle < 10) {
      return "Ground ball";
    } else if (launchAngle >= 10 && launchAngle <= 25) {
      return "Line drive";
    } else if (launchAngle > 25 && launchAngle <= 50) {
      return "Fly ball";
    } else {
      return "Pop up";
    }
  };

  // button to show all data
  const handleShowAllData = () => {
    // if user clicks yes, reset all filters
    setSelectedBatter(null);
    setSelectedPitcher(null);
    setSelectedContactType(null);
    setSelectedOutcome(null);
    setFilteredBatters([]);
    setFilteredPitchers([]);

    setDisplayData(battedBallData);

    // close the modal
    setShowWarningModal(false);
  };

  return (
    <div className="App container mt-4">
      <h1 className="text-center">Baseball Data Visualizer</h1>
      {battedBallData.length > 0 ? (
        <>
          <div className="d-flex justify-content-center mb-4 gap-3">
            <BatterDropdown
              onSelectBatter={handleBatterSelect}
              filteredBatters={filteredBatters.length > 0 ? filteredBatters : battedBallData.map((row) => row['BATTER'])}
              selectedBatter={selectedBatter}
            />
            <PitcherDropdown
              onSelectPitcher={handlePitcherSelect}
              filteredPitchers={filteredPitchers.length > 0 ? filteredPitchers : battedBallData.map((row) => row['PITCHER'])}
              selectedPitcher={selectedPitcher}
            />
            <button className="btn btn-outline-secondary" onClick={resetSelections}>Reset</button>
          </div>

          {/* dropdowns for contact type and outcome */}
          <div className="d-flex justify-content-center mb-4 gap-3">
            <select className="form-select" onChange={(e) => handleContactTypeSelect(e.target.value)} value={selectedContactType || ''}>
              <option value="">Select Contact Type</option>
              <option value="Ground ball">Ground ball</option>
              <option value="Line drive">Line drive</option>
              <option value="Fly ball">Fly ball</option>
              <option value="Pop up">Pop up</option>
            </select>

            <select className="form-select" onChange={(e) => handleOutcomeSelect(e.target.value)} value={selectedOutcome || ''}>
              <option value="">Select Outcome</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
              <option value="Homerun">Homerun</option>
              <option value="Out">Out</option>
              <option value="Error">Error</option>
              <option value="FieldersChoice">Fielders Choice</option>
              <option value="Undefined">Foul</option>
              <option value="Sacrifice">Sacrifice</option>
            </select>
          </div>

          {/* button to show all data */}
          <div className="d-flex justify-content-center mb-4">
            <button className="btn btn-danger" onClick={() => setShowWarningModal(true)}>
              Show All Data
            </button>
          </div>

          {displayData.length > 0 ? (
            <>
              <BaseballField2D battedBallData={displayData} resetState={resetState} />
              <StatsTable displayData={displayData} />
            </>
          ) : (
            noResults && <p>No results found. Please adjust your search filters.</p>
          )}
        </>
      ) : (
        <p>Loading data...</p>
      )}

      {/* warning Modal */}
      <Warning
        show={showWarningModal}
        handleClose={() => setShowWarningModal(false)}
        handleShowAllData={handleShowAllData}
      />
    </div>
  );
}

export default App;
