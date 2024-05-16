import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../../_helper/_loading";
import PaginationTable from "../../../../../_helper/_tablePagination";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import { permissionCancel } from "../../helper";

const ShipmentPointOperatorTable = ({ values }) => {
  // const history = useHistory();
  const [, setLoader] = useState(false);
  const [rowData, getRowData, loading, setRowData] = useAxiosGet([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const getData = (values, pageNo = 0, pageSize = 50) => {
    console.log(
      `/oms/ShipPoint/GetPermissionShipPointLanding?BusinessUnitId=${values?.businessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
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
    getData(values, pageNo, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, values.businessUnit]);

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
    <>
      {loading && <Loading />}
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
        <div className="table-responsive">
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
        </div>
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
  );
};

export default ShipmentPointOperatorTable;
