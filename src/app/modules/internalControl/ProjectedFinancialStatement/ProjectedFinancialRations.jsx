import React, { useState } from "react";
import { dateFormatWithMonthName } from "../../_helper/_dateFormate";
import { _formatMoney } from "../../_helper/_formatMoney";
import BasicModal from "../../_helper/_BasicModal";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
const ProjectedFinancialRations = ({
  ratioTableData,
  componentTableData,
  values,
  selectedBusinessUnit,
}) => {
  const [isShowModel, setIsShowModel] = useState(false);
  const [formula, setFormula] = useState("");
  return (
    <div className="row">
      <div className="col-12 text-center">
        <h2>{selectedBusinessUnit}</h2>
        <h4 className="text-primary">Projected Financial Ratio</h4>
        <p>
          <strong>
            For the period from:{" "}
            <span>{dateFormatWithMonthName(values?.fromDate)}</span> To{" "}
            <span>{dateFormatWithMonthName(values?.toDate)}</span>
          </strong>
        </p>
      </div>
      <div className="col-lg-6">
        <h4>Financial Ratio</h4>
        <div className="table-responsive">
          <table className="table table-striped table-bordered bj-table bj-table-landing">
            <thead>
              <tr>
                <th>SL</th>
                <th>Rario Name</th>
                <th>Std Ratio</th>
                <th>Last Period</th>
                <th>Current Period</th>
                <th
                  style={{
                    width: 80,
                  }}
                >
                  Matric
                </th>
              </tr>
            </thead>
            <tbody>
              {ratioTableData?.length &&
                ratioTableData?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      style={{
                        fontWeight: Number.isInteger(item?.numSL || 0)
                          ? "bold"
                          : "",
                      }}
                    >
                      <>
                        <td className="text-right">{item?.numSL}</td>
                        <td className="text-left">{item?.strRarioName}</td>

                        <td className="text-right">
                          {item?.stdRatio ? item?.stdRatio : ""}
                        </td>
                        <td className="text-right">
                          {item?.numRatio ? item?.lastPeriod : ""}
                        </td>
                        <td className="text-right">
                          {item?.numRatio ? item?.numRatio : ""}
                        </td>
                        <td>
                          {item?.strMatric}
                          {!Number.isInteger(item?.numSL || 0) && (
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id="quick-user-tooltip">
                                  {item?.strFormula}
                                </Tooltip>
                              }
                            >
                              <span className="ml-2 cursor: pointer">
                                <i
                                  class="fa fa-info-circle"
                                  aria-hidden="true"
                                  onClick={() => {
                                    if (item?.strFormula !== "") {
                                      setFormula(item?.strFormula);
                                      setIsShowModel(true);
                                    } else {
                                      return toast.warn("No Formula Found");
                                    }
                                  }}
                                ></i>
                              </span>
                            </OverlayTrigger>
                          )}
                        </td>
                      </>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="col-lg-6">
        <h4>Financial Ratio Component</h4>
        <div className="table-responsive">
          <table className="table table-striped table-bordered bj-table bj-table-landing">
            <thead>
              <tr>
                <th>Com. Name</th>
                <th>Last Period</th>
                <th>Current Period</th>
              </tr>
            </thead>
            <tbody>
              {componentTableData?.length &&
                componentTableData?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <>
                        <td className="text-left">{item?.strComName}</td>
                        <td className="text-right">
                          {_formatMoney(Math.round(item?.numLastPeriod))}
                        </td>
                        <td className="text-right">
                          {_formatMoney(Math.round(item?.numAmount), 0)}
                        </td>
                      </>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <BasicModal
          open={isShowModel}
          handleOpen={() => setIsShowModel(true)}
          handleClose={() => {
            setIsShowModel(false);
          }}
          myStyle={{
            width: 300,
            height: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          hideBackdrop={true}
        >
          <h6 className="text-center">{formula}</h6>
        </BasicModal>
      </div>
    </div>
  );
};

export default ProjectedFinancialRations;
