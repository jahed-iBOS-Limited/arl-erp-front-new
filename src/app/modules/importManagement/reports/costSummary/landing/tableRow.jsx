import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import printIcon from "../../../../_helper/images/print-icon.png";
import { PurchaseOrderViewTableRow } from "../../../../procurement/purchase-management/purchaseOrder/report/tableRow";
import {
  getCostingSummary,
  getReportHeaderInfo,
  getShipmentDDL,
} from "../helper";
import Print from "./Print";
import ShipmenmtQuantityModal from "./shipmentQuantityModal";

const TableRow = ({ formCommonApproval }) => {
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [shipmentDDL, setShipmentDDL] = useState([]);
  const [headerInfo, setHeaderInfo] = useState([]);
  const [isPrintable, setIsPrintable] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowShipmentQuantity, setIsShowShipmentQuantity] = useState(false);
  const printRef = useRef();
  const [POLCNO, setPOLCNO] = useState({});
  const [Shipment, setShipment] = useState({});
  const [, approvalHandler, loadingApproveHandler] = useAxiosPost();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const header = [
    "SL",
    "Particulars",
    "Estimated Amount (BDT)",
    "Actual Amount (BDT)",
    "Variance (BDT)",
  ];

  const initData = {
    shipment: { value: 0, label: "All" },
  };

  const loadPoLc = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/imp/ImportCommonDDL/GetPONOLcNoforLCSummeryDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
      )
      .then((res) => res?.data);
  };

  const getReport = (values) => {
    getCostingSummary(
      values?.poLc?.poId,
      values?.poLc?.lcId,
      values?.shipment?.value,
      setRowDto,
      setLoader
    );
  };

  const getShipment = (poLc) => {
    getShipmentDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      poLc,
      setShipmentDDL,
      formCommonApproval
    );
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getReportHeaderInfo(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setHeaderInfo
      );
    }
  }, [profileData, selectedBusinessUnit]);

  // Calculation of Total Cost Including Vat And Tax
  const totalCostIncludingVatAndTax = () => {
    let total = 0;
    rowDto.forEach((item) => {
      if (item?.section === 1) {
        total += item.numBookedAmount;
      }
    });
    return total?.toFixed(4);
  };

  // Calculation of Total Deduction Of VAT And TAX
  const totalDeductionOfVatAndTax = () => {
    let total = 0;
    rowDto.forEach((item) => {
      if (item?.section === 2) {
        total += item.numBookedAmount;
      }
    });
    return total?.toFixed(4);
  };

  // Calculation of Net landing cost excluding VAT and TAX
  const netLandingCostExcludingVatAndTax =
    totalCostIncludingVatAndTax() - totalDeductionOfVatAndTax();
  return (
    <>
      {(loader || loadingApproveHandler) && <Loading />}
      <ICustomCard
        title="LC Cost Sheet"
        renderProps={() => (
          <div
            onClick={() => {
              setIsPrintable(true);
            }}
          >
            {formCommonApproval ? (
              <div>
                <button
                  disabled={
                    !POLCNO?.label || !Shipment?.label || !rowDto?.length
                  }
                  className="btn btn-primary"
                  onClick={() => {
                    approvalHandler(
                      `/imp/ImportReport/ApproveCommercialCoating`,
                      {
                        shipmentId: Shipment?.value || 0,
                        poId: POLCNO?.poId || 0,
                        approveBy: profileData?.userId,
                      },
                      () => {},
                      true
                    );
                  }}
                  type="button"
                >
                  Approve
                </button>
              </div>
            ) : (
              <ReactToPrint
                trigger={() => (
                  <button className="btn btn-primary">
                    <img
                      style={{ width: "25px", paddingRight: "5px" }}
                      src={printIcon}
                      alt="print-icon"
                    />
                    Print
                  </button>
                )}
                content={() => printRef.current}
                // onBeforeGetContent={()=>setIsPrintable(true)}
                onAfterPrint={() => {
                  setIsPrintable(false);
                }}
              />
            )}
          </div>
        )}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({ values, errors, touched, setFieldValue, dirty, isValid }) => (
            <>
              <Form className="form form-label-right">
                <div className="row global-form">
                  <div className="col-lg-3">
                    <label>PO/LC No</label>
                    <SearchAsyncSelect
                      selectedValue={values?.poLc}
                      handleChange={(valueOption) => {
                        setFieldValue("poLc", valueOption);
                        setPOLCNO(valueOption);
                        getShipment(valueOption?.label);
                        if (!valueOption) {
                          setRowDto([]);
                          setPOLCNO({});
                        }
                        setFieldValue("shipment", "");
                      }}
                      loadOptions={loadPoLc || []}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="shipment"
                      options={shipmentDDL || []}
                      value={values?.shipment}
                      onChange={(valueOption) => {
                        setFieldValue("shipment", valueOption);
                        setShipment(valueOption || {});
                        if (valueOption) {
                          setRowDto([]);
                        } else {
                          getCostingSummary(
                            values?.poLc?.poId,
                            values?.poLc?.lcId,
                            valueOption?.value,
                            setRowDto,
                            setLoader
                          );
                        }
                      }}
                      placeholder="Shipment"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 pt-5 mt-1">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => {
                        getReport(values);
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <Print
                  printRef={printRef}
                  headerInfo={headerInfo}
                  header={header}
                  rowDto={rowDto}
                  totalCostIncludingVatAndTax={totalCostIncludingVatAndTax}
                  totalDeductionOfVatAndTax={totalDeductionOfVatAndTax}
                  netLandingCostExcludingVatAndTax={
                    netLandingCostExcludingVatAndTax
                  }
                  values={values}
                  setIsShowModal={setIsShowModal}
                  isPrintable={isPrintable}
                  setIsShowShipmentQuantity={setIsShowShipmentQuantity}
                />
                <IViewModal
                  show={isShowModal}
                  onHide={() => setIsShowModal(false)}
                  title="View Purchase Order"
                >
                  <PurchaseOrderViewTableRow
                    poId={values?.poLc?.poId}
                    orId={values?.poLc?.poTypeId}
                    isHiddenBackBtn={true}
                  />
                </IViewModal>
                <IViewModal
                  show={isShowShipmentQuantity}
                  onHide={() => setIsShowShipmentQuantity(false)}
                  // title="View Purchase Order"
                >
                  <ShipmenmtQuantityModal
                    shipmentId={values?.shipment?.value}
                    checkbox={"shipmentInformation"}
                    poNo={values?.poLc?.label}
                    lcNo={values?.poLc?.lcNumber}
                  />
                </IViewModal>
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default TableRow;
