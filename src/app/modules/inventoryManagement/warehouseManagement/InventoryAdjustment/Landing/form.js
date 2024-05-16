import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import { _todayDate } from "../../../../_helper/_todayDate";
import { setInvAdjustmentAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import { getGridDataAction } from "../_redux/Actions";
import { getPlantDDL, getSBUDDL, getWareDDL } from "../helper";
import PaginationTable from "./../../../../_helper/_tablePagination";
import GridData from "./grid";
// import { values } from "lodash";

// Validation schema
const validationSchema = Yup.object().shape({});
const initData = {
  sbu: "",
  plant: "",
  warehouse: "",
  transGrup: { value: 7, label: "Adjust Inventory" },
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

export default function HeaderForm() {
  let [controlls, setControlls] = useState([]);
  const [sbuDDL, setsbuDDL] = useState([]);
  const [plantDDL, setplantDDL] = useState([]);
  const [wareHouseDDL, setwareHouseDDL] = useState([]);
  // const [transGroupDDL, ] = useState([{value: 7, label: "Adjust Inventory"}]);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);

  // const [transNo, setTransNo] = useState('');
  //  console.log(transNo)

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  // get user profile data from store
  const profileData = useSelector(
    (state) => state?.authData?.profileData,
    shallowEqual
  );

  // get selected business unit from store
  const selectedBusinessUnit = useSelector(
    (state) => state?.authData?.selectedBusinessUnit,
    shallowEqual
  );

  // gridData Data
  const { gridData } = useSelector((state) => {
    return state?.invTransa;
  }, shallowEqual);

  // gridData Data
  const { invAdjustment } = useSelector((state) => {
    return state?.localStorage;
  }, shallowEqual);

  useEffect(() => {
    // transGrupDDL(settransGroupDDL, profileData?.accountId);
    getSBUDDL(profileData?.accountId, selectedBusinessUnit?.value, setsbuDDL);
    getPlantDDL(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setplantDDL
    );
    viewGridData(invAdjustment);
    if (invAdjustment) {
      dispatch(
        getGridDataAction(
          invAdjustment?.fromDate || _todayDate(),
          invAdjustment?.toDate || _todayDate(),
          invAdjustment?.transGrup?.value,
          profileData?.accountId,
          selectedBusinessUnit?.value,
          invAdjustment?.sbu?.value,
          invAdjustment?.plant?.value,
          invAdjustment?.warehouse?.value,
          setLoading,
          pageNo,
          pageSize
        )
      );
      if (invAdjustment?.plant?.value) {
        getWarehouseDDL(invAdjustment?.plant?.value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  // Get warehouse ddl on plant ddl onChange
  const getWarehouseDDL = (param) => {
    getWareDDL(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      param,
      setwareHouseDDL
    );
  };

  const viewGridData = (values) => {
    dispatch(
      getGridDataAction(
        values?.fromDate || _todayDate(),
        values?.toDate || _todayDate(),
        values?.transGrup?.value,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.sbu?.value,
        values?.plant?.value,
        values?.warehouse?.value,
        setLoading,
        pageNo,
        pageSize
      )
    );
    dispatch(setInvAdjustmentAction(values));
  };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values, searchValue) => {
    dispatch(
      getGridDataAction(
        values?.fromDate || _todayDate(),
        values?.toDate || _todayDate(),
        values?.transGrup?.value,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.sbu?.value,
        values?.plant?.value,
        values?.warehouse?.value,
        setLoading,
        pageNo,
        pageSize,
        searchValue
      )
    );
    dispatch(setInvAdjustmentAction(values));
  };

  useEffect(() => {
    setControlls([
      {
        label: "SBU",
        name: "sbu",
        options: sbuDDL,
      },
      {
        label: "Plant",
        name: "plant",
        options: [{ label: "All", value: 0 }, ...plantDDL],
        dependencyFunc: (payload, allvalues, setter) => {
          getWarehouseDDL(payload);
          setter("warehouse", "");
        },
      },
      {
        label: "Warehouse",
        name: "warehouse",
        options: [{ label: "All", value: 0 }, ...wareHouseDDL],
        isDisabled: ["plant"],
      },
      {
        label: "Transaction Group",
        name: "transGrup",
        options: [{ value: 7, label: "Adjust Inventory" }],
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sbuDDL, plantDDL, wareHouseDDL]);

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, ...invAdjustment }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Form className="form form-label-right">
              <div
                style={{ marginTop: "-65px", paddingBottom: "38px" }}
                className="text-right"
              >
                <button
                  disabled={
                    !values?.warehouse ||
                    values?.warehouse?.value === 0 ||
                    !values?.plant || values?.plant?.value === 0 ||
                    !values?.sbu ||
                    !values?.transGrup
                  }
                  type="button"
                  style={{ transform: "translateY(24px)" }}
                  className="btn btn-primary ml-3"
                  onClick={() => {
                    history.push({
                      pathname: `/inventory-management/warehouse-management/InventoryAdjustment/create`,
                      search: `?potype=${values?.transGrup?.value}`,
                      state: values,
                    });
                    dispatch(setInvAdjustmentAction(values));
                  }}
                >
                  Create
                </button>
              </div>
              <div className="form-group row global-form">
                {controlls.map((itm, idx) => {
                  return (
                    <div className="col-lg-3" key={idx + 1}>
                      <ISelect
                        dependencyFunc={itm.dependencyFunc}
                        label={itm.label}
                        placeholder={itm.label}
                        options={itm.options || []}
                        value={values[itm.name]}
                        name={itm.name}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        values={values}
                        disabledFields={itm.isDisabled || []}
                        touched={touched}
                      />
                    </div>
                  );
                })}
                <div className="col-lg-3">
                  <label>From Date</label>
                  <div className="flex-fill">
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From date"
                      type="date"
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <div className="flex-fill">
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To date"
                      type="date"
                    />
                  </div>
                </div>
                <div className="col-lg-3" style={{ marginTop: 22 }}>
                  <button
                    disabled={
                      !values?.warehouse ||
                      !values?.plant ||
                      !values?.sbu ||
                      !values?.transGrup ||
                      !values?.fromDate ||
                      !values?.toDate
                    }
                    type="submit"
                    onClick={() => {
                      dispatch(setInvAdjustmentAction(values));
                      viewGridData(values);
                    }}
                    // style={{ transform: "translateY(24px)" }}
                    className="btn btn-primary"
                  >
                    View
                  </button>
                </div>
              </div>
              <PaginationSearch
                placeholder="Transaction Code Search"
                paginationSearchHandler={paginationSearchHandler}
                values={values}
              />
              <GridData
                setLoading={setLoading}
                viewGridData={viewGridData}
                values={values}
                setPositionHandler={setPositionHandler}
              />
              {/* Pagination Code */}
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                  rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 300, 400, 500]}
                />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
