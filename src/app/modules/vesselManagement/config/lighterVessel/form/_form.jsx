/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Formik } from "formik";
import { useSelector, shallowEqual } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { useEffect } from "react";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { toast } from "react-toastify";
import { editLighterVessel } from "../helper";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";

const initData = {
  port: "",
  lighterVesselName: "",
  motherVessel: "",
  capacity: "",
  carrierName: "",
  contactNo: "",
  carrierRate: "",
};
const LighterVesselCreateForm = ({
  setShow,
  getData,
  preValues,
  formType,
  singleItem,
}) => {
  const [, postData, loader] = useAxiosPost();
  const [
    motherVesselDDL,
    getMotherVesselDDL,
    ,
    setMotherVesselDDL,
  ] = useAxiosGet();
  const [rows, setRows] = useState([]);
  const [portDDL, getPortDDL] = useAxiosGet();
  // const [lighterCarrierDDL, getLighterCarrierDDL] = useAxiosGet();
  const [loading, setLoading] = useState(false);
  const SI = singleItem;

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getPortDDL(`/wms/FertilizerOperation/GetDomesticPortDDL`);
    if (formType === "edit") {
      // getLighterCarrierDDL(
      //   `/wms/FertilizerOperation/GetLighterCarrierDDL?BusinessUnitId=${buId}&PortId=${SI?.portId}`
      // );
      getMotherVesselDDL(
        `/wms/FertilizerOperation/GetMotherVesselProgramInfo?PortId=${SI?.portId}`
      );
    }
  }, [accId, buId]);

  const addRow = (values, callBack) => {
    const isExist = rows?.find((item) => {
      return (
        item?.portId === values?.port?.value &&
        item?.motherVesselId === values?.motherVessel?.value &&
        item?.lighterVesselName?.replace(/\s/g, "").toLowerCase() ===
          values?.lighterVesselName?.replace(/\s/g, "").toLowerCase()
      );
    });
    if (isExist) {
      return toast.warn(
        "Port, Mother Vessel Name & Lighter Vessel Name are already exist"
      );
    }

    const newRow = {
      lighterVesselName: values?.lighterVesselName,
      accountId: accId,
      businessUnitId: buId,
      insertby: userId,
      motherVesselId: values?.motherVessel?.value,
      motherVesselName: values?.motherVessel?.label,
      vesselCapacity: values?.capacity,
      portId: values?.port?.value,
      portName: values?.port?.label,
      carrierAgenName: values?.carrierName?.label,
      carrierAgenId: values?.carrierName?.value,
      contactNo: values?.contactNo,
      carrierRate: +values?.carrierRate,
    };
    setRows([...rows, newRow]);
    callBack();
  };

  const removeRow = (index) => {
    setRows(rows?.filter((_, i) => i !== index));
  };

  const saveHandler = (values) => {
    const payload = {
      userId: userId,
      businessUnitId: buId,
      lighterVesselId: values?.lighterVesselId,
      lighterVesselName: values?.lighterVesselName,
      vesselCapacity: values?.capacity,
      motherVesselId: values?.motherVessel?.value,
      motherVesselName: values?.motherVessel?.label,
      contactNo: values?.contactNo,
      carrierAgenName: values?.carrierName?.label,
      carrierAgenId: values?.carrierName?.value,
      carrierRate: values?.carrierRate,
    };

    const callBack = () => {
      getData("", 0, 15, preValues);
      setShow(false);
    };

    if (formType === "create") {
      postData(
        `/wms/FertilizerOperation/CreateLighterVessel`,
        rows,
        callBack,
        true
      );
    }
    if (formType === "edit") {
      editLighterVessel(payload, setLoading, callBack);
    }
  };

  const modifiedSingleItem = {
    port: {
      value: SI?.portId,
      label: SI?.portName,
    },
    lighterVesselName: SI?.lighterVesselName,
    lighterVesselId: SI?.lighterVesselId,
    motherVessel: {
      value: SI?.motherVesselId,
      label: SI?.motherVesselName,
    },
    capacity: SI?.vesselCapacity,
    carrierName: {
      value: SI?.carrierAgenId,
      label: SI?.carrierAgenName,
    },
    contactNo: SI?.contactNo,
    carrierRate: SI?.carrierRate,
  };

  const loadOptions = async (v) => {
    await [];
    if (v.length < 3) return [];
    return axios
      .get(
        `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${0}`
      )
      .then((res) => {
        const updateList = res?.data.map((item) => ({
          ...item,
        }));
        return [...updateList];
      });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={formType === "edit" ? modifiedSingleItem : initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <Card>
              <CardHeader title="Lighter Vessel Entry">
                <CardHeaderToolbar>
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={() => {
                        saveHandler(values);
                      }}
                      className="btn btn-primary ml-2"
                      disabled={
                        loading || (formType === "create" && !rows?.length)
                      }
                    >
                      Save
                    </button>
                  </div>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {(loading || loader) && <Loading />}
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-6">
                        <NewSelect
                          label="Port"
                          placeholder="Port"
                          value={values?.port}
                          name="port"
                          options={portDDL || []}
                          onChange={(e) => {
                            if (e) {
                              setFieldValue("port", e);
                              setFieldValue("motherVessel", "");
                              getMotherVesselDDL(
                                `/wms/FertilizerOperation/GetMotherVesselProgramInfo?PortId=${e.value}&businessUnitId=${buId}`
                              );
                              // getLighterCarrierDDL(
                              //   `/wms/FertilizerOperation/GetLighterCarrierDDL?BusinessUnitId=${buId}&PortId=${e?.value}`
                              // );
                            } else {
                              setFieldValue("port", "");
                              setFieldValue("motherVessel", "");
                              setMotherVesselDDL([]);
                            }
                          }}
                          isDisabled={false}
                        />
                      </div>
                      <div className="col-lg-6">
                        <NewSelect
                          label="Mother Vessel Name"
                          placeholder="Mother Vessel Name"
                          value={values?.motherVessel}
                          name="motherVessel"
                          options={motherVesselDDL || []}
                          onChange={(e) => {
                            setFieldValue("motherVessel", e);
                          }}
                          isDisabled={false}
                        />
                      </div>
                      <div className="col-lg-6">
                        <InputField
                          label="Lighter Vessel Name"
                          value={values?.lighterVesselName}
                          name="lighterVesselName"
                          type="text"
                          disabled={false}
                          placeholder="Lighter Vessel Name"
                        />
                      </div>
                      <div className="col-lg-6">
                        <InputField
                          label="Capacity"
                          value={values?.capacity}
                          name="capacity"
                          type="number"
                          disabled={false}
                          placeholder="Capacity"
                        />
                      </div>
                      {/* <div className="col-lg-6">
                        <NewSelect
                          label="Carrier Name"
                          placeholder="Carrier Name"
                          value={values?.carrierName}
                          name="carrierName"
                          options={
                            lighterCarrierDDL?.map((itm) => ({
                              ...itm,
                              value: itm?.carrierId,
                              label: itm?.carrierName,
                            })) || []
                          }
                          onChange={(e) => {
                            setFieldValue("carrierName", e || "");
                          }}
                          isDisabled={false}
                        />
                      </div> */}
                      <div className="col-lg-6">
                        <label>Carrier Name</label>
                        <SearchAsyncSelect
                          selectedValue={values?.carrierName}
                          handleChange={(valueOption) => {
                            setFieldValue("carrierName", valueOption);
                          }}
                          placeholder={"Search Carrier Name"}
                          loadOptions={loadOptions}
                        />
                      </div>
                      <div className="col-lg-6">
                        <InputField
                          label="Carrier Rate"
                          value={values?.carrierRate}
                          name="carrierRate"
                          type="text"
                          onChange={(e) => {
                            setFieldValue("carrierRate", e.target.value);
                          }}
                          placeholder="Carrier Rate"
                        />
                      </div>
                      <div className="col-lg-6">
                        <InputField
                          label="Lighter Master Contact No"
                          value={values?.contactNo}
                          name="contactNo"
                          type="text"
                          onChange={(e) => {
                            setFieldValue("contactNo", e.target.value);
                          }}
                          placeholder="Lighter Master Contact No"
                        />
                      </div>
                      {formType === "create" && (
                        <div className="col-12 mt-3 text-right">
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => {
                              const callBack = () => {
                                setFieldValue("lighterVesselName", "");
                              };
                              addRow(values, callBack);
                            }}
                            disabled={
                              !values?.motherVessel ||
                              !values?.lighterVesselName ||
                              !values?.port ||
                              values?.carrierRate <= 0 ||
                              !values?.carrierName ||
                              !values?.capacity
                            }
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {rows?.length > 0 && (
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
                              "Mother Vessel",
                              "Lighter Vessel",
                              "Capacity",
                              "Carrier Name",
                              "Carrier Rate",
                              "Contact No.",
                              "Action",
                            ]?.map((th, index) => {
                              return <th key={index}> {th} </th>;
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {/* {console.log(rows)} */}
                          {rows?.map((item, index) => {
                            console.log("item", item);
                            return (
                              <tr key={index}>
                                <td
                                  style={{ width: "40px" }}
                                  className="text-center"
                                >
                                  {index + 1}
                                </td>
                                <td>{item?.motherVesselName}</td>
                                <td>{item?.lighterVesselName}</td>
                                <td>{item?.vesselCapacity}</td>
                                <td>{item?.carrierAgenName}</td>
                                <td>{item?.carrierRate}</td>
                                <td>{item?.contactNo}</td>
                                <td className="text-center">
                                  <div className="d-flex justify-content-around">
                                    <span>
                                      <IDelete remover={removeRow} id={index} />
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default LighterVesselCreateForm;
