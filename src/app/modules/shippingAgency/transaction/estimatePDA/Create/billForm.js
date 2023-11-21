import { Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { attachment_action } from "../helper";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IEdit from "../../../../_helper/_helperIcons/_edit";
const validationSchema = Yup.object().shape({});
const initData = {
  billDate: _todayDate(),
  billType: "",
  amount: "",
  vat: "",
  popdandfw: "",
  povat: "",
  total: "",
  status: {
    value: 1,
    label: "Paid",
  },
  attachment: "",
};
function BillForm({ clickRowData, estimatePDABillAddHandler }) {
  const {
    profileData: { accountId: accId, userId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [loading, setLoading] = useState(false);
  const [billRowDto, setBillRowDto] = useState([]);
  const [fileObjects, setFileObjects] = useState([]);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const saveHandler = (values, cb) => {
    // empty billRowDto check
    if (billRowDto?.length === 0) return toast.warning("Please add bill row");

    estimatePDABillAddHandler({
      billRowDto,
      cb,
    });
  };
  const rowAddHandelar = (values, setFieldValue) => {
    const obj = {
      billId: 0,
      estimatePdarowId: 0,
      expenseParticularId: 1,
      billDate: values?.billDate,
      billType: values?.billType?.label || "",
      amount: +values?.amount || 0,
      vat: +values?.vat || 0,
      poPdFw: +values?.popdandfw || 0,
      poVat: +values?.povat || 0,
      total: +values?.total || 0,
      status: values?.status?.label || "",
      attachmentsId: values?.attachment || "",
      isActive: true,
      actionBy: userId,
      accountId: accId,
      lastActionDateTime: new Date(),
      isEdit: false,
    };

    // duplicate check
    const duplicateCheck = billRowDto?.some(
      (item) =>
        item?.billDate === obj?.billDate && item?.billType === obj?.billType
    );
    if (duplicateCheck) return toast.warning("Duplicate data found");
    setBillRowDto([...billRowDto, obj]);
    setFieldValue("billType", "");
    setFieldValue("amount", "");
    setFieldValue("vat", "");
    setFieldValue("popdandfw", "");
    setFieldValue("povat", "");
    setFieldValue("total", "");
    setFieldValue("attachment", "");
  };

  useEffect(() => {
    if (clickRowData?.estimatePDABillCreateDtos?.length > 0) {
      const copybillRowDto = JSON.parse(
        JSON.stringify(clickRowData?.estimatePDABillCreateDtos)
      );
      setBillRowDto(copybillRowDto || []);
    }
  }, [clickRowData]);

  return (
    <>
      <>
        {loading && <Loading />}
        <Formik
          validationSchema={validationSchema}
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
              setBillRowDto([]);
            });
          }}
        >
          {({
            values,
            setFieldValue,
            touched,
            errors,
            resetForm,
            handleSubmit,
          }) => (
            <>
              <ICustomCard
                title='Bill Create'
                saveHandler={() => {
                  handleSubmit();
                }}
                resetHandler={() => {
                  resetForm(initData);
                }}
              >
                <div className='row global-form my-3'>
                  <div className='col-lg-3'>
                    <InputField
                      value={values?.billDate}
                      label='Bill Date'
                      name='billDate'
                      type='date'
                      onChange={(e) => {
                        setFieldValue("billDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className='col-lg-3'>
                    <NewSelect
                      value={values?.billType || ""}
                      options={[
                        {
                          value: 1,
                          label: "FW",
                        },
                        {
                          value: 2,
                          label: "PD",
                        },
                        {
                          value: 3,
                          label: "WTR",
                        },
                      ]}
                      name='billType'
                      placeholder='Bill Type'
                      label='Bill Type'
                      onChange={(valueOption) => {
                        setFieldValue("billType", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className='col-lg-3'>
                    <InputField
                      value={values?.amount}
                      label='Amount'
                      name='amount'
                      placeholder='Amount'
                      type='number'
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className='col-lg-3'>
                    <InputField
                      value={values?.vat}
                      label='VAT'
                      name='vat'
                      placeholder='VAT'
                      type='number'
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className='col-lg-3'>
                    <InputField
                      value={values?.popdandfw}
                      label='PO PD & FW'
                      name='popdandfw'
                      placeholder='PO PD & FW'
                      type='text'
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className='col-lg-3'>
                    <InputField
                      value={values?.povat}
                      label='PO VAT'
                      name='povat'
                      placeholder='PO VAT'
                      type='text'
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className='col-lg-3'>
                    <InputField
                      value={values?.total}
                      label='Total'
                      name='total'
                      placeholder='Total'
                      type='number'
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className='col-lg-3'>
                    <NewSelect
                      value={values?.status || ""}
                      options={[
                        {
                          value: 1,
                          label: "Paid",
                        },
                        {
                          value: 2,
                          label: "Unpaid",
                        },
                      ]}
                      name='status'
                      placeholder='Status'
                      label='Status'
                      onChange={(valueOption) => {
                        setFieldValue("status", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className='col-lg-3 d-flex align-items-center'>
                    <div className=''>
                      <button
                        className='btn btn-primary mr-2 mt-3'
                        type='button'
                        onClick={() => setOpen(true)}
                        style={{ padding: "4px 5px" }}
                      >
                        Attachment
                      </button>
                    </div>

                    <div>
                      {values?.attachment && (
                        <button
                          className='btn btn-primary'
                          type='button'
                          onClick={() => {
                            dispatch(
                              getDownlloadFileView_Action(values?.attachment)
                            );
                          }}
                        >
                          Attachment View
                        </button>
                      )}
                    </div>
                  </div>
                  <div className='col d-flex align-items-center justify-content-end'>
                    <div className=''>
                      <button
                        className='btn btn-primary mr-2 mt-3'
                        type='button'
                        onClick={() => {
                          rowAddHandelar(values, setFieldValue);
                        }}
                        disabled={
                          !values?.billDate ||
                          !values?.billType ||
                          !values?.amount ||
                          !values?.popdandfw ||
                          !values?.total ||
                          !values?.status
                        }
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <BillRowTable
                  billRowDto={billRowDto}
                  setBillRowDto={setBillRowDto}
                  dispatch={dispatch}
                />

                <DropzoneDialogBase
                  filesLimit={1}
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
                    attachment_action(fileObjects, setFieldValue, setLoading);
                  }}
                  showPreviews={true}
                  showFileNamesInPreview={true}
                />
              </ICustomCard>
            </>
          )}
        </Formik>
      </>
    </>
  );
}

export default BillForm;

function BillRowTable({ billRowDto, setBillRowDto, dispatch }) {
  return (
    <div className='table-responsive'>
      <table className='table table-striped table-bordered global-table'>
        <thead>
          <tr>
            <th>SL</th>
            <th>Bill Date</th>
            <th>Bill Type</th>
            <th
              style={{
                width: "100px",
              }}
            >
              Amount
            </th>
            <th
              style={{
                width: "100px",
              }}
            >
              VAT
            </th>
            <th
              style={{
                width: "100px",
              }}
            >
              PO PD & FW
            </th>
            <th
              style={{
                width: "100px",
              }}
            >
              PO VAT
            </th>
            <th
              style={{
                width: "100px",
              }}
            >
              Total
            </th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {billRowDto?.map((item, index) => (
            <tr key={index}>
              <td className='text-center'> {index + 1}</td>
              <td>{_dateFormatter(item?.billDate)}</td>
              <td>{item?.billType}</td>
              <td>
                {item?.isEdit ? (
                  <>
                    <InputField
                      value={item?.amount}
                      name='amount'
                      placeholder='Amount'
                      type='number'
                      onChange={(e) => {
                        const copy = [...billRowDto];
                        copy[index] = {
                          ...item,
                          amount: e.target.value,
                        };
                        setBillRowDto(copy);
                      }}
                    />
                  </>
                ) : (
                  item?.amount
                )}
              </td>
              <td>
                {item?.isEdit ? (
                  <>
                    <InputField
                      value={item?.vat}
                      name='vat'
                      placeholder='VAT'
                      type='number'
                      onChange={(e) => {
                        const copy = [...billRowDto];
                        copy[index] = {
                          ...item,
                          vat: e.target.value,
                        };
                        setBillRowDto(copy);
                      }}
                    />
                  </>
                ) : (
                  item?.vat
                )}
              </td>
              <td>
                {item?.isEdit ? (
                  <>
                    <InputField
                      value={item?.poPdFw}
                      name='poPdFw'
                      placeholder='PO PD & FW'
                      type='text'
                      onChange={(e) => {
                        const copy = [...billRowDto];
                        copy[index] = {
                          ...item,
                          poPdFw: e.target.value,
                        };
                        setBillRowDto(copy);
                      }}
                    />
                  </>
                ) : (
                  item?.poPdFw
                )}
              </td>
              <td>
                {item?.isEdit ? (
                  <>
                    <InputField
                      value={item?.poVat}
                      name='poVat'
                      placeholder='PO VAT'
                      type='text'
                      onChange={(e) => {
                        const copy = [...billRowDto];
                        copy[index] = {
                          ...item,
                          poVat: e.target.value,
                        };
                        setBillRowDto(copy);
                      }}
                    />
                  </>
                ) : (
                  item?.poVat
                )}
              </td>
              <td>
                {item?.isEdit ? (
                  <>
                    <InputField
                      value={item?.total}
                      name='total'
                      placeholder='Total'
                      type='number'
                      onChange={(e) => {
                        const copy = [...billRowDto];
                        copy[index] = {
                          ...item,
                          total: e.target.value,
                        };
                        setBillRowDto(copy);
                      }}
                    />
                  </>
                ) : (
                  item?.total
                )}
              </td>
              <td>
                <span
                  style={{
                    color: item?.status === "Paid" ? "green" : "orange",
                  }}
                >
                  <b>{item?.status}</b>
                </span>
              </td>
              <td>
                <div
                  className='d-flex'
                  style={{
                    gap: "10px",
                  }}
                >
                  {item?.attachmentsId && (
                    <span
                      onClick={() => {
                        dispatch(
                          getDownlloadFileView_Action(item?.attachmentsId)
                        );
                      }}
                    >
                      <i class='fa fa-paperclip pointer' aria-hidden='true'></i>
                    </span>
                  )}
                  <span
                    className='edit'
                    onClick={() => {
                      const copy = [...billRowDto];
                      copy[index] = { ...copy[index], isEdit: true };
                      setBillRowDto(copy);
                    }}
                  >
                    <IEdit />
                  </span>
                  <span
                    className='delete'
                    onClick={() => {
                      const filterData = billRowDto?.filter(
                        (itm, idx) => idx !== index
                      );
                      setBillRowDto(filterData);
                    }}
                  >
                    <IDelete />
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
