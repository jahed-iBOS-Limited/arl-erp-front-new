import React from "react";
import IView from "./../../../../_helper/_helperIcons/_view";
import PaginationTable from "./../../../../_helper/_tablePagination";
import ChallanPrintModal from "./../challanPrintModal/challanPrintModal";
function CompleteTable({
  rowDto,
  values,
  setPositionHandler,
  paginationState,
  setChallanPrintModalShow,
  gridData,
  challanPrintModalShow,
  setDeliveryId,
  deliveryId,
  accId,
  buId,
}) {
  const { pageNo, setPageNo, pageSize, setPageSize } = paginationState;

  return (
    <>
      {gridData?.length > 0 && (
        <div className="react-bootstrap-table table-responsive">
          <table className={"table table-striped table-bordered global-table "}>
            <thead>
              <tr>
                <th>SL</th>
                <th>Delivery Code</th>
                <th>Delivery Address</th>
                <th>Item Name</th>
                <th>Shippoint Name</th>
                <th>Partner Name</th>
                <th>Commissioning Agent</th>
                <th>Supplier Name</th>
                <th>Sales Type</th>
                <th>Comission Per Bag</th>
                <th>Declared Price</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Bill Register Code</th>
                <th style={{ width: "100px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.map((item, index) => {
                return (
                  <>
                    <tr key={index}>
                      <td style={{ width: "30px" }} className="text-center">
                        {index + 1}
                      </td>
                      <td>{item?.secondaryDeliveryCode}</td>
                      <td>{item?.deliveryAddress}</td>
                      <td>{item?.itemName}</td>
                      <td>{item?.shippointName}</td>
                      <td>{item?.soldToPartnerName}</td>
                      <td>{item?.accOfParnterName}</td>
                      <td>{item?.supplierName}</td>
                      <td>{item?.salesType}</td>
                      <td className="text-right">{item?.numComission}</td>
                      <td className="text-right">{item?.numDeclaredPrice}</td>
                      <td className="text-right">{item?.numFirstPrice}</td>
                      <td className="text-right">{item?.numQuantity}</td>
                      <td className="text-right">{item?.numTotalPrice}</td>
                      <td>{item?.billRegisterCode}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-around">
                          <span>
                            <IView
                              clickHandler={() => {
                                setDeliveryId(item?.secondaryDeliveryId);
                                setChallanPrintModalShow(true);
                              }}
                            />
                          </span>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>

          <>
            {rowDto?.data?.length > 0 && (
              <PaginationTable
                count={rowDto?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{
                  pageNo,
                  setPageNo,
                  pageSize,
                  setPageSize,
                }}
                values={values}
              />
            )}
          </>

          <ChallanPrintModal
            show={challanPrintModalShow}
            deliveryId={deliveryId}
            onHide={() => {
              setChallanPrintModalShow(false);
            }}
            setChallanPrintModalShow={setChallanPrintModalShow}
          />
        </div>
      )}
    </>
  );
}

export default CompleteTable;
