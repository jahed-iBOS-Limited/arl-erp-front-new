import { Form, Formik } from "formik";
import moment from "moment";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { validationSchema } from "../helper";
import ReactHtmlTableToExcel from "react-html-table-to-excel";

export default function _Form({
  accId,
  buId,
  type,
  title,
  rowData,
  initData,
  allSelect,
  selectedAll,
  saveHandler,
  motherVesselDDL,
  onChangeHandler,
  rowDataHandler,
  domesticPortDDL,
  getVessels,
  organizationDDL,
}) {
  const { state } = useLocation();
  const history = useHistory();
  const disableHandler = () => {
    return type;
  };

  const view = type === "view";

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, ...state }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm();
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
        }) => (
          <>
            <Card>
              <ModalProgressBar />
              <CardHeader title={title}>
                <CardHeaderToolbar>
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        history.goBack();
                      }}
                      className="btn btn-light"
                    >
                      <i className="fa fa-arrow-left"></i>
                      Back
                    </button>
                    {type !== "view" && (
                      <button
                        type="reset"
                        onClick={() => {
                          resetForm(initData);
                        }}
                        className="btn btn-light ml-2"
                        disabled={type === "view"}
                      >
                        <i className="fa fa-redo"></i>
                        Reset
                      </button>
                    )}

                    {type !== "view" && (
                      <button
                        type="submit"
                        className="btn btn-primary ml-2"
                        onClick={handleSubmit}
                        disabled={false}
                      >
                        {type === "edit" ? "Add" : `Save`}
                      </button>
                    )}
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form global-form-custom">
                    <div className="col-lg-3">
                      <NewSelect
                        name="organization"
                        options={
                          organizationDDL
                          //   [
                          //   { value: 73244, label: "G2G BADC" },
                          //   { value: 73245, label: "G2G BCIC" },
                          // ]
                        }
                        value={values?.organization}
                        label="Organization"
                        onChange={(valueOption) => {
                          setFieldValue("organization", valueOption);
                        }}
                        placeholder="Organization"
                        errors={errors}
                        touched={touched}
                        isDisabled={disableHandler()}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="loadingPort"
                        options={domesticPortDDL || []}
                        value={values?.loadingPort}
                        label="Port"
                        placeholder="Port"
                        onChange={(valueOption) => {
                          setFieldValue("loadingPort", valueOption);
                          getVessels({
                            ...values,
                            loadingPort: valueOption,
                          });
                        }}
                        isDisabled={!values?.organization}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="motherVessel"
                        options={motherVesselDDL}
                        value={values?.motherVessel}
                        label="Mother Vessel"
                        onChange={(e) => {
                          onChangeHandler(
                            "motherVessel",
                            values,
                            e,
                            setFieldValue
                          );
                        }}
                        placeholder="Mother Vessel"
                        errors={errors}
                        touched={touched}
                        isDisabled={disableHandler()}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Program No</label>
                      <InputField
                        value={values?.programNo}
                        name="programNo"
                        placeholder="Program No"
                        type="text"
                        disabled
                      />
                    </div>

                    {/* <div className="col-lg-3">
                      <InputField
                        label="Customer Pass No"
                        value={values?.customerPassNo}
                        name="customerPassNo"
                        placeholder="Customer Pass No"
                        type="text"
                        disabled={disableHandler()}
                      />
                    </div> */}
                    <div className="col-12 text-right mt-3">
                      <h5>
                        Total Quantity:{" "}
                        {_fixedPoint(
                          rowData
                            ?.filter((item) => item?.isSelected)
                            ?.reduce((a, b) => (a += b?.surveyQty), 0),
                          true,
                          0
                        )}
                      </h5>
                    </div>
                  </div>
                </Form>

                {rowData?.length > 0 && (
                  <div className="row">
                    <div className="col-md-12">
                      <>
                        <div className="text-right">
                          <ReactHtmlTableToExcel
                            id="test-table-xls-button-att-reports"
                            className="btn btn-primary"
                            table={"table-to-xlsx"}
                            filename={"Loading Information"}
                            sheet={"Loading Information"}
                            buttonText="Export Excel"
                          />
                        </div>
                        <div className="table-responsive">
                          <table
                            id="table-to-xlsx"
                            className={
                              "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                            }
                          >
                            <thead>
                              <tr className="cursor-pointer">
                                {!type && (
                                  <th
                                    onClick={() => allSelect(!selectedAll())}
                                    style={{ width: "30px" }}
                                  >
                                    <input
                                      type="checkbox"
                                      value={selectedAll()}
                                      checked={selectedAll()}
                                      onChange={() => {}}
                                    />
                                  </th>
                                )}
                                {[
                                  "SL",
                                  "Lighter Vessel",
                                  "Item Name",
                                  "Boat Note",
                                  "Side At",
                                  "Loading Start",
                                  "Quantity",
                                  "Loading Complete",
                                  "Sailing Date",
                                ]?.map((th, index) => {
                                  return <th key={index}> {th} </th>;
                                })}
                              </tr>
                            </thead>
                            <tbody>
                              {rowData?.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    {!type && (
                                      <td
                                        onClick={() => {
                                          rowDataHandler(
                                            "isSelected",
                                            index,
                                            !item.isSelected
                                          );
                                        }}
                                        className="text-center"
                                        style={
                                          item?.isSelected
                                            ? {
                                                backgroundColor: "#aacae3",
                                                width: "30px",
                                              }
                                            : { width: "30px" }
                                        }
                                      >
                                        <input
                                          type="checkbox"
                                          value={item?.isSelected}
                                          checked={item?.isSelected}
                                          onChange={() => {}}
                                        />
                                      </td>
                                    )}
                                    <td
                                      style={{ width: "30px" }}
                                      className="text-center"
                                    >
                                      {index + 1}
                                    </td>
                                    <td>{item?.lighterVessel}</td>
                                    <td>{item?.itemName}</td>
                                    <td style={{ minWidth: "70px" }}>
                                      {view ? (
                                        item?.boatNote
                                      ) : (
                                        <InputField
                                          value={item?.boatNote}
                                          name="boatNote"
                                          type="text"
                                          onChange={(e) => {
                                            rowDataHandler(
                                              "boatNote",
                                              index,
                                              e?.target?.value
                                            );
                                          }}
                                        />
                                      )}
                                    </td>
                                    <td style={{ maxWidth: "190px" }}>
                                      {view ? (
                                        moment(item?.sideAt).format("lll")
                                      ) : (
                                        <InputField
                                          style={{
                                            width: "130px",
                                          }}
                                          value={item?.sideAt}
                                          name="sideAt"
                                          type="datetime-local"
                                          onChange={(e) => {
                                            rowDataHandler(
                                              "sideAt",
                                              index,
                                              e?.target?.value
                                            );
                                          }}
                                        />
                                      )}
                                    </td>
                                    <td style={{ maxWidth: "190px" }}>
                                      {view ? (
                                        item?.loadingStart ? (
                                          moment(item?.loadingStart).format(
                                            "lll"
                                          )
                                        ) : (
                                          ""
                                        )
                                      ) : (
                                        <InputField
                                          style={{
                                            width: "130px",
                                          }}
                                          value={item?.loadingStart}
                                          name="loadingStart"
                                          type="datetime-local"
                                          onChange={(e) => {
                                            rowDataHandler(
                                              "loadingStart",
                                              index,
                                              e?.target?.value
                                            );
                                          }}
                                        />
                                      )}
                                    </td>
                                    <td
                                      className="text-right"
                                      style={{ width: "100px" }}
                                    >
                                      {view ? (
                                        _fixedPoint(item?.surveyQty, true)
                                      ) : (
                                        <InputField
                                          value={item?.surveyQty}
                                          name="surveyQty"
                                          type="number"
                                          onChange={(e) => {
                                            rowDataHandler(
                                              "surveyQty",
                                              index,
                                              +e?.target?.value
                                            );
                                          }}
                                        />
                                      )}
                                    </td>
                                    <td style={{ maxWidth: "190px" }}>
                                      {view ? (
                                        item?.loadingComplete ? (
                                          moment(item?.loadingComplete).format(
                                            "lll"
                                          )
                                        ) : (
                                          ""
                                        )
                                      ) : (
                                        <InputField
                                          style={{
                                            width: "130px",
                                          }}
                                          value={item?.loadingComplete}
                                          name="loadingComplete"
                                          type="datetime-local"
                                          onChange={(e) => {
                                            rowDataHandler(
                                              "loadingComplete",
                                              index,
                                              e?.target?.value
                                            );
                                          }}
                                        />
                                      )}
                                    </td>
                                    <td style={{ maxWidth: "190px" }}>
                                      {view ? (
                                        item?.sailingDate ? (
                                          moment(item?.sailingDate).format(
                                            "lll"
                                          )
                                        ) : (
                                          ""
                                        )
                                      ) : (
                                        <InputField
                                          style={{
                                            width: "130px",
                                          }}
                                          value={item?.sailingDate}
                                          name="sailingDate"
                                          type="datetime-local"
                                          onChange={(e) => {
                                            rowDataHandler(
                                              "sailingDate",
                                              index,
                                              e?.target?.value
                                            );
                                          }}
                                        />
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
