import Axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import IConfirmModal from "../../../../_helper/_confirmModal";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import printIcon from "../../../../_helper/images/print-icon.png";
import { setRentalVehilceCostLandingAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import {
  EditRentalVehicleBillSubmit_api,
  GetRentalVehicleCostLandingPasignation_api,
} from "../helper";
import IEdit from './../../../../_helper/_helperIcons/_edit';

const validationSchema = Yup.object().shape({
  reportType: Yup.object().shape({
    label: Yup.string().required("Report Type  is required"),
    value: Yup.string().required("Report Type  is required"),
  }),
});

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  reportType: {
    value: 1,
    label: "Pending",
  },
  supplierName: { value: 0, label: "All" },
  reportTypeOne: { value: 0, label: "All" },
  itemLists: [],
};

const colSpan = {
  Pending: 11,
  Complete: 10,
  // eslint-disable-next-line no-useless-computed-key
  ["Bill Submit"]: 10,
};
const RentalVehilceCostModifiedLanding = () => {
  const [loading, setLoading] = useState(false);
  const [billSubmitBtn, setBillSubmitBtn] = useState(true);
  const [intItemLists, setIntItemLists] = useState([]);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const printRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const rentalVehilceCostLanding = useSelector((state) => {
    return state.localStorage?.rentalVehilceCostLanding;
  }, shallowEqual);
  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);
  const gridDataFunc = (values, setter, setFieldValue, searchText) => {
    const billSubmitType = values?.reportType?.value === 3 ? true : false;
    const status = values?.reportType?.value === 1 ? false : true;
    GetRentalVehicleCostLandingPasignation_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      status,
      setter,
      setFieldValue,
      setLoading,
      searchText,
      billSubmitType,
      values?.supplierName?.value,
      values?.shipPoint?.value,
      values?.reportTypeOne?.value
    );
  };

  const paginationSearchHandler = (searchValue, values, setFieldValue) => {
    setFieldValue("itemLists", []);
    gridDataFunc(values, null, setFieldValue, searchValue);
  };

  const saveHandler = (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      let confirmObject = {
        title: "Are you sure?",
        yesAlertFunc: () => {
          if (values?.itemLists.length > 0) {
            // send all items when type COMPLETE is selected
            // otherwise send selected items
            const filterSelectedData = values?.itemLists?.filter(
              (item) => item?.itemCheck
            );

            const paylaod = filterSelectedData?.map((itm) => ({
              tripId: itm?.tripId || 0,
              additionalCost: +itm?.additionalCost || 0,
              additionalCostReason: itm?.additionalCostReason || "",
              deductionCost: +itm?.deductionCost || 0,
              deductionCostReason: itm?.deductionCostReason || "",
              actionBy: profileData?.userId,
            }));

            if (values?.reportType?.value === 2) {
              EditRentalVehicleBillSubmit_api(
                paylaod,
                cb,
                setLoading,
                setBillSubmitBtn
              );
            } else {
              
            }
          } else {
            toast.warning("Item not selected");
          }
        },
        noAlertFunc: () => {},
      };
      IConfirmModal(confirmObject);
    } else {
      setLoading(false);
    }
  };

  // one item select
  const itemSlectedHandler = (value, index, setFieldValue, values) => {
    const copyRowDto = [...values?.itemLists];
    copyRowDto[index].itemCheck = !copyRowDto[index].itemCheck;
    setFieldValue("itemLists", copyRowDto);

    // btn hide conditon
    const bllSubmitBtn = copyRowDto.some((itm) => itm.itemCheck === true);
    if (bllSubmitBtn) {
      setBillSubmitBtn(false);
    } else {
      setBillSubmitBtn(true);
    }
  };

  // All item select
  const allGridCheck = (value, setFieldValue, values) => {
    const modifyGridData = values?.itemLists?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    setFieldValue("itemLists", modifyGridData);
    // btn hide conditon
    const bllSubmitBtn = modifyGridData.some((itm) => itm.itemCheck === true);
    if (bllSubmitBtn) {
      setBillSubmitBtn(false);
    } else {
      setBillSubmitBtn(true);
    }
  };

  const claculator = (arr, key) => {
    const total = arr?.reduce((acc, cur) => (acc += +cur?.[key]), 0);
    return total;
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      gridDataFunc(rentalVehilceCostLanding, setIntItemLists, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const loadOptions = async (v) => {
    await [{ value: 0, label: "All" }];
    if (v.length < 3) return [{ value: 0, label: "All" }];
    return Axios.get(
      `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${
        profileData?.accountId
      }&UnitId=${selectedBusinessUnit?.value}&SBUId=${0}`
    ).then((res) => {
      const updateList = res?.data.map((item) => ({
        ...item,
      }));
      return [{ value: 0, label: "All" }, ...updateList];
    });
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        ...rentalVehilceCostLanding,
        itemLists: intItemLists || [],

      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
        saveHandler(values, () => {
          resetForm(initData);
          gridDataFunc(values, null, setFieldValue);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        errors,
        touched,
        setFieldValue,
        isValid,
      }) => (
        <>
          {loading && <Loading />}
          <Card>
            {true && <ModalProgressBar />}
            <CardHeader title="Rental Vehicle Cost">
              <CardHeaderToolbar>
                {values?.reportType?.value === 1 && (
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary ml-2"
                    type="submit"
                    // alway active save button when type Complete is slected
                    disabled={billSubmitBtn}
                    // disabled={billSubmitBtn}
                  >
                    Save
                  </button>
                )}
                {values?.reportType?.value === 2 && (
                  <ReactToPrint
                    trigger={() => (
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ padding: "2px 5px" }}
                      >
                        <img
                          style={{
                            width: "25px",
                            paddingRight: "5px",
                          }}
                          src={printIcon}
                          alt="print-icon"
                        />
                        Print
                      </button>
                    )}
                    content={() => printRef.current}
                  />
                )}
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <Form className="form form-label-right rentalVehicleCost">
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipPoint"
                        options={[{ value: 0, label: "All" }, ...shipPointDDL]}
                        value={values?.shipPoint}
                        label="Shippoint"
                        onChange={(valueOption) => {
                          setFieldValue("shipPoint", valueOption);
                          setFieldValue("itemLists", []);
                    
                        }}
                        placeholder="Shippoint"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Supplier Name</label>
                      <SearchAsyncSelect
                        selectedValue={values.supplierName}
                        handleChange={(valueOption) => {
                          setFieldValue("itemLists", []);
                          setFieldValue("supplierName", valueOption);
                        }}
                        loadOptions={loadOptions}
                      />
                      <FormikError
                        errors={errors}
                        name="supplierName"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                    <NewSelect
                      label="Report Type"
                      options={[
                        { value: 0, label: "All" },
                        { value: 1, label: "Delivery Chalan" },
                        { value: 2, label: "Transfer Chalan" },
                      ]}
                      value={values?.reportTypeOne}
                      placeholder="Report Type"
                      name="reportTypeOne"
                      onChange={(valueOption) => {
                        setFieldValue("itemLists", []);
                        setFieldValue("reportTypeOne", valueOption);
                  
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="reportType"
                        options={[
                          { value: 1, label: "Pending" },
                          { value: 2, label: "Complete" },
                          // { value: 3, label: "Bill Submit" },
                        ]}
                        value={values?.reportType}
                        label="Type"
                        onChange={(valueOption) => {
                          setFieldValue("itemLists", []);
                          setFieldValue("reportType", valueOption);
                     
                        }}
                        placeholder="Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    
                    <div className="col-lg-3">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>From Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                      />
                    </div>

                    <div
                      className="col text-right"
                      style={{ marginTop: "14px" }}
                    >
                      <button
                        type="button"
                        className="btn btn-primary mr-2"
                        onClick={() => {
                          setFieldValue("itemLists", []);
                          dispatch(setRentalVehilceCostLandingAction(values));
                          gridDataFunc(values, null, setFieldValue);
                        }}
                        disabled={
                          !values?.shipPoint ||
                          !values?.supplierName ||
                          !values?.reportType
                        }
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <PaginationSearch
                  placeholder="Shipment Code  & Vehicle No"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                  setFieldValue={setFieldValue}
                />
                <div className="print_wrapper">
                  <div className="react-bootstrap-table table-responsive">
                    <div className="loan-scrollable-table scroll-table-auto">
                      <div
                        style={{ maxHeight: "540px" }}
                        className="scroll-table _table scroll-table-auto table-responsive"
                      >
                        {values?.itemLists?.length > 0 && (
                          <table
                            className="table table-striped table-bordered global-table"
                            componentRef={printRef}
                            ref={printRef}
                          >
                            {/* <table className='table table-striped table-bordered global-table'> */}
                            <thead>
                              <tr>
                                {/* only show checkbox when pending type is selected */}
                                {values?.reportType?.value === 1 && (
                                  <th style={{ minWidth: "20px" }}>
                                    <input
                                      type="checkbox"
                                      id="parent"
                                      onChange={(e) => {
                                        allGridCheck(
                                          e.target.checked,
                                          setFieldValue,
                                          values
                                        );
                                      }}
                                    />
                                  </th>
                                )}
                                <th style={{ minWidth: "45px" }}>
                                  SL No.
                                </th>
                                <th style={{ minWidth: "145px" }}>
                                  Supplier Name
                                </th>
                                <th style={{ minWidth: "140px" }}>
                                  Ship To Party Name
                                </th>
                                <th style={{ minWidth: "102px" }}>
                                  Shipment Code
                                </th>
                                <th style={{ minWidth: "110px" }}>
                                  Chalan No.
                                </th>
                                <th style={{ minWidth: "60px" }}>Total Qty</th>
                                <th style={{ minWidth: "105px" }}>
                                  Vehicle No.
                                </th>

                                <th style={{ minWidth: "155px" }}>
                                  Route Name
                                </th>
                                <th style={{ minWidth: "70px" }}>Zone Name</th>
                                <th style={{ minWidth: "60px" }}>
                                  Distance KM
                                </th>
                                <th style={{ minWidth: "60px" }}>Rental</th>
                                <th style={{ minWidth: "60px" }}>Additional</th>
                                <th style={{ minWidth: "70px" }}>
                                  Additional Reason
                                </th>
                                <th style={{ minWidth: "65px" }}>
                                  Deduction Cost
                                </th>
                                <th style={{ minWidth: "70px" }}>
                                  Deduction Cost Reason
                                </th>
                                <th style={{ minWidth: "60px" }}>
                                  Net Payable
                                </th>
                                  <th style={{ minWidth: "50px" }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {values?.itemLists?.map((data, index) => {
                                const netPayable =
                                  +data?.totalCost +
                                  +data?.additionalCost -
                                  +data?.deductionCost;
                                return (
                                  <tr key={index}>
                                    {/* only show checkbox when pending type is selected */}

                                    {values?.reportType?.value === 1 && (
                                      <td>
                                        <input
                                          type="checkbox"
                                          className=""
                                          value={data.itemCheck}
                                          checked={data.itemCheck}
                                          name={data.itemCheck}
                                          onChange={(e) => {
                                            itemSlectedHandler(
                                              e.target.checked,
                                              index,
                                              setFieldValue,
                                              values
                                            );
                                          }}
                                        />
                                      </td>
                                    )}
                                    <td className="text-center">{index + 1}</td>
                                    <td>{data?.supplierName}</td>
                                    <td>{data?.partnerName}</td>
                                    <td>{data?.shipmentCode}</td>
                                    <td>{data?.challanNo}</td>
                                    <td className="text-right">
                                      {data?.totalQty}
                                    </td>
                                    <td>{data?.vehicleNo}</td>

                                    <td>{data?.routeName}</td>
                                    <td>{data?.zoneName}</td>
                                    <td className="text-right">
                                      {data?.distanceKm}
                                    </td>
                                    <td className="text-right">
                                      {data?.totalCost}
                                    </td>
                                    <td className="text-right">
                                      {values?.itemLists[index]?.additionalCost}
                                    </td>
                                    <td className="text-right">
                                      {
                                        values?.itemLists[index]
                                          ?.additionalCostReason
                                      }
                                    </td>
                                    <td className="text-right">
                                      {values?.itemLists[index]?.deductionCost}
                                    </td>
                                    <td className="text-right">
                                      {
                                        values?.itemLists[index]
                                          ?.deductionCostReason
                                      }
                                    </td>
                                    <td className="text-right">{netPayable}</td>
                                    <td className="text-center">
                                      <span
                                        onClick={(e) => {
                                          dispatch(
                                            setRentalVehilceCostLandingAction(
                                              values
                                            )
                                          );
                                          history.push({
                                            pathname: `/transport-management/routecostmanagement/rentalVehicleCostModified/edit/${data?.challanNo}`,
                                            // state: {
                                            //   data: {
                                            //     ...data,
                                            //     rentAmount:
                                            //       data?.totalCost || 0,
                                            //   },
                                            // },
                                          });
                                        }}
                                      >
                                        <IEdit/>
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td
                                  // colspan={values?.reportType?.value !== 3 ? 8 : 7}
                                  // colspan={values?.reportType?.value !== 3 ? 7 : 7}
                                  colspan={colSpan[values?.reportType?.label]}
                                  className="text-right"
                                >
                                  <b>Total Amount:</b>
                                </td>
                                <td className="text-right">
                                  <b>
                                    {" "}
                                    {claculator(values?.itemLists, "totalCost")}
                                  </b>
                                </td>

                                <td className="text-right">
                                  <b>
                                    {claculator(
                                      values?.itemLists,
                                      "additionalCost"
                                    )}
                                  </b>
                                </td>
                                <td> </td>
                                <td className="text-right">
                                  <b>
                                    {claculator(
                                      values?.itemLists,
                                      "deductionCost"
                                    )}
                                  </b>
                                </td>
                                <td> </td>
                                <td className="text-right">
                                  <b>
                                    {" "}
                                    {values?.itemLists?.reduce(
                                      (acc, cur) =>
                                        (acc +=
                                          +cur?.totalCost +
                                          +cur?.additionalCost -
                                          +cur?.deductionCost),
                                      0
                                    )}
                                  </b>
                                </td>
                                {values?.reportType?.value === 1 && <td></td>}
                              </tr>
                            </tfoot>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </CardBody>
          </Card>
        </>
      )}
    </Formik>
  );
};

export default RentalVehilceCostModifiedLanding;
