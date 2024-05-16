/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { getMonth } from "../../../../salesManagement/report/customerSalesTarget/utils";
// import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
// import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { GetDomesticPortDDL } from "../../generalInformation/helper";
// import { GetShipPointDDL } from "../../generalInformation/helper";
import { getSBUListDDL } from "../helper";

const initData = {
  sbu: "",
  port: "",
  carrierAgent: "",
  address: "",
  supplierContact: "",
};

const GudamAllotmentForm = ({
  setShow,
  getData,
  formType,
  singleItem,
  tableValues,
}) => {
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [, postData, loading] = useAxiosPost();
  const [rows, setRows] = useState([]);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [portDDL, setPortDDL] = useState([]);

  useEffect(() => {
    GetDomesticPortDDL(setPortDDL);
    // getBusinessPartnerList(
    //   `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
    // );
    // GetShipPointDDL(accId, buId, setShipPointDDL);
    getSBUListDDL(accId, buId, setSbuDDL);
  }, [accId, buId]);

  const getInitData = () => {
    if (formType === "edit") {
      return {
        soldToPartner: {
          value: singleItem?.soldToPartnerId,
          label: singleItem?.soldToPartnerName,
        },
        shipToPartner: {
          value: singleItem?.shipToPartnerId,
          label: singleItem?.shipToPartnerName,
        },
        motherVessel: {
          value: singleItem?.motherVesselId,
          label: singleItem?.motherVesselName,
        },
        item: {
          value: singleItem?.itemId,
          label: singleItem?.itemName,
        },
        allotmentQty: singleItem?.allotmentQuantity,
        month: {
          value: singleItem?.monthId,
          label: getMonth(singleItem?.monthId),
        },
        year: {
          value: singleItem?.yearId,
          label: singleItem?.yearId,
        },
      };
    } else {
      return initData;
    }
  };

  const saveHandler = (values) => {
    if (formType === "edit") {
    } else {
      postData(
        `/wms/FertilizerOperation/CreateLighterCarrierAgent`,
        rows,
        () => {
          getData(tableValues, 0, 15);
          setShow(false);
        },
        true
      );
    }
  };

  const addRow = (values) => {
    const newRow = {
      businessUnitId: buId,
      portId: values?.port?.value,
      portName: values?.port?.label,
      carrierId: values?.carrierAgent?.value,
      carrierName: values?.carrierAgent?.label,
      address: values?.address,
      phone: values?.supplierContact,
      insertby: userId,
    };

    setRows([...rows, newRow]);
  };

  const remover = (index) => {
    setRows(rows?.filter((_, i) => i !== index));
  };

  const isSaveBtnDisabled = (values) => {
    return rows?.length < 1;
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={getInitData()}>
        {({ values, resetForm, setFieldValue, errors, touched }) => (
          <>
            <Card>
              {/* copy from Gudam Allotment Entry */}
              <CardHeader title="Create Carrier Agent">
                <CardHeaderToolbar>
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={() => {
                        saveHandler(values);
                        resetForm();
                      }}
                      className="btn btn-primary ml-2"
                      disabled={loading || isSaveBtnDisabled(values)}
                    >
                      Save
                    </button>
                  </div>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {loading && <Loading />}
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="sbu"
                          options={sbuDDL || []}
                          value={values?.sbu}
                          label="SBU"
                          onChange={(valueOption) => {
                            setFieldValue("sbu", valueOption);
                          }}
                          placeholder="SBU"
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
                          onChange={(valueOption) => {
                            setFieldValue("port", valueOption);
                          }}
                          placeholder="Port"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Carrier Agent</label>
                        <SearchAsyncSelect
                          name="carrierAgent"
                          selectedValue={values?.carrierAgent}
                          handleChange={(valueOption) => {
                            setFieldValue("carrierAgent", valueOption);
                            setFieldValue(
                              "address",
                              valueOption?.supplierAddress
                            );
                            setFieldValue(
                              "supplierContact",
                              valueOption?.supplierContact
                            );
                          }}
                          placeholder="Carrier Agent (min 3 char)"
                          loadOptions={(v) => {
                            const searchValue = v.trim();
                            if (searchValue?.length < 3) return [];
                            return axios
                              .get(
                                `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${searchValue}&AccountId=${accId}&UnitId=${buId}&SBUId=${values?.sbu?.value}`
                              )
                              .then((res) => res?.data);
                          }}
                        />
                        <FormikError
                          errors={errors}
                          name="item"
                          touched={touched}
                        />
                      </div>
                      {values?.carrierAgent?.value && (
                        <>
                          <div className="col-md-3">
                            <InputField
                              label="Address"
                              placeholder="Address"
                              value={values?.address}
                              name="address"
                              type="text"
                              onChange={(e) => {
                                setFieldValue("address", e.target.value);
                              }}
                            />
                          </div>

                          <div className="col-md-3">
                            <InputField
                              label="Contact Number"
                              placeholder="Contact Number"
                              value={values?.supplierContact}
                              name="supplierContact"
                              type="text"
                              onChange={(e) => {
                                setFieldValue(
                                  "supplierContact",
                                  e.target.value
                                );
                              }}
                            />
                          </div>
                        </>
                      )}

                      {formType !== "edit" && (
                        <div className="col-12 text-right mt-5">
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => {
                              addRow(values);
                              resetForm();
                            }}
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
                {formType !== "edit" && (
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
                            "Port",
                            "Carrier Agent",
                            // "Address",
                            "Number",
                            "Action",
                          ]?.map((th, index) => {
                            return <th key={index}> {th} </th>;
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {rows?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: "40px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.portName}</td>
                              <td>{item?.carrierName}</td>
                              {/* <td>{item?.address}</td> */}
                              <td>{item?.phone}</td>
                              <td
                                style={{ width: "80px" }}
                                className="text-center"
                              >
                                <div className="d-flex justify-content-around">
                                  <span>
                                    <IDelete remover={remover} id={index} />
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
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default GudamAllotmentForm;
