/* eslint-disable no-mixed-operators */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import ReactToPrint from "react-to-print";
import Loading from "./../../../../_helper/loader/_loader";
import {
  getReportForInvReq,
  getReportForInvReqInternal,
  getReportForInvReqW2w,
  GetMESConfigurationBusinessUnitWiseByAccountId,
  getReportForCanceledMRR,
} from "../helper";
import {
  getSingleDataByForBackCalculation,
  getSingleDataById,
} from "./../../../../productionManagement/manufacturingExecutionSystem/productionEntry/helper";
import BackCalculationPEViewModal from "./../../../../productionManagement/manufacturingExecutionSystem/productionEntry/ViewForBackCalculation/ViewModal";
import ProductionEntryViewModal from "./../../../../productionManagement/manufacturingExecutionSystem/productionEntry/View/ViewModal";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ICustomCard from "../../../../_helper/_customCard";
import iMarineIcon from "../../../../_helper/images/imageakijpoly.png";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";
import ViewForm from "../attachmentView/viewForm";

let imageObj = {
  8: iMarineIcon,
};

// this component is used from multiple place , sometimes by modal , sometimes route of this components, do not change this component existing props name or existing routing dynamic parameter,You can add new props , new parameter, but don't change existing props name and routing parameter
export function InventoryTransactionReportViewTableRow({
  Invid,
  grId,
  currentRowData,
  forCanceledMRR,
}) {
  const [loading, setLoading] = useState(false);
  const [itemReqReport, setiIemReqReport] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [poData, setPOData] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [singleBackCalculationData, setSingleBackCalculationData] = useState(
    {}
  );
  const [singleData, setSingleData] = useState({});
  const [
    modalShowForBackCalculation,
    setModalShowForBackCalculation,
  ] = useState(false);

  const [data, setData] = useState({});
  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    if (forCanceledMRR) {
      getReportForCanceledMRR(
        Invid,
        selectedBusinessUnit?.value,
        setiIemReqReport
      );
    } else {
      if (+grId === 4) {
        getReportForInvReqW2w(Invid, setiIemReqReport);
      } else if (+grId === 9) {
        getReportForInvReqInternal(Invid, setiIemReqReport);
      } else {
        getReportForInvReq(
          Invid,
          selectedBusinessUnit?.value,
          setiIemReqReport
        );
      }
    }
  }, [Invid, grId, selectedBusinessUnit]);

  const printRef = useRef();

  let totalAmount = itemReqReport?.objRow?.reduce(
    (total, data) => total + Math.abs(data?.monTransactionValue),
    0
  );

  useEffect(() => {
    GetMESConfigurationBusinessUnitWiseByAccountId(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setData
    );
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <ICustomCard
        title=""
        renderProps={() => (
          <>
            <ReactToPrint
              pageStyle="@page { size: 8in 12in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
              trigger={() => (
                <button className="btn btn-primary">
                  {/* <img
                            style={{ width: "25px", paddingRight: "5px" }}
                            src={printIcon}
                            alt="print-icon"
                          /> */}
                  Print
                </button>
              )}
              content={() => printRef.current}
            />
            <ReactToPrint
              pageStyle="@page { size: 8in 12in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
              trigger={() => (
                <button className="btn btn-primary ml-2">PDF</button>
              )}
              content={() => printRef.current}
            />
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button btn btn-primary ml-2"
              table="table-to-xlsx"
              filename="tablexls"
              sheet="tablexls"
              buttonText="Excel"
            />
          </>
        )}
      >
        <Formik
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({ handleSubmit, resetForm, values, errors, touched, isValid }) => (
            <>
              {loading && <Loading />}
              <FormikForm>
                <div className="">
                  <div ref={printRef} className="print_wrapper">
                    <div className="m-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="d-flex justify-content-center align-items-center">
                            {selectedBusinessUnit.value === 8 && (
                              <img
                                style={{ width: "150px", height: "100px" }}
                                class=""
                                src={imageObj[selectedBusinessUnit?.value]}
                                alt="img"
                              />
                            )}
                            {/* imageObj[selectedBusinessUnit?.value] */}
                          </div>
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center mt-2">
                          <h3>{itemReqReport?.objHeader?.businessUnitName}</h3>
                          <h6>
                            {itemReqReport?.objHeader?.businessUnitAddress}
                          </h6>
                          <h4>Inventory Transaction</h4>
                        </div>
                        <div></div>
                      </div>
                      <div className="my-3">
                        Challan No:
                        {/* Transaction Code: */}
                        <span className="font-weight-bold mr-2 ml-1">
                          {itemReqReport?.objHeader?.inventoryTransactionCode}
                        </span>{" "}
                        GRn Date:
                        <span className="font-weight-bold mr-2 ml-1">
                          {_dateFormatter(
                            itemReqReport?.objHeader?.transectionDate
                          )}
                        </span>{" "}
                        Transaction Group Name:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {itemReqReport?.objHeader?.transactionGroupName}
                        </sapn>
                        Transaction Type Name:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {itemReqReport?.objHeader?.transactionTypeName}
                        </sapn>
                        Reference Type Name:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {itemReqReport?.objHeader?.referenceTypeName}
                        </sapn>
                      </div>
                      <div className="my-3">
                        Reference Code:
                        <sapn
                          className="font-weight-bold mr-2 ml-1"
                          style={
                            currentRowData?.transactionTypeId === 14
                              ? {
                                  color: "blue",
                                  borderBottom: "1px solid",
                                  cursor: "pointer",
                                }
                              : {}
                          }
                          onClick={() => {
                            if (data?.isBackCalculation) {
                              setModalShowForBackCalculation(true);
                              getSingleDataByForBackCalculation(
                                itemReqReport?.objHeader?.referenceId,
                                setSingleBackCalculationData
                              );
                            } else {
                              setModalShow(true);
                              getSingleDataById(
                                itemReqReport?.objHeader?.referenceId,
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                setSingleData
                              );
                            }
                          }}
                        >
                          {itemReqReport?.objHeader?.referenceCode
                            ? itemReqReport?.objHeader?.referenceCode
                            : "NA"}
                        </sapn>
                        Business Partner Name:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {itemReqReport?.objHeader?.businessPartnerName
                            ? itemReqReport?.objHeader?.businessPartnerName
                            : "NA"}
                        </sapn>
                        Cost Center Name:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {itemReqReport?.objHeader?.costCenterName
                            ? itemReqReport?.objHeader?.costCenterName
                            : "NA"}
                        </sapn>
                        Project Name:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {itemReqReport?.objHeader?.projectName
                            ? itemReqReport?.objHeader?.projectName
                            : "NA"}
                        </sapn>
                        Personnel Name:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {itemReqReport?.objHeader?.personnelName
                            ? itemReqReport?.objHeader?.personnelName
                            : "NA"}
                        </sapn>
                      </div>
                      <div className="my-3">
                        {/* {itemReqReport?.objHeader?.transactionGroupId === 1 && ( */}
                        <>
                          Adjustment Journal Code:
                          <sapn className="font-weight-bold mr-2 ml-1">
                            {itemReqReport?.objHeader?.adjustmentJournalCode
                              ? itemReqReport?.objHeader?.adjustmentJournalCode
                              : "NA"}
                          </sapn>
                          Challan:
                          <sapn className="font-weight-bold mr-2 ml-1">
                            {itemReqReport?.objHeader?.challan
                              ? itemReqReport?.objHeader?.challan
                              : "NA"}
                          </sapn>
                          Challan Date:
                          <sapn className="font-weight-bold mr-2 ml-1">
                            {itemReqReport?.objHeader?.challanDateTime
                              ? _dateFormatter(
                                  itemReqReport?.objHeader?.challanDateTime
                                )
                              : "NA"}
                          </sapn>
                          Vat Challan:
                          <sapn className="font-weight-bold mr-2 ml-1">
                            {itemReqReport?.objHeader?.vatChallan
                              ? itemReqReport?.objHeader?.vatChallan
                              : "NA"}
                          </sapn>
                          Vat Amount:
                          <sapn className="font-weight-bold mr-2 ml-1">
                            {itemReqReport?.objHeader?.vatAmount
                              ? itemReqReport?.objHeader?.vatAmount
                              : 0}
                          </sapn>
                          Others Charge:
                          <sapn className="font-weight-bold mr-2 ml-1">
                            {itemReqReport?.objHeader?.othersCharge || 0}
                          </sapn>
                          Gate Entry NO:
                          <sapn className="font-weight-bold mr-2 ml-1">
                            {itemReqReport?.objHeader?.gateEntryNo
                              ? itemReqReport?.objHeader?.gateEntryNo
                              : "NA"}
                          </sapn>
                        </>
                        {/* )} */}
                        Comments:
                        <sapn className="font-weight-bold mr-2 ml-1">
                          {itemReqReport?.objHeader?.comments
                            ? itemReqReport?.objHeader?.comments
                            : "NA"}
                        </sapn>
                        <>
                          Attachment
                          <sapn className="font-weight-bold mr-2 ml-1">
                            <IView
                              title="Attachment"
                              clickHandler={() => {
                                setPOData({
                                  inventoryTransactionId:
                                    itemReqReport?.objHeader
                                      ?.inventoryTransactionId,
                                  inventoryTransactionCode:
                                    itemReqReport?.objHeader
                                      ?.inventoryTransactionCode,
                                });
                                setIsShowModal(true);
                              }}
                            />
                          </sapn>
                        </>
                        <div className="text-right">
                          <b>Total Amount : </b>{" "}
                          {(
                            (+itemReqReport?.objHeader?.vatAmount || 0) +
                            (+totalAmount || 0)
                          ).toFixed(4)}
                        </div>
                        {+grId === 9 && (
                          <>
                            Plant Name:
                            <sapn className="font-weight-bold mr-2 ml-1">
                              {itemReqReport?.objHeader?.plantName}
                            </sapn>
                            Warehouse Name:
                            <sapn className="font-weight-bold mr-2 ml-1">
                              {itemReqReport?.objHeader?.warehouseName}
                            </sapn>
                          </>
                        )}
                      </div>
                      {+grId === 4 ? (
                        ""
                      ) : +grId === 9 ? (
                        ""
                      ) : (
                        <div className="table-responsive">
                          <table
                            className="table table-striped table-bordered global-table"
                            id="table-to-xlsx"
                          >
                            <thead>
                              <tr>
                                <th>SL</th>
                                <th>Item Code</th>
                                <th>Item Name</th>
                                <th>Uom</th>
                                <th>Location</th>
                                <th>Bin Number</th>
                                <th>Quantity</th>
                                <th>Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {itemReqReport?.objRow?.map((data, i) => (
                                <tr>
                                  <td className="text-center">{i + 1}</td>
                                  <td>{data?.itemCode}</td>
                                  <td>{data?.itemName}</td>
                                  <td>{data?.uomName}</td>
                                  <td style={{ width: "150px" }}>
                                    {data?.inventoryLocationName}
                                  </td>
                                  <td style={{ width: "150px" }}>
                                    {data?.binNumber}
                                  </td>
                                  <td className="text-right">
                                    {Math.abs(
                                      data?.numTransactionQuantity
                                    ).toFixed(4)}
                                  </td>
                                  {/* <td className="text-right">{data?.currentStock}</td> */}
                                  <td className="text-right">
                                    {Math.abs(data?.monTransactionValue)}
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td></td>
                                {/* <td></td>
                            <td></td>
                            <td></td>
                            <td></td> */}
                                <td colspan="5"></td>
                                <td className="font-weight-bold">Total</td>
                                {/* <td className="text-right">{data?.currentStock}</td> */}
                                <td className="text-right">
                                  {totalAmount?.toFixed(4)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                      {+grId === 4 && (
                        <div className="table-responsive">
                          <table
                            className="table table-striped table-bordered global-table"
                            id="table-to-xlsx"
                          >
                            <thead>
                              <tr>
                                <th>SL</th>
                                <th>Item ID</th>
                                <th>Item Name</th>

                                <th>Quantity</th>
                                <th>From Plant</th>
                                <th>To Plant</th>
                                <th>From Warehouse</th>
                                <th>To Warehouse</th>
                                <th>Location Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {itemReqReport?.transRows?.map((data, i) => (
                                <tr>
                                  <td className="text-center">{i + 1}</td>
                                  <td className="text-right">{data?.itemId}</td>
                                  <td>{data?.itemName}</td>

                                  <td className="text-right">
                                    {Math.abs(
                                      data?.transactionQuantity
                                    ).toFixed(4)}
                                  </td>
                                  <td>{data?.fromPlantName}</td>
                                  <td>{data?.toPlantName}</td>
                                  <td>{data?.fromWarehouseName}</td>
                                  <td>{data?.toWarehouseName}</td>
                                  {/* <td className="text-right">{data?.currentStock}</td> */}
                                  <td>{data?.fromLocationName}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {+grId === 9 && (
                        <div className="table-responsive">
                          <table
                            className="table table-striped table-bordered global-table"
                            id="table-to-xlsx"
                          >
                            <thead>
                              <tr>
                                <th>SL</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Receive Quantity</th>
                                <th>From Location</th>
                                <th>To Location</th>
                              </tr>
                            </thead>
                            <tbody>
                              {itemReqReport?.objRow?.map((data, i) => (
                                <tr>
                                  <td className="text-center">{i + 1}</td>
                                  <td>{data?.itemName}</td>
                                  <td>
                                    {Math.abs(data?.numTransactionQuantity)}
                                  </td>
                                  <td>{data?.receiveQuantity}</td>
                                  <td>{data?.fromLocationName}</td>
                                  <td>{data?.toLocationName}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="mt-3">
                        <div className="d-flex">
                          <p>Request By:</p>
                          <p className="font-weight-bold ml-2">
                            {
                              itemReqReport?.objHeader
                                ?.actionByNameDesignationDept
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <IViewModal
                      title="Attachment"
                      show={isShowModal}
                      onHide={() => setIsShowModal(false)}
                    >
                      <ViewForm
                        poData={poData}
                        setIsShowModal={setIsShowModal}
                      />
                    </IViewModal>
                  </div>

                  <ProductionEntryViewModal
                    data={singleData}
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                  />
                  <BackCalculationPEViewModal
                    data={singleBackCalculationData}
                    show={modalShowForBackCalculation}
                    onHide={() => setModalShowForBackCalculation(false)}
                  />
                </div>
              </FormikForm>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}
