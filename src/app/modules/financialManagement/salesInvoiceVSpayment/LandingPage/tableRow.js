import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Loading from "../../../_helper/_loading";
// import IView from "../../../../_helper/_helperIcons/_view";
// import PaginationTable from "../../../../_helper/_tablePagination";
// import IViewModal from "../../../../_helper/_viewModal";
// import ValueAdditionViewForm from "../viewForm/addEditForm";
// import IEdit from "../../../_helper/_helperIcons/_edit";

export function LandingTableRow() {
  const [gridData] = useState({});
  const [loading] = useState(false);
  const history = useHistory();

  // useEffect(() => {
  //   if (profileData?.accountId && selectedBusinessUnit?.value) {
  //     GetValueAdditionPagination(
  //       profileData?.accountId,
  //       selectedBusinessUnit?.value,
  //       setGridData,
  //       setLoading,
  //       pageNo,
  //       pageSize
  //     );
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [profileData, selectedBusinessUnit]);

  // //setPositionHandler
  // const setPositionHandler = (pageNo, pageSize) => {
  //   GetValueAdditionPagination(
  //     profileData?.accountId,
  //     selectedBusinessUnit?.value,
  //     setGridData,
  //     setLoading,
  //     pageNo,
  //     pageSize
  //   );
  // };

  return (
    <>
      <div className="row cash_journal">
        {loading && <Loading />}
        <div className="col-lg-12">
          <div className="table-responsive">
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th style={{ minWidth: "40px" }}>SL</th>
                  <th style={{ minWidth: "70px" }}>Bill NO</th>
                  <th style={{ minWidth: "70px" }}>PO NO</th>
                  <th style={{ minWidth: "70px" }}>Pay Amount</th>
                  <th style={{ minWidth: "70px" }}>Deducted AIT</th>
                  <th style={{ minWidth: "70px" }}>Received AIT</th>
                  <th style={{ minWidth: "70px" }}>AIT Challan No</th>
                  <th style={{ minWidth: "70px" }}>Remarks</th>
                  <th style={{ minWidth: "70px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.data?.map((item, index) => (
                  <tr>
                    {/* key={item.businessUnitId} */}
                    <td> {item?.sl}</td>
                    <td>
                      <div className="pl-2">{item?.valueAdditionName}</div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-around">
                        {/* <IView
                        title="View"
                        clickHandler={() => {
                          setId(item?.valueAdditionId);
                          setShowModal(true);
                        }}
                      /> */}
                        <span
                          className="edit"
                          onClick={() => {
                            history
                              .push
                              // `/mngVat/cnfg-vat/value-addition/edit/${item?.valueAdditionId}`
                              ();
                          }}
                        >
                          {/* <IEdit /> */}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal Start */}
          {/* <IViewModal
            show={showModal}
            onHide={() => setShowModal(false)}
            // children={<ValueAdditionViewForm id={id} />}
          /> */}
          {/* Modal End */}
        </div>
        {/* {gridData?.data?.length > 0 && (
          <PaginationTable
            count={gridData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )} */}
      </div>
    </>
  );
}
