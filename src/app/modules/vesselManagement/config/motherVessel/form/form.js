/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../../_helper/_customCard";
import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import FormikError from "../../../../_helper/_formikError";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import IButton from "../../../../_helper/iButton";
import { GetCountryDDL } from "../../../../chartering/helper";
import { GetDomesticPortDDL } from "../../../allotment/generalInformation/helper";
import { editMotherVessel } from "../helper";

const initData = {
  vesselName: "",
  programNo: "",
  port: "",
  programDate: _todayDate(),
  product: "",
  origin: "",
  lotNo: "",
  organization: "",
  supplier: "",
  freightRateDollar: "",
  freightRateTaka: "",
  localRevenueRate: "",
  freightCostRate: "",
  freightCostRateBdt: "",
};

const THeaders = [
  "SL",
  "Port",
  "Program No",
  "Program Date",
  "Organization",
  "Product",
  "Origin",
  "Lot No",
  "Local Revenue Rate",
  "Action",
];

const MotherVesselCreateForm = ({ setShow, getData, formType, item }) => {
  const [, postData, loader] = useAxiosPost();
  const [portDDL, setPortDDL] = useState([]);
  const [originDDL, setOriginDDL] = useState([]);
  const [, getRowData] = useAxiosGet([]);
  const [rowData, setRowData] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [organizationDDL, getOrganizationDDL] = useAxiosGet();


  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    GetDomesticPortDDL(setPortDDL);
    GetCountryDDL(setOriginDDL);
    if (["view", "edit"].includes(formType)) {
      getRowData(
        `/wms/FertilizerOperation/GetMotherVesselProgramInfoById?MotherVesselId=${item?.mVesselId}`,
        (resData) => {
          setRowData(
            resData?.motherVesselDetails?.map((item) => ({
              ...item,
              strPortName: item?.portName,
              strProductName: item?.productName,
              strOriginName: item?.originName,
              strLotNumber: item?.lotNo,
              strProgramNo: item?.programNo,
              strOrganizationName: item?.organizationName,
              dteProgramDate: item?.programDate,
              id: item?.id || 0,
              intPortId: item?.portId,
              intProductId: item?.productId,
              intOriginId: item?.originId,
              intOrganizationId: item?.organizationId,
              localRevenueRate: item?.localRevenueRate || 0,
            }))
          );
          const HI = resData?.motherVesselInfo;
          setSingleData({
            ...HI,
            vesselName: HI?.mVesselName,
            mVesselId: HI?.mVesselId,
            supplier: { value: HI?.supplierId, label: HI?.supplierName },
            freightRateDollar: HI?.freightRate,
            freightRateTaka: HI?.freightRateDbt,
            amount: HI?.amount,

            freightCostRate: HI?.freightCostRate,
            freightCostRateBdt: HI?.freightCostRateBdt,
          });
        }
      );
    }
  }, [item]);

  useEffect(()=>{
    getOrganizationDDL(`/tms/LigterLoadUnload/GetG2GBusinessPartnerDDL?BusinessUnitId=${buId}&AccountId=${accId}`);
  }, [accId, buId])

  const singleDataSet = (item, values) => {
    setRowData(rowData?.filter((element) => element?.id !== item?.id));
    const newData = {
      ...values,
      ...item,
      programNo: item?.strProgramNo,
      port: {
        value: item?.portId,
        label: item?.strPortName,
      },
      programDate: _dateFormatter(item?.dteProgramDate),
      product: {
        value: item?.productId,
        label: item?.strProductName,
      },
      origin: {
        value: item?.originId,
        label: item?.strOriginName,
      },
      lotNo: item?.strLotNumber,
      organization: {
        value: item?.organizationId,
        label: item?.strOrganizationName,
      },
    };
    setSingleData(newData);
  };

  const addHandler = (values, cb) => {
    const isUnique = rowData?.find(
      (item) => item?.strProgramNo === values.programNo
    );
    if (!isUnique) {
      const newRow = {
        id: values?.id || 0,
        intPortId: values?.port?.value,
        strPortName: values?.port?.label,
        intProductId: values?.product?.value,
        strProductName: values?.product?.label,
        intOriginId: values?.origin?.value,
        strOriginName: values?.origin?.label,
        strLotNumber: values?.lotNo,
        strProgramNo: values?.programNo,
        intOrganizationId: values?.organization?.value,
        strOrganizationName: values?.organization?.label,
        dteProgramDate: values?.programDate,
        localRevenueRate: +values?.localRevenueRate || 0,
      };
      setRowData([...rowData, newRow]);
      cb();
    } else {
      toast.warn("Duplicate program no is not allowed!");
    }
  };

  const remover = (index) => {
    setRowData(rowData?.filter((_, i) => i !== index));
  };

  const saveHandler = (values) => {
    const payload = {
      motherVessel: {
        mVesselName: values?.vesselName,
        accountId: accId,
        businessUnitId: buId,
        freightRate: +values?.freightRateDollar,
        freightRateDbt: +values?.freightRateTaka,
        supplierId: values?.supplier?.value,
        supplierName: values?.supplier?.label,

        userId: userId,
        mVesselId: values?.mVesselId || 0,
        amount: values?.amount,

        freightCostRate: values?.freightCostRate,
        freightCostRateBdt: values?.freightCostRateBdt,
      },
      motherVesselDetails: rowData,
    };
    const url = `/wms/FertilizerOperation/CreateMotherVesselProgramInfo`;

    const cb = () => {
      getData("", 0, 15);
      setShow(false);
    };

    if (formType === "create") {
      postData(url, payload, cb, true);
    }
    if (formType === "edit") {
      editMotherVessel(payload, setLoading, cb);
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

  const createOrEdit = ["create", "edit"].includes(formType);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={formType === "create" ? initData : singleData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, errors, touched, setValues }) => (
          <>
            <ICustomCard
              title={
                formType === "create"
                  ? "Mother Vessel Entry"
                  : formType === "edit"
                  ? `Edit Mother vessel's info (${item?.mVesselName})`
                  : `Mother vessel's other info (${item?.mVesselName})`
              }
              saveHandler={
                createOrEdit
                  ? () => {
                      saveHandler(values);
                    }
                  : ""
              }
              saveDisabled={loading || rowData?.length < 1}
            >
              {(loading || loader) && <Loading />}
              {createOrEdit && (
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <InputField
                          label="Mother Vessel Name"
                          placeholder="Mother Vessel Name"
                          value={values?.vesselName}
                          name="vesselName"
                          type="text"
                          disabled={!createOrEdit}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>Supplier</label>
                        <SearchAsyncSelect
                          selectedValue={values?.supplier}
                          handleChange={(valueOption) => {
                            setFieldValue("supplier", valueOption);
                          }}
                          loadOptions={loadOptions}
                          isDisabled={!createOrEdit}
                        />
                        <FormikError
                          errors={errors}
                          name="supplier"
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Freight Rate (USD)"
                          placeholder="Freight Rate (USD)"
                          value={values?.freightRateDollar}
                          name="freightRateDollar"
                          type="number"
                          disabled={!createOrEdit}
                          onChange={(e) => {
                            setFieldValue(
                              "freightRateDollar",
                              e?.target?.value
                            );
                            if (values?.freightRateTaka) {
                              setFieldValue(
                                "amount",
                                e?.target?.value * values?.freightRateTaka
                              );
                            }
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Freight Rate (BDT)"
                          placeholder="Freight Rate (BDT)"
                          value={values?.freightRateTaka}
                          name="freightRateTaka"
                          type="number"
                          disabled={!createOrEdit}
                          onChange={(e) => {
                            setFieldValue("freightRateTaka", e?.target?.value);
                            if (values?.freightRateDollar) {
                              setFieldValue(
                                "amount",
                                e?.target?.value * values?.freightRateDollar
                              );
                            }
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Amount"
                          placeholder="Amount"
                          value={values?.amount}
                          name="amount"
                          type="number"
                          disabled={true}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Freight Cost Rate"
                          placeholder="Freight Cost Rate"
                          value={values?.freightCostRate}
                          name="freightCostRate"
                          type="number"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Freight Cost Rate (BDT)"
                          placeholder="Freight Cost Rate (BDT)"
                          value={values?.freightCostRateBdt}
                          name="freightCostRateBdt"
                          type="number"
                        />
                      </div>
                    </div>
                    <div className="row">
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
                        <InputField
                          label="Program No"
                          placeholder="Program No"
                          value={values?.programNo}
                          name="programNo"
                          type="text"
                          disabled={false}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Program Date"
                          placeholder="Program Date"
                          value={values?.programDate}
                          name="programDate"
                          type="date"
                          disabled={false}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="organization"
                          options={organizationDDL || []}
                          value={values?.organization}
                          label="Organization"
                          onChange={(valueOption) => {
                            setFieldValue("organization", valueOption);
                            setFieldValue("localRevenueRate", "");
                          }}
                          placeholder="Organization"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Product</label>
                        <SearchAsyncSelect
                          selectedValue={values?.product}
                          handleChange={(valueOption) => {
                            setFieldValue("product", valueOption);
                          }}
                          placeholder="Search Product"
                          loadOptions={(v) => {
                            const searchValue = v.trim();
                            if (searchValue?.length < 3) return [];
                            return axios
                              .get(
                                `/wms/FertilizerOperation/GetItemListDDL?AccountId=${accId}&BusinessUinitId=${buId}&CorporationType=${values?.organization?.value}&SearchTerm=${searchValue}`
                              )
                              .then((res) => res?.data);
                          }}
                        />
                        <FormikError
                          errors={errors}
                          name="product"
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="origin"
                          options={originDDL || []}
                          value={values?.origin}
                          label="Origin"
                          onChange={(valueOption) => {
                            setFieldValue("origin", valueOption);
                          }}
                          placeholder="Origin"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Lot Number"
                          placeholder="Lot Number"
                          value={values?.lotNo}
                          name="lotNo"
                          type="text"
                          disabled={false}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Local Revenue Rate"
                          placeholder="Local Revenue Rate"
                          value={values?.localRevenueRate}
                          name="localRevenueRate"
                          onChange={(e) => {
                            if (+e.target.value < 0) {
                              return toast.warning("Rate must be positive");
                            }
                            setFieldValue("localRevenueRate", e.target.value);
                          }}
                          type="number"
                          disabled={
                            (buId === 94 &&
                              values?.organization?.value !== 73244) ||
                            (buId === 178 &&
                              values?.organization?.value !== 88577)
                          }
                        />
                      </div>
                      <IButton
                        onClick={() => {
                          addHandler(values, () => {
                            setValues({
                              ...initData,
                              vesselName: values?.vesselName,
                              mVesselId: values?.mVesselId,
                              supplier: values?.supplier,
                              freightRateDollar: values?.freightRateDollar,
                              freightRateTaka: values?.freightRateTaka,
                              freightCostRate: values?.freightCostRate,
                              freightCostRateBdt: values?.freightCostRateBdt,
                            });
                          });
                        }}
                        disabled={
                          !values?.vesselName ||
                          !values?.port ||
                          !values?.programNo ||
                          !values?.programDate ||
                          !values?.organization ||
                          !values?.product ||
                          !values?.origin ||
                          !values?.lotNo ||
                          (values?.organization?.value === 73244 &&
                            !values?.localRevenueRate)
                        }
                      >
                        Add
                      </IButton>
                    </div>
                  </div>
                </form>
              )}
              {rowData?.length > 0 && (
                <ICustomTable ths={THeaders}>
                  {rowData?.map((item, i) => {
                    return (
                      <tr key={i + item?.portName}>
                        <td>{i + 1}</td>
                        <td>{item?.strPortName}</td>
                        <td>{item?.strProgramNo}</td>
                        <td>{_dateFormatter(item?.dteProgramDate)}</td>
                        <td>{item?.strOrganizationName}</td>
                        <td>{item?.strProductName}</td>
                        <td>{item?.strOriginName}</td>
                        <td className="text-center">{item?.strLotNumber}</td>
                        <td className="text-center">
                          {item?.localRevenueRate}
                        </td>
                        <td className="text-center">
                          {formType !== "view" && (
                            <div className="d-flex justify-content-around">
                              <span>
                                <IEdit
                                  onClick={() => {
                                    singleDataSet(item, values);
                                  }}
                                />
                              </span>
                              <span>
                                <IDelete remover={remover} id={i} />
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </ICustomTable>
              )}
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default MotherVesselCreateForm;
