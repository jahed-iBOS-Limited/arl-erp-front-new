import TableRow from "./grid";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
// import axios from "axios";
import ICalendar from "../../../../_helper/_inputCalender";
import {
  getSbuDDLAction,
  getPurchaseOrgDDLAction,
  getPlantDDLAction,
} from "../../../../_helper/_redux/Actions";
import {
  getOrderTypeListDDLAction,
  getPoReferenceTypeDDLAction,
} from "../_redux/Actions";
import { _todayDate } from "../../../../_helper/_todayDate";
import { toast } from "react-toastify";
import {
  ModalProgressBar,
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "./../../../../../../_metronic/_partials/controls";

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
  refType: "",
  sbu: "",
  purchaseOrg: "",
  plant: "",
  warehouse: "",
  type: 0,
  toDate: _todayDate(),
  fromDate: _todayDate(),
  // customer: "",
};

export default function HeaderForm({
  createinvoice,
  rowDto,
  setRowDto,
  setReportType,
  gridDataFunc,
  itemData,
  allGridCheck,
  loading,
  gridData,
  ReportType,
  paginationState,
}) {
  const history = useHistory();
  let [controlls, setControlls] = useState([]);
  // const [customerDDL, setCustomerDDL] = useState([]);
  const sbuDDL = useSelector((state) => state.commonDDL.sbuDDL);
  const purchaseOrgDDL = useSelector((state) => state.commonDDL.purchaseOrgDDL);
  const plantDDL = useSelector((state) => state.commonDDL.plantDDL);
  const wareHouseDDL = useSelector((state) => state.commonDDL.wareHouseDDL);
  const orderTypeDDL = useSelector((state) => state.purchaseOrder.orderTypeDDL);
  const { pageNo, setPageNo, pageSize, setPageSize } = paginationState;
  const poReferenceTypeDDL = useSelector(
    (state) => state.purchaseOrder.poReferenceTypeDDL
  );
  const [createDisabledBtn, setCreateBtnDisabled] = useState(false);
  // get user profile data from store
  const profileData = useSelector(
    (state) => state.authData.profileData,
    shallowEqual
  );
  // get selected business unit from store
  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit,
    shallowEqual
  );

  // const getCustomerDDL_api = async (accId, buId, setter) => {
  //   try {
  //     const res = await axios.get(
  //       `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
  //     );
  //     if (res.status === 200 && res?.data) {
  //       setter(res?.data);
  //     }
  //   } catch (error) {}
  // };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getSbuDDLAction(profileData.accountId, selectedBusinessUnit.value)
    );
    dispatch(
      getPurchaseOrgDDLAction(profileData.accountId, selectedBusinessUnit.value)
    );
    dispatch(
      getPlantDDLAction(profileData.accountId, selectedBusinessUnit.value)
    );
    dispatch(getOrderTypeListDDLAction());
    // getCustomerDDL_api(
    //   profileData?.accountId,
    //   selectedBusinessUnit?.value,
    //   setCustomerDDL
    // );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  // Get po ref type ddl on ordertype ddl onChange
  const getPoReferenceTypeDDL = (param) => {
    dispatch(getPoReferenceTypeDDLAction(param));
  };

  useEffect(() => {
    let found = rowDto.filter((item) => item?.itemcheck);
    if (found.length > 0) {
      setCreateBtnDisabled(true);
    } else {
      setCreateBtnDisabled(false);
    }
  }, [rowDto]);

  useEffect(() => {
    setControlls([
      {
        label: "SBU",
        name: "sbu",
        options: sbuDDL,
      },
      // {
      //   label: "Customer",
      //   name: "customer",
      //   options: customerDDL || [],
      // },
      {
        label: "Report Type",
        name: "ReportType",
        options: [
          { value: 1, label: "Incomplete" },
          { value: 2, label: "Complete" },
        ],
        defaultValue: [{ value: 1, label: "Incomplete" }],
        dependencyFunc: (payload, values, setter, label) => {
          setReportType(label);
          getPoReferenceTypeDDL(payload);
          setRowDto([]);
          gridDataFunc(
            { ...values, ReportType: { value: payload, label: label } },
            pageNo,
            pageSize,
          );
        },
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sbuDDL,
    purchaseOrgDDL,
    orderTypeDDL,
    plantDDL,
    wareHouseDDL,
    poReferenceTypeDDL,
  ]);

  useEffect(() => {
    if (sbuDDL[0]?.value) {
      const values = {
        ...initData,
        sbu: {
          value: sbuDDL[0]?.value,
          label: sbuDDL[0]?.label,
        },
        ReportType: { value: 1, label: "Incomplete" },
      };
      gridDataFunc(values, pageNo, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData, sbuDDL]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          sbu: {
            value: sbuDDL[0]?.value,
            label: sbuDDL[0]?.label,
          },
          ReportType: { value: 1, label: "Incomplete" },
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Form className="form form-label-right">
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Customer Sales Invoice"}>
                  <CardHeaderToolbar>
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() => {
                        history.push({
                          pathname: "/financial-management/financials/cash",
                        });
                      }}
                    >
                      Cash Journal
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        history.push({
                          pathname: "/financial-management/financials/bank",
                        });
                      }}
                    >
                      Bank Journal
                    </button>
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  <div className="form-group row global-form p-0">
                    {controlls.map((itm, idx) => {
                      return (
                        <div className="col-lg-2">
                          <ISelect
                            dependencyFunc={itm.dependencyFunc}
                            label={itm.label}
                            placeholder={itm.label}
                            options={itm.options || []}
                            defaultValue={values[itm.name]}
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
                    <div
                      className={
                        values.ReportType.value === 1 ? "d-none" : "col-lg-3"
                      }
                    >
                      <label>From Delivery Date</label>
                      <ICalendar
                        value={values.fromDate || ""}
                        name="fromDate"
                        disabled={values.ReportType.value === 1 ? true : false}
                      />
                    </div>
                    <div
                      className={
                        values.ReportType.value === 1 ? "d-none" : "col-lg-3"
                      }
                    >
                      <label>To Delivery Date</label>
                      <ICalendar
                        value={values.toDate || ""}
                        name="toDate"
                        disabled={values.ReportType.value === 1 ? true : false}
                      />
                    </div>

                    {values.ReportType?.label === "Incomplete" && (
                      <div className="col-lg-3 mt-6">
                        <div
                          role="group"
                          aria-labelledby="my-radio-group"
                          className="d-flex justify-content-between"
                        >
                          <label>
                            <Field
                              component={() => (
                                <input
                                  type="radio"
                                  name="type"
                                  checked={values.type === "1"}
                                  className="mr-2 pointer"
                                  onChange={(e) => {
                                    setFieldValue("type", "1");
                                    //invoicetype=1;
                                  }}
                                />
                              )}
                            />
                            Delivery Wise
                          </label>
                          <label>
                            <Field
                              component={() => (
                                <input
                                  type="radio"
                                  name="type"
                                  checked={values.type === "2"}
                                  className="mr-2 pointer"
                                  onChange={(e) => {
                                    setFieldValue("type", "2");
                                    //invoicetype=2;
                                  }}
                                />
                              )}
                            />
                            Customer Wise
                          </label>
                        </div>
                      </div>
                    )}
                    <div style={{ marginTop: "22px" }}>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => {
                          gridDataFunc(values, pageNo, pageSize);
                        }}
                        disabled={
                          !values?.sbu ||
                          // !values?.customer ||
                          !values?.ReportType
                          // || !values?.type
                        }
                      >
                        View
                      </button>
                      {values?.ReportType?.value !== 2 && (
                        <button
                          type="button"
                          className="btn btn-primary ml-2"
                          disabled={!createDisabledBtn}
                          onClick={() => {
                            if (rowDto.length === 0) {
                              toast.warn("Grid Data Empty");
                            } else {
                              if (values.ReportType.value === 1) {
                                const gridRefresh = () => {
                                  gridDataFunc(values, pageNo, pageSize);
                                };
                                createinvoice(
                                  values.type,
                                  values.sbu.value,
                                  values.ReportType.value,
                                  values.fromDate,
                                  values.toDate,
                                  gridRefresh
                                );
                                gridRefresh(
                                  values.ReportType.value,
                                  values.fromDate,
                                  values.toDate
                                );
                              } else {
                                toast.warn("Please Select Incomplete Data", {
                                  toastId: 456,
                                });
                              }
                            }
                          }}
                        >
                          Create
                        </button>
                      )}
                    </div>
                  </div>
                  <TableRow
                    rowdata={rowDto}
                    itemData={itemData}
                    allGridCheck={allGridCheck}
                    loading={loading}
                    ReportType={ReportType}
                    gridDataFunc={gridDataFunc}
                    gridData={gridData}
                    values={values}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                  />
                </CardBody>
              </Card>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
