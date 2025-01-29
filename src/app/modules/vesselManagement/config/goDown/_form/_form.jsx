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
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import TextArea from "../../../../_helper/TextArea";
import FormikError from "../../../../_helper/_formikError";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { editGodown } from "../helper";

const initData = {
  businessPartner: "",
  transportZone: "",
  godownName: "",
  godownAddress: "",
  contactNumber: "",
  remarks: "",
  unloadingSupplier: "",
  unloadingRate: "",
  bolgateUnloadRate: "",
};

const GodownForm = ({
  setShow,
  getData,
  formType,
  singleItem,
  values,
  businessPartnerDDL,
}) => {
  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [, postData, loading] = useAxiosPost();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [businessPartnerList, getBusinessPartnerList] = useAxiosGet();
  const [transportZoneDDL, getTransportZoneDDL] = useAxiosGet();

  useEffect(() => {
    // getBusinessPartnerList(
    //   `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
    // );
    getTransportZoneDDL(
      `/tms/TransportZone/GetTransportZoneDDL?AccountId=${accId}&BusinessUnitId=${buId}&partnerFlag=true`
    );
  }, [accId, buId]);

  const getInitData = () => {
    if (formType === "edit") {
      return {
        businessPartner: {
          value: singleItem?.businessPartnerId,
          label: singleItem?.businessPartnerName,
        },
        transportZone: {
          value: singleItem?.transportZoneId,
          label: singleItem?.transportZoneName,
        },

        godownName: singleItem?.shipToParterName,
        godownAddress: singleItem?.shipToParterAddress,
        contactNumber: singleItem?.shipToPartnerContact,
        remarks: singleItem?.remarks,
        unloadingSupplier: {
          value: singleItem?.unloadingSupplierId,
          label: singleItem?.unloadingSupplier,
        },
        unloadingRate: singleItem?.unloadingRate,
        bolgateUnloadRate: singleItem?.bolgateUnloadRate || "",
      };
    } else {
      return initData;
    }
  };

  const saveHandler = (values) => {
    if (formType === "edit") {
      const payload = {
        shiptoPartnerId: singleItem?.shiptoPartnerId,
        shipToParterName: values?.godownName,
        shipToParterAddress: values?.godownAddress,
        shipToPartnerContatct: values?.contactNumber,
        remarks: values?.remarks,
        businessPartnerId: values?.businessPartner?.value,
        transportZoneId: values?.transportZone?.value,
        unloadingSupplierId: values?.unloadingSupplier?.value,
        unloadingSupplier: values?.unloadingSupplier?.label,
        unloadingRate: +values?.unloadingRate,
        bolgateUnloadRate: +values?.bolgateUnloadRate || 0,
      };
      editGodown(payload, setIsLoading, () => {
        getData(values, 0, 15);
        setShow(false);
      });
    } else {
      postData(
        `/tms/LigterLoadUnload/CreateShipToPartnerG2G`,
        rows,
        () => {
          getData(values, 0, 15);
          setShow(false);
        },
        true
      );
    }
  };

  const addRow = (values) => {
    const newRow = {
      accountId: accId,
      businessUintId: buId,
      shipToParterName: values?.godownName,
      shipToParterAddress: values?.godownAddress,
      partnerShippingContact: values?.contactNumber,
      remarks: values?.remarks,
      businessPartnerId: values?.businessPartner?.value,
      businessPartnerName: values?.businessPartner?.label,
      transportZoneId: values?.transportZone?.value,
      transportZoneName: values?.transportZone?.label,
      unloadingSupplierId: values?.unloadingSupplier?.value,
      unloadingSupplier: values?.unloadingSupplier?.label,
      unloadingRate: +values?.unloadingRate,
      bolgateUnloadRate: +values?.bolgateUnloadRate || 0,
    };
    setRows([...rows, newRow]);
  };

  const remover = (index) => {
    setRows(rows?.filter((_, i) => i !== index));
  };

  const isSaveBtnDisabled = (values) => {
    if (formType === "edit") {
      return !(
        values?.godownName &&
        values?.godownAddress &&
        values?.contactNumber
      );
    } else {
      return rows?.length < 1;
    }
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
      <Formik enableReinitialize={true} initialValues={getInitData()}>
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <Card>
              <CardHeader title="Godown Entry">
                <CardHeaderToolbar>
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={() => {
                        saveHandler(values);
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
                {(loading || isLoading) && <Loading />}
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="businessPartner"
                          options={businessPartnerDDL || []}
                          value={values?.businessPartner}
                          label="Business Partner"
                          onChange={(e) => {
                            setFieldValue("businessPartner", e);
                          }}
                          placeholder="Business Partner"
                          // isDisabled={formType === "edit"}
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="transportZone"
                          options={transportZoneDDL || []}
                          value={values?.transportZone}
                          label="Transport Zone"
                          onChange={(e) => {
                            setFieldValue("transportZone", e);
                          }}
                          placeholder="Transport Zone"
                          // isDisabled={formType === "edit"}
                        />
                      </div>
                      <div className="col-md-3">
                        <InputField
                          label="Godown Name"
                          placeholder="Godown Name"
                          value={values?.godownName}
                          name="godownName"
                          type="text"
                          disabled={false}
                        />
                      </div>
                      <div className="col-md-3">
                        <InputField
                          label="Godown Address"
                          placeholder="Godown Address"
                          value={values?.godownAddress}
                          name="godownAddress"
                          type="text"
                          disabled={false}
                        />
                      </div>
                      <div className="col-md-3">
                        <InputField
                          label="Contact Number"
                          placeholder="Contact Number"
                          value={values?.contactNumber}
                          name="contactNumber"
                          type="text"
                          disabled={false}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Unloading Supplier</label>
                        <SearchAsyncSelect
                          selectedValue={values?.unloadingSupplier}
                          handleChange={(valueOption) => {
                            setFieldValue("unloadingSupplier", valueOption);
                          }}
                          loadOptions={loadOptions}
                        />
                        <FormikError
                          errors={errors}
                          name="unloadingSupplier"
                          touched={touched}
                        />
                      </div>
                      <div className="col-md-3">
                        <InputField
                          label="Unloading Rate"
                          placeholder="Unloading Rate"
                          value={values?.unloadingRate}
                          name="unloadingRate"
                          type="number"
                          disabled={false}
                        />
                      </div>
                      <div className="col-md-3">
                        <InputField
                          label="Bolgate Unload Rate"
                          placeholder="Bolgate Unload Rate"
                          value={values?.bolgateUnloadRate}
                          name="bolgateUnloadRate"
                          type="number"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label htmlFor="narration">Remarks</label>
                        <TextArea
                          value={values?.remarks}
                          name="remarks"
                          placeholder="Remarks"
                          type="text"
                        />
                      </div>
                      {formType !== "edit" && (
                        <div className="col-12 text-right mt-5">
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => {
                              addRow(values);
                            }}
                            disabled={
                              !(
                                values?.godownName &&
                                values?.godownAddress &&
                                values?.contactNumber
                              )
                            }
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
                            "Business Partner",
                            "Transport Zone",
                            "Godown Name",
                            "Godown Address",
                            "Contact No",
                            "Unloading Supplier",
                            "Unloading Rate",
                            "Bolgate Unload Rate",
                            "Remarks",
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
                              <td>{item?.businessPartnerName}</td>
                              <td>{item?.transportZoneName}</td>
                              <td>{item?.shipToParterName}</td>
                              <td>{item?.shipToParterAddress}</td>
                              <td>{item?.partnerShippingContact}</td>
                              <td>{item?.unloadingSupplier}</td>
                              <td>{item?.unloadingRate}</td>
                              <td>{item?.bolgateUnloadRate}</td>
                              <td>{item?.remarks}</td>

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

export default GodownForm;
