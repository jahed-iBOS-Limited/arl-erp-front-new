import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import PaginationTable from "../../../_helper/_tablePagination";
import { generateExcel } from "./helper";
const initData = {
  date: _todayDate(),
  reportType: "",
  businessUnit: "",
  plant: "",
  warehouse: "",
};
export default function GLWiseBalance() {
  const {
    authData: { profileData },
  } = useSelector((store) => store, shallowEqual);

  const [buDDL, getBuDDL] = useAxiosGet();
  const [rowDto, getRowDto, loading] = useAxiosGet();
  const [excelData, getExcelData] = useAxiosGet();
  const [plantDDL, getPlantDDL, , setPlantDDL] = useAxiosGet();
  const [wareHouseDDL, getWareHouseDDL, , setWareHouseDDL] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  useEffect(() => {
    getBuDDL(`/hcm/HCMDDL/GetBusinessunitDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const saveHandler = (values, cb) => {};

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getRowDto(
      `/fino/Report/GetGlWiseInventoryReport?intBusinessUnitId=${
        values?.businessUnit?.value
      }&dteToDate=${values?.date}&intItemTypeId=0&intWarehouseId=${values
        ?.warehouse?.value ||
        0}&pageNo=${pageNo}&pageSize=${pageSize}&reportType=${
        values?.reportType?.value
      }`,
      (data) => {
        getExcelData(
          `/fino/Report/GetGlWiseInventoryReport?intBusinessUnitId=${
            values?.businessUnit?.value
          }&dteToDate=${values?.date}&intItemTypeId=0&intWarehouseId=${values
            ?.warehouse?.value || 0}&pageNo=${pageNo}&pageSize=${
            data?.[0]?.totalRows
          }&reportType=${values?.reportType?.value}`
        );
      }
    );
  };
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
          {loading && <Loading />}
          <IForm
            title="GL Wise Balance"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={buDDL || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("businessUnit", valueOption);
                        setFieldValue("plant", "");
                        setFieldValue("warehouse", "");
                        getPlantDDL(
                          `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${
                            profileData?.userId
                          }&AccId=${profileData?.accountId}&BusinessUnitId=${
                            valueOption?.value
                          }&OrgUnitTypeId=${7}`
                        );
                      } else {
                        setFieldValue("businessUnit", "");
                        setFieldValue("plant", "");
                        setFieldValue("warehouse", "");
                        setPlantDDL([]);
                        setWareHouseDDL([]);
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantDDL || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("plant", valueOption);
                        setFieldValue("warehouse", "");
                        getWareHouseDDL(
                          `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${values?.businessUnit?.value}&PlantId=${valueOption?.value}&OrgUnitTypeId=8`
                        );
                      } else {
                        setFieldValue("plant", valueOption);
                        setFieldValue("warehouse", "");
                        setWareHouseDDL([]);
                      }
                    }}
                    placeholder="Plant"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="warehouse"
                    options={
                      [{ value: 0, label: "All" }, ...wareHouseDDL] || []
                    }
                    value={values?.warehouse}
                    label="WareHouse"
                    onChange={(valueOption) => {
                      setFieldValue("warehouse", valueOption);
                    }}
                    placeholder="WareHouse"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="reportType"
                    options={[
                      { value: 0, label: "Summary" },
                      { value: 1, label: "Details" },
                    ]}
                    value={values?.reportType}
                    label="Report Type"
                    onChange={(valueOption) => {
                      setFieldValue("reportType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    label="Date"
                    type="date"
                    name="date"
                    onChange={(e) => {
                      setFieldValue("date", e.target.value);
                    }}
                  />
                </div>
                <div className="mt-5 ml-5">
                  <button
                    type="button"
                    disabled={
                      !values?.date ||
                      !values?.businessUnit ||
                      !values?.reportType
                    }
                    onClick={() => {
                      setPositionHandler(pageNo, pageSize, values, "");
                    }}
                    className="btn btn-primary"
                  >
                    View
                  </button>
                </div>
                {excelData?.length > 0 ? (
                  <div className="mt-5 ml-5">
                    <button
                      type="button"
                      disabled={!excelData?.length}
                      onClick={() => {
                        generateExcel(excelData);
                      }}
                      className="btn btn-primary"
                    >
                      Excel Export
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Business Unit</th>
                        <th>Warehouse</th>
                        <th>General Ledger</th>
                        <th>Item</th>
                        <th>Value</th>
                        <th>Closing Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.length > 0 &&
                        rowDto.map((item, index) => (
                          <tr className="bg-light">
                            <td>{index + 1}</td>
                            <td>{item?.strBusinessUnitName}</td>
                            <td>{item?.strWarehouseName}</td>
                            <td>{item?.strGeneralLedgerName}</td>
                            <td>{item?.strItemName}</td>
                            <td className="text-center">{item?.totalValue}</td>
                            <td className="text-center">{item?.numCloseQty}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {rowDto?.length > 0 && (
                  <PaginationTable
                    count={rowDto?.[0]?.totalRows}
                    setPositionHandler={setPositionHandler}
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
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
