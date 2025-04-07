import React from 'react';
import InfoCircle from '../../../../_helper/_helperIcons/_infoCircle';

const RegisterNewTable = ({
  setTableItem,
  inventoryStatement,
  setIsShowModal,
}) => {
  let totalOpenQty = 0;
  let totalInQty = 0;
  let totalOutQty = 0;
  let totalClosingQty = 0;
  let totalClosingValue = 0;
  let totalRate = 0;

  inventoryStatement?.forEach((item) => {
    totalOpenQty += item?.numOpenQty;
    totalInQty += item?.numInQty;
    totalOutQty += item?.numOutQty;
    totalClosingQty += item?.numCloseQty;
    totalClosingValue += item?.closingValues;
    totalRate += item?.numRate;
  });

  return (
    inventoryStatement?.length > 0 && (
      <div className="react-bootstrap-table table-responsive">
        <div className="loan-scrollable-table inventory-statement-report">
          <div style={{ maxHeight: '400px' }} className="scroll-table _table">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm">
              <thead>
                <tr>
                  <th style={{ minWidth: '40px' }}>SL</th>
                  <th style={{ minWidth: '220px' }}>Item Name</th>
                  <th style={{ minWidth: '100px' }}>Item Code</th>
                  <th style={{ minWidth: '80px' }}>UoM Name</th>
                  <th style={{ minWidth: '80px' }}>Open Qty</th>
                  {/* <th style={{ minWidth: "80px" }}>Open Value</th> */}
                  <th style={{ minWidth: '80px' }}>In Qty</th>
                  {/* <th style={{ minWidth: "80px" }}>In Value</th> */}
                  <th style={{ minWidth: '80px' }}>Out Qty</th>
                  {/* <th style={{ minWidth: "80px" }}>Out Value</th> */}
                  <th style={{ minWidth: '80px' }}>Closing Qty</th>
                  <th style={{ minWidth: '118px' }}>Closing Value</th>
                  {/* <th style={{ minWidth: "100px" }}>Closing Value</th> */}
                  <th style={{ minWidth: '100px' }}>Rate</th>
                  <th style={{ minWidth: '50px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {inventoryStatement?.length > 0 &&
                  inventoryStatement?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ width: '30px' }} className="text-center">
                          {index + 1}
                        </td>
                        <td>
                          <span className="pl-2">{item?.strItemName}</span>
                        </td>
                        <td>
                          <span className="pl-2 text-center">
                            {item?.strItemCode}
                          </span>
                        </td>
                        <td>
                          <span className="pl-2">{item?.strBaseUOM}</span>
                        </td>
                        <td className="text-right">
                          <span>{item?.numOpenQty}</span>
                        </td>
                        {/* <td className="text-right">
                          <span>{item?.numOpenValue}</span>
                        </td> */}
                        <td className="text-right">
                          <span>{item?.numInQty}</span>
                        </td>
                        {/* <td className="text-right">
                          <span>{item?.numInValue}</span>
                        </td> */}
                        <td className="text-right">
                          <span>{item?.numOutQty}</span>
                        </td>
                        {/* <td className="text-right">
                          <span>{item?.numOutValue}</span>
                        </td> */}
                        <td className="text-right">
                          <span>{item?.numCloseQty}</span>
                        </td>
                        <td className="text-right">
                          <span>{item?.closingValues}</span>
                        </td>
                        {/* <td className="text-right">
                          <span>{item?.numClosingValue}</span>
                        </td> */}
                        <td className="text-right">
                          <span>{item?.numRate}</span>
                        </td>
                        <td className="text-center">
                          <InfoCircle
                            clickHandler={() => {
                              setIsShowModal(true);
                              setTableItem({
                                ...item,
                                itemId: item?.intItemId,
                              });
                            }}
                            classes={'text-primary'}
                          />
                        </td>
                      </tr>
                    );
                  })}
                <tr>
                  <td
                    colSpan={2}
                    className="text-center "
                    style={{ fontWeight: 'bold' }}
                  >
                    Total
                  </td>
                  <td></td>
                  <td></td>
                  <td className="text-right " style={{ fontWeight: 'bold' }}>
                    {totalOpenQty}
                  </td>
                  <td className="text-right " style={{ fontWeight: 'bold' }}>
                    {totalInQty}
                  </td>
                  <td className="text-right " style={{ fontWeight: 'bold' }}>
                    {totalOutQty}
                  </td>
                  <td className="text-right " style={{ fontWeight: 'bold' }}>
                    {totalClosingQty}
                  </td>
                  <td className="text-right " style={{ fontWeight: 'bold' }}>
                    {totalClosingValue}
                  </td>
                  <td className="text-right " style={{ fontWeight: 'bold' }}>
                    {totalRate}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  );
};

export default RegisterNewTable;
