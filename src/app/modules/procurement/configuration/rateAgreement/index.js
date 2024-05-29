import { default as Axios } from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import FormikError from "../../../_helper/_formikError";
import IEdit from "../../../_helper/_helperIcons/_edit";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
const initData = {
  sbu: "",
  purchaseOrganization: "",
  plant: "",
  wareHouse: "",
  item: "",
};
export default function RateAgreement() {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  //  ddl list
  const [sbuListDDL, getSbuListDDL] = useAxiosGet();
  const [poListDDL, getPoListDDL] = useAxiosGet();
  const [plantListDDL, getPlanListDDL] = useAxiosGet();
  const [whListDDL, getWhListDDL] = useAxiosGet();
  const [rowDto, getRowDto, rowDtoLoading] = useAxiosGet();

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const saveHandler = (values, cb) => {};
  const history = useHistory();
  const getLandingData = (pageNo, pageSize, values) => {
    getRowDto(
      `/procurement/PurchaseOrder/GetRateAgreement?BusinessUnitId=${buId}&PurchaseOrganisationId=${values?.purchaseOrganization?.value}&PlantId=${values?.plant?.value}&WarehouseId=${values?.wareHouse?.value}&PageNo=${pageNo}&PageSize=${pageSize}`,

    );
  };

  const loadUserList = (v, values) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/wms/ItemPlantWarehouse/GetItemPlantWarehouseForPurchaseRequestSearchDDL?accountId=${accId}&businessUnitId=${buId}&plantId=${values?.plant?.value}&whId=${values?.wareHouse?.value}&purchaseOrganizationId=${values?.purchaseOrganization?.value}&typeId=2&searchTerm=${v}`
      // typeId 2 pass for this standard products
    ).then((res) => {
      const updateList = res?.data.map((item) => ({
        ...item,
      }));
      return updateList;
    });
  };

  useEffect(() => {
    getSbuListDDL(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    getPoListDDL(
      `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    getPlanListDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {rowDtoLoading && <Loading />}
          <IForm
            title="Rate Agreement"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary mr-4"
                    disabled={
                      !values?.sbu ||
                      !values?.purchaseOrganization ||
                      !values?.plant ||
                      !values?.wareHouse
                    }
                    onClick={() => {
                      getLandingData(pageNo, pageSize, values);
                    }}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    disabled={
                      !values?.sbu ||
                      !values?.purchaseOrganization ||
                      !values?.plant ||
                      !values?.wareHouse ||
                      !values?.item
                    }
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        `/mngProcurement/purchase-configuration/rate-agreement/create`,
                        values
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="sbu"
                    options={sbuListDDL || []}
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
                    name="purchaseOrganization"
                    isDisabled={!values?.sbu?.value}
                    options={poListDDL || []}
                    value={values?.purchaseOrganization}
                    label="Purchase Organization"
                    onChange={(valueOption) => {
                      setFieldValue("purchaseOrganization", valueOption);
                    }}
                    placeholder="Purchase Organization"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    isDisabled={!values?.purchaseOrganization?.value}
                    options={plantListDDL || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      setFieldValue("wareHouse", "");
                      if (valueOption?.value) {
                        setFieldValue("plant", valueOption);
                        getWhListDDL(
                          `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${valueOption?.value}&OrgUnitTypeId=8`
                        );
                      } else {
                        setFieldValue("wareHouse", "");
                        setFieldValue("plant", "");
                      }
                    }}
                    placeholder="Plant"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="wareHouse"
                    isDisabled={!values?.plant?.value}
                    options={whListDDL || []}
                    value={values?.wareHouse}
                    label="WareHouse"
                    onChange={(valueOption) => {
                      setFieldValue("wareHouse", valueOption);
                      if (valueOption) {
                        getRowDto(
                          `/procurement/PurchaseOrder/GetRateAgreement?BusinessUnitId=${buId}&PurchaseOrganisationId=${values?.purchaseOrganization?.value}&PlantId=${values?.plant?.value}&WarehouseId=${valueOption?.value}&PageNo=${pageNo}&PageSize=${pageSize}`
                        );
                      }
                    }}
                    placeholder="WareHouse"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {console.log(values)}
                <div className="col-lg-3">
                  <label>Item Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.item}
                    handleChange={(valueOption) => {
                      setFieldValue("item", valueOption);
                    }}
                    loadOptions={(v) => loadUserList(v, values)}
                    isDisabled={!values?.wareHouse}
                  />
                  <FormikError
                    errors={errors}
                    name="item  "
                    touched={touched}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                    <thead>
                      <tr>
                        <th>Sl</th>
                        <th>Contract Name</th>
                        <th>Contract Code</th>
                        <th>Warehouse</th>
                        <th>Contract Date</th>
                        <th>Item Name</th>
                        <th>Item Code</th>
                        <th>Rate Agreement</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.data?.length > 0 &&
                        rowDto?.data?.map((item, index) => (
                          <tr style={{textAlign:"center"}} key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.nameOfContact}</td>
                            <td>{item?.agreementCode}</td>
                            <td>{item?.warehouseName}</td>
                            <td>{_dateFormatter(item?.contactDateTime)}</td>
                            <td>{item?.itemName}</td>
                            <td>{item?.itemCode}</td>
                            <td style={{ fontWeight: "bold" }}>
                              {item?.isForRateAgreement ? (
                                <span style={{ color: "green" }}>Yes</span>
                              ) : (
                                <span style={{ color: "red" }}>No</span>
                              )}
                            </td>
                            <td>{_dateFormatter(item?.contractStartDate)}</td>
                            <td>{_dateFormatter(item?.contractEndDate)}</td>
                            <td style={{fontWeight:"bold"}}>
                              {item?.agreementStatus === "Active" ? (
                                <span style={{ color: "green" }}>
                                  {item?.agreementStatus}
                                </span>
                              ) : (
                                <span style={{ color: "red" }}>
                                  {item?.agreementStatus}
                                </span>
                              )}
                            </td>
                            <td className="text-center">
                              {
                                item?.agreementStatus === "Active" && 
                                <>
                                <IEdit
                                title="Edit"
                                onClick={() => {
                                  history.push({
                                    pathname: `/mngProcurement/purchase-configuration/rate-agreement/edit/${item?.agreementHeaderId}`,
                                    state: {...values, ...item}
                                  });
                                }}
                              />
                                </>
                              }
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  </div>
                  {rowDto?.data?.length > 0 && (
                    <PaginationTable
                      count={rowDto?.totalCount}
                      setPositionHandler={getLandingData}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={values}
                    />
                  )}
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
