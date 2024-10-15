import React from 'react';

const Legend = () => {
    const legendItems = [
        { outcome: 'Single', color: 'yellow' },
        { outcome: 'Double', color: 'blue' },
        { outcome: 'Triple', color: '#9370DB' }, // purple
        { outcome: 'Homerun', color: '#800080' }, // dark purple
        { outcome: 'Out', color: 'red' },
        { outcome: 'Error', color: 'orange' },
        { outcome: 'Foul', color: 'black' },
        { outcome: 'Sacrifice', color: '#006400' }, // dark green
        { outcome: "FC", color: 'pink' }, // FC
    ];

    return (
        <div className="card mb-3" style={{ width: '120px' }}>
            <h5 className="card-title">Legend</h5>
            <ul className="list-group list-group-flush">
                {legendItems.map((item, index) => (
                    <li key={index} className="list-group-item d-flex align-items-center p-1">
                        <span
                            className="rounded-circle"
                            style={{
                                display: 'inline-block',
                                width: '12px',
                                height: '12px',
                                backgroundColor: item.color,
                                marginRight: '8px',
                            }}
                        ></span>
                        <span>{item.outcome}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Legend;
