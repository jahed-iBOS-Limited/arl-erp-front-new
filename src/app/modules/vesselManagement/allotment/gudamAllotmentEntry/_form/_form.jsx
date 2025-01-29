/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { getMonth } from "../../../../salesManagement/report/customerSalesTarget/utils";
// import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
// import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import FormikError from "../../../../_helper/_formikError";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { GetDomesticPortDDL } from "../../generalInformation/helper";
// import { GetShipPointDDL } from "../../generalInformation/helper";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import {
  editGudamAllotment,
  getMotherVesselDDL,
  getShipToPartnerDDLByShipPoint,
} from "../helper";

const initData = {
  soldToPartner: "",
  shipToPartner: "",
  item: "",
  allotmentQty: "",
  month: "",
  year: "",
  shipPoint: "",
  port: "",
  programNo: "",
  revenueRate: "",
  revenueByTransport: "",
  isNearShipPoint: "",
  extraAllotmentQuantity: 0,
};

const GudamAllotmentForm = ({
  setShow,
  getData,
  formType,
  singleItem,
  tableValues,
}) => {
  const history = useHistory();
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [, postData, loading] = useAxiosPost();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [businessPartnerList, getBusinessPartnerList] = useAxiosGet();
  const [shipToPartnerDDL, setShipToPartnerDDL] = useState([]);
  // const [shipPointDDL, setShipPointDDL] = useState([]);
  const [portDDL, setPortDDL] = useState([]);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [businessPartnerDDL, getBusinessPartnerDDL] = useAxiosGet();

  useEffect(() => {
    GetDomesticPortDDL(setPortDDL);
    // getBusinessPartnerList(
    //   `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
    // );
    // GetShipPointDDL(accId, buId, setShipPointDDL);

    getBusinessPartnerDDL(
      `/tms/LigterLoadUnload/GetG2GBusinessPartnerDDL?BusinessUnitId=${buId}&AccountId=${accId}`
    );
  }, [accId, buId]);

  useEffect(() => {}, [accId, buId]);

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
        port: {
          value: singleItem?.portId,
          label: singleItem?.portName,
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
        extraAllotmentQuantity: singleItem?.extraAllotmentQuantity || 0,
        month: {
          value: singleItem?.monthId,
          label: getMonth(singleItem?.monthId),
        },
        year: {
          value: singleItem?.yearId,
          label: singleItem?.yearId,
        },
        revenueRate: singleItem?.revenueRate || "",
        revenueByTransport: singleItem?.revenueByTransport || "",
      };
    } else {
      return initData;
    }
  };

  const saveHandler = (values) => {
    if (formType === "edit") {
      const payload = {
        id: singleItem?.id,
        soldToPartnerId: values?.soldToPartner?.value,
        soldToPartnerName: values?.soldToPartner?.label,
        shipToPartnerId: values?.shipToPartner?.value,
        shipToPartnerName: values?.shipToPartner?.label,
        itemId: values?.item?.value,
        itemName: values?.item?.label,
        monthId: values?.month?.value,
        yearId: values?.year?.value,
        allotmentQuantity: values?.allotmentQty,
        extraAllotmentQuantity: +values?.extraAllotmentQuantity || 0,
        motherVesselName: values?.motherVessel?.label,
        motherVesselId: values?.motherVessel?.value,
        revenueRate: +values?.revenueRate || 0,
        revenueByTransport: +values?.revenueByTransport || 0,
        portId: values?.port?.value,
        portName: values?.port?.label,
        actionBy: userId,
      };
      editGudamAllotment(payload, setIsLoading, () => {
        getData(tableValues, 0, 15);
        setShow(false);
      });
    } else {
      postData(
        `/tms/LigterLoadUnload/CreateLighterShipToPartnerAllotment`,
        rows,
        () => {
          getData(tableValues, 0, 15);
          setShow(false);
          history.push({
            pathname: `/vessel-management/allotment/tenderinformation/entry`,
            state: { ...values, type: "redirect" },
          });
        },
        true
      );
    }
  };

  const addRow = (values) => {
    const date = new Date();
    const newRow = {
      businessUnitId: buId,
      soldToPartnerId: values?.soldToPartner?.value,
      soldToPartnerName: values?.soldToPartner?.label,
      shipToPartnerId: values?.shipToPartner?.value,
      shipToPartnerName: values?.shipToPartner?.label,
      itemId: values?.item?.value,
      itemName: values?.item?.label,
      monthId: date?.getMonth(),
      yearId: date?.getFullYear(),
      allotmentQuantity: values?.allotmentQty,
      extraAllotmentQuantity: values?.extraAllotmentQuantity,
      actionby: userId,
      portId: values?.port?.value,
      portName: values?.port?.label,
      motherVesselName: values?.motherVessel?.label,
      motherVesselId: values?.motherVessel?.value,
      revenueRate: +values?.revenueRate || 0,
      revenueByTransport: +values?.revenueByTransport || 0,
      isNearShipPoint: values?.isNearShipPoint,
    };
    setRows([...rows, newRow]);
  };

  const remover = (index) => {
    setRows(rows?.filter((_, i) => i !== index));
  };

  const isSaveBtnDisabled = (values) => {
    if (formType === "edit") {
      return !(
        values?.soldToPartner &&
        values?.shipToPartner &&
        values?.item &&
        values?.year &&
        values?.allotmentQty
      );
    } else {
      return rows?.length < 1;
    }
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={getInitData()}>
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <Card>
              <CardHeader title="Gudam Allotment Entry">
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
                          name="soldToPartner"
                          options={businessPartnerDDL || []}
                          value={values?.soldToPartner}
                          label="Business Partner"
                          onChange={(e) => {
                            setFieldValue("soldToPartner", e);
                            getShipToPartnerDDLByShipPoint(
                              buId,
                              e?.value,
                              setShipToPartnerDDL,
                              setIsLoading
                            );
                          }}
                          placeholder="Business Partner"
                          // isDisabled={formType === "edit"}
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
                            getMotherVesselDDL(
                              accId,
                              buId,
                              valueOption?.value,
                              setMotherVesselDDL
                            );
                          }}
                          placeholder="Port"
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="motherVessel"
                          options={motherVesselDDL}
                          value={values?.motherVessel}
                          label="Mother Vessel"
                          onChange={(valueOption) => {
                            setFieldValue("motherVessel", valueOption);
                            setFieldValue("programNo", valueOption?.programNo);
                          }}
                          placeholder="Mother Vessel"
                        />
                      </div>
                      <div className="col-md-3">
                        <InputField
                          label="Program No"
                          placeholder="Program No"
                          value={values?.programNo}
                          name="programNo"
                          type="text"
                          disabled={true}
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="shipToPartner"
                          options={shipToPartnerDDL || []}
                          value={values?.shipToPartner}
                          label="Ship to Partner"
                          onChange={(e) => {
                            setFieldValue("shipToPartner", e);
                          }}
                          placeholder="Ship to Partner"
                          isDisabled={!values?.soldToPartner}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Item</label>
                        <SearchAsyncSelect
                          selectedValue={values?.item}
                          handleChange={(valueOption) => {
                            setFieldValue("item", valueOption);
                          }}
                          placeholder="Search Item"
                          loadOptions={(v) => {
                            const searchValue = v.trim();
                            if (searchValue?.length < 3) return [];
                            return axios
                              .get(
                                `/wms/FertilizerOperation/GetItemListDDL?AccountId=${accId}&BusinessUinitId=${buId}&CorporationType=${values?.soldToPartner?.value}&SearchTerm=${searchValue}`
                              )
                              .then((res) => res?.data);
                          }}
                          // isDisabled={type}
                        />
                        <FormikError
                          errors={errors}
                          name="item"
                          touched={touched}
                        />
                      </div>
                      {/* <YearMonthForm obj={{ values, setFieldValue }} /> */}
                      <div className="col-md-3">
                        <InputField
                          label="Allotment Qty"
                          placeholder="Allotment Qty"
                          value={values?.allotmentQty}
                          name="allotmentQty"
                          type="text"
                          disabled={false}
                        />
                      </div>
                      <div className="col-md-3">
                        <InputField
                          label="Extra Allotment Qty"
                          placeholder="Allotment Qty"
                          value={+values?.extraAllotmentQuantity || 0}
                          name="extraAllotmentQuantity"
                          type="text"
                          disabled={false}
                          errors
                          touched
                        />
                      </div>

                      <div className="col-md-3">
                        <InputField
                          label="Revenue Rate (Tk.)"
                          placeholder="Revenue Rate (Tk.)"
                          value={values?.revenueRate}
                          name="revenueRate"
                          type="number"
                          disabled={false}
                        />
                      </div>
                      <div className="col-md-3">
                        <InputField
                          label="Revenue by Transport"
                          placeholder="Revenue by Transport"
                          value={values?.revenueByTransport}
                          name="revenueByTransport"
                          type="number"
                          disabled={false}
                        />
                      </div>
                      <div className="col-md-3 mt-5">
                        <input
                          type="checkbox"
                          value={values?.isNearShipPoint}
                          checked={values?.isNearShipPoint}
                          onChange={(e) => {
                            setFieldValue(
                              "isNearShipPoint",
                              e?.target?.checked
                            );
                          }}
                        />{" "}
                        <label htmlFor="isNearShipPoint">Near shipPoint</label>
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
                                values?.soldToPartner &&
                                values?.shipToPartner &&
                                values?.item &&
                                values?.allotmentQty
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
                            "Ship to Partner",
                            "Mother Vessel",
                            "Item Name",
                            // "Month",
                            // "Year",
                            "Allotment Qty",
                            "Extra Allotment Qty",
                            "Revenue Rate (Tk.)",
                            "Revenue by Transport",
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
                              <td>{item?.soldToPartnerName}</td>
                              <td>{item?.shipToPartnerName}</td>
                              <td>{item?.motherVesselName}</td>
                              <td>{item?.itemName}</td>
                              {/* <td>{getMonth(item?.monthId)}</td>
                            <td>{item?.yearId}</td> */}
                              <td className="text-right">
                                {_fixedPoint(item?.allotmentQuantity, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(
                                  item?.extraAllotmentQuantity,
                                  true
                                ) || 0}
                              </td>
                              <td className="text-right">
                                {item?.revenueRate}
                              </td>
                              <td className="text-right">
                                {item?.revenueByTransport}
                              </td>
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
