import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
const initData = {
  plant: "",
  warehouse: "",
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
};
export default function ItemQualityCheckLanding() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  const [
    landingData,
    getLandingData,
    loadingLandingData,
    setLandingData,
  ] = useAxiosGet();

  const [plantDDL, getPlantDDL] = useAxiosGet();
  const [warehouseDDL, getWarehouseDDL] = useAxiosGet();

  const handleGetLandingData = (pageNo, pageSize, values) => {
    getLandingData(
      `/mes/QCTest/GetItemQualityCheckLanding?businessUnitId=${buId}&plantId=${values?.plant?.value}&warehouseId=${values?.warehouse?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&pageNo=${pageNo}&pageSize=${pageSize}`,
      (landingData) => {
        
        const updatedRow = landingData?.data?.map((item) => ({
          ...item,
          isChecked: false,
        }));
        setLandingData({
            ...landingData,
            data: updatedRow
          });
      }
    );
  };

  //   const handleRowSelect = (index)=>{
  //     const updatedLandingData =
  //   }

  useEffect(() => {
    getPlantDDL(
      `/wms/Plant/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);
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
          {loadingLandingData && <Loading />}
          <IForm
            title="Item Quality Check"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        `/inventory-management/warehouse-management/itemqualitycheck/create`
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
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantDDL || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      setFieldValue("warehouse", "");
                      setFieldValue("plant", valueOption);
                      if (!valueOption) return;
                      getWarehouseDDL(
                        `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${accId}&businessUnitId=${buId}&PlantId=${valueOption?.value}`
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="warehouse"
                    options={warehouseDDL || []}
                    value={values?.warehouse}
                    label="Warehouse"
                    onChange={(valueOption) => {
                      setFieldValue("warehouse", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDate}
                    label="From Date"
                    name="fromDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.toDate}
                    label="To Date"
                    name="toDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3" style={{ marginTop: 20 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      handleGetLandingData(pageNo, pageSize, values);
                    }}
                    disabled={!values?.plant || !values?.warehouse}
                  >
                    View
                  </button>
                </div>
              </div>
              <div
                style={{ marginTop: "20px" }}
                className="scroll-table _table table-responsive"
              >
                <table className="table table-striped table-bordered bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>
                        {/* <input type="checkbox" name="checkbox" checked={false} onChange/> */}
                        
                      </th>
                      <th>SL</th>
                      <th>Date</th>
                      <th>Supplier Name</th>
                      <th>Address</th>
                      <th>Item Name</th>
                      <th>Net Weight</th>
                      <th>Deduct %</th>
                      <th>Deduct Qty</th>
                      <th>Status</th>
                      <th>QC Final Com</th>
                      <th>Procu Final Com</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      landingData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="checkbox"
                              name="checkbox"
                              checked={item?.isChecked}
                              onChange={() => console.log("hello")}
                            />
                          </td>
                          <td>{index + 1}</td>
                          <td>{item?.date}</td>
                          <td>{item?.supplierName}</td>
                          <td>{item?.supplierAddress}</td>
                          <td>{item?.itemName}</td>
                          <td>{item?.netWeight}</td>
                          <td>{item?.deductionPercentage}</td>
                          <td>{item?.deductionQuantity}</td>
                          <td>{item?.actualQuantity}</td>
                          <td>{item?.actualQuantity}</td>
                          <td>{item?.status}</td>
                          <td className="text-center">
                            <span>
                              <IView />
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {landingData?.data?.length > 0 && (
                  <PaginationTable
                    count={landingData?.totalCount}
                    setPositionHandler={handleGetLandingData}
                    paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  />
                )}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
