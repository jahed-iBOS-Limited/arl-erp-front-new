/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { getLandingData,getDamageTypeDDL } from "../helper";
import Loading from "./../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "./../../../../../../_metronic/_partials/controls";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import PaginationTable from "./../../../../_helper/_tablePagination";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle"
import IView from "../../../../_helper/_helperIcons/_view"

const DamageCategoryLanding = () => {
  const history = useHistory();

  const [gridData, setGridData] = useState();
  const [isloading, setIsLoading] = useState(false);
  const [damageType, setDamageType] = useState("")
  const [damageTypeDDL, setDamageTypeDDL] = useState([])

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if(profileData?.accountId && selectedBusinessUnit?.value){
    getDamageTypeDDL(profileData?.accountId, selectedBusinessUnit?.value, setDamageTypeDDL)         
  }
  }, [profileData?.accountId, selectedBusinessUnit?.value])

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getLandingData(
      damageType.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setIsLoading,
      setGridData
    )
  };

  return (
    <>
      <Card>
        <CardHeader title="Damage Category">
          <CardHeaderToolbar>
            <button
              onClick={() =>
                history.push("/rtm-management/configuration/damageCategory/create")
              }
              className="btn btn-primary"
            >
              Create
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          {isloading && <Loading />}
          <div className="form-card-content">
          <div className="row">
            <div className="col-lg-3">
              <label>Select Damage Type </label>
              <Select
                onChange={(valueOption) => {
                  setDamageType(valueOption);
                }}
                options={damageTypeDDL}
                value={damageType}
                isSearchable={true}
                name="damageType"
                styles={customStyles}
                placeholder="Select Damage Type"
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                })}
              />
            </div>
            <div className="col-lg-2" style={{ marginTop: "18px" }}>
              <button
                className="btn btn-primary"
                onClick={() =>
                  getLandingData(
                    damageType.value,
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    pageNo,
                    pageSize,
                    setIsLoading,
                    setGridData
                  )
                }
                disabled={!damageType}
              >
                View
              </button>
            </div>
          </div>
        </div>
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
              <th>SL</th>
                <th>Damage Category Name</th>
                <th>Damage Type Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.data?.length > 0 &&
                gridData?.data?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{item?.dmgCatagoryName}</td>
                      <td>{item?.damageTypeName}</td>
                      <td style={{ width: "100px" }} className="text-center">
                        <span
                          className="edit mr-2"
                          onClick={(e) =>
                            history.push(
                              `/rtm-management/configuration/damageCategory/edit/${item?.dmgCatagoryId}`
                            )
                          }
                        >
                          <IEdit />
                        </span>
                        <span
                          className="view"
                          onClick={(e) =>
                            history.push(
                              `/rtm-management/configuration/damageCategory/view/${item?.dmgCatagoryId}`
                            )
                          }
                        >
                          <IView clickHandler={() => {}} />
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {/* Pagination Code */}
          {gridData?.data?.length > 0 && (
            <PaginationTable
              count={gridData?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            />
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default DamageCategoryLanding;
