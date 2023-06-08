import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import IView from "../../../../_helper/_helperIcons/_view";
import { useHistory } from "react-router-dom";
import { GetValueAdditionPagination } from "../helper";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import IViewModal from "../../../../_helper/_viewModal";
import ValueAdditionViewForm from "../viewForm/addEditForm";

export function TableRow() {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const [showModal, setShowModal] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // Id
  const [id, setId] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetValueAdditionPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setGridData,
        setLoading,
        pageNo,
        pageSize
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    GetValueAdditionPagination(
      profileData?.accountId,
      selectedBusinessUnit?.value,
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
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Value Addition</th>
                <th style={{ width: "60px" }}>Actions</th>
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
                      <IView
                        title="View"
                        clickHandler={() => {
                          setId(item?.valueAdditionId);
                          setShowModal(true);
                        }}
                      />
                      <span
                        className="edit"
                        onClick={() => {
                          history.push(
                            `/mngVat/cnfg-vat/value-addition/edit/${item?.valueAdditionId}`
                          );
                        }}
                      >
                        <IEdit />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal Start */}
          <IViewModal
            show={showModal}
            onHide={() => setShowModal(false)}
            children={<ValueAdditionViewForm id={id} />}
          />
          {/* Modal End */}
        </div>
        {gridData?.data?.length > 0 && (
          <PaginationTable
            count={gridData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </div>
    </>
  );
}
