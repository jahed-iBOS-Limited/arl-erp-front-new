/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useHistory } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import {
  monthDDL,
  yearsDDL,
} from "../../../../inventoryManagement/warehouseManagement/liftingEntry/form/addEditForm";
import NewSelect from "../../../../_helper/_select";
import { validationSchema } from "../helper";
import InputField from "../../../../_helper/_inputField";
import IViewModal from "../../../../_helper/_viewModal";
import AddCompanyForm from "./addCompany";

export default function _Form({
  rowData,
  viewType,
  initData,
  areaList,
  regionList,
  saveHandler,
  channelList,
  territoryList,
  rowDtoHandler,
  onChangeHandler,
}) {
  const history = useHistory();
  const [show, setShow] = useState(false);

  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
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
        }) => (
          <>
            <Card>
              <ModalProgressBar />
              <CardHeader title={`Market Share Entry`}>
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
                    {viewType !== "view" && (
                      <>
                        <button
                          type="reset"
                          onClick={() => {
                            resetForm(initData);
                          }}
                          className="btn btn-light ml-2"
                          disabled={viewType === "view"}
                        >
                          <i className="fa fa-redo"></i>
                          Reset
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary ml-2"
                          onClick={handleSubmit}
                          // disabled={rowData?.length < 1}
                        >
                          Save
                        </button>
                      </>
                    )}
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {/* header section */}
                  <div className="global-form">
                    <div className="row">
                      {!viewType && (
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="channel"
                              options={channelList || []}
                              value={values?.channel}
                              label="Distribution Channel"
                              onChange={(e) => {
                                onChangeHandler(
                                  "channel",
                                  values,
                                  e,
                                  setFieldValue
                                );
                              }}
                              placeholder="Distribution Channel"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <NewSelect
                              name="region"
                              options={regionList || []}
                              value={values?.region}
                              label="Region"
                              onChange={(e) => {
                                onChangeHandler(
                                  "region",
                                  values,
                                  e,
                                  setFieldValue
                                );
                              }}
                              placeholder="Region"
                              errors={errors}
                              touched={touched}
                              isDisabled={!values?.channel}
                            />
                          </div>
                          <div className="col-lg-3">
                            <NewSelect
                              name="area"
                              options={areaList || []}
                              value={values?.area}
                              label="Area"
                              onChange={(e) => {
                                onChangeHandler(
                                  "area",
                                  values,
                                  e,
                                  setFieldValue
                                );
                              }}
                              placeholder="Area"
                              errors={errors}
                              touched={touched}
                              isDisabled={!values?.region}
                            />
                          </div>
                        </>
                      )}
                      <div className="col-lg-3">
                        <NewSelect
                          name="territory"
                          options={territoryList || []}
                          value={values?.territory}
                          label="Territory"
                          onChange={(valueOption) => {
                            setFieldValue("territory", valueOption);
                          }}
                          placeholder="Territory"
                          errors={errors}
                          touched={touched}
                          isDisabled={
                            !values?.region || !values?.area || viewType
                          }
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="month"
                          options={monthDDL}
                          value={values?.month}
                          label="Month"
                          onChange={(valueOption) => {
                            setFieldValue("month", valueOption);
                          }}
                          placeholder="Month"
                          errors={errors}
                          touched={touched}
                          isDisabled={viewType}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="year"
                          options={yearsDDL}
                          value={values?.year}
                          label="Year"
                          onChange={(valueOption) => {
                            setFieldValue("year", valueOption);
                          }}
                          placeholder="Year"
                          errors={errors}
                          touched={touched}
                          isDisabled={viewType}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Row Section */}
                  {/* <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3 d-flex">
                        <NewSelect
                          name="company"
                          options={companyList || []}
                          value={values?.company}
                          label="Company"
                          onChange={(valueOption) => {
                            setFieldValue("company", valueOption);
                          }}
                          placeholder="Company"
                          errors={errors}
                          touched={touched}
                        />

                        {viewType !== "view" ? (
                          <ICon
                            classes="mt-5 pt-2 ml-2"
                            title="Add a new company "
                            onClick={() => {
                              setShow(true);
                            }}
                          >
                            <i
                              class="fas fa-plus-circle"
                              style={{ color: "#3699FF" }}
                            ></i>
                          </ICon>
                        ) : null}
                      </div>

                      <div className="col-lg-3">
                        <InputField
                          label="Sales Qty"
                          value={values?.salesQty}
                          name="salesQty"
                          placeholder="Sales Qty"
                          type="number"
                          min={0}
                          disabled={disableHandler()}
                        />
                      </div>
                      <div className="col-lg-3 mt-5">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => {
                            addRow(values, () => {
                              setFieldValue("company", "");
                              setFieldValue("salesQty", "");
                            });
                          }}
                          disabled={!values?.company || !values?.salesQty}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div> */}
                  <div className="row">
                    <div className="col-lg-6">
                      {rowData?.length > 0 && (
                       <div className="table-responsive">
                         <table
                          id="table-to-xlsx"
                          className={
                            "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                          }
                        >
                          <thead>
                            <tr className="cursor-pointer">
                              {["SL", "Company Name", "Sales Qty"]?.map(
                                (th, i) => {
                                  return <th key={i}> {th} </th>;
                                }
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {rowData?.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td
                                    style={{ width: "40px" }}
                                    className="text-center"
                                  >
                                    {index + 1}
                                  </td>
                                  <td>{item?.companyName}</td>
                                  <td style={{ width: "140px" }}>
                                    <InputField
                                      value={item?.quantity}
                                      name="quantity"
                                      placeholder="Sales Qty"
                                      type="number"
                                      min={0}
                                      disabled={viewType === "view"}
                                      onChange={(e) => {
                                        rowDtoHandler(
                                          index,
                                          "quantity",
                                          e?.target?.value
                                        );
                                      }}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                       </div>
                      )}
                    </div>
                    <div className="col-lg-6"></div>
                  </div>
                </Form>
              </CardBody>
            </Card>
            <IViewModal
              modelSize={"md"}
              show={show}
              onHide={() => setShow(false)}
            >
              <AddCompanyForm setShow={setShow} />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}
