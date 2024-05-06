import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { TableAction } from "../../../../_helper/columnFormatter";
import { useUIContext } from "../../../../_helper/uiContextHelper";
import Loading from "../../../../_helper/_loading";
import { getSaleForceTerritoryGridData } from "../_redux/Actions";
// import PaginationTable from "./../../../../_helper/_tablePagination";
// import PaginationSearch from "../../../../_helper/_search";
import { Formik } from "formik";
import { Card } from "../../../../../../_metronic/_partials/controls";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { deleteSalesForceTerritory } from "../Form/api";
import { GetEmployeeLoginInfo_api } from "../_redux/Api";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
export function TableRow() {
  const dispatch = useDispatch();

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

const [territoryTypeDDL, getTerritoryDDL] = useAxiosGet();

  const [loading, setLoading] = useState(false);
  const [employeeLoginInfo, setEmployeeLoginInfo] = useState([]);
  //paginationState
  // const [pageNo, setPageNo] = React.useState(0);
  // const [pageSize, setPageSize] = React.useState(15);
  // get controlling unit list  from store
  const rowData = useSelector((state) => {
    return state.salesForceTerritoryConig?.gridData;
  }, shallowEqual);
  const getData = (values) => {
    const filterData = {
      TerritoryTypeId:values?.territoryType?.value || 0,
      channelId: values?.channel?.value || 0,
      regionId: values?.region?.value || 0,
      areaId: values?.area?.value || 0,
      territoryId: values?.territory?.value || 0,
      levelId: 0,
      pkId: 0,
      salesForceType:values?.salesForceType?.value || "",
    };
    const userData = {
      TerritoryTypeId: 0,
      channelId: employeeLoginInfo?.empChannelId || 0,
      regionId: employeeLoginInfo?.regionId || 0,
      areaId: employeeLoginInfo?.areaId || 0,
      territoryId: employeeLoginInfo?.empTerritoryId || 0,
      levelId: employeeLoginInfo?.empLevelId || 0,
      pkId: employeeLoginInfo?.empTerritoryId || 0,
    };
    const data = !employeeLoginInfo?.empLevelId ? filterData : userData;
    dispatch(
      getSaleForceTerritoryGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        data,
        setLoading,
        0,
        100
      )
    );
  };

  useEffect(() => {
    GetEmployeeLoginInfo_api(
      profileData.accountId,
      selectedBusinessUnit.value,
      profileData?.employeeId,
      setEmployeeLoginInfo
    );

    getTerritoryDDL(`/oms/TerritoryTypeInfo/GetTerritoryTypeList?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (
      employeeLoginInfo?.empLevelId === 0 ||
      employeeLoginInfo?.empLevelId === null ||
      employeeLoginInfo?.empLevelId
    ) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeLoginInfo]);

  // UI Context
  const uIContext = useUIContext();
  const uIProps = useMemo(() => {
    return {
      ids: uIContext.ids,
      setIds: uIContext.setIds,
      queryParams: uIContext.queryParams,
      setQueryParams: uIContext.setQueryParams,
      openEditPage: uIContext.openEditPage,
      openViewDialog: uIContext.openViewDialog,
    };
  }, [uIContext]);

  // Table columns
  const columns = [
    { dataField: "sl", text: "SL" },
    { dataField: "strChannel", text: "Distribution Channel" },
    { dataField: "strSetupName", text: "Setup Name" },
    { dataField: "strRegion", text: "Region" },
    { dataField: "strArea", text: "Area" },
    { dataField: "strTerritory", text: "Territory" },
    { dataField: "strZone", text: "Point" },
    { dataField: "intEmployeeId", text: "Enroll" },
    { dataField: "strEmployeeName", text: "Name" },
    { dataField: "strEmail", text: "Email" },
    {
      dataField: "intSetupAutoId",
      text: "Actions",
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        openViewDialog: uIProps.openViewDialog,
        key: "intSetupAutoId",
        isView: true,
        isEdit: true,
        // isDelete: true,
        deleteHandler: (row) => {
          deleteSalesForceTerritory(
            row?.intSetupAutoId,
            row?.intEmployeeId,
            setLoading,
            () => {
              getData();
            }
          );
        },
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { width: "80px" },
    },
  ];

  const initData = {
    territoryType:"",
    channel: "",
    region: "",
    area: "",
    territory: "",
    salesForceType:"",
  };

  const isHide = (values, name) => {
    switch (name) {
      case "region":
        return ["Region", "Area", "Territory"].includes(values?.territoryType?.label);
      case "area":
        return ["Area", "Territory"].includes(values?.territoryType?.label);
      case "territory":
        return ["Territory"].includes(values?.territoryType?.label);
      default:
        return false; 
    }
  };

  const tagZone = rowData?.filter((itm, idx) => {
    // if (itm?.intEmployeeId && itm?.strEmployeeName && itm?.strZone !== "na" && itm?.strZone) {
    //   return {
    //     ...itm,
    //   }
    // }
    return (
      itm?.intEmployeeId &&
      itm?.strEmployeeName &&
      itm?.strZone !== "na" &&
      itm?.strZone
    );
  });
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={() => {}}
    >
      {({ values, setFieldValue }) => (
        <>
          <Card>
            {!employeeLoginInfo?.empLevelId ? (
              <form className="form form-label-right">
                {loading && <Loading />}
                <div className="global-form">
                  <div className="row">
                  <div className="col-lg-3">
                  <NewSelect
                    name="territoryType"
                    options={territoryTypeDDL}
                    value={values?.territoryType}
                    label="Territory Type"
                    onChange={(valueOption) => {
                      setFieldValue("territoryType", valueOption);
                      setFieldValue("channel", "");
                      setFieldValue("region", "");
                      setFieldValue("area", "");
                      setFieldValue("territory", "");
                      setFieldValue("salesForceType", "");
                    }}
                  />
                </div>
                {[7].includes(values?.territoryType?.levelPosition) &&  <div className="col-lg-3">
                        <NewSelect
                          name="salesForceType"
                          options={[
                            {value:"TSO", label:"TSO"},
                            {value: "TerritoryManager", label:"Territory Manager"},
                            {value:"ProductServiceEngineer", label:"Product Service Engineer"},
                          ]}
                          value={values?.salesForceType}
                          label="SalesForce Type"
                          onChange={(valueOption) => {
                            setFieldValue("salesForceType", valueOption);
                          }}                
                        />
                      </div>}
                    <RATForm obj={{ setFieldValue, values,  region: isHide(values, "region"), area: isHide(values, "area"), territory: isHide(values, "territory") }} />
                    <div className="col-12 text-right mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          getData(values);
                        }}
                        // disabled={
                        //   loading ||
                        //   (values?.type?.value !== 5 &&
                        //     !(values?.month?.value && values?.year?.value)) ||
                        //   !values?.type ||
                        //   (values?.type?.value === 5 &&
                        //     !values?.commissionRate)
                        // }
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 d-flex justify-content-end">
                    <h5>
                      Employee Assign Zone :{" "}
                      <span className="text-primary">{tagZone?.length}</span>
                    </h5>
                    <h5 className="ml-4">
                      Employee Not Assign Zone :{" "}
                      <span className="text-danger">
                        {rowData?.length - tagZone?.length}
                      </span>
                    </h5>
                  </div>
                </div>
              </form>
            ) : null}
            {loading && <Loading />}
            {/* <div className="mt-2">
        <PaginationSearch
          placeholder="Territory Name & Code Search"
          paginationSearchHandler={paginationSearchHandler}
        />
      </div> */}
            <div
              style={{ lineHeight: "1rem" }}
              className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table"
            >
              <BootstrapTable
                keyField="sl"
                bootstrap4
                bordered={false}
                remote
                data={
                  rowData?.map((item, i) => ({
                    ...item,
                    dteInsertionDate: _dateFormatter(item?.dteInsertionDate),
                    sl: i + 1,
                  })) || []
                }
                columns={columns}
              ></BootstrapTable>
            </div>
            {/* {gridData?.data?.length > 0 && (
        <PaginationTable
          count={gridData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )} */}
          </Card>
        </>
      )}
    </Formik>
  );
}
