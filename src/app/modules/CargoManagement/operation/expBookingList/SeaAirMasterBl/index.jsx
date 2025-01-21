import React, { useState } from 'react';
import MasterHBAWModal from '../masterHAWBModal';
import MasterHBLModal from '../masterHBLModal';

export default function SeaAirMasterBL({
  selectedRow,
  isPrintView,
  CB,
  airMasterBlid,
  sipMasterBlid,
  rowClickData,
}) {
  const [transportPlanningType, setTransportPlanningType] = useState('');
  return (
    <div>
      <div className="col-lg-4 mb-2 mt-5">
        {!selectedRow?.[0]?.isAirmasterBlGenarate && (
          <label className="mr-3">
            <input
              type="radio"
              name="transportPlanningType"
              checked={transportPlanningType.value === 1}
              className="mr-1 pointer"
              style={{ position: 'relative', top: '2px' }}
              onChange={(e) => {
                setTransportPlanningType({
                  value: 1,
                  label: 'Air',
                });
              }}
              // disabled={
              //   shipBookingRequestGetById?.transportPlanning
              //     ?.transportPlanningModeId === 1
              // }
              required
            />
            Air
          </label>
        )}

        {!selectedRow?.[0]?.isSeamasterBlGenarate && (
          <label>
            <input
              type="radio"
              name="transportPlanningType"
              checked={transportPlanningType.value === 2}
              className="mr-1 pointer"
              style={{ position: 'relative', top: '2px' }}
              onChange={(e) => {
                setTransportPlanningType({
                  value: 2,
                  label: 'Sea',
                });
              }}
              // disabled={
              //   shipBookingRequestGetById?.transportPlanning
              //     ?.transportPlanningModeId === 2
              // }
              required
            />
            Sea
          </label>
        )}
      </div>
      {transportPlanningType.value === 1 && (
        <MasterHBAWModal
          selectedRow={selectedRow}
          isPrintView={isPrintView}
          CB={CB}
          rowClickData={{
            ...rowClickData,
            tradeTypeId: 1,
          }}
        />
      )}
      {transportPlanningType.value === 2 && (
        <MasterHBLModal
          selectedRow={selectedRow}
          isPrintView={isPrintView}
          CB={CB}
          rowClickData={{
            ...rowClickData,
            tradeTypeId: 1,
          }}
        />
      )}
    </div>
  );
}
