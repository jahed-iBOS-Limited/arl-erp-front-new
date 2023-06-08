import React, { useState } from "react";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import IView from "./../../../../_helper/_helperIcons/_view";
import IViewModal from "./../../../../_helper/_viewModal";
import document from "./document.svg";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { GetTreasuryDepositLogDetails_api } from "./../helper";
import moment from "moment";
import MultipleViewTreasuryDeposit from './multipleView/multipleViewTreasuryDeposit';
import TresuaryDepositViewModal from './../../../transaction/tresuaryDeposit/View/viewForm';
const TreasuryDepositModel = ({ rowDto, parentRowClickData }) => {
  const [modelShow, setModelShow] = useState(false);
  const [landing, setLoading] = useState(false);
  const [modelShowAll, setModelShowAll] = useState(false);
  // const [viewClick, setViewClick] = useState({});
  const [singleData, setSingleData] = useState("");
  return (
    <>
      <OverlayTrigger
        overlay={<Tooltip id="cs-icon">{"Details All Log"}</Tooltip>}
      >
        <img
          src={document}
          alt={"document"}
          onClick={() => {
            setModelShowAll(true);
          }}
          style={{
            width: "18px",
            position: "absolute",
            top: "1px",
            right: "22px",
            cursor: "pointer",
          }}
        />
      </OverlayTrigger>

      <div>
        <div className="row global-table">
          <div className="col-lg-12 pr-0 pl-0">
            <table className="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th style={{ width: "35px" }}>S/N</th>
                  <th style={{ width: "150px" }}>Tresuary Code</th>
                  <th>Tresuary Date</th>
                  <th>Depositor Name</th>
                  <th>Deposit Amount</th>
                  <th>Action By</th>
                  <th>Activity</th>
                  <th>Modify No</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((tableData, index) => {
                  return (
                    <tr key={index}>
                      <td> {index + 1} </td>
                      <td> {tableData?.treasuryCode} </td>
                      <td> {_dateFormatter(tableData?.depositDate)} </td>
                      <td className="text-right">
                        {" "}
                        {tableData?.depositorName}{" "}
                      </td>
                      <td className="text-right">
                        {" "}
                        {_fixedPoint(tableData?.depositAmount)}{" "}
                      </td>
                      <td> {tableData?.createdBy} </td>
                      <td> {tableData?.activity} </td>
                      <td> {tableData?.modifedNo} </td>
                      <td>
                        <span className="d-flex justify-content-center align-items-center">
                          <span
                            onClick={() => {
                              // setViewClick(tableData);
                              setModelShow(true);
                              GetTreasuryDepositLogDetails_api(
                                tableData?.logId,
                                setSingleData,
                                setLoading
                              );
                            }}
                          >
                            <IView />
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {modelShow && (
          <IViewModal
            show={modelShow}
            onHide={() => {
              setModelShow(false);
            }}
            title={'View "Treasury Deposit Log"'}
            btnText="Close"
            isShow={landing}
          >
            <div className="mt-8">
              <p className="p-0 m-0">
                <b>Activity</b>: {singleData?.activity}{" "}
              </p>
              <p className="p-0 m-0">
                <b>Action Date/Time</b>:{" "}
                {moment(singleData?.activityTime).format("DD-MMM-YY, LTS")}
              </p>
            </div>
            <TresuaryDepositViewModal id={true} singleData={singleData} />
          </IViewModal>
        )}
        {modelShowAll && (
          <IViewModal
            show={modelShowAll}
            onHide={() => {
              setModelShowAll(false);
            }}
            title={'View "Treasury Deposit Log (Details All)"'}
            btnText="Close"
          >
            <MultipleViewTreasuryDeposit parentRowClickData={parentRowClickData}/>
          </IViewModal>
        )}
      </div>
    </>
  );
};

export default TreasuryDepositModel;
