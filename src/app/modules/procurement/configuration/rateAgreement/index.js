import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { _dateTimeFormatter } from "../../../_helper/_dateFormate";
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
  supplier: "",
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
      `/procurement/PurchaseOrder/GetRateAgreement?BusinessUnitId=${buId}&PurchaseOrganisationId=${
        values?.purchaseOrganization?.value
      }&PlantId=${values?.plant?.value}&WarehouseId=${
        values?.wareHouse?.value
      }&supplierId=${values?.supplier?.value ||
        0}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
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
          {(rowDtoLoading) && <Loading />}
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
                      !values?.supplier
                    }
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        `/mngProcurement/purchase-configuration/rateAgreement/create`,
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
                    }}
                    placeholder="WareHouse"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Supplier Name</label>
                  <SearchAsyncSelect
                    selectedValue={values.supplier}
                    isDisabled={!values?.wareHouse?.value}
                    handleChange={(valueOption) => {
                      setFieldValue("supplier", valueOption);
                    }}
                    loadOptions={(v) => {
                      if (v.length < 3) return [];
                      return axios
                        .get(
                          `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${values?.sbu?.value}`
                        )
                        .then((res) => {
                          const updateList = res?.data.map((item) => ({
                            ...item,
                          }));
                          return updateList;
                        });
                    }}
                  />
                  <FormikError
                    errors={errors}
                    name="supplierName"
                    touched={touched}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                    <thead>
                      <tr>
                        <th>Sl</th>
                        <th>Contract Code</th>
                        <th>Warehouse</th>
                        <th>Contract Date</th>
                        <th>Supplier Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.data?.length > 0 &&
                        rowDto?.data?.map((item, index) => (
                          <tr key={index}>
                            <td>{item?.sl}</td>
                            <td>{item?.agreementCode}</td>
                            <td>{item?.warehouseName || "Sample Name"}</td>
                            <td>{_dateTimeFormatter(item?.contactDateTime)}</td>
                            <td>{item?.supplierName}</td>
                            <td>
                              {_dateTimeFormatter(item?.contractStartDate)}
                            </td>
                            <td>{_dateTimeFormatter(item?.contractEndDate)}</td>
                            <td className="text-center">
                              <IEdit
                                title="Edit"
                                onClick={() => {
                                  history.push({
                                    pathname: `/mngProcurement/purchase-configuration/rateAgreement/edit/${item?.agreementHeaderId}`,
                                    state: item,
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
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
