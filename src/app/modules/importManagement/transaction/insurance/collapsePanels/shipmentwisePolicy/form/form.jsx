import React from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../../../_helper/_select";
import InputField from "../../../../../../_helper/_inputField";
import ICustomTable from "../../../../../../_helper/_customTable";
// import IEdit from "../../../../../../_helper/_helperIcons/_edit";
import { useHistory } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../../../_metronic/_partials/controls";
import { _dateFormatter } from "../../../../../../_helper/_dateFormate";
import { validationSchema } from "../helper";
import numberWithCommas from "../../../../../../_helper/_numberWithCommas";
import IView from "../../../../../../_helper/_helperIcons/_view";
// import { toast } from "react-toastify";
import IEdit from "./../../../../../../_helper/_helperIcons/_edit";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  edit,
  shipmentDDL,
  gridData,
  // policyNumber,
  poNumber,
  routeState
}) {
  // Table headers
  const header = [
    "SL",
    "PO No",
    "Shipment No",
    "Policy Number",
    "Bill No",
    "Amount",
    "Policy Date",
    "Action",
  ];

  // const { state } = useLocation();
  // const policyNumber = state?.policyNumber

  const history = useHistory();

  //this function is for taking decision about title...
  const getTitle = (routeState) => {
    if (routeState === "view") {
      return "View Shipment Wise Insurance Policy";
    } else if (routeState === "edit") {
      return "Edit Shipment Wise Insurance Policy";
    } else {
      return "Shipment Wise Insurance Policy";
    }
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
          isValid,
        }) => (
          <>
            <Card>
              {console.log('values: ', values)}
              {true && <ModalProgressBar />}
              <CardHeader title={getTitle(routeState)}>
                <CardHeaderToolbar>
                  <button
                    type="reset"
                    ref={resetBtnRef}
                    className="btn btn-light ml-2"
                  >
                    <i className="fa fa-redo"></i>
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary ml-2"
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>

              <CardBody>
                <div className="d-flex justify-content-center align-items-center">
                  <div style={{ fontWeight: "900" }}>PO Number:{poNumber}</div>
                </div>
                <Form className="form form-label-right">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row global-form">
                        <>
                          <div className="col-lg-3">
                            <label>Shipment</label>
                            <NewSelect
                              name="shipment"
                              options={shipmentDDL || []}
                              value={values?.shipment}
                              onChange={(valueOption) => {
                                setFieldValue("shipment", valueOption);
                                setFieldValue(
                                  "invoiceAmount",
                                  valueOption?.invoiceAmount
                                );
                              }}
                              errors={errors}
                              touched={touched}
                              isDisabled={edit}
                            />
                          </div>
                          <div className="col-lg-3">
                            <label>Policy Number</label>
                            <InputField
                              value={values?.policyNumber}
                              placeholder="Policy Number"
                              name="policyNumber"
                              disabled={routeState === 'view'}
                              onChange={(valueOption) => {
                                setFieldValue(
                                  "policyNumber",
                                  valueOption?.target?.value.startsWith(
                                    values?.policyNumberActual
                                  )
                                    ? valueOption?.target?.value
                                    : values?.policyNumberActual
                                );
                              }}
                            />
                          </div>
                          <div className="col-lg-3">
                            <label>Policy Date</label>
                            <InputField
                              placeholder="Policy Date"
                              name="policyDate"
                              type="date"
                              value={values?.policyDate}
                              disabled={routeState === "view"}
                            />
                          </div>
                          <div className="col-lg-3">
                            <label>Bill No</label>
                            <InputField
                              value={values?.billNo}
                              placeholder="Bill No"
                              name="billNo"
                              type="text"
                              disabled={routeState === "view"}
                            />
                          </div>
                          <div className="col-lg-3">
                            <label>Invoice Amount</label>
                            <InputField
                              // value={values?.invoiceAmount}
                              value={numberWithCommas(values?.invoiceAmount)}
                              placeholder="Invoice Amount"
                              name="invoiceAmount"
                              type="text"
                              // min={0}
                              disabled={true}
                              // onChange={(e) => {
                              //   setFieldValue(
                              //     "totalAmount",
                              //     parseInt(
                              //       parseInt(values?.vat ? values?.vat : 0) +
                              //         parseInt(
                              //           e?.target?.value ? e?.target?.value : 0
                              //         )
                              //         +
                              //         parseInt(
                              //           values?.insuredBDT
                              //             ? values?.insuredBDT
                              //             : 0
                              //         )
                              //     )
                              //   );
                              //   setFieldValue(
                              //     "invoiceAmount",
                              //     parseInt(e?.target?.value)
                              //   );
                              // }}
                            />
                          </div>
                          {/* <div className="col-lg-3">
                            <label>Insured BDT</label>
                            <InputField
                              value={values?.insuredBDT}
                              placeholder="Insured BDT"
                              name="insuredBDT"
                              type="number"
                              min={0}
                              onChange={(e) => {
                                setFieldValue(
                                  "totalAmount",
                                  parseInt(
                                    parseInt(
                                      values?.invoiceAmount
                                        ? values?.invoiceAmount
                                        : 0
                                    ) +
                                      parseInt(
                                        e?.target?.value ? e?.target?.value : 0
                                      ) +
                                      parseInt(values?.vat ? values?.vat : 0)
                                  )
                                );
                                setFieldValue("insuredBDT", e?.target?.value);
                              }}
                            />
                          </div> */}
                          <div className="col-lg-3">
                            <label>Total Amount (Including VAT)</label>
                            <InputField
                              placeholder="Total Amount"
                              name="totalAmount"
                              value={values?.totalAmount}
                              type="number"
                              step="any"
                              min="0"
                              disabled={edit}
                              // onBlur={(e) => {
                              //   if (
                              //     Number(e?.target?.value) < Number(values?.vat)
                              //   ) {
                              //     toast.warning(
                              //       "Total Amount can't be less than VAT Amount"
                              //     );
                              //   }
                              // }}
                            />
                          </div>

                          <div className="col-lg-3">
                            <label>VAT</label>
                            <InputField
                              placeholder="VAT"
                              name="vat"
                              type="number"
                              min="0"
                              step="any"
                              value={values?.vat}
                              disabled={edit}
                              // onBlur={(e) => {
                              //   if (
                              //     Number(e?.target?.value) >
                              //     Number(values?.totalAmount)
                              //   ) {
                              //     toast.warning(
                              //       "VAT can't be greater than Total Amount"
                              //     );
                              //   }
                              // }}
                              // onChange={(e) => {
                              //   setFieldValue(
                              //     "totalAmount",
                              //     parseInt(
                              //       parseInt(
                              //         values?.invoiceAmount
                              //           ? values?.invoiceAmount
                              //           : 0
                              //       ) +
                              //         parseInt(
                              //           e?.target?.value ? e?.target?.value : 0
                              //         ) +
                              //         parseInt(
                              //           values?.insuredBDT
                              //             ? values?.insuredBDT
                              //             : 0
                              //         )
                              //     )
                              //   );
                              //   setFieldValue("vat", e?.target?.value);
                              // }}
                            />
                          </div>

                          <div className="col-lg-3">
                            <label>Due Date</label>
                            <InputField
                              value={values?.dueDate}
                              placeholder="Due Date"
                              name="dueDate"
                              type="date"
                              disabled={routeState === "view"}
                              // error={errors}
                              // touched={touched}
                            />
                          </div>
                        </>
                      </div>
                    </div>
                  </div>
                  {!edit && (
                    <ICustomTable ths={header}>
                      {gridData?.length > 0 &&
                        gridData?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: "30px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>
                                <span className="pl-2">{item?.poNumber}</span>
                              </td>
                              <td>
                                <span className="pl-2">
                                  {item?.shipmentCode}
                                </span>
                              </td>
                              <td>
                                <span className="pl-2">
                                  {item?.policyNumber}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className="pl-2">{item?.billNumber}</span>
                              </td>
                              <td className="text-right">
                                <span className="pl-2">
                                  {numberWithCommas(item?.numTotalAmount)}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className="pl-2">
                                  {_dateFormatter(item?.dtePolicyDate)}
                                </span>
                              </td>

                              <td
                                style={{ width: "100px" }}
                                className="text-center"
                              >
                                <span
                                  className="edit p-1"
                                  onClick={(e) =>
                                    history.push({
                                      pathname: `/managementImport/transaction/insurance-policy/view/${item?.shipmentId}`,
                                      state: {
                                        checkbox: "shipmentWiseInsurancePolicy",
                                        routeState: "view",
                                        item: item,
                                      },
                                    })
                                  }
                                >
                                  <IView />
                                </span>
                                <span
                                  className="edit ml-3"
                                  onClick={(e) =>
                                    history.push({
                                      pathname: `/managementImport/transaction/insurance-policy/edit/${item?.shipmentId}`,
                                      state: {
                                        checkbox: "shipmentWiseInsurancePolicy",
                                        routeState: "edit",
                                        item: item,
                                      },
                                    })
                                  }
                                >
                                  <IEdit />
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </ICustomTable>
                  )}

                  <button
                    type="submit"
                    style={{ display: "none" }}
                    ref={btnRef}
                    onSubmit={() => handleSubmit()}
                  ></button>
                  <button
                    type="reset"
                    style={{ display: "none" }}
                    ref={resetBtnRef}
                    // onSubmit={() => resetForm(initData)}
                  ></button>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
