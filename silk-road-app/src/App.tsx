import React from 'react';
import {observer} from "mobx-react";
import {SilkRoadManager} from "./models/SilkRoadManager";
import './index.scss';

const App = observer((props: { silkRoadManager: SilkRoadManager }) => {
    const silkRoadManager = props.silkRoadManager;
    return (
        <div className="modal App">
            <div className="modal-dialog App_dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Silk road path</h5>
                    </div>
                    <div className="modal-body App_body">

                            {silkRoadManager
                                .cities
                                .map(city =>
                                    <div className="form-group form-check" key={city.name}>
                                        <input type="checkbox"
                                               className="form-check-input"
                                               checked={city.isSelected}
                                               onChange={() => silkRoadManager.toggleCity(city)}
                                        />
                                        <label className="form-check-label">{city.name}</label>
                                    </div>
                                )
                            }

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={silkRoadManager.fetchRouting}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default App;
