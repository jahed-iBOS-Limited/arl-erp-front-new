/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { validationSchema } from "../helper";
import IDelete from "../../../../_helper/_helperIcons/_delete";

export default function _Form({
  portDDL,
  rowData,
  viewType,
  initData,
  getVessels,
  lighterDDL,
  pendingQty,
  saveHandler,
  shipPointDDL,
  motherVesselDDL,
  onChangeHandler,
  lighterDestinationDDL,
  dateWiseQuantity,
  getDateWiseQuantity,
  setDateWiseQuantity,
  state,
  organizationDDL,
}) {
  // const [unloadedQty, setUnloadedQty] = useState("");
  useEffect(() => {
    if (initData?.voyageNo && initData?.lighterVessel?.value) {
      getDateWiseQuantity(
        `/tms/LigterLoadUnload/ViewLighterUnloadingInfoByVoyageNo?VoyageNo=${initData?.voyageNo}&LighterVesselId=${initData?.lighterVessel?.value}&shipPointId=${initData?.shipPoint?.value}&RowId=${state?.rowId}`
      );
    }
  }, [initData?.voyageNo, initData?.lighterVesselId]);
  const history = useHistory();
  const disableHandler = () => {
    if (viewType === "modify") {
      return false;
    } else if (viewType === "edit") {
      return false;
    } else if (viewType) {
      return true;
    } else {
      return false;
    }
  };

  const rowDtoHandler = (name, value, index, i) => {
    const data = { ...dateWiseQuantity };
    if (!value) {
      data["rowDataList"][index]["unLoadDetails"][i][name] = "";
      setDateWiseQuantity(data);
      return;
    }
    data["rowDataList"][index]["unLoadDetails"][i][name] = value;
    setDateWiseQuantity(data);
  };

  const minDate = () => {
    let today = new Date();

    let preDate = new Date();
    preDate.setDate(today.getDate() - 1);

    return preDate.toISOString().slice(0, 16);
  };

  const handleDelete = (index, subIndex) => {
    const newData = dateWiseQuantity.rowDataList.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          unLoadDetails: item.unLoadDetails.filter((_, j) => j !== subIndex)
        };
      }
      return item;
    }).filter(item => item.unLoadDetails.length > 0);

    setDateWiseQuantity((prevState) => ({
      ...prevState,
      rowDataList: newData,
    }));
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={viewType === "modify" ? { ...initData } : initData}
        onSubmit={(values, { resetForm }) => {
          if (!values?.unloadingDate)
            return toast.warn("Unloading Date is required");
          saveHandler(values, () => {
            if (viewType !== "modify") {
              resetForm(initData);
            }
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
              <CardHeader title={`Unloading Information`}>
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
                          disabled={false}
                        >
                          Save
                        </button>{" "}
                      </>
                    )}
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      {!viewType && (
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="organization"
                              options={
                                organizationDDL
                                // [ { value: 73244, label: "G2G BADC" },
                                // { value: 73245, label: "G2G BCIC" },]
                              }
                              value={values?.organization}
                              label="Organization"
                              onChange={(valueOption) => {
                                setFieldValue("organization", valueOption);
                              }}
                              placeholder="Organization"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <NewSelect
                              name="port"
                              options={portDDL || []}
                              value={values?.port}
                              label="Port"
                              placeholder="Port"
                              onChange={(valueOption) => {
                                setFieldValue("port", valueOption);
                                getVessels({
                                  ...values,
                                  port: valueOption,
                                });
                              }}
                              isDisabled={!values?.organization}
                            />
                          </div>
                        </>
                      )}
                      <div className="col-lg-3">
                        <NewSelect
                          name="lighterDestination"
                          options={lighterDestinationDDL}
                          value={values?.lighterDestination}
                          label="Lighter Destination"
                          onChange={(e) => {
                            onChangeHandler(
                              "lighterDestination",
                              values,
                              e,
                              setFieldValue
                            );
                          }}
                          placeholder="Lighter Destination"
                          errors={errors}
                          touched={touched}
                          isDisabled={
                            viewType === "modify" ? true : disableHandler()
                          }
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
                          isDisabled={
                            viewType === "modify" ? true : disableHandler()
                          }
                        />
                      </div>
                      {/* <div className="col-lg-3">
                        <InputField
                          label="Program No"
                          placeholder="Program No"
                          value={values?.programNo}
                          name="programNo"
                          type="text"
                          disabled={true}
                        />
                      </div> */}
                      <div className="col-lg-3">
                        <NewSelect
                          name="programNo"
                          options={[]}
                          value={values?.programNo}
                          label="Program No"
                          placeholder="Program No"
                          errors={errors}
                          touched={touched}
                          isDisabled={true}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="lighterVessel"
                          options={lighterDDL}
                          value={values?.lighterVessel}
                          label="Lighter Vessel"
                          onChange={(e) => {
                            onChangeHandler(
                              "lighterVessel",
                              values,
                              e,
                              setFieldValue
                            );
                          }}
                          placeholder="Lighter"
                          errors={errors}
                          touched={touched}
                          isDisabled={
                            viewType === "modify" ? true : disableHandler()
                          }
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipPoint"
                          options={shipPointDDL}
                          value={values?.shipPoint}
                          label="ShipPoint"
                          onChange={(e) => {
                            onChangeHandler(
                              "shipPoint",
                              values,
                              e,
                              setFieldValue
                            );
                            getDateWiseQuantity(
                              `/tms/LigterLoadUnload/ViewLighterUnloadingInfoByVoyageNo?VoyageNo=${values?.voyageNo ||
                                0}&LighterVesselId=${
                                values?.lighterVessel?.value
                              }&shipPointId=${e?.value}&RowId=${state?.rowId ||
                                0}`
                            );
                          }}
                          placeholder="ShipPoint"
                          errors={errors}
                          touched={touched}
                          isDisabled={disableHandler()}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="item"
                          options={[]}
                          value={values?.item}
                          label="Item"
                          placeholder="Item"
                          isDisabled={true}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Received At"
                          value={values?.receivedAt}
                          name="receivedAt"
                          type="datetime-local"
                          disabled={disableHandler()}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Unloading Start"
                          value={values?.unloadingStart}
                          name="unloadingStart"
                          type="datetime-local"
                          disabled={disableHandler()}
                        />
                      </div>
                      {viewType === "view" && values?.unloadingComplete && (
                        <div className="col-lg-3">
                          <InputField
                            label="Unloading Completion Date"
                            value={values?.unloadingComplete}
                            name="unloadingComplete"
                            type="datetime-local"
                            disabled={viewType === "view"}
                          />
                        </div>
                      )}
                      <div className="col-12"></div>
                      {viewType !== "view" && (
                        <>
                          <div className="col-lg-3">
                            <InputField
                              label="Unloading Date"
                              value={values?.unloadingDate}
                              name="unloadingDate"
                              type="date"
                              disabled={viewType === "view"}
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              label="Unloaded Qty"
                              value={values?.unloadedQty}
                              name="unloadedQty"
                              placeholder="Unloaded Qty"
                              type="number"
                              min={0}
                              disabled={
                                viewType === "view" || viewType === "modify"
                              }
                            />
                          </div>
                          <div className="col-lg-3 mt-5 d-flex align-items-center">
                            <input
                              type="checkbox"
                              id="isComplete"
                              name="isComplete"
                              value={values?.isComplete}
                              checked={values?.isComplete}
                              onChange={(e) => {
                                setFieldValue("isComplete", e.target.checked);
                              }}
                              disabled={viewType === "view"}
                            />
                            <label htmlFor="isComplete" className="pl-1">
                              Unloading Complete
                            </label>
                          </div>
                          {values?.isComplete && (
                            <div className="col-lg-3">
                              <InputField
                                label="Unloading Completion Date"
                                value={values?.unloadingComplete}
                                name="unloadingComplete"
                                type="datetime-local"
                                disabled={viewType === "view"}
                                min={minDate()}
                              />
                            </div>
                          )}
                          {/* { viewType === "edit" ||  && ( */}
                          <div className="col-lg-12 mt-5">
                            <h5>
                              <b>Loaded Qty: </b>
                              {pendingQty?.loadQty}, <b>Unloaded Qty: </b>
                              {pendingQty?.unLoadQty},{" "}
                              <b>Pending for Unload Qty: </b>
                              {pendingQty?.pendingQty}
                            </h5>
                          </div>
                          {/* )} */}
                        </>
                      )}
                    </div>
                  </div>
                </Form>
                <div className="row">
                  {viewType === "view" ? (
                    <div className="col-md-6">
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
                                {[
                                  "SL",
                                  // "Unloading Date",
                                  "Item Name",
                                  "Quantity",
                                ]?.map((th, index) => {
                                  return <th key={index}> {th} </th>;
                                })}
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
                                    {/* <td className="text-center">
                                  {_dateFormatter(item?.unloadingDate)}
                                </td> */}
                                    <td>{item?.itemName}</td>
                                    <td className="text-right">
                                      {_fixedPoint(item?.receiveQnt, true, 1)}
                                    </td>
                                  </tr>
                                );
                              })}
                              <tr>
                                <td colSpan={2} className="text-right">
                                  <b>Total</b>
                                </td>
                                <td className="text-right">
                                  <b>
                                    {_fixedPoint(
                                      rowData?.reduce(
                                        (a, b) => a + b?.receiveQnt,
                                        0
                                      ),
                                      true
                                    )}
                                  </b>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ) : null}
                  {viewType === "view" ||
                  viewType === "modify" ||
                  viewType === "edit" ? (
                    <div className="col-md-6">
                      <h5>Previous Unload Info</h5>
                      <div className="table-responsive">
                        <table
                          id="table-to-xlsx"
                          className={
                            "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                          }
                        >
                          <thead>
                            <tr className="cursor-pointer">
                              {[
                                "SL",
                                "Date",
                                "Unloaded Quantity",
                                "ShipPoint",
                                "Action"
                              ]?.map((th, index) => {
                                return <th key={index}> {th} </th>;
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {dateWiseQuantity?.rowDataList?.length > 0 &&
                              dateWiseQuantity?.rowDataList?.map(
                                (item, index) =>
                                  item?.unLoadDetails?.length > 0 &&
                                  item?.unLoadDetails?.map((data, i) => (
                                    <tr key={i}>
                                      <td
                                        style={{ width: "40px" }}
                                        className="text-center"
                                      >
                                        {i + 1}
                                      </td>
                                      <td className="text-center">
                                        <InputField
                                          value={_dateFormatter(
                                            data?.unloadDateDetails
                                          )}
                                          name="unloadDateDetails"
                                          type="date"
                                          disabled={viewType !== "modify"}
                                          onChange={(e) => {
                                            rowDtoHandler(
                                              "unloadDateDetails",
                                              e.target.value,
                                              index,
                                              i
                                            );
                                          }}
                                        />
                                        {/* {_dateFormatter(data?.unloadDateDetails)} */}
                                      </td>
                                      <td className="text-center">
                                        <InputField
                                          value={data?.receiveQuantityDeatails}
                                          name="receiveQuantityDeatails"
                                          type="number"
                                          disabled={viewType !== "modify"}
                                          onChange={(e) => {
                                            if (+e.target.value < 0) return;
                                            rowDtoHandler(
                                              "receiveQuantityDeatails",
                                              +e.target.value,
                                              index,
                                              i
                                            );
                                          }}
                                        />
                                      </td>
                                      <td className="text-center">
                                        {data?.shipPointName}
                                      </td>
                                      <td className="text-center">{viewType === "modify" ? <span onClick={()=>{
                                        handleDelete(index, i)
                                      }}><IDelete/></span> : null}</td>
                                    </tr>
                                  ))
                              )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
