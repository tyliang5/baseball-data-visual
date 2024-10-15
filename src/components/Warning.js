import React from 'react';

const Warning = ({ show, handleClose, handleShowAllData }) => {
    return (
        <div className={`modal ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        <p>
                            Warning: This action will show all available data, which may cause performance issues, lag, or crash the browser. Are you sure you want to proceed?
                        </p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            No
                        </button>
                        <button type="button" className="btn btn-danger" onClick={handleShowAllData}>
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Warning;
