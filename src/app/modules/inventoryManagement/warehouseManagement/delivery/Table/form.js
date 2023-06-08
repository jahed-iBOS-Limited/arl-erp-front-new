import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import { TableRow } from "./tableRow";
import NewSelect from "./../../../../_helper/_select";
import { useSelector } from "react-redux";
import { shallowEqual, useDispatch } from "react-redux";
import {
  getSBUDDLDelivery_Aciton,
  getDistributionChannelDDLAction,
  GetShipPointDDLAction,
  getDeliveryGridData,
  GetWarehouseDDLAction,
  clearGridDataActions,
} from "../_redux/Actions";
import { setDeliveryLandingAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import InputField from "./../../../../_helper/_inputField";
import { _todayDate } from "./../../../../_helper/_todayDate";
// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  sbu: "",
  distributionChannel: "",
  shipPoint: "",
  status: { value: false, label: "Incomplete" },
  from: _todayDate(),
  to: _todayDate(),
};
export default function HeaderFormDedivery() {
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const deliveryLanding = useSelector((state) => {
    return state.localStorage.deliveryLanding;
  });

  let delivery = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        SBUDDL: state.delivery.SBUDDL,
        distributionChannelDDL: state.delivery.distributionChannelDDL,
        shipPointDDL: state.delivery.shipPointDDL,
      };
    },
    { shallowEqual }
  );

  let {
    profileData,
    selectedBusinessUnit,
    SBUDDL,
    distributionChannelDDL,
    shipPointDDL,
  } = delivery;

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getSBUDDLDelivery_Aciton(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
      dispatch(
        GetShipPointDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      deliveryLanding?.sbu?.value
    ) {
      commonGridFunc(
        pageNo,
        pageSize,
        null,
        deliveryLanding?.sbu?.value,
        deliveryLanding?.shipPoint?.value,
        deliveryLanding?.distributionChannel?.value,
        deliveryLanding?.status?.value,
        deliveryLanding?.from,
        deliveryLanding?.to
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);
  //commonGridFunc
  const commonGridFunc = (
    pageNo,
    pageSize,
    searchValue,
    sbuId,
    shipPointId,
    channelId,
    status,
    fromDate,
    toDate
  ) => {
    dispatch(
      getDeliveryGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        setLoading,
        pageNo,
        pageSize,
        searchValue,
        sbuId,
        shipPointId,
        channelId,
        status,
        fromDate,
        toDate
      )
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    commonGridFunc(
      pageNo,
      pageSize,
      searchValue,
      values?.sbu?.value,
      values?.shipPoint?.value,
      values?.distributionChannel?.value,
      values?.status?.value,
      values?.from,
      values?.to
    );
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    commonGridFunc(
      pageNo,
      pageSize,
      null,
      values?.sbu?.value,
      values?.shipPoint?.value,
      values?.distributionChannel?.value,
      values?.status?.value,
      values?.from,
      values?.to
    );
  };

  const channelList =
    selectedBusinessUnit?.value === 171 || selectedBusinessUnit?.value === 224
      ? [{ value: 0, label: "All" }, ...(distributionChannelDDL || [])]
      : distributionChannelDDL;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, ...deliveryLanding }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Delivery"}>
                <CardHeaderToolbar>
                  <button
                    disabled={
                      !values?.shipPoint ||
                      !values?.distributionChannel ||
                      !values?.sbu
                    }
                    onClick={() => {
                      dispatch(setDeliveryLandingAction(values));
                      history.push({
                        pathname: `/inventory-management/warehouse-management/delivery/add`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-2">
                      <NewSelect
                        name="sbu"
                        options={SBUDDL || []}
                        value={values?.sbu}
                        label="SBU"
                        onChange={(valueOption) => {
                          setFieldValue("distributionChannel", "");
                          dispatch(clearGridDataActions([]));
                          setFieldValue("sbu", valueOption);
                          dispatch(
                            getDistributionChannelDDLAction(
                              profileData.accountId,
                              selectedBusinessUnit.value,
                              valueOption?.value
                            )
                          );
                        }}
                        placeholder="SBU"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="distributionChannel"
                        options={channelList || []}
                        value={values?.distributionChannel}
                        label="Distribution Channel"
                        onChange={(valueOption) => {
                          setFieldValue("distributionChannel", valueOption);
                          dispatch(clearGridDataActions([]));
                        }}
                        placeholder="Distribution Channel"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="shipPoint"
                        options={
                          [{ value: 0, label: "All" }, ...shipPointDDL] || []
                        }
                        value={values?.shipPoint}
                        label="Ship Point"
                        onChange={(valueOption) => {
                          setFieldValue("shipPoint", valueOption);
                          dispatch(clearGridDataActions([]));
                          dispatch(
                            GetWarehouseDDLAction(
                              profileData.accountId,
                              selectedBusinessUnit.value,
                              valueOption?.value
                            )
                          );
                        }}
                        placeholder="Ship Point"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="status"
                        options={
                          [
                            { value: false, label: "Incomplete" },
                            { value: true, label: "Complete" },
                          ] || []
                        }
                        value={values?.status}
                        label="Status"
                        onChange={(valueOption) => {
                          dispatch(clearGridDataActions([]));
                          setFieldValue("status", valueOption);
                        }}
                        placeholder="Status"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    {/* Last Change Assign By Iftakhar Alam */}
                    {/* {values?.status?.value === false ? (
                      <> */}
                    <div className="col-lg-2">
                      <label>From</label>
                      <InputField
                        value={values?.from}
                        name="from"
                        placeholder={_todayDate()}
                        onChange={(e) => {
                          setFieldValue("from", e.target.value);
                          dispatch(clearGridDataActions([]));
                        }}
                        type="date"
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>To</label>
                      <InputField
                        value={values?.to}
                        name="to"
                        placeholder={_todayDate()}
                        onChange={(e) => {
                          setFieldValue("to", e.target.value);
                          dispatch(clearGridDataActions([]));
                        }}
                        type="date"
                      />
                    </div>
                    {/* </>
                    ) : (
                      ""
                    )} */}

                    <div
                      className={
                        // values?.status?.value === true
                        //   ? "col-lg-3"
                        //   : "col-lg-3 offset-9 d-flex justify-content-end"
                        "col-lg-3 offset-9 d-flex justify-content-end"
                      }
                    >
                      <button
                        type="button"
                        className="btn btn-primary mt-5"
                        onClick={() => {
                          dispatch(setDeliveryLandingAction(values));
                          commonGridFunc(
                            pageNo,
                            pageSize,
                            null,
                            values?.sbu?.value,
                            values?.shipPoint?.value,
                            values?.distributionChannel?.value,
                            values?.status?.value,
                            values?.from,
                            values?.to
                          );
                        }}
                        disabled={
                          !values?.shipPoint ||
                          !values?.distributionChannel ||
                          !values?.sbu
                        }
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <TableRow
                    pageNo={pageNo}
                    setPageNo={setPageNo}
                    setPositionHandler={setPositionHandler}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    loading={loading}
                    setLoading={setLoading}
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
