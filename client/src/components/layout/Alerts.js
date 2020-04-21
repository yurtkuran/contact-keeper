import React, { useContext } from 'react';
import AlertContext from '../../context/alert/alertContext';

const Alerts = () => {
    // initialize context
    const alertContext = useContext(AlertContext);

    return (
        alertContext.alerts.length > 0 &&
        alertContext.alerts.map((alert) => (
            <div className={`alert alert-${alert.type}`} key={alert.id}>
                <i className='fas fa-info-cirle' /> {alert.msg}
            </div>
        ))
    );
};

export default Alerts;
