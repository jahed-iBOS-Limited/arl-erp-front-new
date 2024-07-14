import React, { useState } from "react";
import { Formik } from "formik";
import {
  getBusinessPartnerDDL,
  getCostTypeDDL,
  validationSchema,
} from "../helper";
import { useHistory } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import AddCostTypeForm from "./addCostType";
import CashReceiveForm from "./cashReceive";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import { getVoyageDDLNew } from "../../../helper";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import ICustomTable from "../../../_chartinghelper/_customTable";
import { _formatMoney } from "../../../_chartinghelper/_formatMoney";
import IDelete from "../../../_chartinghelper/icons/_delete";
import IViewModal from "../../../_chartinghelper/_viewModal";
import { _dateFormatter } from "../../../_chartinghelper/_dateFormatter";
import ServicePO from "./servicePo";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  vesselDDL,
  setLoading,
  rowData,
  removeRow,
  addRow,
  costTypeDDL,
  setCostTypeDDL,
  businessPartnerDDL,
  setBusinessPartnerDDL,
  selectedBusinessUnit,
  profileData,
  setRowData,
}) {
  const history = useHistory();
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [open, setOpen] = useState(false);
  const [businessPartnerLabel, setBusinessPartnerLabel] = useState("");
  const [show, setShow] = useState(false);
  // const [singleRow, setSingleRow] = useState({});
  const [isShowPoModal, setIsShowPoModal] = useState(false);
  const [singleData, setSingleData] = useState({});

  const setBPLabel = (businessPartnerTypeId) => {
    let label = "";
    switch (businessPartnerTypeId) {
      case 4:
        label = "Agency";
        break;
      case 9:
        label = "Surveyor";
        break;
      case 10:
        label = "Weather Routing";
        break;
      case 12:
        label = "Security Guard";
        break;
      case 11:
        label = "Lighterage";
        break;
      default:
        break;
    }
    setBusinessPartnerLabel(label);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
        }) => (
          <>
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>{title}</p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={"btn btn-secondary px-3 py-2"}
                  >
                    <i className="fa fa-arrow-left pr-1"></i>
                    Back
                  </button>
                  {viewType !== "view" && viewType !== "cash" && (
                    <button
                      type="button"
                      onClick={() => resetForm(initData)}
                      className={"btn btn-info reset-btn ml-2 px-3 py-2"}
                    >
                      Reset
                    </button>
                  )}
                  {viewType !== "view" && viewType !== "cash" && (
                    <button
                      type="submit"
                      className={"btn btn-primary ml-2 px-3 py-2"}
                      onClick={handleSubmit}
                      disabled={!rowData?.length}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vesselName || ""}
                      isSearchable={true}
                      options={vesselDDL || []}
                      styles={customStyles}
                      name="vesselName"
                      placeholder="Vessel Name"
                      label="Vessel Name"
                      onChange={(valueOption) => {
                        setFieldValue("vesselName", valueOption);
                        setValues({ ...initData, vesselName: valueOption });
                        setFieldValue("voyageNo", "");
                        setVoyageNoDDL([]);
                        if (valueOption) {
                          getVoyageDDLNew({
                            accId: profileData?.accountId,
                            buId: selectedBusinessUnit?.value,
                            id: valueOption?.value,
                            setter: setVoyageNoDDL,
                            setLoading: setLoading,
                            hireType: 0,
                            isComplete: 2,
                            voyageTypeId: 0,
                          });
                        }
                      }}
                      isDisabled={viewType || rowData?.length}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.voyageNo || ""}
                      isSearchable={true}
                      options={voyageNoDDL || []}
                      styles={customStyles}
                      name="voyageNo"
                      placeholder="Voyage No"
                      label="Voyage No"
                      onChange={(valueOption) => {
                        setFieldValue("voyageNo", valueOption);

                        if (valueOption) {
                          getCostTypeDDL(
                            valueOption?.voyageTypeID,
                            setCostTypeDDL,
                            setLoading
                          );
                        }
                        setValues({
                          ...initData,
                          vesselName: values?.vesselName,
                          voyageNo: valueOption,
                          voyageType: valueOption?.voyageTypeName || "",
                        });
                      }}
                      isDisabled={
                        viewType || !values?.vesselName || rowData?.length
                      }
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Voyage Type</label>
                    <FormikInput
                      value={values?.voyageType}
                      name="voyageType"
                      placeholder="Voyage Type"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  {viewType !== "view" && viewType !== "cash" && (
                    <>
                      <div className="col-lg-2">
                        <FormikSelect
                          value={values?.costType || ""}
                          isSearchable={true}
                          options={costTypeDDL || []}
                          styles={customStyles}
                          name="costType"
                          placeholder="Cost Type"
                          label="Cost Type"
                          onChange={(valueOption) => {
                            setFieldValue("costType", valueOption);
                            setFieldValue("businessPartner", "");
                            setBusinessPartnerDDL([]);
                            setBPLabel(valueOption?.stackHolderTypeId);
                            getBusinessPartnerDDL(
                              selectedBusinessUnit?.value,
                              values?.voyageNo?.value,
                              valueOption?.stackHolderTypeId || 0,
                              setBusinessPartnerDDL,
                              setLoading
                            );
                          }}
                          isDisabled={!values?.voyageNo}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-1 mt-4">
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="plus-icon">
                              Add a new cost type
                            </Tooltip>
                          }
                        >
                          <i
                            onClick={() => {
                              setOpen(true);
                            }}
                            className="fas fa-plus-circle fa-2x"
                            style={{ color: "#007bff", cursor: "pointer" }}
                          ></i>
                        </OverlayTrigger>
                      </div>

                      {values?.costType && businessPartnerLabel && (
                        <div className="col-lg-3">
                          <FormikSelect
                            value={values?.businessPartner || ""}
                            isSearchable={true}
                            options={businessPartnerDDL || []}
                            styles={customStyles}
                            name="businessPartner"
                            placeholder={businessPartnerLabel}
                            label={businessPartnerLabel}
                            onChange={(valueOption) => {
                              setFieldValue("businessPartner", valueOption);
                            }}
                            isDisabled={!values?.voyageNo}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}
                      <div className="col-lg-3">
                        <label>Cost Amount</label>
                        <FormikInput
                          value={values?.costAmount}
                          name="costAmount"
                          placeholder="Cost Amount"
                          type="text"
                          errors={errors}
                          touched={touched}
                          // onChange={(e) => {
                          //   setFieldValue("advanceAmount", e?.target?.value);
                          //   setFieldValue(
                          //     "dueAmount",
                          //     Number(values?.totalAmount) -
                          //       Number(e?.target?.value)
                          //   );
                          // }}
                          // onBlur={(e) => {
                          //   if (
                          //     Number(e?.target?.value) >
                          //     Number(values?.totalAmount)
                          //   ) {
                          //     toast.warn(
                          //       "Advance amount cannot be greater than final amount"
                          //     );
                          //   }
                          // }}
                        />
                      </div>
                      {/* {(values?.costType?.value === 15 ||
                        values?.costType?.value === 16) && (
                        <div className="col-lg-3">
                          <label>Advance Amount</label>
                          <FormikInput
                            value={values?.advanceAmount}
                            name="advanceAmount"
                            placeholder="Advance Amount"
                            type="text"
                            errors={errors}
                            touched={touched}
                            // onChange={(e) => {
                            //   setFieldValue("advanceAmount", e?.target?.value);
                            //   setFieldValue(
                            //     "dueAmount",
                            //     Number(values?.totalAmount) -
                            //       Number(e?.target?.value)
                            //   );
                            // }}
                            // onBlur={(e) => {
                            //   if (
                            //     Number(e?.target?.value) >
                            //     Number(values?.totalAmount)
                            //   ) {
                            //     toast.warn(
                            //       "Advance amount cannot be greater than final amount"
                            //     );
                            //   }
                            // }}
                          />
                        </div>
                      )} */}
                      {/* {values?.costType &&
                        values?.costType?.value !== 15 &&
                        values?.costType?.value !== 16 && (
                          <div className="col-lg-3">
                            <label>Final Amount</label>
                            <FormikInput
                              value={values?.totalAmount}
                              name="totalAmount"
                              placeholder="Final Amount"
                              type="text"
                              errors={errors}
                              touched={touched}
                              // onChange={(e) => {
                              //   setFieldValue("totalAmount", e?.target?.value);
                              //   setFieldValue(
                              //     "dueAmount",
                              //     Number(e?.target?.value) -
                              //       Number(values?.advanceAmount)
                              //   );
                              // }}
                            />
                          </div>
                        )} */}

                      <div className="col-lg-3">
                        <label>Transaction Date</label>
                        <FormikInput
                          value={values?.transactionDate}
                          name="transactionDate"
                          placeholder="Transaction Date"
                          type="date"
                          errors={errors}
                          touched={touched}
                          // disabled={true}
                        />
                      </div>

                      {/* <div className="col-lg-3">
                        <label>Due Amount</label>
                        <FormikInput
                          value={values?.dueAmount}
                          name="dueAmount"
                          placeholder="Due Amount"
                          type="text"
                          errors={errors}
                          touched={touched}
                          disabled={true}
                        />
                      </div> */}

                      <div className="col-lg-3 mt-5">
                        <button
                          className="btn btn-primary px-3 py-2"
                          type="button"
                          onClick={() => {
                            addRow(values, setFieldValue);
                          }}
                          disabled={
                            !values?.costType ||
                            !values?.voyageNo ||
                            !values?.vesselName ||
                            !values?.costAmount
                          }
                        >
                          Add
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {rowData?.length > 0 && (
                <>
                  <ICustomTable
                    ths={[
                      { name: "SL" },
                      { name: "Cost Type Name" },
                      { name: "Transaction Date" },
                      { name: "Cost Amount" },
                      // { name: "Advance Amount" },
                      // { name: "Final Amount" },
                      // { name: "Paid Amount" },
                      // { name: "Due Amount" },
                      // viewType !== "view" && { name: "Action" },
                      { name: "Action" },
                    ]}
                  >
                    {rowData?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>{item?.costName}</td>
                        <td>{_dateFormatter(item?.entryDate)}</td>

                        <td className="text-right">
                          {_formatMoney(item?.costAmount)}
                        </td>
                        {viewType === "view" && !item?.purchaseOrderNo && (
                          <td className="text-center">
                            <div className="btn-container">
                              <button
                                type="button"
                                className="btn btn-primary "
                                onClick={() => {
                                  setIsShowPoModal(true);
                                  setSingleData(item);
                                }}
                              >
                                PO Create
                              </button>
                            </div>
                          </td>
                        )}
                        {/* <td className="text-right">
                          {_formatMoney(item?.totalAmount)}
                        </td> */}
                        {/* <td className="text-right">
                          {_formatMoney(item?.paidAmount)}
                        </td>
                        <td className="text-right">
                          {_formatMoney(item?.dueAmount)}
                        </td> */}
                        {viewType !== "view" && (
                          <td
                            className="text-center d-flex justify-content-center"
                            // style={{ maxWidth: "120px" }}
                          >
                            {(viewType === "edit" || !viewType) &&
                              !item?.purchaseOrderNo && (
                                <IDelete remover={removeRow} id={index} />
                              )}
                            {/* {(viewType === "edit" || viewType === "cash") && (
                              <div className="d-flex justify-content-center">
                                <span style={{ opacity: "0%" }}>
                                  <i className="fas fa-lg fa-hand-holding-usd ml-3"></i>{" "}
                                </span>

                                {(item?.costId === 15 || item?.costId === 16) &&
                                  !item?.totalAmount && (
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip id="cs-icon">
                                          Pay/Receive
                                        </Tooltip>
                                      }
                                    >
                                      <div
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          setSingleRow(item);
                                          setShow(true);
                                        }}
                                      >
                                        <i className="fas fa-lg fa-hand-holding-usd ml-3"></i>{" "}
                                      </div>
                                    </OverlayTrigger>
                                  )}
                              </div>
                            )} */}
                          </td>
                        )}
                      </tr>
                    ))}
                  </ICustomTable>
                </>
              )}
            </form>
            <IViewModal show={open} onHide={() => setOpen(false)} size="md">
              <AddCostTypeForm
                setOpen={setOpen}
                value={values}
                setLoading={setLoading}
                setCostTypeDDL={setCostTypeDDL}
                getCostTypeDDL={getCostTypeDDL}
              />
            </IViewModal>
            <IViewModal show={show} onHide={() => setShow(false)}>
              <CashReceiveForm
                title="Cash Payment/Receive"
                setShow={setShow}
                setLoading={setLoading}
                // singleRow={singleRow}
                setRowData={setRowData}
              />
            </IViewModal>

            <IViewModal
              show={isShowPoModal}
              onHide={() => setIsShowPoModal(false)}
            >
              <ServicePO
                isShowPoModal={isShowPoModal}
                setIsShowPoModal={setIsShowPoModal}
                singleData={singleData}
                setSingleData={setSingleData}
                setCostTypeDDL={setCostTypeDDL}
                setRowData={setRowData}
              />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}
