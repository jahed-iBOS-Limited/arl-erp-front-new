import axios from 'axios';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import IEdit from '../../../../_helper/_helperIcons/_edit';

const SalesCommissionConfigureLandingTable = ({ obj }) => {
  const {
    gridData,
    values,
    setOpen,
    setSingleData,
    getData,
    dataSelection,
  } = obj;

  return (
    <div>
      {[17, 18, 25, 27, 22, 41].includes(values?.commissionType?.value) ? (
        <TableTwo obj={{ gridData, values, setOpen, setSingleData, getData }} />
      ) : (
        <TableOne
          obj={{
            gridData,
            values,
            setOpen,
            setSingleData,
            getData,
            dataSelection,
          }}
        />
      )}
    </div>
  );
};

export default SalesCommissionConfigureLandingTable;

const TableOne = ({ obj }) => {
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const {
    gridData,
    setOpen,
    setSingleData,
    values,
    getData,
    dataSelection: {
      selectedRows,
      setSelectedRows,
      isAllSelected,
      isSomeSelected,
      handleSelectAll,
      handleSelectRow,
    },
  } = obj;

  const deleteData = async () => {
    const url = `oms/CustomerSalesTarget/DeletePartySalesCommissionConfig`;
    await axios['post'](
      url,
      selectedRows?.map((row) => ({
        autoId: row?.autoId,
        actionBy: profileData?.userId,
      })),
    );
    setSelectedRows([]);
    getData(0, 15, values);
  };
  return (
    <div>
      <div className="table-responsive">
        {(isAllSelected || isSomeSelected) && (
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-danger mt-1"
              type="button"
              onClick={() => {
                deleteData(values);
                getData(0, 15, values);
              }}
            >
              Delete
            </button>
          </div>
        )}
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th style={{ minWidth: '30px' }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  indeterminate={isSomeSelected} // Some libraries/frameworks like React allow this directly, otherwise handle styles
                  onChange={handleSelectAll}
                />
              </th>
              <th style={{ width: '40px' }}>SL</th>
              <th>Area Name</th>
              {![35, 36, 37, 38, 39, 40].includes(
                values?.commissionType?.value,
              ) && (
                <>
                  <th>BP Rate/bag</th>
                  <th>BA Rate/bag</th>
                  <th>CP Rate/bag</th>
                  <th>CA Rate/bag</th>
                </>
              )}
              <th>Offer Qnt From</th>
              <th>Offer Qnt To</th>
              <th>Achievement From</th>
              <th>Achievement To</th>
              {[35, 36, 37, 38, 39, 40].includes(
                values?.commissionType?.value,
              ) && (
                <>
                  <th>Commission Rate</th>
                </>
              )}
              <th>Group Name</th>
              {[40].includes(values?.commissionType?.value) ? (
                <th>Designation Name</th>
              ) : (
                ''
              )}
              {/* {[17, 18, 25, 27].includes(values?.commissionType?.value) && (
                <>
                  {" "}
                  <th>1-99%</th>
                  <th>100-999%</th>
                  <th> {">"}999% </th>
                </>
              )} */}
              <th>Insert By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.data?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.some(
                        (row) => row.autoId === item.autoId,
                      )}
                      onChange={() => handleSelectRow(item)}
                    />
                  </td>
                  <td> {index + 1}</td>
                  <td>{item?.areaName}</td>
                  {![35, 36, 37, 38, 39, 40].includes(
                    values?.commissionType?.value,
                  ) && (
                    <>
                      <td className="text-right">{item?.bpcommissionRate}</td>
                      <td className="text-right">{item?.bacommissionRate}</td>
                      <td className="text-right">{item?.cpcommissionRate}</td>
                      <td className="text-right">{item?.cacommissionRate}</td>
                    </>
                  )}
                  <td className="text-right">{item?.offerQntFrom}</td>
                  <td className="text-right">{item?.offerQntTo}</td>
                  <td className="text-right">{item?.achievementFrom}</td>
                  <td className="text-right">{item?.achievementTo}</td>
                  {[35, 36, 37, 38, 39, 40].includes(
                    values?.commissionType?.value,
                  ) && (
                    <>
                      <td className="text-right">{item?.commissionRate}</td>
                    </>
                  )}
                  <td className="text-right">{item?.itemGroupName}</td>
                  {[40].includes(values?.commissionType?.value) && (
                    <td className="text-right">{item?.designationName}</td>
                  )}

                  {/* {[17, 18, 25, 27].includes(values?.commissionType?.value) && (
                    <>
                      <td className="text-right">
                        {item?.firstSlabCommissionRate}
                      </td>
                      <td className="text-right">
                        {item?.secondSlabCommissionRate}
                      </td>
                      <td className="text-right">
                        {item?.thirdSlabCommissionRate}
                      </td>
                    </>
                  )} */}
                  <td className="text-right">{item?.actionName}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-around">
                      <span>
                        <IEdit
                          onClick={() => {
                            setSingleData(item);
                            setOpen(true);
                          }}
                        ></IEdit>
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TableTwo = ({ obj }) => {
  const { gridData, setOpen, setSingleData } = obj;

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th rowSpan={2} style={{ width: '40px' }}>
                SL
              </th>
              <th rowSpan={2}>Area Name</th>
              <th colSpan={2}>Achievement</th>
              <th colSpan={2}>Quantity</th>
              <th rowSpan={2}>BP Rate/bag</th>
              <th rowSpan={2}>BA Rate/bag</th>
              <th rowSpan={2}>CP Rate/bag</th>
              <th rowSpan={2}>CA Rate/bag</th>
              <th rowSpan={2}>Offer Qnt To</th>
              <th rowSpan={2}>Offer Qnt From</th>
              <th rowSpan={2}>Achievement From</th>
              <th rowSpan={2}>Achievement To</th>
              <th rowSpan={2}>Group Name</th>
              <th rowSpan={2}>Insert By</th>
              <th rowSpan={2}>Action</th>
            </tr>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.data?.map((item, index) => {
              return (
                <tr key={index}>
                  <td> {index + 1}</td>
                  <td>{item?.areaName}</td>
                  <td className="text-center">{item?.achievementFrom}</td>
                  <td className="text-center">{item?.achievementTo}</td>
                  <td className="text-center">{item?.offerQntFrom}</td>
                  <td className="text-center">{item?.offerQntTo}</td>
                  <td className="text-right">{item?.bpcommissionRate}</td>
                  <td className="text-right">{item?.bacommissionRate}</td>
                  <td className="text-right">{item?.cpcommissionRate}</td>
                  <td className="text-right">{item?.cacommissionRate}</td>
                  <td className="text-right">{item?.offerQntFrom}</td>
                  <td className="text-right">{item?.offerQntTo}</td>
                  <td className="text-right">{item?.achievementFrom}</td>
                  <td className="text-right">{item?.achievementTo}</td>
                  <td className="text-right">{item?.itemGroupName}</td>
                  <td className="text-right">{item?.actionName}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-around">
                      <span>
                        <IEdit
                          onClick={() => {
                            setSingleData(item);
                            setOpen(true);
                          }}
                        ></IEdit>
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
