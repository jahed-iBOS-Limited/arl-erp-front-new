import React from 'react';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
function AdvancesForIntGrid({
  gridData,
  allGridCheck,
  itemSlectedHandler,
  setGridData,
}) {
  return (
    <>
      {gridData?.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered mt-3 global-table">
            <thead>
              <tr>
                <th style={{ width: '25px' }}>
                  <input
                    type="checkbox"
                    id="parent"
                    onChange={(event) => {
                      setGridData(allGridCheck(event.target.checked, gridData));
                    }}
                  />
                </th>
                <th style={{ width: '35px' }}>SL</th>
                <th style={{ width: '150px' }}>Submit Date</th>
                <th style={{ width: '150px' }}>Advance Code</th>
                <th style={{ width: '150px' }}>Advance For Name</th>
                <th style={{ width: '150px' }}>Disbursement Center Name</th>
                <th style={{ width: '150px' }}>Advance Amount</th>
                <th style={{ width: '150px' }}>Total Amount</th>
                {/* <th style={{ width: "150px" }}>Adjust Amount</th> */}
                <th style={{ width: '150px' }}>Net Amount</th>
                <th style={{ width: '150px' }}>Comments</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      id="itemCheck"
                      type="checkbox"
                      className=""
                      value={item?.itemCheck}
                      checked={item?.itemCheck}
                      name={item?.itemCheck}
                      onChange={(e) => {
                        setGridData(
                          itemSlectedHandler(e.target.checked, index, gridData)
                        );
                      }}
                    />
                  </td>
                  <td> {index + 1}</td>
                  <td>
                    <div className="pl-2">
                      {_dateFormatter(item?.submitDate)}
                    </div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.advanceCode}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.employeeName}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.disbursementCenterName}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.advancedAmount}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.totalApprovedAmount}</div>
                  </td>
                  {/* <td>
                    <div className="pl-2">
                      <InputField
                        value={item?.adjustAmount}
                        name="adjustAmount"
                        placeholder="Adjust Amount"
                        type="number"
                        onChange={(e) => {
                          if (
                            item?.advancedAmount >= e.target.value &&
                            item?.totalApprovedAmount >= e.target.value
                          ) {
                            item["adjustAmount"] = e.target.value;
                            item["netAmount"] =
                              item["totalApprovedAmount"] - e.target.value;
                            setGridData([...gridData]);
                          } else {
                            setGridData([...gridData]);
                          }
                        }}
                      />
                    </div>
                  </td> */}
                  <td>
                    <div className="pl-2">{item?.netAmount}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.comments}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default AdvancesForIntGrid;
