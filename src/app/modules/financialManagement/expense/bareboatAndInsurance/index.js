import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import IConfirmModal from "../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import { dryDockSaveHandler } from "./helper";

const initData = {
  vessel: "",
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
  allSelect: false,
};

export default function BareboatAndInsurancelanding() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [viewType, setViewType] = useState(1);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(75);
  const [gridData, getGridData, gridLoading, setGridData] = useAxiosGet([]);
  const [vesselAssetDDL, getVesselAssetDDL, vesselAssetLoading] = useAxiosGet();
  const [loading, setLoading] = useState(false);

  const landingData = (values) => {
    getGridData(
      `/fino/BareBoatManagement/BareboatAndInsuranceJournalLinding?IntCategoryId=${
        viewType === 1 ? 1 : viewType === 2 ? 2 : 3
      }&IntBusinessUnitId=${selectedBusinessUnit?.value}&IntVesselId=${
        values?.vessel?.value
      }&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}&DteFromDate=${
        values?.fromDate
      }&DteToDate=${values?.toDate}`,
      (res) => {
        const modifyGridData = res?.data?.map((itm) => ({
          ...itm,
          itemCheck: false,
        }));
        setGridData({
          ...res,
          data: modifyGridData,
        });
      }
    );
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridData(
      `/fino/BareBoatManagement/BareboatAndInsuranceJournalLinding?IntCategoryId=${
        viewType === 1 ? 1 : viewType === 2 ? 2 : 3
      }&IntBusinessUnitId=${selectedBusinessUnit?.value}&IntVesselId=${
        values?.vessel?.value
      }&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}&DteFromDate=${
        values?.fromDate
      }&DteToDate=${values?.toDate}`,
      (res) => {
        const modifyGridData = res?.data?.map((itm) => ({
          ...itm,
          itemCheck: false,
        }));

        setGridData({
          ...res,
          data: modifyGridData,
        });
      }
    );
  };
  const saveHandler = (values, cb) => {};

  useEffect(() => {
    getVesselAssetDDL(
      `/asset/Asset/GetAssetVesselDdl?IntBussinessUintId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const itemSlectedHandler = (value, index) => {
    const mainData = gridData;
    const copyRowDto = [...mainData?.data];
    copyRowDto[index].itemCheck = !copyRowDto[index].itemCheck;
    setGridData({
      ...mainData,
      data: copyRowDto,
    });
  };

  const allGridCheck = (value) => {
    const mainData = gridData;
    const modifyGridData = mainData?.data?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    setGridData({
      ...mainData,
      data: modifyGridData,
    });
  };

  const totalAmount = gridData?.data?.reduce((acc, item) => {
    if (item?.itemCheck) {
      return acc + (item?.numAmount || 0);
    } else {
      return acc;
    }
  }, 0);

  const intConfigIds = gridData?.data
    ?.filter((item) => item?.itemCheck)
    ?.map((item) => item?.id);

  const getDateDifference = (date1, date2) => {
    const start = new Date(date1);
    const end = new Date(date2);
    const dateDiffInDays = Math.floor((end - start) / (1000 * 3600 * 24)) + 1;
    return dateDiffInDays;
  };

  const actualCheckedItemsRate = () => {
    const rate = gridData?.data?.reduce((total, item) => {
      if (item?.itemCheck) {
        const ratePerDay = item?.numRate;
        const fromDate = item?.dteFromDate;
        const toDate = item?.dteToDate;
        const dateDifference = getDateDifference(fromDate, toDate);
        return total + ratePerDay * dateDifference;
      }
      return total;
    }, 0);
    return rate || 0;
  };

  const checkIfToDateIsSame = (values) => {
    const getToDate = _dateFormatter(
      gridData?.data
        ?.filter((item) => item?.itemCheck)
        ?.map((item) => item?.dteToDate)
    );
    return values?.toDate <= getToDate;
  };

  const confirmToCancel = (values) => {
    let confirmObject = {
      title: "Are you sure?",
      message: "If you create journal, it can not be undone",
      yesAlertFunc: async () => {
        if (viewType === 3 && totalAmount > actualCheckedItemsRate()) {
          return toast.warn("Total Amount can not be more than Budget Amount");
        } else {
          if (viewType === 3 && !checkIfToDateIsSame(values)) {
            return toast.warn("Not in date range");
          } else {
            const payload = {
              intBusinessUnitId: selectedBusinessUnit?.value || 0,
              numAmount: +totalAmount || 0,
              intConfigId: intConfigIds || [],
              intVesselId: values?.vessel?.value || 0,
              dteFromDate: values?.fromDate,
              dteToDate: values?.toDate,
              intActionBy: profileData?.userId,
              intTypeId: viewType === 1 ? 1 : viewType === 2 ? 2 : 3,
            };
            dryDockSaveHandler(setLoading, payload, () => {
              landingData(values);
            });
            // createJournalPosting(
            //   `/fino/BareBoatManagement/BareboatAndInsurenceTransaction`,
            //   payload,
            //   () => {
            //     landingData(values);
            //   },
            //   true
            // );
          }
        }
      },
      noAlertFunc: () => {
        "";
      },
    };
    IConfirmModal(confirmObject);
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
          {(gridLoading || vesselAssetLoading || loading) && <Loading />}
          <IForm
            title="Bareboat, Insurance & Dry Dock"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div className="col-lg-4 mb-2 mt-5">
                <label className="mr-3">
                  <input
                    type="radio"
                    name="viewType"
                    checked={viewType === 1}
                    className="mr-1 pointer"
                    style={{ position: "relative", top: "2px" }}
                    onChange={(valueOption) => {
                      setViewType(1);
                      setGridData([]);
                    }}
                  />
                  Bareboat Management
                </label>
                <label className="mr-3">
                  <input
                    type="radio"
                    name="viewType"
                    checked={viewType === 2}
                    className="mr-1 pointer"
                    style={{ position: "relative", top: "2px" }}
                    onChange={(e) => {
                      setViewType(2);
                      setGridData([]);
                    }}
                  />
                  Insurance
                </label>
                <label>
                  <input
                    type="radio"
                    name="viewType"
                    checked={viewType === 3}
                    className="mr-1 pointer"
                    style={{ position: "relative", top: "2px" }}
                    onChange={(e) => {
                      setViewType(3);
                      setGridData([]);
                    }}
                  />
                  Dry Dock
                </label>
              </div>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="vessel"
                    options={vesselAssetDDL || []}
                    value={values?.vessel}
                    label="Vessel"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("vessel", valueOption);
                        setGridData([]);
                      } else {
                        setFieldValue("vessel", "");
                        setGridData([]);
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    placeholder="From Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e?.target?.value);
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    placeholder="To Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e?.target?.value);
                    }}
                  />
                </div>

                <div className="col-lg-3 d-flex mr-1">
                  <button
                    style={{ marginTop: "20px" }}
                    onClick={() => {
                      landingData(values);
                    }}
                    className="btn btn-primary"
                    type="button"
                    disabled={!values?.vessel}
                  >
                    Show
                  </button>
                  <button
                    style={{ marginTop: "20px", marginLeft: "10px" }}
                    onClick={() => {
                      confirmToCancel(values);
                    }}
                    className="btn btn-primary"
                    type="button"
                    disabled={!intConfigIds || !intConfigIds?.length}
                  >
                    Journal Vouchar
                  </button>
                </div>
                <div className="col-lg-12 text-right">
                  <h5 className="mt-5 font-weight-bold">
                    Total Amount: {totalAmount ? _formatMoney(totalAmount) : 0}
                  </h5>
                </div>
              </div>

            <div className="table-responsive">
            <table className="table table-striped table-bordered bj-table bj-table-landing mt-3">
                <thead>
                  <tr>
                    <th style={{ width: "90px" }}>
                      <input
                        type="checkbox"
                        id="parent"
                        onChange={(event) => {
                          allGridCheck(event.target.checked);
                        }}
                      />
                    </th>
                    <th>SL</th>
                    <th>Vessel Name</th>
                    <th>Particulars </th>
                    <th>Fee Per Day/Month </th>
                    <th>Dif Days</th>
                    <th>Amount</th>
                    <th>Base Type </th>
                    <th>Duration </th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Field
                          name={values.itemCheck}
                          component={() => (
                            <input
                              id="itemCheck"
                              type="checkbox"
                              className="ml-2"
                              value={item.itemCheck}
                              checked={item.itemCheck}
                              name={item.itemCheck}
                              onChange={(e) => {
                                itemSlectedHandler(e.target.checked, index);
                              }}
                            />
                          )}
                          label="Transshipment"
                        />
                      </td>
                      <td>
                        <div className="text-left">{index + 1}</div>
                      </td>
                      <td>
                        <div className="text-left">{item?.strVesselName}</div>
                      </td>
                      <td>
                        <div className="text-left">
                          {viewType === 1 || viewType === 3
                            ? item?.strBusinessTransactionName
                            : item?.strSupplierName}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          {item?.numRate ? _formatMoney(item?.numRate) : 0}
                        </div>
                      </td>
                      <td>
                        <div className="text-right">{item?.daysDifference}</div>
                      </td>
                      <td>
                        <div className="text-right">
                          {item?.numAmount ? _formatMoney(item?.numAmount) : 0}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">{item?.strBaseName}</div>
                      </td>
                      <td>
                        <div className="text-center">
                          {viewType === 2 || viewType === 3
                            ? `${_dateFormatter(
                                item?.dteFromDate
                              )} - ${_dateFormatter(item?.dteToDate)}`
                            : ""}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

              {/* Pagination Code */}
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  values={values}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                />
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
