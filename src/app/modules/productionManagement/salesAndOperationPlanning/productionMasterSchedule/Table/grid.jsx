import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import Loading from "./../../../../_helper/_loading";
import IEdit from "./../../../../_helper/_helperIcons/_edit";
import {
  getMasterSchedulingLandingPageData,
  updateMasterScheduling,
} from "../helper";

const GridData = ({ gridData, loading, plant, year, horizon, setGridData }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [rowIndex, setRowIndex] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [rowDto, setRowDto] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const editFieldHandle = () => {
    setIsEditable(!isEditable);
  };

  const updateItemQuantity = () => {
    var updateData = [];
    if (rowIndex && itemQuantity) {
      updateData.push({
        productionMasterScheduleId:
          gridData[rowIndex - 1].productionMasterScheduleId,
        productionMasterScheduleRowId:
          gridData[rowIndex - 1].productionMasterScheduleRowId,
        itemQTY: itemQuantity,
      });
      setRowIndex("");
      setItemQuantity("");
    }
    setRowDto(updateData);
  };

  const saveHandler = async () => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      if (rowIndex && itemQuantity) {
        rowDto.push({
          productionMasterScheduleId:
            gridData[rowIndex - 1].productionMasterScheduleId,
          productionMasterScheduleRowId:
            gridData[rowIndex - 1].productionMasterScheduleRowId,
          itemQTY: itemQuantity,
        });
      }
      if (rowDto?.length === 0) {
        toast.warning("Please add Item and quantity");
      } else {
        updateMasterScheduling(rowDto, () => {
          getMasterSchedulingLandingPageData(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            plant,
            year,
            horizon,
            setGridData
          );
        });
      }
    }
  };

  //console.log(gridData)
  return (
    <>
      <div className="row cash_journal">
        <div className="col-lg-12">
          <div className="table-responsive">
            <table className="global-table table">
              <thead>
                <tr>
                  <th style={{ width: "20px" }}>SL</th>
                  <th style={{ width: "150px" }}>Schedule Horizon</th>
                  <th style={{ width: "150px" }}>Item Name</th>
                  <th style={{ width: "150px" }}>UoM Name</th>
                  <th style={{ width: "150px" }}>Work Center</th>
                  <th style={{ width: "150px" }}>Schedule Qty</th>
                  <th style={{ width: "70px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && <Loading />}
                {gridData?.map((tableData, index) => (
                  <tr key={index}>
                    <td className="text-center"> {tableData?.sl} </td>
                    <td className="text-center"> {tableData?.sl} </td>
                    <td className="pl-5">{tableData?.itemName}</td>
                    <td className="pl-5">{tableData?.uoMName}</td>
                    <td className="pl-5">{tableData?.workCenterName}</td>
                    {isEditable ? (
                      <td className="text-center">
                        <input
                          type="number"
                          min="0"
                          defaultValue={tableData.itemQTY}
                          name="itemQuantity"
                          onChange={(e) => {
                            setItemQuantity(e.target.value);
                            setRowIndex(index + 1);
                          }}
                          style={{ width: "80px", textAlign: "center" }}
                          onClick={() => updateItemQuantity(index)}
                        />
                      </td>
                    ) : (
                      <td className="text-center">{tableData.itemQTY}</td>
                    )}
                    <td className="text-center">
                      <span onClick={() => editFieldHandle(index)}>
                        <IEdit />
                      </span>{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isEditable ? (
            <button
              type="button"
              onClick={() => {
                saveHandler();
                setIsEditable(!isEditable);
              }}
              className="btn btn-primary"
              style={{ float: "right", marginTop: 10 }}
            >
              Update
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default withRouter(GridData);
