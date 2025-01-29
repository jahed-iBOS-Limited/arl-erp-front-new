import React from 'react';

const LocalAndInternationalRateDetailsTable = ({rowData}) => {

  return (
    <div className="table-responsive">
      <table
        id="table-to-xlsx"
        className={
          'table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm'
        }
      >
        <thead>
          <tr className="cursor-pointer">
            <th>SL</th>
            <th>Mother Vessel </th>
            <th>Item</th>
            <th>Godown </th>
            <th>Business Partner</th>
            <th>Port</th>
            <th>Local <br /> Revinue Rate</th>
            <th>International <br /> Revinue Rate</th>
            <th>MotherVessel Freight </th>
          </tr>
        </thead>
        <tbody>
          {rowData?.map((item, index) => {
            return (
              <tr key={index}>
                <td style={{ width: '40px' }} className="text-center">
                  {index + 1}
                </td>
                <td>{item?.motherVesselName}</td>
                <td>{item?.itemName}</td>
                <td>{item?.godownName}</td>
                <td>{item?.businessPartnerName}</td>
                <td>{item?.portName}</td>
                <td className='text-right'>{item?.localRevenueRate}</td>
                <td className='text-right'>{item?.motherVesselRevenueRate}</td>
                <td className='text-right'>{item?.freightInBDT}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LocalAndInternationalRateDetailsTable;
