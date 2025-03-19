import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import IDate from "../../../../_helper/_date";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import { getPriceSetupGridData } from "../_redux/Actions";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import IButton from "../../../../_helper/iButton";

const initData = {
  type: { value: 2, label: "Details" },
  channel: "",
  customer: "",
  date: _todayDate(),
};

export function TableRow() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  // const [buDDL, getBuDDL] = useAxiosGet();

  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get controlling unit list  from store
  const gridData = useSelector((state) => {
    return state.priceSetup?.gridData;
  }, shallowEqual);

  useEffect(() => {
    // getBuDDL(
    //   `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${profileData?.accountId}`
    // );
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getPriceSetupGridData(
          profileData.accountId,
          selectedBusinessUnit.value,
          setLoading,
          pageNo,
          pageSize
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const reportId = `f475cec0-ba66-4f10-a062-dc9d567c30be`;
  const parameterValues = (values) => {
    return [
      { name: "intSoldToPartnerId", value: `${values?.customer?.value}` },
      { name: "intDistributionChannel", value: `${values?.channel?.value}` },
      { name: "BusinessUnitId", value: `${selectedBusinessUnit?.value}` },
      { name: "dteLastActionDateTime", value: `${values?.date}` },
    ];
  };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    dispatch(
      getPriceSetupGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        setLoading,
        pageNo,
        pageSize
      )
    );
  };

  // Table columns
  const columns = [
    {
      dataField: "sl",
      text: "SL",
    },
    {
      dataField: "conditionTypeName",
      text: "Condition type",
    },
    {
      dataField: "channlname",
      text: "Channel Name",
    },
    {
      dataField: "itemName",
      text: "Item Name",
    },
    {
      dataField: "price",
      text: "Price",
    },

    {
      dataField: "startDate",
      text: "Start Date",
      formatter: IDate,
      formatExtraData: {
        key: "startDate",
      },
    },
    {
      dataField: "endDate",
      text: "End Date",
      formatter: IDate,
      formatExtraData: {
        key: "endDate",
      },
    },
  ];

  return (
    <>
      {loading && <Loading />}

      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <form className="mb-2">
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="type"
                    options={[
                      { value: 1, label: "Top Sheet" },
                      { value: 2, label: "Details" },
                    ]}
                    value={values?.type}
                    label="Type"
                    onChange={(valueOption) => {
                      setFieldValue("type", valueOption);
                      setShowReport(false);
                    }}
                  />
                </div>
                {values?.type?.value === 1 && (
                  <>
                    <RATForm
                      obj={{
                        values,
                        setFieldValue,
                        region: false,
                        area: false,
                        territory: false,
                        onChange: () => {
                          setShowReport(false);
                        },
                      }}
                    />
                    <div className="col-lg-3">
                      <label>Customer</label>
                      <SearchAsyncSelect
                        selectedValue={values?.customer}
                        handleChange={(valueOption) => {
                          setFieldValue("customer", valueOption);
                          setShowReport(false);
                        }}
                        isDisabled={!values?.channel}
                        placeholder="Sold to Partner"
                        loadOptions={async (v) => {
                          await [{ value: 0, label: "All" }];
                          const searchValue = v.trim();
                          if (searchValue?.length < 3 || !searchValue)
                            return [{ value: 0, label: "All" }];
                          return await axios
                            .get(
                              `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&ChannelId=${values?.channel?.value}`
                            )
                            .then((res) => [
                              { value: 0, label: "All" },
                              ...res?.data,
                            ]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        name="date"
                        type="date"
                        label="Date"
                        value={values?.date}
                        onChange={() => {
                          setShowReport(false);
                        }}
                      />
                    </div>
                    <IButton
                      onClick={() => {
                        setShowReport(true);
                      }}
                    />
                  </>
                )}
              </div>
            </form>
            {showReport && [1].includes(values?.type?.value) && (
              <PowerBIReport
                reportId={reportId}
                groupId={groupId}
                parameterValues={parameterValues(values)}
                parameterPanel={false}
              />
            )}
            {values?.type?.value === 2 && (
              <BootstrapTable
                wrapperClasses="table-responsive"
                classes="table table-head-custom table-vertical-center"
                bootstrap4
                bordered={false}
                remote
                keyField="controllingUnitId"
                data={gridData?.data || []}
                columns={columns}
              ></BootstrapTable>
            )}{" "}
            {/* Pagination Code */}
            {gridData?.data?.length > 0 && values?.type?.value === 2 && (
              <PaginationTable
                count={gridData?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
              />
            )}
          </>
        )}
      </Formik>
    </>
  );
}
