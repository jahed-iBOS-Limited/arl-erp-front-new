import React, { useState, useEffect } from "react";
import GridTable from "./table";
import { Formik, Form } from "formik";
import Loading from "./../../../../_helper/_loading";
import {
  GetItemGroupLanding_api,
  getWareHouseDDL,
  updateItemGroupById_api,
} from "../helper";
import { useSelector, shallowEqual } from "react-redux";
import ICustomCard from "./../../../../_helper/_customCard";
import NewSelect from "./../../../../_helper/_select";
import { useHistory } from "react-router-dom";
import PaginationTable from "./../../../../_helper/_tablePagination";
import IConfirmModal from "./../../../../_helper/_confirmModal";

const initData = {
  outletName: "",
  status: { value: true, label: "Active " },
};

function ItemGroupForPrivilege() {
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
    GetItemGroupLanding_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.plantId,
      profileData?.sbuId,
      values?.outletName?.value,
      values?.status?.value,
      pageNo,
      pageSize,
      setRowDto,
      setLoading
    );
  };

  // useEffect(() => {
  //   if (profileData?.accountId && selectedBusinessUnit?.value) {
  //     commonGridFunc(_todayDate());
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [profileData, selectedBusinessUnit]);
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

  const activeCB = (values) => {
    commonGridFunc(pageNo, pageSize, values);
  };
  const acitveOnclickFunc = (values) => {
    const status = values?.status?.value ? false : true;
    let confirmObject = {
      title: `Are you sure "${
        values?.status?.value ? "Active" : "In-Active"
      }"?`,
      yesAlertFunc: () => {
        updateItemGroupById_api(
          values?.id,
          status,
          setLoading,
          activeCB,
          values
        );
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };
  return (
    <ICustomCard
      title="Item Group For Privilege"
      createHandler={() => {
        history.push(
          "/pos-management/configuration/itemGroupForPrivilege/create"
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
                        setRowDto([]);
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
                        { value: true, label: "Active " },
                        { value: false, label: "In-Active " },
                      ]}
                      value={values?.status}
                      label="Status"
                      onChange={(valueOption) => {
                        setFieldValue("status", valueOption);
                        setRowDto([]);
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
                        commonGridFunc(pageNo, pageSize, values);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
                <GridTable
                  rowDto={rowDto}
                  values={values}
                  acitveOnclickFunc={acitveOnclickFunc}
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

export default ItemGroupForPrivilege;
