import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import InputField from "./../../../../../_helper/_inputField";
import { useLocation, useHistory } from "react-router-dom";
import NewSelect from "./../../../../../_helper/_select";
import {
  GetApproveExpensesGroupApi,
  GetApproveAdvancesApi,
  billregisterAttachment_action,
  SaveBillRegister_api,
  GetApproveExpensesApi,
  getExpenseFor,
  getCostCenterDDL,
} from "./../../helper";
import moment from "moment";
import Loading from "./../../../../../_helper/_loading";
import AdvancesForIntGrid from "./../../advancesForInt/advancesForInt";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import InternalExpenseGrid from "../../internalExpense/InternalExpenseGrid";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { YearDDL } from "./../../../../../_helper/_yearDDL";
import { _dateFormatter } from "./../../../../../_helper/_dateFormate";
import { _todayDate } from "./../../../../../_helper/_todayDate";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../../_metronic/_partials/controls";
import { toast } from "react-toastify";
// Validation schema
const validationSchema = Yup.object().shape({});
const monthDDL = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];
const startOfMonth = moment(_todayDate())
  .startOf("month")
  .format();
export default function HeaderForm() {
  const [open, setOpen] = React.useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [expenseFor, setExpenseFor] = useState([]);
  const [costCenterDDL, setCostCenterDDL] = useState([]);
  const [isDisabled, setDisabled] = useState(false);
  const { state: headerData } = useLocation();
  const billType = headerData?.billType?.value;
  const initData = {
    year: {
      value: new Date().getFullYear(),
      label: `${new Date().getFullYear()}`,
    },
    month: monthDDL[new Date().getMonth()],
    CfromDate: _dateFormatter(startOfMonth),
    CtoDate: _todayDate(),
    id: undefined,
    narration: "",
    costCenter: "",
    billNo: "",
    // CfromDate: "",
    // CtoDate: "",
    expenseFor: "",
    expenseGroup:
      headerData?.billType?.value === 4
        ? {
            value: "Other",
            label: "Other",
          }
        : "",
    isGroup:
      headerData?.billType?.value === 4 ? { value: 2, label: "Group" } : "",
  };

  const history = useHistory();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getExpenseFor(
        profileData.accountId,
        selectedBusinessUnit.value,
        setExpenseFor
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const backHandler = () => {
    history.goBack();
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
  const expenseGroupOnChangeHandler = (values, type) => {
    // type Group
    if (values?.isGroup?.value === 2) {
      GetApproveExpensesGroupApi(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.plant?.value,
        values?.sbu?.value,
        setGridData,
        setDisabled,
        type,
        values?.CfromDate,
        values?.CtoDate,
        values?.expenseFor?.value,
        values?.costCenter?.value
      );
    } else if (values?.isGroup?.value === 1) {
      // type Individual
      GetApproveExpensesApi(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.plant?.value,
        values?.sbu?.value,
        setGridData,
        setDisabled,
        type,
        values?.CfromDate,
        values?.CtoDate,
        values?.expenseFor?.value,
        values?.costCenter?.value
      );
    }
  };

  const girdDataFunc = (values) => {
    // Internal Expense (Bill Register) view api
    if (values?.billType?.value === 4) {

      // if business unit Akij Shipping Lines Ltd.
      if (!values?.costCenter?.value && selectedBusinessUnit?.value === 17)
        return toast.warn("Cost Center must be select");

      const type = values?.expenseGroup?.value === "TaDa" ? 5 : 4;
      // Expense Register && Internal TA
      if (values?.expenseGroup?.value) {
        expenseGroupOnChangeHandler(values, type);
      }
    } else if (values?.billType?.value === 3) {
      //Advance For Internal Expense
      GetApproveAdvancesApi(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.plant?.value,
        values?.sbu?.value,
        setGridData,
        setDisabled
      );
    }
  };

  useEffect(() => {
    if (headerData?.billType?.value) {
      // girdDataFunc({ ...headerData, ...initData });
      const values = { ...headerData, ...initData };
      getCostCenterDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        values?.sbu?.value,
        setCostCenterDDL
      );
      if (values?.billType?.value === 3) {
        //Advance For Internal Expense
        GetApproveAdvancesApi(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          values?.plant?.value,
          values?.sbu?.value,
          setGridData,
          setDisabled
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerData]);
  const modalView = (code) => {
    return confirmAlert({
      title: `Bill Code: ${code} `,
      message: "",
      buttons: [],
    });
  };

  // saveHandler
  const saveHandler = (values) => {
    const allFromData = { ...headerData, ...values };
    let totalAdvanceAmount = 0;
    const commonRow = gridData
      ?.filter((item) => item?.itemCheck)
      ?.map((item) => {
        totalAdvanceAmount += item?.advanceAmount || 0;
        return {
          expanceId: item?.expenseId || item?.advanceId,
          naration: values?.narration || "",
          adjustAmount: +item?.adjustAmount || 0,
          netAmount: +item?.netAmount || 0,
          billRef: values?.billNo || "",
          billTypeId: billType,
          plantId: headerData?.plant?.value || 0,
          sbuId: headerData?.sbu?.value || 0,
          costCenterName: values?.costCenter?.label || "",
          costCenterId: values?.costCenter?.value || 0,
        };
      });
    // Internal Expense row
    let internalExpenseRow = [];
    if (billType === 4) {
      // if business unit Akij Shipping Lines Ltd.
      if (!values?.costCenter?.value && selectedBusinessUnit?.value === 17)
        return toast.warn("Cost Center must be select");

      if (values?.isGroup?.value === 2) {
        const itemCheckFilter = gridData?.filter((item) => item?.itemCheck);
        totalAdvanceAmount = itemCheckFilter?.[0]?.advanceAmount || 0;
        itemCheckFilter.forEach((element) => {
          let adjustAmountParent = +element.adjustAmount || 0;
          if (element?.subItem?.length > 0) {
            element.subItem.forEach((subItem) => {
              let netAmount = +subItem.netAmount || 0;
              let adjustAmount = 0;

              if (adjustAmountParent > 0) {
                if (adjustAmountParent >= netAmount) {
                  adjustAmount = netAmount;
                  adjustAmountParent = adjustAmountParent - netAmount;
                  netAmount = 0;
                } else {
                  adjustAmount = adjustAmountParent;
                  netAmount = netAmount - adjustAmountParent;
                  adjustAmountParent = 0;
                }
              }
              const obj = {
                expanceId: subItem?.expenseId,
                naration: values?.narration || "",
                adjustAmount: +adjustAmount || 0,
                netAmount: +netAmount || 0,
                billRef: values?.billNo || "",
                billTypeId: billType,
                plantId: headerData?.plant?.value || 0,
                sbuId: headerData?.sbu?.value || 0,
                costCenterName: values?.costCenter?.label || "",
                costCenterId: values?.costCenter?.value || 0,
              };
              internalExpenseRow.push(obj);
            });
          }
        });
      } else {
        internalExpenseRow = commonRow;
      }
    }
    const payload = {
      obj: billType === 4 ? internalExpenseRow : commonRow,
      img: [],
    };
    if (fileObjects?.length > 0) {
      // if image upload
      billregisterAttachment_action(fileObjects, setDisabled)
        .then((data) => {
          const newPayload = {
            ...payload,
            img: data?.map((itm) => ({ imageId: itm?.id })),
          };
          SaveBillRegister_api(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            profileData?.userId,
            totalAdvanceAmount,
            newPayload,
            setDisabled,
            girdDataFunc,
            allFromData,
            setFileObjects,
            modalView
          );
        })
        .catch((err) => console.log(err?.message));
    } else {
      // not image upload
      SaveBillRegister_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.userId,
        totalAdvanceAmount,
        payload,
        setDisabled,
        girdDataFunc,
        allFromData,
        setFileObjects,
        modalView
      );
    }
  };

  const atListOneItemSelectGridData = gridData?.some((itm) => itm?.itemCheck);

  const dateSetFunction = (month, year) => {
    var newDate = moment();
    newDate.set("month", month - 1);
    newDate.set("year", year);
    const firstDate = _dateFormatter(
      moment(newDate)
        .startOf("month")
        .format()
    );
    const lestDate = _dateFormatter(
      moment(newDate)
        .endOf("month")
        .format()
    );
    return { lestDate, firstDate };
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          errors,
          touched,
          setFieldValue,
          isValid,
          values,
          handleSubmit,
        }) => (
          <>
            {isDisabled && <Loading />}
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader
                title={`${headerData?.billType?.label} (${"Bill Register"})`}
              >
                <CardHeaderToolbar>
                  <button
                    type="button"
                    onClick={backHandler}
                    className={"btn btn-light"}
                  >
                    <i className="fa fa-arrow-left"></i>
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary ml-2"
                    type="submit"
                    disabled={!atListOneItemSelectGridData}
                  >
                    Save
                  </button>
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-primary ml-2"
                    table="table-to-xlsx"
                    filename="internal_Expense_Bill_Register"
                    sheet="tablexls"
                    buttonText="Export Excel"
                  />
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3 ">
                      <label>Narration</label>
                      <InputField
                        value={values?.narration}
                        name="narration"
                        placeholder="Narration"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Bill No</label>
                      <InputField
                        value={values?.billNo}
                        name="billNo"
                        placeholder="Bill No"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <button
                        className="btn btn-primary mr-2 mt-5"
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        Attachment
                      </button>
                    </div>
                  </div>
                  {headerData?.billType?.value === 4 && (
                    <div className="row global-form">
                      <div className="col-lg-3">
                        <NewSelect
                          name="expenseGroup"
                          options={[
                            {
                              value: "TaDa",
                              label: "Ta/Da",
                            },
                            {
                              value: "Other",
                              label: "Other",
                            },
                          ]}
                          value={values?.expenseGroup}
                          label="Expense Group"
                          onChange={(valueOption) => {
                            setFieldValue("expenseGroup", valueOption);
                            setGridData([]);
                            const moddingValues = {
                              ...values,
                              expenseGroup: valueOption,
                            };
                            girdDataFunc({ ...headerData, ...moddingValues });
                          }}
                          placeholder="Expense Group"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          isClearable={false}
                          label="Year "
                          placeholder="Year"
                          name="year"
                          options={YearDDL()}
                          value={values?.year}
                          onChange={(valueOption) => {
                            setGridData([]);
                            setFieldValue("year", valueOption);
                            var newDate = moment();
                            newDate.set("month", values?.month?.value - 1);
                            newDate.set("year", valueOption?.value);
                            setFieldValue(
                              "CfromDate",
                              _dateFormatter(
                                moment(newDate)
                                  .startOf("month")
                                  .format()
                              )
                            );
                            setFieldValue("CtoDate", _dateFormatter(newDate));
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          isClearable={false}
                          label="Month"
                          placeholder="Month"
                          name="month"
                          options={monthDDL}
                          value={values?.month}
                          onChange={(valueOption) => {
                            setGridData([]);
                            setFieldValue("month", valueOption);
                            var newDate = moment();
                            newDate.set("month", valueOption?.value - 1);
                            newDate.set("year", values?.year?.value);

                            setFieldValue(
                              "CfromDate",
                              _dateFormatter(
                                moment(newDate)
                                  .startOf("month")
                                  .format()
                              )
                            );
                            setFieldValue("CtoDate", _dateFormatter(newDate));
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>From Date</label>
                        <InputField
                          value={values?.CfromDate}
                          placeholder="From Date"
                          name="CfromDate"
                          type="date"
                          touched={touched}
                          onChange={(e) => {
                            setGridData([]);
                            setFieldValue("CfromDate", e.target.value);
                          }}
                          min={
                            dateSetFunction(
                              values?.month?.value,
                              values?.year?.value
                            )?.firstDate
                          }
                          max={
                            dateSetFunction(
                              values?.month?.value,
                              values?.year?.value
                            )?.lestDate
                          }
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>To Date</label>
                        <InputField
                          value={values?.CtoDate}
                          placeholder="To Date"
                          name="CtoDate"
                          type="date"
                          touched={touched}
                          onChange={(e) => {
                            setGridData([]);
                            setFieldValue("CtoDate", e.target.value);
                          }}
                          min={
                            dateSetFunction(
                              values?.month?.value,
                              values?.year?.value
                            )?.firstDate
                          }
                          max={
                            dateSetFunction(
                              values?.month?.value,
                              values?.year?.value
                            )?.lestDate
                          }
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="expenseFor"
                          options={expenseFor || []}
                          value={values?.expenseFor}
                          label="Request By Name"
                          onChange={(valueOption) => {
                            setGridData([]);
                            setFieldValue("expenseFor", valueOption);
                          }}
                          placeholder="Request By Name"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="isGroup"
                          options={
                            [
                              { value: 2, label: "Group" },
                              { value: 1, label: "Individual" },
                            ] || []
                          }
                          value={values?.isGroup}
                          label="View Type"
                          onChange={(valueOption) => {
                            setGridData([]);
                            setFieldValue("isGroup", valueOption);
                          }}
                          placeholder="View Type"
                          errors={errors}
                          touched={touched}
                          isClearable={false}
                        />
                      </div>
                      {selectedBusinessUnit?.value === 17 && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="costCenter"
                            options={costCenterDDL || []}
                            value={values?.costCenter || ""}
                            label="Cost Center"
                            onChange={(valueOption) => {
                              setFieldValue("costCenter", valueOption);
                              setGridData([]);
                            }}
                            placeholder="Cost Center"
                            isDisabled={!headerData?.sbu?.value}
                          />
                        </div>
                      )}

                      <div className="col pr-0 d-flex align-items-end mt-2 justify-content-end">
                        <button
                          onClick={() => {
                            setGridData([]);
                            girdDataFunc({ ...headerData, ...values });
                          }}
                          type="button"
                          className="btn btn-primary ml-2"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  )}
                  {billType === 4 && (
                    <InternalExpenseGrid
                      gridData={gridData}
                      setGridData={setGridData}
                      allGridCheck={allGridCheck}
                      itemSlectedHandler={itemSlectedHandler}
                      parentValues={{ ...headerData, ...values }}
                    />
                  )}
                  {billType === 3 && (
                    <AdvancesForIntGrid
                      gridData={gridData}
                      setGridData={setGridData}
                      allGridCheck={allGridCheck}
                      itemSlectedHandler={itemSlectedHandler}
                    />
                  )}
                  <DropzoneDialogBase
                    filesLimit={5}
                    acceptedFiles={["image/*", "application/pdf"]}
                    fileObjects={fileObjects}
                    cancelButtonText={"cancel"}
                    submitButtonText={"submit"}
                    maxFileSize={1000000}
                    open={open}
                    onAdd={(newFileObjs) => {
                      setFileObjects([].concat(newFileObjs));
                    }}
                    onDelete={(deleteFileObj) => {
                      const newData = fileObjects.filter(
                        (item) => item.file.name !== deleteFileObj.file.name
                      );
                      setFileObjects(newData);
                    }}
                    onClose={() => setOpen(false)}
                    onSave={() => {
                      setOpen(false);
                    }}
                    showPreviews={true}
                    showFileNamesInPreview={true}
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
