import React, { useState, useEffect } from "react";
import GridTable from "./table";
import { Formik, Form } from "formik";
import Loading from "./../../../../_helper/_loading";
import { getWareHouseDDL } from "../helper";
import { useSelector, shallowEqual } from "react-redux";
import ICustomCard from "./../../../../_helper/_customCard";
import NewSelect from "./../../../../_helper/_select";
import { useHistory } from "react-router-dom";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { getCustomerGroupLandingPasignation } from "./../helper";

const initData = {
  outletName: "",
  status: { value: 3, label: "All" },
};

function CustomerGroupForPrivilege() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const history = useHistory();
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [WareHouseDDL, setWareHouseDDL] = useState([]);

  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const commonGridFunc = (pageNo, pageSize, values) => {
    getCustomerGroupLandingPasignation(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.outletName?.value,
      values?.status?.value,
      pageSize,
      pageNo,
      setRowDto,
      setLoading
    );
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getWareHouseDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.plantId,
        profileData?.userId,
        setWareHouseDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    commonGridFunc(pageNo, pageSize, values);
  };
  return (
    <ICustomCard
      title="Customer Group For Privilege"
      createHandler={() => {
        history.push(
          "/pos-management/configuration/customerGroupForPrivilege/create"
        );
      }}
    >
      <>
        {loading && <Loading />}
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
            setValues,
          }) => (
            <>
              <Form className="form form-label-right Demand_Analysis_Wrapper">
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="outletName"
                      options={WareHouseDDL || []}
                      value={values?.outletName}
                      label="Outlet Name"
                      onChange={(valueOption) => {
                        setFieldValue("outletName", valueOption);
                        setRowDto([])
                      }}
                      placeholder="Outlet Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="status"
                      options={[
                        { value: 3, label: "All" },
                        { value: true, label: "Active " },
                        { value: false, label: "In-Active " },
                      ]}
                      value={values?.status}
                      label="Status"
                      onChange={(valueOption) => {
                        setFieldValue("status", valueOption);
                        setRowDto([])
                      }}
                      placeholder="Status"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col d-flex justify-content-end align-items-end">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        setRowDto([])
                        commonGridFunc(pageNo, pageSize, values);
                      }}
                      disabled={!values?.outletName}
                    >
                      View
                    </button>
                  </div>
                </div>
                <GridTable
                  rowDto={rowDto}
                  values={values}
                  commonGridFunc={commonGridFunc}
                  pageSize={pageSize}
                  pageNo={pageNo}
                />
                {rowDto?.data?.length > 0 && (
                  <PaginationTable
                    count={rowDto?.totalCount}
                    values={values}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                  />
                )}
              </Form>
            </>
          )}
        </Formik>
      </>
    </ICustomCard>
  );
}

export default CustomerGroupForPrivilege;
