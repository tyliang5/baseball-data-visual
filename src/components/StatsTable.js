import React from 'react';

// converts date
const formatDate = (excelDate) => {
    const baseDate = new Date(1899, 11, 30);
    const formattedDate = new Date(baseDate.getTime() + excelDate * 86400000); // convert days to milliseconds

    // extract month, day, and year
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(formattedDate.getDate()).padStart(2, '0');
    const year = formattedDate.getFullYear();

    return `${month}/${day}/${year}`; // format as MM/DD/YYYY
};

const StatsTable = ({ displayData }) => {
    return (
        <div className="mt-4">
            <h2>Stats</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>Batter</th>
                            <th>Pitcher</th>
                            <th>Game Date</th>
                            <th>Launch Angle</th>
                            <th>Exit Speed</th>
                            <th>Exit Direction</th>
                            <th>Hit Distance</th>
                            <th>Hang Time</th>
                            <th>Outcome</th>
                            <th>Video</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayData.map((row, index) => (
                            <tr key={index}>
                                <td>{row['BATTER']}</td>
                                <td>{row['PITCHER']}</td>
                                <td>{formatDate(row['GAME_DATE'])}</td>
                                <td>{row['LAUNCH_ANGLE']}</td>
                                <td>{row['EXIT_SPEED']}</td>
                                <td>{row['EXIT_DIRECTION']}</td>
                                <td>{row['HIT_DISTANCE']}</td>
                                <td>{row['HANG_TIME']}</td>
                                <td>{row['PLAY_OUTCOME'] || 'Foul'}</td> {/*undefined outcomes are fouls */}
                                <td>
                                    <a href={row['VIDEO_LINK']} target="_blank" rel="noopener noreferrer">
                                        Watch
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StatsTable;
