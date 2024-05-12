/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import ICard from "../../../../_helper/_card";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IApproval from "../../../../_helper/_helperIcons/_approval";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { getMonth } from "../../customerSalesTarget/utils";
import {
  deletedTarget,
  editSalesTarget,
  getManpowerSalesTargetLandingData,
} from "../helper";
import SubsidyTable from "./subsidyTable";

const headerOne = [
  "SL",
  "Distribution Channel",
  "Employee Name",
  "Enroll",
  "Region",
  "Area",
  "Territory",
  "Zone",
  "Month",
  "Year",
  "Target Qty",
  "Action",
];
const headerTwo = ["SL", "Month", "Year", "ShipPoint", "Target Qty", "Action"];

const getHeaders = (values) => {
  const typeId = values?.type?.value;
  return typeId === 1 ? headerOne : headerTwo;
};

const initData = {
  type: "",
  month: "",
  year: "",
};

const types = [
  { value: 1, label: "Sales Target" },
  { value: 2, label: "Customer Open Target" },
  { value: 3, label: "Retailer Open Target" },
  { value: 4, label: "ShipPoint Target" },
  { value: 5, label: "Government Subsidy" },
];

const ManpowerSalesTargetTable = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [, getRowData] = useAxiosGet();

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, pageNo, pageSize) => {
    setRowData([]);
    const typeId = values?.type?.value;
    if (typeId === 1) {
      getManpowerSalesTargetLandingData(
        accId,
        buId,
        values?.month?.value,
        values?.year?.value,
        pageNo,
        pageSize,
        setRowData,
        setLoading
      );
    } else if (typeId === 4) {
      getRowData(
        `/oms/Complains/GetGhatTargetEntry?AccountId=${accId}&BusinessUnitId=${buId}&TypeId=${values?.type?.value}&Month=${values?.month?.value}&Year=${values?.year?.value}&PageNo=${pageNo}&PageSize=${pageSize}`,
        (resData) => {
          setRowData(resData?.data);
        }
      );
    } else if (typeId === 5) {
      getRowData(
        `/oms/Complains/GetGhatTargetRate?accountId=${accId}&businessUnitId=${buId}&typeId=5&year=${values?.year?.value}`,
        (resData) => {
          setRowData(resData?.data);
        }
      );
    }
  };

  const rowDataHandler = (name, index, value) => {
    const newRowDto = [...rowData?.data];
    newRowDto[index][name] = value;
    setRowData({ ...rowData, data: newRowDto });
  };

  const rowDataDelete = (id, values) => {
    deletedTarget(id, setLoading, () => {
      getData(values, pageNo, pageSize);
    });
  };

  const editTarget = (values, item, index) => {
    const payload = [
      {
        intId: item?.intId,
        channelId: item?.channelId,
        setupPKId: item?.setupPKId,
        setupPkName: item?.setupPkName,
        channelName: item?.channelName,
        territoryTypeId: item?.territoryTypeId,
        territoryTypeName: item?.territoryTypeName,
        targeQnt: +item?.targeQnt,
        targeAmount: item?.targeAmount,
        actionBy: userId,
      },
    ];
    editSalesTarget(
      payload,
      () => {
        getData(values, pageNo, pageSize);
        rowDataHandler("isEdit", index, false);
      },
      setLoading
    );
  };

  let totalTarget = 0;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <ICard
              title="Manpower Sales Target"
              isCreteBtn={true}
              createHandler={() => {
                history.push(
                  "/sales-management/report/manpowersalestarget/create"
                );
              }}
            >
              {loading && <Loading />}
              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="type"
                        options={types}
                        value={values?.type}
                        label="Type"
                        onChange={(valueOption) => {
                          setFieldValue("type", valueOption);
                          setRowData([]);
                        }}
                        placeholder="Select Type"
                      />
                    </div>

                    <YearMonthForm
                      obj={{
                        values,
                        setFieldValue,
                        month: ![5].includes(values?.type?.value),
                      }}
                    />
                    <IButton
                      onClick={() => {
                        getData(values, pageNo, pageSize);
                      }}
                      disabled={
                        ([1, 4].includes(values?.type?.value) &&
                          !values?.month) ||
                        !values?.year
                      }
                    />
                  </div>
                </div>
                {rowData?.data?.length > 0 &&
                  [1, 4].includes(values?.type?.value) && (
                    <table
                      className={
                        "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                      }
                    >
                      <thead>
                        <tr className="cursor-pointer">
                          {getHeaders(values)?.map((item) => (
                            <th key={item}>{item}</th>
                          ))}
                        </tr>
                      </thead>
                      {rowData?.data?.map((item, index) => {
                        totalTarget += +item?.targeQnt;
                        return (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            {[1].includes(values?.type?.value) && (
                              <>
                                <td>{item?.channelName}</td>
                                <td>{item?.employeeName}</td>
                                <td>{item?.employeeEnroll}</td>
                                <td>{item?.regionName}</td>
                                <td>{item?.areaName}</td>
                                <td>{item?.territoryName}</td>
                                <td>{item?.setupPkName}</td>
                              </>
                            )}
                            <td>{getMonth(item?.targetMonthId)}</td>
                            <td>{item?.targetYearId}</td>
                            {[4].includes(values?.type?.value) && (
                              <td>{item?.shipPointName}</td>
                            )}
                            <td
                              className="text-right"
                              style={{ width: "130px" }}
                            >
                              {item?.isEdit ? (
                                <InputField
                                  value={item?.targeQnt}
                                  name="targeQnt"
                                  type="number"
                                  onChange={(e) => {
                                    rowDataHandler(
                                      "targeQnt",
                                      index,
                                      e?.target?.value
                                    );
                                  }}
                                />
                              ) : (
                                _fixedPoint(item?.targeQnt, true, 0)
                              )}
                            </td>
                            <td
                              className="text-center"
                              style={{ width: "80px" }}
                            >
                              <div className="d-flex justify-content-around">
                                {!item?.isEdit ? (
                                  <span
                                    className="cursor-pointer"
                                    onClick={() => {
                                      rowDataHandler("isEdit", index, true);
                                    }}
                                  >
                                    <IEdit />
                                  </span>
                                ) : (
                                  <>
                                    <span
                                      className="cursor-pointer mr-2"
                                      onClick={() => {
                                        rowDataHandler("isEdit", index, false);
                                        rowDataHandler(
                                          "targeQnt",
                                          index,
                                          item?.tempTargetQuantity
                                        );
                                      }}
                                    >
                                      <ICon title="Cancel">
                                        <i class="fas fa-times-circle"></i>
                                      </ICon>
                                    </span>
                                    <span
                                      onClick={() => {
                                        editTarget(values, item, index);
                                      }}
                                    >
                                      <IApproval title="Done" />
                                    </span>
                                  </>
                                )}
                                {[1].includes(values?.type?.value) && (
                                  <span>
                                    <IDelete
                                      remover={(id) => {
                                        rowDataDelete(id, values);
                                      }}
                                      id={item?.intId}
                                    />
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td
                          colSpan={[1].includes(values?.type?.value) ? 10 : 4}
                          className="text-right"
                        >
                          <b>Total</b>
                        </td>
                        <td className="text-right">
                          <b>{totalTarget}</b>
                        </td>
                        <td></td>
                      </tr>
                    </table>
                  )}
              </form>
              {[5].includes(values?.type?.value) && (
                <SubsidyTable obj={{ rowData }} />
              )}
              {rowData?.data?.length > 0 &&
                [1, 4].includes(values?.type?.value) && (
                  <PaginationTable
                    count={rowData?.totalCount}
                    setPositionHandler={(pageNo, pageSize) => {
                      getData(values, pageNo, pageSize);
                    }}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                  />
                )}
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
};

export default ManpowerSalesTargetTable;
