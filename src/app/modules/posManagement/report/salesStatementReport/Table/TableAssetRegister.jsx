import React from 'react';
import InfoCircle from '../../../../_helper/_helperIcons/_infoCircle';
import numberWithCommas from '../../../../_helper/_numberWithCommas';

const TableAssetRegister = ({
  setTableItem,
  inventoryStatement,
  setIsShowModal,
}) => {
  return (
    inventoryStatement?.length > 0 && (
      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm">
        <thead>
          <tr>
            <th>SL</th>
            <th>Item Name</th>
            <th>Location</th>
            <th>Open Qty</th>
            <th>Open Value</th>
            <th>Qty</th>
            <th>Value</th>
            <th>Closing Qty</th>
            <th>Closing Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {inventoryStatement?.length > 0 &&
            inventoryStatement?.map((item, index) => {
              return (
                <tr key={index + 1}>
                  <td style={{ width: '30px' }} className="text-center">
                    {item?.sl}
                  </td>
                  <td>
                    <span className="pl-2">{item?.strItemName}</span>
                  </td>
                  <td>
                    <span className="pl-2">
                      {item?.strInventoryLocationName}
                    </span>
                  </td>

                  <td className="text-right">
                    <span>{item?.openQty}</span>
                  </td>
                  <td className="text-right">
                    <span>
                      {numberWithCommas((item?.openValue || 0).toFixed(2))}
                    </span>
                  </td>
                  <td className="text-right">
                    <span>{item?.qty}</span>
                  </td>
                  <td className="text-right">
                    <span>
                      {numberWithCommas((item?.value || 0).toFixed(2))}
                    </span>
                  </td>
                  <td className="text-right">
                    <span>{item?.clossingQty}</span>
                  </td>
                  <td className="text-right">
                    <span>
                      {numberWithCommas((item?.clossingValue || 0).toFixed(2))}
                    </span>
                  </td>
                  <td className="text-center">
                    <InfoCircle
                      clickHandler={() => {
                        setIsShowModal(true);
                        setTableItem(item);
                      }}
                      classes={'text-primary'}
                    />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    )
  );
};

export default TableAssetRegister;
