import React, { useState } from 'react';
import Contra from './contra';
import InterCompanyTransferRequest from './interCompanyTransferRequest';

const FundTransfer = () => {
  const [viewType, setViewType] = useState({
    actionId: 1,
    actionName: 'Contra',
  });

  return (
    <div>
      <div>
        <strong className="ml-3" style={{ fontSize: '16px', color: 'black' }}>
          Fund Transfer Request
        </strong>
      </div>
      <div className="col-lg-4 py-2">
        <label className="mr-3">
          <input
            type="radio"
            name="viewType"
            checked={viewType?.actionName === 'Contra'}
            className="mr-1 pointer"
            style={{
              position: 'relative',
              top: '2px',
            }}
            onChange={(valueOption) => {
              setViewType({ actionId: 1, actionName: 'Contra' });
            }}
          />
          <strong style={{ fontSize: '13px', color: 'black' }}>Contra</strong>
        </label>
        <label className="mr-3">
          <input
            type="radio"
            name="viewType"
            checked={viewType?.actionName === 'InterCompanyTransferRequest'}
            className="mr-1 pointer"
            style={{ position: 'relative', top: '2px' }}
            onChange={(e) => {
              setViewType({
                actionId: 2,
                actionName: 'InterCompanyTransferRequest',
              });
            }}
          />
          <strong style={{ fontSize: '13px', color: 'black' }}>
            Inter Company Transfer Request
          </strong>
        </label>
      </div>

      {viewType?.actionName === 'Contra' && <Contra viewType={viewType} />}

      {viewType?.actionName === 'InterCompanyTransferRequest' && (
        <InterCompanyTransferRequest viewType={viewType} />
      )}
    </div>
  );
};

export default FundTransfer;
