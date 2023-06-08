import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { permissionCancel } from "../helper";

export default function ShipPointOperatorLanding() {
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const [rowData, getRowData, loading, setRowData] = useAxiosGet([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  const {
    // profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const initData = {
    businessUnit: { value: buId, label: "Selected Business Unit" },
  };

  const getData = (values, pageNo = 0, pageSize = 50) => {
    getRowData(
      `/oms/ShipPoint/GetPermissionShipPointLanding?BusinessUnitId=${values?.businessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}`,
      (resData) => {
        setRowData({
          ...resData,
          data: resData?.data?.map((item) => ({ ...item, isSelected: false })),
        });
      }
    );
  };

  const cancelPermission = () => {
    const payload = {
      autoId: rowData?.data
        ?.filter((item) => item?.isSelected)
        ?.map((element) => element?.sl),
    };
    permissionCancel(payload, setLoader, () => {});
  };

  useEffect(() => {
    getData(initData, pageNo, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize);
  };

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowData?.data];
    _data[index][name] = value;
    setRowData({ ...rowData, data: _data });
  };

  const allSelect = (value) => {
    let _data = [...rowData?.data];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setRowData({ ...rowData, data: modify });
  };

  const selectedAll = () => {
    return rowData?.data?.length > 0 &&
      rowData?.data?.filter((item) => item?.isSelected)?.length ===
        rowData?.data?.length
      ? true
      : false;
  };

  return (
    <ICustomCard
      title={"Shipping Point Operator"}
      createHandler={() => {
        history.push(
          `/inventory-management/configuration/shippingpointoperator/add`
        );
      }}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={({ resetForm }) => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            {(loading || loader) && <Loading />}
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={[
                      { value: 0, label: "All Business Unit" },
                      { value: buId, label: "Selected Business Unit" },
                    ]}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                      getData({ ...values, businessUnit: valueOption });
                    }}
                  />
                </div>
              </div>
            </form>
            <div className="text-right">
              {rowData?.data?.length > 0 && (
                <button
                  className="btn btn-danger my-2"
                  type="button"
                  onClick={() => {
                    cancelPermission();
                  }}
                  disabled={
                    !rowData?.data?.filter((item) => item?.isSelected)?.length
                  }
                >
                  Cancel Permission
                </button>
              )}
            </div>

            {rowData?.data?.length > 0 && (
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr onClick={() => allSelect(!selectedAll())}>
                    <th style={{ width: "30px" }}>
                      <input
                        type="checkbox"
                        value={selectedAll()}
                        checked={selectedAll()}
                        onChange={() => {}}
                      />
                    </th>
                    <th style={{ width: "35px" }}>SL</th>
                    <th>User Name</th>
                    <th>ShipPoint</th>
                  </tr>
                </thead>
                <tbody>
                  {rowData?.data?.map((item, index) => (
                    <tr
                      style={
                        item?.isSelected
                          ? {
                              backgroundColor: "#aacae3",
                              width: "30px",
                            }
                          : { width: "30px" }
                      }
                      onClick={() => {
                        rowDataHandler("isSelected", index, !item.isSelected);
                      }}
                      key={index}
                    >
                      <td className="text-center">
                        <input
                          type="checkbox"
                          value={item?.isSelected}
                          checked={item?.isSelected}
                          onChange={() => {}}
                        />
                      </td>
                      <td> {index + 1} </td>
                      <td> {item?.userName} </td>
                      <td> {item?.shipPointName} </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {rowData?.data?.length > 0 && (
              <PaginationTable
                count={rowData?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{
                  pageNo,
                  setPageNo,
                  pageSize,
                  setPageSize,
                }}
              />
            )}
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}
