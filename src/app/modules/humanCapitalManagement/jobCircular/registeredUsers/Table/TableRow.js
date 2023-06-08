import React, { useState, useEffect } from "react";
import {useDispatch } from "react-redux";
import { getRegisteredUsers } from "../helper";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import IView from "../../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";

export function TableRow() {
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const dispatch = useDispatch();

 
  //Dispatch Get getEmpDDLAction
  useEffect(() => {
    getRegisteredUsers(pageNo, pageSize, setRowDto, setLoader);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize) => {
    getRegisteredUsers(pageNo, pageSize, setRowDto, setLoader);
  };

  return (
    <>
      {loader && <Loading />}
      <div>
        {rowDto?.data?.length >= 0 && (
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
              {rowDto?.data?.map((user, index) => (
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
