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
import { _formatMoney } from "../../../_helper/_formatMoney";
import IViewModal from "../../../_helper/_viewModal";
import ApprovalModal from "./approvalModal";
import { _todayDate } from "../../../_helper/_todayDate";
const initData = {
  soldToPatner: "",
  item: "",
  startDate: "",
  endDate: _todayDate(),
  status: {
    value: 2,
    label: "Pending",
  },
};
export default function PriceApprove() {
  const saveHandler = (values, cb) => {};

  const [isShowApprovalModal, setIsShowApprovalModal] = useState(false);

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
        console.log("data", data);
      }
    );
  };

  const getTableDataFromApi = (values) => {
    getTableData(
      `/item/PriceSetup/GetItemApprovePagination?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}&CustomerId=${values?.soldToPatner?.value}&ItemId=${values?.item?.value}&ConditionTypeId=4&FromDate=${values?.startDate}&ToDate=${values?.endDate}&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}&Status=${values?.status?.value}`,
      (resData) => {
        setTableData({
          ...resData,
          data: resData?.data?.map((item) => {
            return {
              ...item,
              isChecked: false,
            };
          }),
        });
        console.log("tabledata", tableData);
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
                        getTableDataFromApi(values);
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
                  <div
                    className="col-lg-8 text-right"
                    style={{
                      marginTop: "18px",
                    }}
                  >
                    <button
                      className="btn btn-primary ml-2"
                      onClick={() => {
                        setIsShowApprovalModal(true);
                      }}
                      disabled={!tableData?.data?.length}
                    >
                      Approve
                    </button>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table global-table">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            name="checkAll"
                            checked={
                              tableData?.data?.length > 0 &&
                              tableData?.data?.every((item) => item?.isChecked)
                            }
                            onChange={(e) => {
                              setTableData({
                                ...tableData,
                                data: tableData?.data?.map((item) => {
                                  return {
                                    ...item,
                                    isChecked: e?.target?.checked,
                                  };
                                }),
                              });
                            }}
                            disabled={
                              !tableData?.data?.length &&
                              values?.status?.value === 1
                            }
                          />
                        </th>
                        <th>SL</th>
                        <th>Condition Type</th>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData?.data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <input
                                type="checkbox"
                                name="isChecked"
                                checked={item?.isChecked}
                                onChange={(e) => {
                                  console.log("tabledata", tableData);
                                  console.log("item", item);
                                  setTableData({
                                    ...tableData,
                                    data: tableData?.data?.map((i, idx) => {
                                      if (index === idx) {
                                        return {
                                          ...i,
                                          isChecked: e?.target?.checked,
                                        };
                                      } else {
                                        return i;
                                      }
                                    }),
                                  });
                                }}
                                disabled={values?.status?.value === 1}
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td>{item?.conditionTypeName}</td>
                            <td>{item?.itemName}</td>
                            <td className="text-right">
                              {_formatMoney(item?.price)}
                            </td>
                            <td className="text-right">
                              {_dateFormatter(item?.startDate)}
                            </td>
                            <td className="text-right">
                              {_dateFormatter(item?.endDate)}
                            </td>
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

              <IViewModal
                show={isShowApprovalModal}
                onHide={() => {
                  setIsShowApprovalModal(false);
                }}
              >
                <ApprovalModal
                  tableData={tableData}
                  setTableData={setTableData}
                  values={values}
                />
              </IViewModal>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
