/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getMonth } from "../../../../salesManagement/report/customerSalesTarget/utils";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { getEmpInfoByIdAction } from "../helper";

const initData = {
  employee: "",
  permissionMenu: "",
};

const CreatePermissionForm = ({ setShow, getData, formType, singleItem }) => {
  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [, postData, loading] = useAxiosPost();
  const [info, setInfo] = useState({});
  const [permissionDDL, getPermissionDDL] = useAxiosGet();
  const [buDDL, getBuDDL] = useAxiosGet();

  useEffect(() => {
    // getMenuList(setPermissionMenuDDL);
    getPermissionDDL(
      `/tms/LigterLoadUnload/TransportModeDDL?intPartid=4&Unitid=${buId}`
    );
    getBuDDL(`/hcm/HCMDDL/GetBusinessunitDDL`);
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
    // let payload = {
    //   intEnrol: values?.employee?.value,
    //   ysnGhatInfo:
    //     values?.permissionMenu?.label === "ysnGhatInfo"
    //       ? true
    //       : permissionList?.ysnGhatInfo,
    //   ysnTransportZoneInfo:
    //     values?.permissionMenu?.label === "ysnTransportZoneInfo"
    //       ? true
    //       : permissionList?.ysnTransportZoneInfo,
    //   ysnItemInfo:
    //     values?.permissionMenu?.label === "ysnItemInfo"
    //       ? true
    //       : permissionList?.ysnItemInfo,
    //   intUnitId: buId,
    //   ysnSoinactive:
    //     values?.permissionMenu?.label === "ysnSOInactive"
    //       ? true
    //       : permissionList?.ysnSoinactive,
    //   ysnChalanInfo:
    //     values?.permissionMenu?.label === "ysnChalanInfo"
    //       ? true
    //       : permissionList?.ysnChalanInfo,
    //   ysnBillInfo:
    //     values?.permissionMenu?.label === "ysnBillInfo"
    //       ? true
    //       : permissionList?.ysnBillInfo,
    //   ysnTerritoryInfo:
    //     values?.permissionMenu?.label === "ysnTerritoryInfo"
    //       ? true
    //       : permissionList?.ysnTerritoryInfo,
    //   ysnFuelCashNexpenseRpt:
    //     values?.permissionMenu?.label === "ysnFuelCashNExpenseRpt"
    //       ? true
    //       : permissionList?.ysnFuelCashNexpenseRpt,
    //   ysnTarget:
    //     values?.permissionMenu?.label === "ysnTarget"
    //       ? true
    //       : permissionList?.ysnTarget,
    //   ysnOverDueRequest:
    //     values?.permissionMenu?.label === "ysnOverDueRequest"
    //       ? true
    //       : permissionList?.ysnOverDueRequest,
    //   ysnG2gconfiguration:
    //     values?.permissionMenu?.label === "ysnG2GConfiguration"
    //       ? true
    //       : permissionList?.ysnG2gconfiguration,
    //   ysnG2goperation:
    //     values?.permissionMenu?.label === "ysnG2goperation"
    //       ? true
    //       : permissionList?.ysnG2goperation,
    // };
    const payload = {
      intEnrol: values?.employee?.value,
      businessUnitId: values?.businessUnit?.value,
      permissionMenu: `ysn${values?.permissionMenu?.label}`,
    };
    if (formType === "edit") {
    } else {
      postData(
        `/wms/FertilizerOperation/CreatePermissionForModification`,
        payload,
        () => {
          getData(0, 15, 0);
          setShow(false);
        },
        true
      );
    }
  };

  const isSaveBtnDisabled = (values) => {
    return values?.permissionMenu?.value && values?.employee?.value
      ? false
      : true;
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={getInitData()}>
        {({ values, resetForm, setFieldValue, errors, touched }) => (
          <ICustomCard
            title="Add New Permission"
            saveHandler={() => {
              saveHandler(values);
              resetForm();
            }}
            saveDisabled={loading || isSaveBtnDisabled(values)}
          >
            {loading && <Loading />}
            <form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <label>Search Employee</label>
                    <SearchAsyncSelect
                      name="employee"
                      selectedValue={values?.employee}
                      handleChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                        getEmpInfoByIdAction(valueOption, setInfo);
                        // getEmpPermissionList(
                        //   valueOption,
                        //   buId,
                        //   setPermissionList
                        // );
                      }}
                      placeholder="Employee (min 3 char)"
                      loadOptions={(v) => {
                        const searchValue = v.trim();
                        if (searchValue?.length < 3) return [];
                        return axios
                          .get(
                            `/hcm/HCMDDL/GetEmployeeDDLSearch?AccountId=${accId}&Search=${searchValue}`
                            // `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=${accId}&BusinessUnitId=${buId}&Search=${searchValue}`
                          )
                          .then((res) => {
                            const modify = res?.data?.map((item) => ({
                              ...item,
                              label: `${item?.label} [${item?.erpemployeeId}]`,
                            }));
                            return modify;
                          });
                      }}
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="businessUnit"
                      options={buDDL || []}
                      value={values?.businessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        setFieldValue("businessUnit", valueOption);
                      }}
                      placeholder="Select Business Unit"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="permissionMenu"
                      options={permissionDDL || []}
                      // options={permissionMenuDDL || []}
                      value={values?.permissionMenu}
                      label="Permission Menu"
                      onChange={(valueOption) => {
                        setFieldValue("permissionMenu", valueOption);
                      }}
                      placeholder="Select Permission Menu"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  {values?.employee?.value && (
                    <>
                      <div className="col-md-3">
                        <InputField
                          label="Code"
                          placeholder="Code"
                          value={info?.strEmployeeCode || ""}
                          name="code"
                          type="text"
                          onChange={(e) => {
                            setFieldValue("code", e.target.value);
                          }}
                          disabled={true}
                        />
                      </div>
                      <div className="col-md-3">
                        <InputField
                          label="Designation"
                          placeholder="Designation"
                          value={info?.strDesignationName || ""}
                          name="designation"
                          type="text"
                          onChange={(e) => {
                            setFieldValue("designation", e.target.value);
                          }}
                          disabled={true}
                        />
                      </div>
                    </>
                  )}
                  {/* {formType !== "edit" && (
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
                      )} */}
                </div>
                <div className="row"></div>
              </div>
            </form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
};

export default CreatePermissionForm;
