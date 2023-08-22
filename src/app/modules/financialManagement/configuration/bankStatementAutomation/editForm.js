import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import {
  bankAccountDDL,
  dataModify,
  editBankStatmentAttachment,
  getBankAccountByBranchDDL,
  getBankStatmentAttachmentById,
} from "./helper";
import { shallowEqual, useSelector } from "react-redux";
import IEdit from "../../../_helper/_helperIcons/_edit";
import IDelete from "../../../_helper/_helperIcons/_delete";
import IAdd from "../../../_helper/_helperIcons/_add";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
import { _todayDate } from "../../../_helper/_todayDate";
import { toast } from "react-toastify";
import IClose from "../../../_helper/_helperIcons/_close";
function EditForm({ rowClickItem, landingCB }) {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [backAccountDDL, setBankAccountDDL] = useState([]);
  const [acDDL, setAcDDL] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [rowDto, setRowDto] = useState([]);

  useEffect(() => {
    bankAccountDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setBankAccountDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const formikRef = React.useRef(null);
  useEffect(() => {
    getBankStatmentAttachmentById(
      rowClickItem?.headerId,
      setRowDto,
      setLoading,
      (resData) => {
        dataModify({
          formikRef,
          setRowDto,
          resData,
        });
        getBankAccountByBranchDDL(
          resData?.headerDTO?.bankId,
          profileData?.accountId,
          selectedBusinessUnit.value,
          setAcDDL
        );
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowClickItem]);

  const saveHandler = (values) => {
    //   transactionDate,particulars,instrumentNo,monDebit,monCredit,monBalance, empty check
    const check = rowDto?.some((itm) => {
      return !itm?.transactionDate || !itm?.particulars || !itm?.instrumentNo;
    });
    if (check) return toast.warn("Please fillup all fields");

    const modifyRowDto = rowDto?.map((itm, idx) => {
      return {
        ...itm,
        transactionDate: itm?.transactionDate
          ? _dateFormatter(itm?.transactionDate)
          : new Date(),
        monDebit: +itm?.monDebit || 0,
        monCredit: +itm?.monCredit || 0,
        monBalance: +itm?.monBalance || 0,
        rowId: itm?.rowId || 0,
        headerId: rowClickItem?.headerId,
        serialId: idx + 1,
      };
    });
    const payload = {
      headerDTO: {
        headerId: rowClickItem?.headerId,
        bankId: values?.bankAccount?.value || 0,
        bankName: values?.bankAccount?.label || "",
        bankAccountId: values?.acDDL?.value || 0,
        bankAccountNo:
          values?.acDDL?.bankAccountNo || values?.acDDL?.label || "",
        fileName: values?.fileName || "",
        fileUid: values?.fileUID || "",
        emailUid: values?.emailUId || "",
        senderAddress: values?.senderAddress || "",
        emailHeader: values?.emailHeader || "",
        emailDateTime: values?.emailDate || new Date(),
        isInserted: true,
        statusMessage: values?.statusMessage || "",
        isExecuted: values?.isExecuted || false,
      },
      rowDTO: modifyRowDto,
    };

    editBankStatmentAttachment(payload, setLoading, () => {
      landingCB();
    });
  };
  return (
    <div>
      <>
        <Formik
          enableReinitialize={true}
          initialValues={{
            bankAccount: "",
            acDDL: "",
            fileName: "",
            fileUID: "",
            emailUId: "",
            senderAddress: "",
            emailHeader: "",
            emailDate: "",
            statusMessage: "",
          }}
          // validationSchema={{}}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm();
            });
          }}
          innerRef={formikRef}
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
            <div>
              {loading && <Loading />}
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title='Edit Bank Statement Automation'>
                  <CardHeaderToolbar>
                    <div>
                      <button
                        type='button'
                        className='btn btn-primary ml-2'
                        onClick={() => {
                          setFieldValue("isExecuted", true);
                          handleSubmit();
                        }}
                      >
                        Executed & Save
                      </button>
                      <button
                        type='button'
                        className='btn btn-primary ml-2'
                        onClick={() => {
                          setFieldValue("isExecuted", false);
                          handleSubmit();
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  <Form className='form form-label-right'>
                    <div className='form-group row global-form'>
                      <div className='col-lg-3'>
                        {values?.bankId === 0 && (
                          <p className='m-0'>
                            Bank Account: <b> {values?.bankName}</b>
                          </p>
                        )}
                      </div>
                      <div className='col-lg-3'>
                        {values?.bankAccountId === 0 && (
                          <p className='m-0'>
                            A/C No: <b> {values?.bankAccountNo}</b>
                          </p>
                        )}
                      </div>
                      <div className='col-lg-6'></div>
                      <div className='col-lg-3'>
                        <NewSelect
                          name='bankAccount'
                          placeholder='Select Bank Account'
                          value={values?.bankAccount}
                          onChange={(valueOption) => {
                            setFieldValue("bankAccount", valueOption);
                            setFieldValue("acDDL", "");
                            getBankAccountByBranchDDL(
                              valueOption?.value,
                              profileData?.accountId,
                              selectedBusinessUnit.value,
                              setAcDDL
                            );
                          }}
                          // isSearchable={true}
                          options={backAccountDDL}
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className='col-lg-3'>
                        <NewSelect
                          name='acDDL'
                          placeholder='Select A/C No'
                          value={values?.acDDL}
                          onChange={(valueOption) => {
                            setFieldValue("acDDL", valueOption);
                          }}
                          options={acDDL}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className='col-lg-3'>
                        <label>File Name </label>
                        <InputField
                          value={values?.fileName || ""}
                          name='fileName'
                          placeholder='File Name '
                          type='text'
                          onChange={(e) => {
                            setFieldValue("fileName", e.target.value);
                          }}
                          disabled
                        />
                      </div>
                      {/* <div className='col-lg-3'>
                        <label>File UID </label>
                        <InputField
                          value={values?.fileUID || ""}
                          name='fileUID'
                          placeholder='File UID  '
                          type='text'
                          onChange={(e) => {
                            setFieldValue("fileUID", e.target.value);
                          }}
                          disabled
                        />
                      </div>
                      <div className='col-lg-3'>
                        <label>Email UId </label>
                        <InputField
                          value={values?.emailUId || ""}
                          name='emailUId'
                          placeholder='Email UId'
                          type='text'
                          onChange={(e) => {
                            setFieldValue("emailUId", e.target.value);
                          }}
                          disabled
                        />
                      </div> */}
                      <div className='col-lg-3'>
                        <label>Sender Address </label>
                        <InputField
                          value={values?.senderAddress || ""}
                          name='senderAddress'
                          placeholder='Sender Address'
                          type='text'
                          onChange={(e) => {
                            setFieldValue("senderAddress", e.target.value);
                          }}
                          disabled
                        />
                      </div>
                      <div className='col-lg-3'>
                        <label>Email Header </label>
                        <InputField
                          value={values?.emailHeader || ""}
                          name='emailHeader'
                          placeholder='Email Header '
                          type='text'
                          onChange={(e) => {
                            setFieldValue("emailHeader", e.target.value);
                          }}
                          disabled
                        />
                      </div>
                      <div className='col-lg-3'>
                        <label>Email Date </label>
                        <InputField
                          value={values?.emailDate || ""}
                          name='emailDate'
                          placeholder='Email Date '
                          type='date'
                          onChange={(e) => {
                            setFieldValue("emailDate", e.target.value);
                          }}
                          disabled
                        />
                      </div>
                      <div className='col-lg-3'>
                        <label>Status Message </label>
                        <InputField
                          value={values?.statusMessage || ""}
                          name='statusMessage'
                          placeholder='Status Message  '
                          type='text'
                          onChange={(e) => {
                            setFieldValue("statusMessage", e.target.value);
                          }}
                          disabled
                        />
                      </div>
                    </div>

                    {/* table */}
                    <div className='table-responsive'>
                      <table className='table table-striped table-bordered global-table'>
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Transaction Date</th>
                            <th>Particular</th>
                            <th>Instrument No</th>
                            <th>Credit</th>
                            <th>Debit</th>
                            <th>Balance</th>
                            <th
                              style={{
                                width: "90px",
                              }}
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.length > 0 &&
                            rowDto?.map((item, i) => {
                              return (
                                <tr key={i + 1}>
                                  <td className='text-center'>{i + 1}</td>

                                  <td className='text-center'>
                                    {item?.isEdit ? (
                                      <>
                                        <InputField
                                          value={item?.transactionDate || ""}
                                          name='transactionDate'
                                          placeholder='Transaction Date  '
                                          type='date'
                                          onChange={(e) => {
                                            const data = [...rowDto];
                                            data[i].transactionDate =
                                              e.target.value;
                                            setRowDto(data);
                                          }}
                                        />
                                      </>
                                    ) : (
                                      _dateFormatter(item?.transactionDate)
                                    )}
                                  </td>
                                  <td className='text-center'>
                                    {item?.isEdit ? (
                                      <>
                                        <InputField
                                          value={item?.particulars || ""}
                                          name='particulars'
                                          placeholder='Particulars  '
                                          type='text'
                                          onChange={(e) => {
                                            const data = [...rowDto];
                                            data[i].particulars =
                                              e.target.value;
                                            setRowDto(data);
                                          }}
                                        />
                                      </>
                                    ) : (
                                      item?.particulars
                                    )}
                                  </td>
                                  <td className='text-center'>
                                    {item?.isEdit ? (
                                      <>
                                        <InputField
                                          value={item?.instrumentNo || ""}
                                          name='instrumentNo'
                                          placeholder='Instrument No'
                                          type='text'
                                          onChange={(e) => {
                                            const data = [...rowDto];
                                            data[i].instrumentNo =
                                              e.target.value;
                                            setRowDto(data);
                                          }}
                                        />
                                      </>
                                    ) : (
                                      item?.instrumentNo
                                    )}
                                  </td>

                                  <td className='text-center'>
                                    {item?.isEdit ? (
                                      <>
                                        <InputField
                                          value={item?.monCredit || ""}
                                          name='monCredit'
                                          placeholder='Credit'
                                          type='number'
                                          onChange={(e) => {
                                            const data = [...rowDto];
                                            data[i].monCredit = e.target.value;
                                            setRowDto(data);
                                          }}
                                        />
                                      </>
                                    ) : (
                                      _fixedPoint(item?.monCredit)
                                    )}
                                  </td>
                                  <td className='text-center'>
                                    {item?.isEdit ? (
                                      <>
                                        <InputField
                                          value={item?.monDebit || ""}
                                          name='monDebit'
                                          placeholder='Debit'
                                          type='number'
                                          onChange={(e) => {
                                            const data = [...rowDto];
                                            data[i].monDebit = e.target.value;
                                            setRowDto(data);
                                          }}
                                        />
                                      </>
                                    ) : (
                                      _fixedPoint(item?.monDebit)
                                    )}
                                  </td>
                                  <td className='text-center'>
                                    {item?.isEdit ? (
                                      <>
                                        <InputField
                                          value={item?.monBalance || ""}
                                          name='monBalance'
                                          placeholder='Balance'
                                          type='number'
                                          onChange={(e) => {
                                            const data = [...rowDto];
                                            data[i].monBalance = e.target.value;
                                            setRowDto(data);
                                          }}
                                        />
                                      </>
                                    ) : (
                                      _fixedPoint(item?.monBalance)
                                    )}
                                  </td>
                                  <td className='text-center'>
                                    <div
                                      className='d-flex align-items-center justify-content-center'
                                      style={{
                                        gap: "8px",
                                      }}
                                    >
                                      {item?.isEdit ? (
                                        <>
                                          <sapn
                                            onClick={() => {
                                              // isEdit true
                                              const data = [...rowDto];
                                              data[i].isEdit = false;
                                              setRowDto(data);
                                            }}
                                          >
                                            <IClose />
                                          </sapn>
                                        </>
                                      ) : (
                                        <>
                                          {" "}
                                          <sapn
                                            onClick={() => {
                                              // isEdit true
                                              const data = [...rowDto];
                                              data[i].isEdit = true;
                                              setRowDto(data);
                                            }}
                                          >
                                            <IEdit />
                                          </sapn>
                                        </>
                                      )}
                                      <sapn
                                        onClick={() => {
                                          // new row add inner index position
                                          const obj = {
                                            transactionDate: _todayDate(),
                                            particulars: "",
                                            instrumentNo: "",
                                            monCredit: "",
                                            monDebit: "",
                                            monBalance: "",
                                            isEdit: true,
                                          };

                                          const newData = [...rowDto];
                                          newData.splice(i + 1, 0, obj);
                                          setRowDto(newData);
                                        }}
                                      >
                                        <IAdd />
                                      </sapn>

                                      <sapn
                                        onClick={() => {
                                          // delete single item
                                          const data = rowDto.filter(
                                            (itm, indx) => indx !== i
                                          );
                                          setRowDto(data);
                                        }}
                                      >
                                        <IDelete />
                                      </sapn>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </div>
          )}
        </Formik>
      </>
    </div>
  );
}

export default EditForm;
