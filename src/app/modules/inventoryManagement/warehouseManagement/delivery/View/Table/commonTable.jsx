import React from 'react';

function CommonTable({
  deliveryOrderReportData,
  totalQuantity,
  selectedBusinessUnit,
  totalBundel,
  totalPieces,
  totalRate,
  totalAmount,
  isWorkable,
  totalDiscountRate,
  totalDiscountAmount,
  grandTotal,
}) {
  return (
    <>
      <div className="my-8">
        {!deliveryOrderReportData?.isPrintable ? (
          <h5 style={{ color: 'tomato' }} className="text-center">
            {deliveryOrderReportData?.massage}
          </h5>
        ) : null}

        {deliveryOrderReportData?.rows?.length >= 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-bordered  global-table">
              <thead>
                <tr>
                  <th style={{ width: '35px' }}>SL</th>
                  <th style={{ width: '220px' }}>PRODUCT DESCRIPTION</th>
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
                  {isWorkable && <th style={{ textAlign: 'center' }}>S.N</th>}
                  <th style={{ textAlign: 'right' }}>QNT.</th>
                  {[144].includes(selectedBusinessUnit?.value) && (
                    <>
                      <th
                        style={{
                          width: '150px',
                        }}
                      >
                        Rate
                      </th>
                      <th
                        style={{
                          width: '150px',
                        }}
                      >
                        Amount
                      </th>
                      {[67].includes(deliveryOrderReportData?.channelId) && (
                        <>
                          <th
                            style={{
                              width: '150px',
                            }}
                          >
                            Discount Rate
                          </th>
                          <th
                            style={{
                              width: '150px',
                            }}
                          >
                            Discount Amount
                          </th>
                          <th
                            style={{
                              width: '150px',
                            }}
                          >
                            Grand Total
                          </th>
                        </>
                      )}
                    </>
                  )}
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
                        isWorkable={isWorkable}
                        deliveryOrderReportData={deliveryOrderReportData}
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
                      <td className="text-right">
                        <b>{totalQuantity}</b>
                      </td>
                    </>
                  )}
                  {selectedBusinessUnit?.value !== 171 &&
                    selectedBusinessUnit?.value !== 224 && (
                      <>
                        <td className="text-right"></td>
                      </>
                    )}
                  {/*  Akij Essentials Ltd. == 144*/}
                  {[144].includes(selectedBusinessUnit?.value) && (
                    <>
                      <td className="text-right">
                        <b>{totalRate}</b>
                      </td>
                      <td className="text-right">
                        <b>{totalAmount}</b>
                      </td>
                    </>
                  )}
                  {[67].includes(deliveryOrderReportData?.channelId) && (
                    <>
                      <td className="text-right">{totalDiscountRate}</td>
                      <td className="text-right">{totalDiscountAmount}</td>
                      <td className="text-right">{grandTotal}</td>
                    </>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

const CommonTR = ({
  index,
  td,
  selectedBusinessUnit,
  isWorkable,
  deliveryOrderReportData,
}) => {
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

      {isWorkable && (
        <td>
          <div className="text-center pl-2">
            {td?.itemWiseSerialList?.map((item) => item || 'N/A')}
          </div>
        </td>
      )}
      <td>
        <div className="text-right pl-2">{td?.quantity}</div>
      </td>
      {/*  Akij Essentials Ltd. == 144*/}
      {[144].includes(selectedBusinessUnit?.value) && (
        <>
          <td>
            <div className="text-right pl-2">{td?.itemPrice}</div>
          </td>
          <td>
            <div className="text-right pl-2">
              {(+td?.itemPrice || 0) * (+td?.quantity || 0)}
            </div>
          </td>
        </>
      )}
      {[67].includes(deliveryOrderReportData?.channelId) && (
        <>
          <td className="text-right pl-2">{td?.itemSackDiscountRate}</td>
          <td className="text-right pl-2">{td?.itemSackDiscountAmount}</td>
          <td className="text-right pl-2">
            {(+td?.itemPrice || 0) * (+td?.quantity || 0) -
              (+td?.itemSackDiscountAmount || 0)}
          </td>
        </>
      )}
    </tr>
  );
};

export default CommonTable;
