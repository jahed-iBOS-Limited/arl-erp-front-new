import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import './style.css'
function DetailsView({ obj }) {
  const { detailsGridData, selectedBusinessUnit, values } = obj;
  const printRef = useRef();
  return (
    <>
      <span
        style={{
          position: "absolute",
          right: "16px",
          top: "10px",
          zIndex: "999",
        }}
      >
        <ReactToPrint
          trigger={() => (
            <button
              type="button"
              className="btn btn-primary mr-2"
              style={{ padding: "2px 5px" }}
            >
              <img
                style={{
                  width: "25px",
                  paddingRight: "5px",
                }}
                src={printIcon}
                alt="print-icon"
              />
              Print
            </button>
          )}
          content={() => printRef.current}
        />
      </span>
      <div className="row" ref={printRef}>
        <div className="col-md-12">
          <div className="text-center mt-6 mb-4 materialReqPlan-printReport">
            <h2>{selectedBusinessUnit?.label.toUpperCase()}</h2>
            <h4
              style={{
                fontWeight: "bold",
              }}
            >
              {values?.plant?.label}
            </h4>
            <h5 className="m-0">MRP Details</h5>
          </div>
          <div>
            {detailsGridData?.map((item) => (
              <>
                {" "}
                <div className="table-responsive mrp_table">
                  <h6 className="mb-0 mt-3">
                    <b>
                      {item?.objFinishedItemList?.[0]?.planningHorizonRowName}
                    </b>
                  </h6>
                  {/* Finished */}
                  <>
                    <p className=" mb-0">Finished Goods</p>
                    <div className="table-responsive">
 <table className="table table-striped table-bordered global-table mt-0">
                      {" "}
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Name</th>
                          <th>Plan Qty</th>
                          <th>Stock Qty</th>
                          <th>Required Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item?.objFinishedItemList?.map((item, index) => {
                          return (
                            <tr key={index + 1}>
                              <td>{index + 1}</td>
                              <td>{item?.itemName}</td>
                              <td className="text-right">
                                {_fixedPoint(item?.planQty, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(item?.stockQty, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(item?.requiredQty, true)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
</div>
                   
                  </>
                  {/*Raw Material */}
                  <>
                    <p className=" mb-0">Raw Material</p>
                    <div className="table-responsive">
<table className="table table-striped table-bordered global-table mt-0">
                      {" "}
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>RM Item Name</th>
                          <th>RM Req. Qty</th>
                          <th>RM Stock Qty</th>
                          <th>Open PO</th>
                          <th>Net Req.</th>
                          <th>Planned Order</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item?.objRawMaterialItemList?.map((item, index) => {
                          return (
                            <tr key={index + 1}>
                              <td>{index + 1}</td>
                              <td>{item?.rawMaterialItemName}</td>
                              <td className="text-right">
                                {_fixedPoint(
                                  item?.rawMaterialRequiredQty,
                                  true
                                )}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(item?.rawMaterialStockQty, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(item?.openingPurOrder, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(item?.netRequirementQty, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(item?.plannedOrder, true)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
</div>
                    
                  </>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailsView;
