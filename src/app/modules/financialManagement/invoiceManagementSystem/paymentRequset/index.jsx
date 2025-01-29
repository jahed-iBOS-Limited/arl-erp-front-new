import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "./../../../_helper/_select";
import { useSelector, shallowEqual } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../_metronic/_partials/controls";
import {
  getPlantDDL,
  GetApproveExpensesApi,
  CreatePaymentRequest_api,
  GetApproveAdvancesApi,
  paymentRequestSearchLandingApi,
} from "./helper";
import ClearExpenseGrid from "./clearExpense/clearExpense";
import { _todayDate } from "./../../../_helper/_todayDate";
import Loading from "./../../../_helper/_loading";
import AdvancesForIntGrid from "./advancesForInt/advancesForInt";
import ClearInvoiceGrid from "./clearInvoice/clearInvoice";

const initData = {
  id: undefined,
  requestType: "",
  plant: "",
};
// Validation schema
const validationSchema = Yup.object().shape({});

function PaymentrequsetLanding() {
  const [plantDDL, setPlantDDL] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [clearExpenseGridData, setClearExpenseGridData] = useState([]);
  const [advancesForIntGridData, setAdvancesForIntGridData] = useState([]);
  const [clearInvoiceGridData, setClearInvoiceGridData] = useState([]);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getPlantDDL(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const ViewOnChangeHandler = (values) => {
    if (values?.requestType?.id === 3) {
      /*  =======ClearExpenseGrid =======*/
      GetApproveExpensesApi(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.plant?.value,
        setClearExpenseGridData,
        setDisabled
      );
    } else if (values?.requestType?.id === 4) {
      /*  =======AdvancesForIntGrid =======*/
      GetApproveAdvancesApi(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.plant?.value,
        setAdvancesForIntGridData,
        setDisabled
      );
    } else if (values?.requestType?.id === 1) {
      /*  =======clearInvoiceGrid =======*/
      paymentRequestSearchLandingApi(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.plant?.value,
        setClearInvoiceGridData,
        setDisabled
      );
    }
  };

  // All item select
  const allGridCheck = (value, gridData) => {
    const modifyGridData = gridData?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    return modifyGridData;
  };
  // one item select
  const itemSlectedHandler = (value, index, gridData) => {
    const copyRowDto = [...gridData];
    copyRowDto[index].itemCheck = !copyRowDto[index]?.itemCheck;
    return copyRowDto;
  };

  const clearAndAdvanceSaveDataSet = (values, arr) => {
    const paymentRequestsRow = arr?.map((itm) => ({
      paymentRequestId: 0,
      paymentRequestCode: "",
      paymentRequestDate: _todayDate(),
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      refType: values?.requestType?.value,
      refId: itm?.expenseId || itm?.advanceId,
      refDate: itm?.submitDate,
      refCode: itm?.expenseCode || itm?.advanceCode,
      reqestAmount: itm?.totalApprovedAmount,
      tdsamount: 0,
      vdsamount: 0,
      remarks: itm?.comments,
      journalCreated: true,
      journalCode: "",
      journalPosted: true,
      journalPostBy: 0,
      journalPostingTime: _todayDate(),
      actionBy: profileData?.userId,
    }));
    return paymentRequestsRow;
  };
  const saveHandler = (values) => {
    const clearExpRowDto = clearAndAdvanceSaveDataSet(
      values,
      clearExpenseGridData
    );
    const advForInternalRowDto = clearAndAdvanceSaveDataSet(
      values,
      advancesForIntGridData
    );
    const payload = {
      paymentRequests:
        values?.requestType?.id === 3 ? clearExpRowDto : advForInternalRowDto,
    };
    CreatePaymentRequest_api(payload, null, setDisabled);
  };

  // checkbox select check
  const atListOneItemSelectClearExp = clearExpenseGridData?.some(
    (itm) => itm?.itemCheck
  );
  const atListOneItemSelectAdvancesFor = advancesForIntGridData?.some(
    (itm) => itm?.itemCheck
  );
  const atListOneItemSelectClearInv = clearInvoiceGridData?.some(
    (itm) => itm?.itemCheck
  );
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
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
          <div className="">
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Payment Request"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {disabled && <Loading />}
                <Form className="form form-label-right">
                  <div className="row global-form global-form-custom">
                    <div className="col-lg-3">
                      <NewSelect
                        name="plant"
                        options={plantDDL || []}
                        value={values?.plant}
                        label="Select Plant"
                        onChange={(valueOption) => {
                          setFieldValue("plant", valueOption);
                          setClearExpenseGridData([]);
                          setAdvancesForIntGridData([]);
                        }}
                        placeholder="Select Plant"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="requestType"
                        options={[
                          {
                            value: "Supplier Invoice",
                            label: "Clear Invoice",
                            id: 1,
                          },
                          {
                            value: "Supplier Advance",
                            label: "Supplier Advance",
                            id: 2,
                          },
                          {
                            value: "Internal Expense",
                            label: "Clear Expense",
                            id: 3,
                          },
                          {
                            value: "Internal Advance",
                            label: "Advance For Internal Expense",
                            id: 4,
                          },
                        ]}
                        value={values?.requestType}
                        label="Request Type"
                        onChange={(valueOption) => {
                          setFieldValue("requestType", valueOption);
                          setClearExpenseGridData([]);
                          setAdvancesForIntGridData([]);
                        }}
                        placeholder="Request Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-1">
                      <button
                        onClick={() => {
                          ViewOnChangeHandler(values);
                        }}
                        className="btn btn-primary ml-2 mt-4 mr-2"
                        type="button"
                        disabled={!values?.plant || !values?.requestType}
                      >
                        View
                      </button>
                    </div>
                    {(values?.requestType?.id === 3 ||
                      values?.requestType?.id === 4) && (
                      <div className="col-lg-3">
                        <button
                          onClick={handleSubmit}
                          type="submit"
                          className="btn btn-primary ml-2 mt-4"
                          disabled={
                            atListOneItemSelectAdvancesFor ||
                            atListOneItemSelectClearExp ||
                            atListOneItemSelectClearInv
                              ? false
                              : true
                          }
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>

                  {/*  =======ClearExpenseGrid =======*/}
                  {/* Table Start */}
                  {values?.requestType?.id === 3 && (
                    <ClearExpenseGrid
                      gridData={clearExpenseGridData}
                      allGridCheck={allGridCheck}
                      itemSlectedHandler={itemSlectedHandler}
                      setClearExpenseGridData={setClearExpenseGridData}
                    />
                  )}
                  {/* Table End */}

                  {/*  =======AdvancesForIntGrid =======*/}
                  {/* Table Start */}
                  {values?.requestType?.id === 4 && (
                    <AdvancesForIntGrid
                      gridData={advancesForIntGridData}
                      allGridCheck={allGridCheck}
                      itemSlectedHandler={itemSlectedHandler}
                      setAdvancesForIntGridData={setAdvancesForIntGridData}
                    />
                  )}
                  {/* Table End */}

                  {/*  =======ClearInvoiceGrid =======*/}
                  {/* Table Start */}
                  {values?.requestType?.id === 1 && (
                    <ClearInvoiceGrid
                      gridData={clearInvoiceGridData}
                      allGridCheck={allGridCheck}
                      itemSlectedHandler={itemSlectedHandler}
                      setClearInvoiceGridData={setClearInvoiceGridData}
                    />
                  )}
                  {/* Table End */}
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}

export default PaymentrequsetLanding;
