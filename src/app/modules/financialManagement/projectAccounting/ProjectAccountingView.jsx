import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import Loading from "../../_helper/_loading";
export default function ProjectAccountingView({ id, show, onHide }) {
  //  custom hook
  const [
    {
      projectDescription,
      projectTeam,
      projectCostingExpense,
      projectCostingInventory,
    },
    getData,
    loadingOnGetDescription,
    setRes,
  ] = useAxiosGet();
  //    data fetching
  // get account data
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state.authData,
    shallowEqual
  );
  useEffect(() => {
    if (id) {
      getData(
        `/fino/ProjectAccounting/GetProjectById?accId=${profileData?.accountId}&buId=${selectedBusinessUnit?.value}&id=${id}`,
        (data) => setRes(data)
      );
    }
    // eslint-disable-next-line
  }, [id]);

  // setting new Property variance
  const [expenseVariance, setExpenseVariance] = useState([]);
  const [inventoryVariance, setinventoryVariance] = useState([]);

  // variance setup
  useEffect(() => {
    setExpenseVariance(
      projectCostingExpense?.map((item) => {
        return {
          variance: item?.numBudgetAmount - item?.numActualAmount,
          ...item,
        };
      })
    );
    setinventoryVariance(
      projectCostingInventory?.map((item) => {
        return {
          variance: item?.numTotal - (item?.numActualTotal || 0),
          ...item,
        };
      })
    );
    // eslint-disable-next-line
  }, [projectCostingExpense, projectCostingInventory]);
  // console.log(inventoryVariance);
  return (
    <>
      {loadingOnGetDescription && <Loading />}
      <div>
        <Modal
          show={show}
          onHide={onHide}
          size="xl"
          aria-labelledby="example-modal-sizes-title-xl"
        >
          {" "}
          <Modal.Header>
            {" "}
            <Modal.Title className="mt-3">Project Details</Modal.Title>
          </Modal.Header>{" "}
          <Modal.Body id="example-modal-sizes-title-xl">
            <>
              {" "}
              {/* general description */}
              <div className="container mt-3">
                <div className="row d-flex">
                  <div className="col-lg-3" style={{ marginLeft: "-1.8rem" }}>
                    <p>
                      <span className="fw-bold">Project Name: </span>
                      {projectDescription?.strProjectName || "N/A"}
                    </p>
                    <p>
                      <span className="fw-bold">Project Owner: </span>
                      {projectDescription?.strOwner || "N/A"}
                    </p>
                    <p>
                      <span className="fw-bold">Location: </span>
                      {projectDescription?.strLocation || "N/A"}
                    </p>
                  </div>
                  <div className="col-lg-3">
                    <p>
                      <span className="fw-bold">General Ledger: </span>
                      {projectDescription?.strGl || "N/A"}
                    </p>
                    <p>
                      <span className="fw-bold">Business Transaction: </span>
                      {projectDescription?.strSubGl || "N/A"}
                    </p>
                  </div>
                  <div className="col-lg-3">
                    <p>
                      <span className="fw-bold">Total Budget Cost: </span>
                      {expenseVariance?.reduce(
                        (sum, part) => sum + part?.numBudgetAmount,
                        0
                      ) -
                        inventoryVariance?.reduce(
                          (sum, part) => sum + part?.numTotal,
                          0
                        ) || 0}
                    </p>
                  </div>
                  <div className="col-lg-3">
                    <p>
                      <span className="fw-bold">Expected Revenue: </span>
                      {projectDescription?.numExpectedValue || 0}
                    </p>
                  </div>
                </div>
              </div>
              {/* team Section */}
              <div className="row mt-3" id="pdf-section">
                <div className="col-12">
                  {" "}
                  <p className="mb-0">
                    <span className="fw-bold">Team Details</span>
                  </p>
                </div>
                <div className="col-12">
                  <div className="print_wrapper">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 global-table table-font-size-sm">
                        {projectTeam?.length > 0 && (
                          <thead>
                            <tr>
                              <th style={{ width: "50px" }}>SL</th>
                              <th style={{ width: "100px" }}>
                                <div className="text-left ml-1">Team Name</div>
                              </th>
                              <th style={{ width: "100px" }}>
                                <div className="text-left ml-1">Role Name</div>
                              </th>
                            </tr>
                          </thead>
                        )}
                        <tbody>
                          {projectTeam?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-left">
                                {item?.strTeamMember || "N/A"}
                              </td>
                              <td className="text-left">
                                {item?.strRole || "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div></div>
                  </div>
                </div>
              </div>
              {/* team Section end*/}
              {/* expense section */}
              <div className="row mt-3" id="pdf-section">
                <div className="col-12">
                  {" "}
                  <p className="mb-0">
                    <span className="fw-bold">Expense Details</span>
                  </p>
                </div>
                <div className="col-12">
                  <div className="print_wrapper">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 global-table table-font-size-sm">
                        {expenseVariance?.length > 0 && (
                          <thead>
                            <tr>
                              <th style={{ width: "50px" }}>SL</th>
                              <th style={{ width: "100px" }}>
                                <div className="text-left ml-1">
                                  Porfit Center
                                </div>
                              </th>
                              <th style={{ width: "100px" }}>
                                <div className="text-left ml-1">
                                  Cost Center
                                </div>
                              </th>
                              <th style={{ width: "100px" }}>
                                <div className="text-left ml-1">
                                  Cost Element
                                </div>
                              </th>
                              <th style={{ width: "100px" }}>
                                <div className="text-left ml-1">
                                  Responsible
                                </div>
                              </th>
                              <th style={{ width: "100px" }}>
                                <div className="text-right mr-1">
                                  Budget Amount
                                </div>
                              </th>
                            </tr>
                          </thead>
                        )}
                        <tbody>
                          {expenseVariance?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-left">
                                {item?.strProfitCenter || "N/A"}
                              </td>
                              <td className="text-left">
                                {item?.strCostCenter || "N/A"}
                              </td>
                              <td className="text-left">
                                {item?.strCostElement || "N/A"}
                              </td>
                              <td className="text-left">
                                {item?.strResponsible || "N/A"}
                              </td>
                              <td className="text-right">
                                {item?.numBudgetAmount || "N/A"}
                              </td>
                            </tr>
                          ))}
                          {expenseVariance?.length > 0 && (
                            <tr>
                              <td colspan="5">Total</td>
                              <td className="text-right">
                                {expenseVariance?.reduce(
                                  (sum, part) =>
                                    sum + part?.numBudgetAmount || 0,
                                  0
                                ) || "N/A"}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div></div>
                  </div>
                </div>
              </div>
              {/*  expense end*/}
              {/* inventory section */}
              <div className="row mt-3 mb-5" id="pdf-section">
                <div className="col-12">
                  {" "}
                  <p className="mb-0">
                    <span className="fw-bold">Inventory Details</span>
                  </p>
                </div>
                <div className="col-lg-12">
                  <div className="print_wrapper">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 global-table table-font-size-sm">
                        {inventoryVariance?.length > 0 && (
                          <thead>
                            <tr>
                              <th style={{ width: "50px" }}>SL</th>
                              <th style={{ width: "100px" }}>Item Code</th>
                              <th style={{ width: "100px" }}>
                                <div className="text-left ml-1">Item Name</div>
                              </th>
                              <th style={{ width: "100px" }}>UOM</th>
                              <th style={{ width: "150px" }}>
                                <div className="text-right mr-1">
                                  Return Qty{" "}
                                </div>
                              </th>
                              <th style={{ width: "150px" }}>
                                <div className="text-right mr-1">
                                  Budget Qty
                                </div>
                              </th>

                              <th style={{ width: "150px" }}>
                                <div className="text-right mr-1">
                                  Budget Total
                                </div>
                              </th>
                            </tr>
                          </thead>
                        )}
                        <tbody>
                          {inventoryVariance?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">
                                {item?.strItemCode || "N/A"}
                              </td>
                              <td className="text-left">
                                {item?.strItem || "N/A"}
                              </td>
                              <td className="text-center">
                                {item?.strUom || "N/A"}
                              </td>
                              <td className="text-right">
                                {item?.numReturnQty || 0}
                              </td>
                              <td className="text-right">
                                {item?.numQty || 0}
                              </td>

                              <td className="text-right">
                                {item?.numTotal || 0}
                              </td>
                            </tr>
                          ))}
                          {projectCostingInventory?.length > 0 && (
                            <tr>
                              <td colspan="6">Total</td>
                              <td className="text-right">
                                {inventoryVariance?.reduce(
                                  (sum, part) => sum + part?.numTotal,
                                  0
                                )}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div></div>
                  </div>
                </div>
              </div>
              {/*  inventory end*/}
            </>
          </Modal.Body>{" "}
        </Modal>
      </div>
    </>
  );
}
