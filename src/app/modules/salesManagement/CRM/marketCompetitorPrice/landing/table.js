import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
const LandingTable = ({ obj }) => {
  const {
    profileData: { employeeId },
    tokenData: { token },
  } = useSelector((state) => state?.authData, shallowEqual);

  const { gridData, setLoading, commonGridDataCB } = obj;
  const history = useHistory();
  const [isShowModal, setIsShowModal] = React.useState(false);
  const [clickedRow, setClickedRow] = React.useState({});
  const {
    profileData: { userId },
  } = useSelector((state) => state?.authData, shallowEqual);

  return (
    <>
      <div className='table-responsive'>
        <table className='table table-striped table-bordered global-table'>
          <thead>
            <tr>
              <th>SL</th>
              <th>Date</th>
              <th>Business Unit</th>
              <th>Channel</th>
              <th>District</th>
              <th>Police Station</th>
              <th>Territory</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.data?.map((item, index) => {
              return (
                <tr key={index}>
                  <td className='text-center'> {index + 1}</td>
                  <td>{item?.demo}</td>
                  <td>{item?.demo}</td>
                  <td>{item?.demo}</td>
                  <td>{item?.demo}</td>
                  <td>{item?.demo}</td>
                  <td>{item?.demo}</td>

                  <td>
                    <div
                      className='d-flex justify-content-around'
                      style={{
                        gap: "8px",
                      }}
                    >
                      <span
                        onClick={() => {
                          history.push(
                            `//sales-management/CRM/MarketCompetitorPrice/edit/${item?.complainId}`
                          );
                        }}
                      >
                        <IEdit />
                      </span>

                      <span
                        onClick={() => {
                          setClickedRow(item);
                          setIsShowModal(true);
                        }}
                      >
                        <IView />
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LandingTable;
