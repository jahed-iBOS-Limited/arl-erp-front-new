import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { collectPayment, ValidationSchema, getSalesOrgList } from "../helper";

export default function _Form({
  initData,
  saveHandler,
  type,
  sbuDDL,
  partnerDDL,
  rowDto,
  setRowDto,
  rowDataHandler,
  getRowData,
  totalRentAmount,
  getTotalAmount,
  rowDtoById,
  setLoading,
  profileData,
  selectedBusinessUnit,
}) {
  const history = useHistory();
  const [salesOrgList, setSalesOrgList] = React.useState([]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={ValidationSchema}
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
          setValues,
        }) => (
          <>
            <Card>
              <CardHeader
                title={
                  type === "edit"
                    ? "Edit Asset Rent Invoice"
                    : type === "view"
                    ? "View Asset Rent Invoice"
                    : "Create Asset Rent Invoice"
                }
              >
                <CardHeaderToolbar>
                  <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={false ? "d-none" : "btn btn-light"}
                  >
                    <i className="fa fa-arrow-left"></i>
                    Back
                  </button>

                  <button
                    type="reset"
                    onClick={() => {
                      resetForm(initData);
                    }}
                    className={
                      type === "view" || type === "cash"
                        ? "d-none"
                        : "btn btn-light ml-2"
                    }
                  >
                    <i className="fa fa-redo"></i>
                    Reset
                  </button>
                  {`  `}
                  <button
                    type="submit"
                    className={
                      type === "view" || type === "cash"
                        ? "d-none"
                        : "btn btn-primary ml-2"
                    }
                    onClick={handleSubmit}
                    disabled={type === "view"}
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>

              <CardBody>
                <Form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="sbu"
                          options={sbuDDL}
                          value={values?.sbu}
                          label="SBU"
                          onChange={(valueOption) => {
                            setFieldValue("sbu", valueOption);
                            getSalesOrgList(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              valueOption?.value,
                              setSalesOrgList,
                              setLoading
                            );
                          }}
                          placeholder="SBU"
                          errors={errors}
                          touched={touched}
                          isDisabled={type}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="salesOrganization"
                          options={salesOrgList || []}
                          value={values?.salesOrganization}
                          label="Sales Organization"
                          onChange={(valueOption) => {
                            setFieldValue("salesOrganization", valueOption);
                          }}
                          placeholder="Sales Organization"
                          errors={errors}
                          touched={touched}
                          isDisabled={type || !values?.sbu}
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="partner"
                          options={partnerDDL}
                          value={values?.partner}
                          label="Customer"
                          onChange={(valueOption) => {
                            setFieldValue("partner", valueOption);
                          }}
                          placeholder="Customer"
                          errors={errors}
                          isDisabled={type}
                        />
                      </div>

                      <div className="col-lg-2">
                        <label>Date</label>
                        <InputField
                          value={values?.date}
                          name="date"
                          placeholder="Date"
                          type="date"
                          disabled={type}
                        />
                      </div>
                      {!type ? (
                        <div style={{ marginTop: "17px" }} className="col-lg-1">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              getRowData(values);
                            }}
                          >
                            View
                          </button>
                        </div>
                      ) : type === "cash" ? (
                        <div style={{ marginTop: "17px" }} className="col-lg-2">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              collectPayment(
                                values?.rentInvoiceId,
                                profileData?.userId,
                                values?.totalInvoiceAmount,
                                setLoading
                              );
                            }}
                          >
                            Payment Collection
                          </button>
                        </div>
                      ) : null}
                      <div
                        style={{
                          marginTop: "17px",
                          fontSize: "1rem",
                        }}
                        className="col-lg-2"
                      >
                        <b>
                          Total Rent Amount:{" "}
                          {totalRentAmount || values?.totalInvoiceAmount}
                        </b>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{ display: "none" }}
                    onSubmit={() => handleSubmit()}
                  ></button>

                  <button
                    type="reset"
                    style={{ display: "none" }}
                    onSubmit={() => resetForm(initData)}
                  ></button>
                </Form>
                {!type && rowDto?.length > 0 && (
                 <div className="table-responsive">
                   <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            name="isSelect"
                            // checked={allSelect}
                            value={false}
                            onChange={(e) => {
                              getTotalAmount(
                                rowDto?.map((item) => ({
                                  ...item,
                                  isSelect: e?.target?.checked,
                                }))
                              );
                              setRowDto(
                                rowDto?.map((item) => ({
                                  ...item,
                                  isSelect: e?.target?.checked,
                                }))
                              );
                            }}
                            id="isSelect"
                          />
                        </th>
                        <th>SL</th>
                        <th>Rent Type Name</th>
                        <th>Business Partner Name</th>
                        <th>SBU</th>
                        <th>Asset Name</th>
                        <th>Rent From Date</th>
                        <th>Rent To Date</th>
                        <th>Rent Rate</th>
                        <th>Rent Amount</th>
                        <th>Currency Name</th>
                        <th>Conversation Rate</th>
                        {/* <th>Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="checkbox"
                              name="isSelect"
                              value={item?.isSelect}
                              checked={item?.isSelect}
                              id="isSelect"
                              onChange={(e) => {
                                rowDataHandler(
                                  "isSelect",
                                  e?.target?.checked,
                                  index
                                );
                              }}
                            />
                          </td>
                          <td>
                            <div className="text-center">{index + 1}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.rentTypeName}</div>
                          </td>
                          <td>
                            <div className="pl-2">
                              {item?.businessPartnerName}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.sbuName}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.assetName}</div>
                          </td>
                          <td>
                            <div className="text-center">
                              {_dateFormatter(item?.rentFromDate)}
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              {item?.rentToDate
                                ? _dateFormatter(item?.rentToDate)
                                : "-"}
                            </div>
                          </td>
                          <td>
                            <div className="text-right">{item?.rentRate}</div>
                          </td>
                          <td>
                            <div className="text-right">{item?.rentAmount}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.currencyName}</div>
                          </td>
                          <td>
                            <div className="text-right">
                              {item?.currConversationRate}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                 </div>
                )}
                {type && rowDtoById?.length > 0 && (
                 <div className="table-responsive">
                   <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Rent Type Name</th>
                        <th>Rent From Date</th>
                        <th>Rent To Date</th>
                        <th>Rent Rate</th>
                        <th>Currency Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDtoById?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="text-center">{index + 1}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.rentTypeName}</div>
                          </td>
                          <td>
                            <div className="text-center">
                              {_dateFormatter(item?.rentFromDate)}
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              {item?.rentToDate
                                ? _dateFormatter(item?.rentToDate)
                                : "-"}
                            </div>
                          </td>
                          <td>
                            <div className="text-right">{item?.rentRate}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.currencyName}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
