import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { SalesTargetLanding } from "../helper";
const GridData = ({
  gridData,
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  values,
  setGridData,
}) => {
  // const [modelShow, setModelShow] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values, setGridData) => {
    SalesTargetLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.territoryDDL[0]?.value,
      values?.month?.value,
      values?.year?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize
    );
  };

  return (
    <>
      <div className="row cash_journal">
        {loading && <Loading />}
        <div className="col-lg-12">
          {gridData?.data?.length > 0 && (
            <table
              className="table table-striped table-bordered global-table"
              id="table-to-xlsx-sales-target"
            >
              <thead>
                <tr>
                  <th style={{ width: "35px" }}>SL</th>
                  <th style={{ width: "35px" }}>Item Name</th>
                  <th style={{ width: "35px" }}>Quantity</th>
                  <th style={{ width: "35px" }}>Price</th>
                  <th style={{ width: "35px" }}>Total Amount</th>
                  <th style={{ width: "35px" }}>Start Date</th>
                  <th style={{ width: "35px" }}>End Date</th>
                  {/* <th style={{ width: "35px" }}>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {gridData?.data?.map((tableData, index) => (
                  <tr key={index}>
                    <td className="text-center"> {index + 1} </td>
                    <td>
                      <div className="pl-2"> {tableData?.itemName} </div>
                    </td>
                    <td className="text-right">
                      <div className="pr-2">{tableData?.quantity}</div>
                    </td>
                    <td className="text-right">
                      <div className="pr-2"> {tableData?.price}</div>{" "}
                    </td>
                    <td className="text-right">
                      {" "}
                      <div className="pr-2">{tableData?.totalAmount}</div>
                    </td>
                    <td className="text-center">
                      {" "}
                      {_dateFormatter(tableData?.fromdate)}{" "}
                    </td>
                    <td className="text-center">
                      {" "}
                      {_dateFormatter(tableData?.todate)}{" "}
                    </td>
                    {/* <td>
                      <div className='d-flex justify-content-around'>
                        <span
                          className='edit'
                          onClick={() => {
                            // history.push(
                            //   `/rtm-management/primarySale/salesTarget/edit/${tableData?.targetId}`
                            // );
                            history.push({
                              pathname: `/rtm-management/primarySale/salesTarget/edit/${tableData?.territoryId}`,
                              state: {
                                month: values?.month?.value,
                                year: values?.year?.value,
                                territory: values?.territoryName?.value,
                              },
                            });
                          }}
                        >
                          <IEdit />
                        </span>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {gridData?.objdata?.length > 0 && (
          <PaginationTable
            count={gridData?.count}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}

        {/* <CreditNoteModal
          onHide={() => setModelShow(false)}
          show={modelShow}
          rowDto={rowDto}
        /> */}
      </div>
    </>
  );
};

export default withRouter(GridData);
