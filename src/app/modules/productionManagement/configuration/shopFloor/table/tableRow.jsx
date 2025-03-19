/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomTable from "../../../../_helper/_customTable";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import NewSelect from "../../../../_helper/_select";
import { getPlantNameDDl, landingGridData } from "../helper";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "../../../../../../_metronic/_partials/controls/Card";

const tableHeader = [
  "SL",
  "Shop Floor Name",
  "Shop Floor Code",
  "Warehouse Name",
  "Location",
  "Action",
];

export default function TableRow() {
  const [loader, setLoader] = useState(false);
  const history = useHistory();

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const [landingData, setLandingData] = useState([]);
  const [plantNameDDl, setPlantNameDDl] = useState([]);
  const [selectedDDLItem, setSelectedDDLItem] = useState({});

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getPlantNameDDl(
      profileData.userId,
      profileData.accountId,
      selectedBusinessUnit.value,
      setPlantNameDDl
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  useEffect(() => {
    if (plantNameDDl?.length > 0) {
      setSelectedDDLItem(plantNameDDl[0]);
      landingGridData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        plantNameDDl[0]?.value,
        setLoader,
        setLandingData,
        pageNo,
        pageSize
      );
    }
  }, [plantNameDDl]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    landingGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      selectedDDLItem?.value,
      setLoader,
      setLandingData,
      pageNo,
      pageSize
    );
  };

  return (
    <>
      <Card>
        <CardHeader title={"Shop Floor Basic Information"}>
          <CardHeaderToolbar>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                history.push({
                  pathname:
                    "/production-management/configuration/shopfloor/create",
                  state: selectedDDLItem,
                })
              }
              disabled={!selectedDDLItem}
            >
              Create New
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="row">
            <div className="col-lg-3 global-form ml-4">
              <NewSelect
                name="plantName"
                options={plantNameDDl}
                placeholder="Plant Name"
                onChange={(valueOption) => {
                  setSelectedDDLItem(valueOption);
                  if (valueOption) {
                    landingGridData(
                      profileData?.accountId,
                      selectedBusinessUnit?.value,
                      valueOption?.value,
                      setLoader,
                      setLandingData,
                      pageNo,
                      pageSize
                    );
                  }
                }}
                value={selectedDDLItem}
                errors={"errors"}
                touched={"touched"}
              />
            </div>

            <div className="col-lg-12">
              <ICustomTable ths={tableHeader}>
                <>
                  {loader && <Loading />}
                  {landingData?.data?.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data?.shopFloorName}</td>
                      <td>{data?.shopFloorCode}</td>
                      <td>{data?.warehouseName}</td>
                      <td>{data?.locationName}</td>
                      <td className="text-center">
                        <span
                          onClick={() => {
                            history.push(
                              `/production-management/configuration/shopfloor/edit/${data.shopFloorId}`
                            );
                          }}
                        >
                          <IEdit />
                        </span>
                      </td>
                    </tr>
                  ))}
                </>
              </ICustomTable>
              {/* Pagination Code */}
              {landingData?.data?.length > 0 && (
                <PaginationTable
                  count={landingData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                />
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
