import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import InputField from "../../../_helper/_inputField";
import PaginationTable from "../../../_helper/_tablePagination";
import { _dateFormatter } from "../../../_helper/_dateFormate";
const initData = {
  soldToPatner: "",
  item: "",
  startDate: "",
  endDate: "",
  status: "",
};
export default function PriceApprove() {
  const saveHandler = (values, cb) => {};

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const [
    soldToPartnerDDL,
    getSoldToPartnerDDL,
    loadingOnSoldToPartnerDDL,
  ] = useAxiosGet();

  const [itemListDDL, getItemListDDL, loadingOnItemListDDL] = useAxiosGet();

  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();

  useEffect(() => {
    getSoldToPartnerDDL(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    getItemListDDL(
      `/item/ItemSales/GetItemSalesDDL?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getTableData(
      `/item/PriceSetup/GetItemApprovePagination?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}&CustomerId=${values?.soldToPatner?.value}&ItemId=${values?.item?.value}&ConditionTypeId=4&FromDate=${values?.startDate}&ToDate=${values?.endDate}&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}&status=${values?.status?.value}`,
      (data) => {
        setPageNo(data?.currentPage);
        setPageSize(data?.pageSize);
      }
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          {(loadingOnItemListDDL ||
            loadingOnSoldToPartnerDDL ||
            tableDataLoader) && <Loading />}
          <IForm
            title="Price Approve"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="soldToPatner"
                      options={soldToPartnerDDL || []}
                      value={values?.soldToPatner}
                      label="Sold To Patner"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("soldToPatner", valueOption);
                          setTableData([]);
                        } else {
                          setFieldValue("soldToPatner", "");
                          setTableData([]);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="item"
                      options={itemListDDL || []}
                      value={values?.item}
                      label="Item"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("item", valueOption);
                          setTableData([]);
                        } else {
                          setFieldValue("item", "");
                          setTableData([]);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Start Date</label>
                    <InputField
                      value={values?.startDate}
                      name="startDate"
                      placeholder="Start Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("startDate", e?.target?.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>End Date</label>
                    <InputField
                      value={values?.endDate}
                      name="endDate"
                      placeholder="End Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("endDate", e?.target?.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="status"
                      options={[
                        {
                          value: 1,
                          label: "Approved",
                        },
                        {
                          value: 2,
                          label: "Pending",
                        },
                      ]}
                      value={values?.status}
                      label="Status"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("status", valueOption);
                          setTableData([]);
                        } else {
                          setFieldValue("status", "");
                          setTableData([]);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: "18px",
                    }}
                    className="col-lg-1"
                  >
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        getTableData(
                          `/item/PriceSetup/GetItemApprovePagination?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}&CustomerId=0&ItemId=0&ConditionTypeId=4&FromDate=${values?.startDate}&ToDate=${values?.endDate}&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}&Status=${values?.status?.value}`
                        );
                      }}
                      disabled={
                        !values?.soldToPatner ||
                        !values?.item ||
                        !values?.startDate ||
                        !values?.endDate ||
                        !values?.status
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Condition Type</th>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData?.data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.conditionTypeName}</td>
                            <td>{item?.itemName}</td>
                            <td>{item?.price}</td>
                            <td>{_dateFormatter(item?.startDate)}</td>
                            <td>{_dateFormatter(item?.endDate)}</td>
                            <td>X</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {tableData?.data?.length > 0 && (
                  <PaginationTable
                    count={tableData?.totalCount}
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
