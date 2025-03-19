import { Formik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react'
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import { shallowEqual, useSelector } from 'react-redux';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import IForm from '../../../_helper/_form';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';

const initData = {
    warehouse: "",
    monthYear: "",
};
const POSSalaryDeduct = () => {
    const [fairPriceDDL, getFairPriceDDL, fairPriceDDLloader] = useAxiosGet();
    const [rowData, getRowData, rowDataLoader] = useAxiosGet();
    const { profileData, selectedBusinessUnit } = useSelector(state => state?.authData, shallowEqual)
    // eslint-disable-next-line no-unused-vars
    const [objProps, setObjprops] = useState({});
    const totalPaidAmount = useMemo(
      () =>
        Array.isArray(rowData)
          ? rowData?.reduce(
              (totalValue, item) => (totalValue += item?.paidAmount || 0),
              0
            )
          : 0,
      [rowData]
    );
    useEffect(() => {
        // getFairPriceDDL(`/wms/Warehouse/GetFairPriceShopDDL`);
        getFairPriceDDL(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=68&OrgUnitTypeId=8`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBusinessUnit,profileData?.userId]);
    return (
      <IForm
        title={"Salary Deduct Report"}
        getProps={setObjprops}
        isHiddenReset={true}
        isHiddenBack={true}
        isHiddenSave={true}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initData}
        >
          {({
            values,
            setFieldValue,
            errors,
          }) => (
            <>
              {(rowDataLoader || fairPriceDDLloader) && <Loading />}
              <div className="form-group  global-form">
                <div className="row">
                  <div className="col-lg-2">
                    <NewSelect
                      name="warehouse"
                      options={fairPriceDDL}
                      value={values?.trainigName}
                      label="Warehouse"
                      onChange={(valueOption) => {
                        setFieldValue("warehouse", valueOption);
                      }}
                      errors={errors}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      value={values?.monthYear}
                      label="Month-Year"
                      name="month"
                      type="month"
                      onChange={(e) => {
                        setFieldValue("monthYear", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <button
                      style={{ marginTop: "18px" }}
                      className="btn btn-primary ml-2"
                      disabled={!values?.warehouse?.value || !values?.monthYear}
                      onClick={() => {
                        getRowData(
                          `/hcm/HCMReport/SalaryDeductPOSReport?warehouseId=${
                            values?.warehouse?.value
                          }&monthId=${
                            values?.monthYear?.split("-")[1]
                          }&yearId=${values?.monthYear?.split("-")[0]}`
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                  {rowData?.length > 0 ? (
                    <div className="col-lg-6 mt-5 d-flex justify-content-end">
                      <ReactHtmlTableToExcel
                        id="test-table-xls-button-att-reports"
                        className="btn btn-primary px-3 py-2 mr-2"
                        table="table-to-xlsx"
                        filename="Salary Deduct Report"
                        sheet="Sheet-1"
                        buttonText="Export Excel"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
              {rowData?.length > 0 ? (
                <div className="row">
                  <div className="col-lg-12">
                    <table
                      id="table-to-xlsx"
                      className="table table-striped table-bordered mt-3 bj-table bj-table-landing"
                    >
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Employee ID</th>
                          <th>Name</th>
                          <th>Business Unit</th>
                          <th>Department</th>
                          <th>Designation</th>
                          <th>Workplace Group Name</th>
                          {/* <th>Employee JobStation Id</th> */}
                          <th>Job Station Name</th>
                          <th>Paid Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">{item?.intEmpID}</td>
                            <td>{item?.strName}</td>
                            <td>{item?.strUnit}</td>
                            <td>{item?.strDepartment}</td>
                            <td>{item?.strDesignation}</td>
                            <td>{item?.strWorkplaceGroupName}</td>
                            {/* <td className="text-center">{item?.intEmployeeJobStationId}</td> */}
                            <td>{item?.strJobStationName}</td>
                            <td className="text-right pr-1">{item?.paidAmount}</td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="8" className="text-right">
                            <b>Total</b>
                          </td>
                          <td className="text-right pr-1">
                            <b>{totalPaidAmount}</b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </>
          )}
        </Formik>
      </IForm>
    );
}

export default POSSalaryDeduct