import React from "react";

function CommonTable({
  deliveryOrderReportData,
  totalQuantity,
  selectedBusinessUnit,
  totalBundel,
  totalPieces,
  totalRate,
  totalAmount,
}) {
  return (
    <>
      <div className="my-8">
        {!deliveryOrderReportData?.isPrintable ? (
          <h5 style={{ color: "tomato" }} className="text-center">
            {deliveryOrderReportData?.massage}
          </h5>
        ) : null}

        {deliveryOrderReportData?.rows?.length >= 0 && (
          <table className="table table-striped table-bordered  global-table">
            <thead>
              <tr>
                <th style={{ width: "35px" }}>SL</th>
                <th style={{ minWidth: "220px" }}>PRODUCT DESCRIPTION</th>
                {[186]?.includes(selectedBusinessUnit?.value) && (
                  <th>CUSTOMER DESCRIPTION</th>
                )}
                <th>UOM</th>
                {(selectedBusinessUnit?.value === 171 ||
                  selectedBusinessUnit?.value === 224) && (
                  <>
                    <th>Bundle</th>
                    <th>Pieces</th>
                  </>
                )}
                <th>QNT.</th>
                <th
                  style={{
                    width: "150px",
                  }}
                >
                  Rate
                </th>
                <th
                  style={{
                    width: "150px",
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {deliveryOrderReportData?.rows
                ?.filter((itm) => !itm?.isTradeFreeItem)
                ?.map((td, index) => {
                  return (
                    <CommonTR
                      td={td}
                      index={index}
                      selectedBusinessUnit={selectedBusinessUnit}
                    />
                  );
                })}
              {/* offer item show start */}
              {deliveryOrderReportData?.rows?.filter(
                (itm) => itm?.isTradeFreeItem
              )?.length > 0 && (
                <tr>
                  <td colSpan={2} className="text-left">
                    <b>Offer Item</b>
                  </td>
                </tr>
              )}
              {deliveryOrderReportData?.rows
                ?.filter((itm) => itm?.isTradeFreeItem)
                ?.map((td, index) => {
                  return (
                    <CommonTR
                      td={td}
                      index={index}
                      selectedBusinessUnit={selectedBusinessUnit}
                    />
                  );
                })}
              {/* offer item show end */}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-right">
                  <b>TOTAL</b>
                </td>
                {[186]?.includes(selectedBusinessUnit?.value) && <td></td>}
                {(selectedBusinessUnit?.value === 171 ||
                  selectedBusinessUnit?.value === 224) && (
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
                <td className="text-right">
                  <b>{totalRate}</b>
                </td>
                <td className="text-right">
                  <b>{totalAmount}</b>
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </>
  );
}

const CommonTR = ({ index, td, selectedBusinessUnit }) => {
  return (
    <tr key={index}>
      <td> {index + 1} </td>

      <td>
        <div className="text-left pr-2">{td?.prodcuctDescription}</div>
      </td>
      {[186]?.includes(selectedBusinessUnit?.value) && (
        <td>
          <div className="pl-2">
            {selectedBusinessUnit?.value === 186 && td?.customerItemName}
          </div>
        </td>
      )}
      <td>
        <div className="pl-2">{td?.uom}</div>
      </td>
      {(selectedBusinessUnit?.value === 171 ||
        selectedBusinessUnit?.value === 224) && (
        <>
          <td>
            <div className="text-right pl-2">{td?.bundel}</div>
          </td>
          <td>
            <div className="text-right pl-2">{td?.pieces}</div>
          </td>
        </>
      )}

      <td>
        <div className="text-right pl-2">{td?.quantity}</div>
      </td>
      <td>
        <div className="text-right pl-2">{td?.itemPrice}</div>
      </td>
      <td>
        <div className="text-right pl-2">{
          (+td.quantity || 0) * (+td?.itemPrice || 0)
        }</div>
      </td>
    </tr>
  );
};

export default CommonTable;
