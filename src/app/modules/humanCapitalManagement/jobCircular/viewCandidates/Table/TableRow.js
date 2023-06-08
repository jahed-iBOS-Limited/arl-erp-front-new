import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getLoanApplicationLandingPasignation } from "../helper";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import IView from "../../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";

export function TableRow() {
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const params = useParams();
  const dispatch = useDispatch();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //Dispatch Get getEmpDDLAction
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getLoanApplicationLandingPasignation(
        params?.id,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        pageNo,
        pageSize,
        setRowDto,
        setLoader
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const setPositionHandler = (pageNo, pageSize) => {
    getLoanApplicationLandingPasignation(
      params?.id,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setRowDto,
      setLoader
    );
  };

  return (
    <>
      {loader && <Loading />}
      <div>
        {rowDto?.length >= 0 && (
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Mobile No</th>
                <th>CV</th>

                {/* <th style={{width: "50px" }}>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {rowDto?.map((user, index) => (
                <tr key={index}>
                  <td> {index + 1} </td>
                  <td>
                    <div className="text-left">{user.strFirstName}</div>
                  </td>
                  <td>
                    <div className="text-left">{user.strLastName}</div>
                  </td>
                  <td>
                    <div className="text-left">{user.strEmail}</div>
                  </td>
                  <td>
                    <div className="text-left">{user.strPhone}</div>
                  </td>
                  <td>
                    <div className="text-center">
                      {user?.strCvuploadPath && (
                        <IView
                          clickHandler={(e) => {
                            dispatch(
                              getDownlloadFileView_Action(user?.strCvuploadPath)
                            );
                          }}
                        />
                      )}
                    </div>
                  </td>

                  {/* <td>
                    <div className="d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          history.push(
                            `/human-capital-management/loan/loanapplication/edit/${td.employeeId}/${td?.loanApplicationId}`
                          );
                        }}
                        disabled={td?.isApprove === true}
                      >
                        <span className="edit">
                          <IEdit classes="loan-edit" />
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          singleCheckoutHandler(td?.loanApplicationId);
                        }}
                        disabled={td?.isApprove === true}
                      >
                        <span>
                          <i
                            className="fa fa-trash text-danger"
                            aria-hidden="true"
                          ></i>
                        </span>
                      </button>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {rowDto?.data?.length > 0 && (
          <PaginationTable
            count={rowDto?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </div>
    </>
  );
}
