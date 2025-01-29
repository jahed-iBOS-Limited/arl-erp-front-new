/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useHistory, useLocation } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import TextArea from "../../../../_helper/TextArea";
import { approveOrRejectHandler } from "../helper";
import IViewModal from "../../../../_helper/_viewModal";
import Loading from "../../../../_helper/_loading";

export default function _Form({
  id,
  buId,
  accId,
  addRow,
  SOList,
  userId,
  rowData,
  loading,
  viewType,
  itemList,
  initData,
  deleteRow,
  setRowData,
  setLoading,
  saveHandler,
  channelList,
  getItemList,
  rowDataChange,
}) {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");
  const { state } = useLocation();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowData([]);
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
              {true && <ModalProgressBar />}
              <CardHeader
                title={`${
                  viewType === "edit"
                    ? "Edit"
                    : viewType === "view"
                    ? "View"
                    : "New"
                } Complain`}
              >
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
                      <button
                        type="reset"
                        onClick={() => {
                          setRowData([]);
                          resetForm(initData);
                        }}
                        className="btn btn-light ml-2"
                        disabled={viewType === "view"}
                      >
                        <i className="fa fa-redo"></i>
                        Reset
                      </button>
                    )}

                    {viewType === "view" ? (
                      !state?.isReject &&
                      !state?.salesHeadApprove && (
                        <div>
                          <button
                            type="button"
                            className="btn btn-danger ml-2"
                            onClick={() => {
                              setShow(true);
                              setStatus("reject");
                            }}
                            disabled={!rowData?.length}
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary ml-2"
                            onClick={() => {
                              setShow(true);
                              setStatus("approve");
                            }}
                            disabled={!rowData?.length}
                          >
                            Approve
                          </button>
                        </div>
                      )
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-primary ml-2"
                        onClick={handleSubmit}
                        disabled={!rowData?.length}
                      >
                        Save
                      </button>
                    )}
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      {!viewType && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="channel"
                            options={channelList || []}
                            value={values?.channel}
                            label="Distribution Channel"
                            onChange={(valueOption) => {
                              setFieldValue("channel", valueOption);
                              getItemList(
                                `/item/ItemSales/GetItemSalesByChannelAndWarehouseDDL?AccountId=${accId}&BUnitId=${buId}&DistributionChannelId=${valueOption?.value}&SalesOrgId=${values?.soName?.value}`
                              );
                            }}
                            placeholder="Distribution Channel"
                            errors={errors}
                            touched={touched}
                            isDisabled={viewType || rowData?.length}
                          />
                        </div>
                      )}
                      <div className="col-lg-3">
                        <label>Client Name</label>
                        <SearchAsyncSelect
                          selectedValue={values?.client}
                          handleChange={(valueOption) => {
                            setFieldValue("client", valueOption);
                          }}
                          isDisabled={!values?.channel || viewType}
                          placeholder="Search Client"
                          loadOptions={(v) => {
                            const searchValue = v.trim();
                            if (searchValue?.length < 3) return [];
                            return axios
                              .get(
                                `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.channel?.value}`
                              )
                              .then((res) => res?.data);
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Supply Date"
                          value={values?.supplyDate}
                          name="supplyDate"
                          placeholder="Supply Date"
                          type="date"
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Complain Date"
                          value={values?.complainDate}
                          name="complainDate"
                          placeholder="Complain Date"
                          type="date"
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Complain Type"
                          value={values?.complainType}
                          name="complainType"
                          placeholder="Complain Type"
                          type="text"
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Cause of Complain"
                          value={values?.causeOfComplain}
                          name="causeOfComplain"
                          placeholder="Cause of Complain"
                          type="text"
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Contact Person (Site)"
                          value={values?.contactPerson}
                          name="contactPerson"
                          placeholder="Contact Person (Site)"
                          type="text"
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Contact Number"
                          value={values?.contactNumber}
                          name="contactNumber"
                          placeholder="Contact Number"
                          type="text"
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>

                      <div className="col-lg-3">
                        <InputField
                          label="Site Address"
                          value={values?.siteAddress}
                          name="siteAddress"
                          placeholder="Site Address"
                          type="text"
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>

                      <div className="col-lg-6">
                        <label htmlFor="">Details</label>
                        <TextArea
                          label="Details"
                          value={values?.details}
                          name="details"
                          placeholder="Details"
                          type="text"
                          disabled={viewType === "view"}
                        />
                      </div>

                      <div className="col-12"></div>
                      {!viewType && (
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="soName"
                              options={SOList || []}
                              value={values?.soName}
                              label="Sales Organization"
                              onChange={(valueOption) => {
                                setFieldValue("soName", valueOption);
                                if (valueOption && values?.channel) {
                                  getItemList(
                                    `/item/ItemSales/GetItemSalesByChannelAndWarehouseDDL?AccountId=${accId}&BUnitId=${buId}&DistributionChannelId=${values?.channel?.value}&SalesOrgId=${valueOption?.value}`
                                  );
                                }
                              }}
                              placeholder="Select Sales Organization"
                              errors={errors}
                              touched={touched}
                              isDisabled={rowData?.length || !values?.channel}
                            />
                          </div>

                          <div className="col-lg-3">
                            <NewSelect
                              name="itemName"
                              options={itemList || []}
                              value={values?.itemName}
                              label="Item"
                              onChange={(valueOption) => {
                                setFieldValue("itemName", valueOption);
                              }}
                              placeholder="Select Item"
                              errors={errors}
                              touched={touched}
                              isDisabled={!values?.soName}
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              label="Delivered Quantity"
                              value={values?.deliveredQuantity}
                              name="deliveredQuantity"
                              placeholder="Delivered Quantity"
                              type="number"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              label="Client Measurement Quantity"
                              value={values?.clientMeasurementQuantity}
                              name="clientMeasurementQuantity"
                              placeholder="Client Measurement Quantity"
                              type="number"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              label="Work Order Quantity"
                              value={values?.workOrderQuantity}
                              name="workOrderQuantity"
                              placeholder="Work Order Quantity"
                              type="number"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              label="Problem Quantity"
                              value={values?.problemQuantity}
                              name="problemQuantity"
                              placeholder="Problem Quantity"
                              type="number"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          {!viewType && (
                            <>
                              <div className="col-lg-3 mt-5">
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => {
                                    addRow(values, () => {
                                      setFieldValue("itemName", "");
                                      setFieldValue("deliveredQuantity", "");
                                      setFieldValue(
                                        "clientMeasurementQuantity",
                                        ""
                                      );
                                      setFieldValue("workOrderQuantity", "");
                                      setFieldValue("problemQuantity", "");
                                    });
                                  }}
                                  disabled={
                                    !values?.itemName ||
                                    !values?.deliveredQuantity ||
                                    !values?.clientMeasurementQuantity ||
                                    !values?.workOrderQuantity ||
                                    !values?.problemQuantity
                                  }
                                >
                                  + Add
                                </button>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {rowData?.length > 0 && (
                <div className="table-responsive">
                      <table
                      className={
                        "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                      }
                    >
                      <thead>
                        <tr className="cursor-pointer">
                          <th>SL</th>
                          <th>Item</th>
                          <th>Delivered Qty</th>
                          <th>Client Measurement Qty</th>
                          <th>Work Order Qty</th>
                          <th>Problem Qty</th>
                          {!viewType && <th>Action</th>}
                        </tr>
                      </thead>
                      {rowData?.map((row, index) => (
                        <tr key={index}>
                          <td className="text-center" style={{ width: "40px" }}>
                            {index + 1}
                          </td>
                          <td>{row?.itemName}</td>
                          <td className="text-right" style={{ width: "150px" }}>
                            {viewType === "edit" ? (
                              <InputField
                                value={row?.deliverdQnt}
                                name="deliverdQnt"
                                type="number"
                                errors={errors}
                                touched={touched}
                                onChange={(e) => {
                                  rowDataChange(
                                    index,
                                    "deliverdQnt",
                                    e?.target?.value
                                  );
                                }}
                              />
                            ) : (
                              row?.deliverdQnt
                            )}
                          </td>
                          <td className="text-right" style={{ width: "150px" }}>
                            {viewType === "edit" ? (
                              <InputField
                                value={row?.clientMeasurementQnt}
                                name="clientMeasurementQnt"
                                type="number"
                                errors={errors}
                                touched={touched}
                                onChange={(e) => {
                                  rowDataChange(
                                    index,
                                    "clientMeasurementQnt",
                                    e?.target?.value
                                  );
                                }}
                              />
                            ) : (
                              row?.clientMeasurementQnt
                            )}
                          </td>
                          <td className="text-right" style={{ width: "150px" }}>
                            {viewType === "edit" ? (
                              <InputField
                                value={row?.workOrderQnt}
                                name="workOrderQnt"
                                type="number"
                                errors={errors}
                                touched={touched}
                                onChange={(e) => {
                                  rowDataChange(
                                    index,
                                    "workOrderQnt",
                                    e?.target?.value
                                  );
                                }}
                              />
                            ) : (
                              row?.workOrderQnt
                            )}
                          </td>
                          <td className="text-right" style={{ width: "150px" }}>
                            {viewType &&
                            !state?.isReject &&
                            !state?.salesHeadApprove ? (
                              <InputField
                                value={row?.problemQnt}
                                name="problemQnt"
                                type="number"
                                errors={errors}
                                touched={touched}
                                onChange={(e) => {
                                  rowDataChange(
                                    index,
                                    "problemQnt",
                                    e?.target?.value
                                  );
                                }}
                              />
                            ) : (
                              row?.problemQnt
                            )}
                          </td>

                          {!viewType && (
                            <td
                              className="text-center"
                              style={{ width: "60px" }}
                            >
                              <IDelete remover={deleteRow} id={index} />
                            </td>
                          )}
                        </tr>
                      ))}
                    </table>
                </div>
                  )}
                </Form>
              </CardBody>
            </Card>
            <IViewModal
              modelSize="md"
              show={show}
              onHide={() => setShow(false)}
            >
              {loading && <Loading />}
              <div className="form form-label-right">
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    onClick={() => {
                      approveOrRejectHandler(
                        values,
                        status === "approve" ? true : false,
                        userId,
                        !state?.tsdapprove
                          ? 1
                          : !state?.productionApprove
                          ? 2
                          : !state?.logisticApprove
                          ? 3
                          : !state?.plantHeadApprove
                          ? 4
                          : !state?.salesHeadApprove
                          ? 5
                          : 0,
                        rowData,
                        id,
                        buId,
                        setLoading,
                        () => {
                          setShow(false);
                        }
                      );
                    }}
                    className="btn btn-primary mt-1"
                    disabled={!values?.comment}
                  >
                    Done
                  </button>
                </div>

                <div className="row global-form ">
                  <div className="col-12">
                    <label htmlFor="">Comment</label>
                    <TextArea
                      value={values?.comment}
                      name="comment"
                      placeholder="Comment"
                      type="text"
                      rows="4"
                    />
                  </div>
                </div>
              </div>
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}
