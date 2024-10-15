import React, { useState, useEffect } from 'react';
import Legend from './Legend';

const BaseballField2D = ({ battedBallData, selectedBatter, selectedPitcher, resetState, selectedContactType, selectedOutcome }) => {
    const [hoverData, setHoverData] = useState(null);
    const [selectedDot, setSelectedDot] = useState(null); // for when user clicks on a dot
    const [videoLink, setVideoLink] = useState(null); // video link for selected dot

    // reset button logic
    useEffect(() => {
        if (resetState) {
            setHoverData(null);
            setSelectedDot(null);
            setVideoLink(null);
        }
    }, [resetState]);

    const fieldWidth = 512;
    const fieldHeight = 512;
    const homePlateY = fieldHeight - 77; // pxs to align home plate with the bottom of the field
    const centerFieldY = 40; // pxs to align center field fence with the top of the field
    const pixelDistance = homePlateY - centerFieldY;
    const feetPerPixel = 400 / pixelDistance; //calculate feet per pixel... field isnt totally accurate... especially infield

    const determineBallColor = (playOutcome) => {
        switch (playOutcome.toLowerCase()) {
            case 'single': return 'yellow';
            case 'double': return 'blue';
            case 'triple': return '#9370DB'; // purple
            case 'homerun': return '#800080'; // dark purple
            case 'out': return 'red';
            case 'error': return 'orange';
            case 'undefined': return 'black';
            case 'sacrifice': return '#006400'; // dark green
            case 'fielderschoice': return 'pink'; // FC
            default: return 'gray'; // default to gray idt this will ever be hit
        }
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

    const calculateDotPosition = (data) => {
        const exitDirection = data['EXIT_DIRECTION'];
        const hitDistance = data['HIT_DISTANCE'];

        // convert to radians
        const angleRad = (exitDirection * Math.PI) / 180;

        // converts the hit distance to pixels
        const pixelHitDistance = hitDistance / feetPerPixel;

        // calculate the x and y positions
        let x = pixelHitDistance * Math.sin(angleRad);
        let y = pixelHitDistance * Math.cos(angleRad);

        // ball starts off at home plate
        const centerX = fieldWidth / 2;
        const centerY = homePlateY;

        x = Math.min(Math.max(centerX + x, 0), fieldWidth); // constraints so ball doesnt go out of the box
        y = Math.min(Math.max(centerY - y, 0), fieldHeight);

        // return the position
        return {
            left: `${x}px`,
            top: `${y}px`,
        };
    };

    {/* handle click on a dot */ }
    const handleDotClick = (data) => {
        setSelectedDot(data);
        setVideoLink(data.VIDEO_LINK);
        setHoverData(null);
    };

    const handleDotHover = (data) => {
        if (!selectedDot) {
            setHoverData(data); // show hover info only if no dot is selected
        }
    };

    const handleMouseLeave = () => {
        if (!selectedDot) {
            setHoverData(null); // clear hover info only if no dot is selected
        }
    };

    return (
        <div className="container mt-3">
            <div className="row">
                {battedBallData.length > 0 && (
                    <div className="col-md-3">
                        <Legend />
                        {(hoverData || selectedDot) && (
                            <div className="card mt-3">
                                <div className="card-body">
                                    <h5 className="card-title">Hit Information</h5>
                                    <p><strong>Batter:</strong> {hoverData?.BATTER || selectedDot?.BATTER}</p>
                                    <p><strong>Pitcher:</strong> {hoverData?.PITCHER || selectedDot?.PITCHER}</p>
                                    <p><strong>Launch Angle:</strong> {hoverData?.LAUNCH_ANGLE || selectedDot?.LAUNCH_ANGLE}</p>
                                    <p><strong>Exit Speed:</strong> {hoverData?.EXIT_SPEED || selectedDot?.EXIT_SPEED}</p>
                                    <p><strong>Exit Direction:</strong> {hoverData?.EXIT_DIRECTION || selectedDot?.EXIT_DIRECTION}</p>
                                    <p><strong>Hit Distance:</strong> {hoverData?.HIT_DISTANCE || selectedDot?.HIT_DISTANCE}</p>
                                    <p><strong>Hang Time:</strong> {hoverData?.HANG_TIME || selectedDot?.HANG_TIME}</p>
                                    {/* contact type displayed based on launch angle */}
                                    <p><strong>Contact Type:</strong> {determineContactType(hoverData?.LAUNCH_ANGLE || selectedDot?.LAUNCH_ANGLE)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* baseball field png*/}
                {battedBallData.length > 0 && (
                    <div className="col-md-6">
                        <div
                            className="baseball-field"
                            style={{
                                width: fieldWidth,
                                height: fieldHeight,
                                backgroundImage: "url('/baseballfield.png')",
                                backgroundSize: "cover",
                                backgroundPosition: "center", // ensure the image is centered
                                position: "relative",
                                border: "1px solid #000",
                                overflow: "hidden", // prevent overflow
                            }}
                        >
                            {battedBallData.map((data, index) => {
                                const position = calculateDotPosition(data);
                                const ballColor = determineBallColor(data['PLAY_OUTCOME']);
                                const isSelected = selectedDot === data;

                                return (
                                    <div
                                        key={index}
                                        className="ball-dot"
                                        style={{
                                            left: position.left,
                                            top: position.top,
                                            backgroundColor: ballColor,
                                            border: isSelected ? '3px solid black' : 'none',
                                            zIndex: isSelected ? 2 : 1,
                                            position: 'absolute',
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={() => handleDotHover(data)}
                                        onMouseLeave={handleMouseLeave}
                                        onClick={() => handleDotClick(data)}
                                    ></div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* video */}
                {videoLink && (
                    <div className="col-md-3">
                        <div className="embed-responsive embed-responsive-16by9">
                            <iframe
                                className="embed-responsive-item"
                                src={videoLink}
                                title="Video Player"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>

            {/*no result found*/}
            {battedBallData.length === 0 && (
                <div className="col-12 text-center">
                    <h5>No results found</h5>
                </div>
            )}
        </div>
    );
};

export default BaseballField2D;
