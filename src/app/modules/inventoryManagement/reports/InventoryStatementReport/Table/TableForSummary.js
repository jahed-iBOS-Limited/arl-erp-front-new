import React from "react";
import InfoCircle from "../../../../_helper/_helperIcons/_infoCircle";
import numberWithCommas from "../../../../_helper/_numberWithCommas";

const TableForSummary = ({
  setTableItem,
  inventoryStatement,
  setIsShowModal,
}) => {
  return (
    inventoryStatement?.length > 0 && (
      <div className="table-responsive">
        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
          <thead>
            <tr>
              <th>SL</th>
              <th>Item Name</th>
              <th>Opening Qty</th>
              <th>Opening Value</th>
              <th>IN</th>
              <th>IN Value</th>
              <th>Out</th>
              <th>Out Value</th>
              <th>Transit Quantity</th>
              <th>Closing Qty</th>
              <th>Closing Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inventoryStatement?.length > 0 &&
              inventoryStatement?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td style={{ width: "30px" }} className="text-center">
                      {item?.sl}
                    </td>
                    <td>
                      <span className="pl-2">{item?.strItemName}</span>
                    </td>
                    <td className="text-right">
                      <span>{item?.opnQty}</span>
                    </td>
                    <td className="text-right">
                      <span>
                        {numberWithCommas((item?.openValue || 0).toFixed(2))}
                      </span>
                    </td>
                    <td className="text-right">
                      <span>{item?.numTransferIn}</span>
                    </td>
                    <td className="text-right">
                      <span>
                        {numberWithCommas(
                          (item?.numTransferInValue || 0).toFixed(2)
                        )}
                      </span>
                    </td>
                    <td className="text-right">
                      <span>{item?.numTransferOut}</span>
                    </td>
                    <td className="text-right">
                      <span>
                        {numberWithCommas(
                          (item?.numTransferOutValue || 0).toFixed(2)
                        )}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="pl-2">{item?.numTransitQuantity}</span>
                    </td>
                    <td className="text-right">
                      <span>
                        {(
                          item?.opnQty +
                          item?.numTransferIn -
                          item?.numTransferOut
                        ).toFixed(4)}
                      </span>
                    </td>
                    <td className="text-right">
                      <span>
                        {numberWithCommas(
                          (
                            item?.openValue +
                              item?.numTransferInValue -
                              item?.numTransferOutValue || 0
                          ).toFixed(2)
                        )}
                      </span>
                    </td>
                    <td className="text-center">
                      <InfoCircle
                        clickHandler={() => {
                          setIsShowModal(true);
                          setTableItem(item);
                        }}
                        classes={"text-primary"}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    )
  );
};

export default TableForSummary;
