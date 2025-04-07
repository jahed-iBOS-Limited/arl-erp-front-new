import { Formik } from "formik";
import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { vslAndVoyNoValidationSchema } from "../../../../_helper/_validationSchema";
import ICustomTable from "../../../_chartinghelper/_customTable";
import { _dateFormatter } from "../../../_chartinghelper/_dateFormatter";
import IViewModal from "../../../_chartinghelper/_viewModal";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import IDelete from "../../../_chartinghelper/icons/_delete";
import { getVoyageDDLNew } from "../../../helper";
import {
  getBusinessPartnerDDL,
  getCostTypeDDL,
} from "../helper";
import CashReceiveForm from "./cashReceive";
import ServicePO from "./servicePo";
import AddCostTypeForm from "../../../next/shared/expense/Form/addCostType";

export default function FormCmp({
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
        validationSchema={vslAndVoyNoValidationSchema}
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

                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Transaction Date</label>
                        <FormikInput
                          value={values?.transactionDate}
                          name="transactionDate"
                          placeholder="Transaction Date"
                          type="date"
                          errors={errors}
                          touched={touched}
                        />
                      </div>

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
                      { name: "PO Code" },
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
                        <td className="text-right">{item?.purchaseOrderNo}</td>
                        {viewType === "view" && (
                          <td className="text-center">
                            {!item?.purchaseOrderNo && (
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
                            )}
                          </td>
                        )}
                        {viewType !== "view" && (
                          <td
                            className="text-center d-flex justify-content-center"
                          >
                            {(viewType === "edit" || !viewType) &&
                              !item?.purchaseOrderNo ? (
                              <div>
                                <IDelete remover={removeRow} id={index} />
                              </div>
                            ) : (
                              <div>&nbsp;</div>
                            )}
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
