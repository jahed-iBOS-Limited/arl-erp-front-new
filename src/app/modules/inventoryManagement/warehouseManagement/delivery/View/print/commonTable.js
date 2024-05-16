import React from "react";

function CommonTable({
  deliveryChallanInfo,
  totalQuantity,
  selectedBusinessUnit,
  totalBundel,
  totalPieces,
}) {
  return (
    <>
      <div className="my-8">
        {!deliveryChallanInfo?.isPrintable ? (
          <h5 style={{ color: "tomato" }} className="text-center">
            {deliveryChallanInfo?.massage}
          </h5>
        ) : null}

        {deliveryChallanInfo?.rows?.length >= 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-bordered  global-table">
              <thead>
                <tr>
                  <th style={{ width: "35px" }}>SL</th>
                  <th>PRODUCT DESCRIPTION</th>
                  <th>UOM</th>
                  {(selectedBusinessUnit?.value === 171 ||
                    selectedBusinessUnit?.value === 224) && (
                    <>
                      <th>Bundle</th>
                      <th>Pieces</th>
                    </>
                  )}

                  <th>QNT.</th>
                </tr>
              </thead>
              <tbody>
                {deliveryChallanInfo?.rows?.map((td, index) => {
                  return (
                    <tr key={index}>
                      <td> {index + 1} </td>
                      <td>
                        <div className="text-left pr-2">
                          {td.prodcuctDescription}
                        </div>
                      </td>
                      <td>
                        <div className="pl-2">{td.uom}</div>
                      </td>

                      {(selectedBusinessUnit?.value === 171 ||
                        selectedBusinessUnit?.value === 244) && (
                        <>
                          <td>
                            <div className="text-right pl-2">{td.bundel}</div>
                          </td>
                          <td>
                            <div className="text-right pl-2">{td.pieces}</div>
                          </td>
                        </>
                      )}

                      <td>
                        <div className="text-right pl-2">{td.quantity}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3">
                    <b>TOTAL</b>
                  </td>
                  {(selectedBusinessUnit?.value === 171 ||
                    selectedBusinessUnit?.value === 244) && (
                    <>
                      <td className="text-right">
                        <b>{totalBundel}</b>
                      </td>
                      <td className="text-right">
                        <b>{totalPieces}</b>
                      </td>
                    </>
                  )}
                  <td className="text-right">
                    <b>{totalQuantity}</b>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default CommonTable;
