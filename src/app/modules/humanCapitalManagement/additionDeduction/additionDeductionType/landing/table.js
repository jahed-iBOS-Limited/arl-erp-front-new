/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { getLandingData, deleteSingleData } from "../helper";
import Loading from "./../../../../_helper/_loading";
import Select from "react-select";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "./../../../../../../_metronic/_partials/controls";
import PaginationTable from "./../../../../_helper/_tablePagination";
import customStyles from "./../../../../selectCustomStyle";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import IConfirmModal from "./../../../../_helper/_confirmModal";

const AdditionDeductionTypeLanding = () => {
  const history = useHistory();

  const [gridData, setGridData] = useState();
  const [isloading, setIsLoading] = useState(false);
  const [type, setType] = useState({
    label: "Addition",
    value: 1,
  });

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getLandingData(
      profileData?.accountId,
      type?.label === 1 ? true : false,
      setIsLoading,
      setGridData,
      pageNo,
      pageSize
    );
  };

  // confirm to cancel
  const confirmToCancel = (id) => {
    let confirmObject = {
      title: "Are you sure?",
      message: "If you delete this, it can not be undone",
      yesAlertFunc: async () => {
        deleteSingleData(
          { intAdditionDeductionTypeId: id },
          setIsLoading,
          () => {
            getLandingData(
              profileData?.accountId,
              type?.value === 1 ? true : false,
              setIsLoading,
              setGridData,
              pageNo,
              pageSize
            );
          }
        );
      },
      noAlertFunc: () => {
        "";
      },
    };
    IConfirmModal(confirmObject);
  };

  // Loation For Cretae Page
  const createPageLocation = {
    pathname:
      "/human-capital-management/additionanddeduction/additiondeductiontype/create",
    state: { type: type },
  };

  return (
    <>
      <Card>
        <CardHeader title="Addition/Deduction Type">
          <CardHeaderToolbar>
            <button
              onClick={() => history.push(createPageLocation)}
              className="btn btn-primary"
            >
              Create
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="row global-form">
            <div style={{ width: "175px" }} className="mr-4">
              <label>Type</label>
              <Select
                onChange={(valueOption) => {
                  setType(valueOption);
                  setGridData("")
                }}
                value={type}
                options={[
                  {
                    label: "All",
                    value: 0,
                  },
                  {
                    label: "Addition",
                    value: 1,
                  },
                  {
                    label: "Deduction",
                    value: 2,
                  },
                ]}
                isSearchable={true}
                styles={customStyles}
              />
            </div>
            <div style={{ marginTop: "14px" }}>
              <button
                onClick={() =>
                  getLandingData(
                    profileData?.accountId,
                    type?.value,
                    setIsLoading,
                    setGridData,
                    pageNo,
                    pageSize
                  )
                }
                className="btn btn-primary"
              >
                View
              </button>
            </div>
          </div>
          {isloading && <Loading />}
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th>SL</th>
                <th>
                  {type?.label === "All"
                    ? "Addition/Deduction Type Name"
                    : type?.label + " Type Name"}{" "}
                </th>
                <th>Comments</th>
                <th>Created Date</th>
                <th>Created By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.data?.length > 0 &&
                gridData?.data?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td style={{ width: "30px" }} className="text-center">
                        {index + 1}
                      </td>
                      <td>
                        <span className="pl-2">{item?.strType}</span>
                      </td>
                      <td>
                        <span className="pl-2">{item?.strComments}</span>
                      </td>
                      <td className="text-center">
                        <span className="pl-2">
                          {_dateFormatter(item?.createdDate)}
                        </span>
                      </td>
                      <td>
                        <span className="pl-2">{item?.createdBy}</span>
                      </td>
                      <td style={{ width: "100px" }} className="text-center">
                        <span
                          className="edit"
                          onClick={() =>
                            confirmToCancel(item?.intAdditionDeductionTypeId)
                          }
                        >
                          <IDelete />
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

export default AdditionDeductionTypeLanding;
