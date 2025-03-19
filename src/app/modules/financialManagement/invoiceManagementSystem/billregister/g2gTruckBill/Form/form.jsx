import Axios from "axios";
import { Form, Formik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import SearchAsyncSelect from "../../../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../../_helper/_fixedPoint";
import FormikError from "../../../../../_helper/_formikError";
import IView from "../../../../../_helper/_helperIcons/_view";
import InputField from "../../../../../_helper/_inputField";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import PaginationSearch from "../../../../../_helper/_search";
import AttachFile from "../../../../../_helper/commonInputFieldsGroups/attachemntUpload";

const validationSchema = Yup.object().shape({
  supplier: Yup.object()
    .nullable()
    .required("Supplier is Required"),
  billNo: Yup.string().required("Bill No is Required"),
  billDate: Yup.date().required("Bill Date is Required"),
  paymentDueDate: Yup.date().required("Payment Date is Required"),
});

export default function _Form({
  buId,
  accId,
  btnRef,
  getData,
  initData,
  gridData,
  headerData,
  saveHandler,
  setGridData,
  resetBtnRef,
  setUploadedImage,
}) {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setGridData([]);
            setUploadedImage([]);
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
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-12">
                  <div className="row align-items-end">
                    <div className="col-lg-3">
                      <label>Supplier</label>
                      <SearchAsyncSelect
                        selectedValue={values.supplier}
                        handleChange={(valueOption) => {
                          setGridData([]);
                          setFieldValue("supplier", valueOption);
                        }}
                        loadOptions={(v) => {
                          if (v.length < 3) return [];
                          return Axios.get(
                            `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${headerData
                              ?.sbu?.value || 0}`
                          ).then((res) => {
                            const updateList = res?.data.map((item) => ({
                              ...item,
                            }));
                            return updateList;
                          });
                        }}
                      />
                      <FormikError
                        errors={errors}
                        name="supplier"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        placeholder="From Date"
                        name="fromDate"
                        type="date"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        placeholder="To Date"
                        name="toDate"
                        type="date"
                        touched={touched}
                      />
                    </div>
                    <div className="col-auto mr-auto">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setGridData([]);
                          getData(values, "");
                        }}
                        disabled={!values?.supplier}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3">
                      <InputField
                        value={values?.billNo}
                        label="Bill No"
                        name="billNo"
                        placeholder="Bill No"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={_dateFormatter(values?.billDate)}
                        label="Bill Date"
                        type="date"
                        name="billDate"
                        placeholder="Bill Date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={_dateFormatter(values?.paymentDueDate)}
                        label="Payment Due Date"
                        type="date"
                        name="paymentDueDate"
                        placeholder="Payment Due Date"
                      />
                    </div>
                  </div>
                  <div className="row align-items-end">
                    <div className="col-9">
                      <InputField
                        value={values?.narration}
                        label="Narration No"
                        name="narration"
                        placeholder="Narration"
                      />
                    </div>
                    <div className="col-lg-3">
                      <div className="row align-items-end">
                        <div className="col-5">
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => setOpen(true)}
                          >
                            Attachment
                          </button>
                          {values?.attachmentId && (
                            <IView
                              classes="purchaseInvoiceAttachIcon"
                              clickHandler={() => {
                                dispatch(
                                  getDownlloadFileView_Action(
                                    values?.attachmentId
                                  )
                                );
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
            <div className="row mt-1 ">
              <div
                className="col d-flex justify-content-between"
                style={{
                  fontSize: "15px",
                  fontWeight: "bold",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <PaginationSearch
                    placeholder="Search"
                    paginationSearchHandler={(search) =>
                      getData(values, search)
                    }
                  />
                </div>
                <p>
                  Total Qty:{" "}
                  {_fixedPoint(
                    gridData?.reduce(
                      (a, b) =>
                        Number(a) + (b.checked ? Number(b.quantity || 0) : 0),
                      0
                    ),
                    true
                  )}
                </p>
                <p>
                  Total Amount:{" "}
                  {_fixedPoint(
                    gridData?.reduce(
                      (a, b) =>
                        Number(a) +
                        (b.checked ? Number(b.transportAmount || 0) : 0),
                      0
                    ),
                    true
                  )}
                </p>
              </div>

              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead className="bg-secondary">
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={
                            gridData?.length > 0
                              ? gridData?.every((item) => item?.checked)
                              : false
                          }
                          onChange={(e) => {
                            setGridData(
                              gridData?.map((item) => {
                                return {
                                  ...item,
                                  checked:
                                    item?.transportRate <= 0
                                      ? false
                                      : e?.target?.checked,
                                };
                              })
                            );
                          }}
                        />
                      </th>
                      <th>SL</th>
                      <th>Ship Point Name</th>
                      <th>Delivery Code</th>
                      <th>Supplier Name</th>
                      <th>Mother Vessel Name</th>
                      <th>Ship To Partner</th>
                      <th>Delivery Date</th>
                      <th>Quantity</th>
                      <th>Transport Rate</th>
                      <th>Bill Amount</th>
                      <th>Unload Labour Rate</th>
                      <th>Transport Total</th>
                      <th>Labour Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.map((item, index) => (
                      <tr
                        key={index}
                        style={
                          item?.transportRate <= 0
                            ? { backgroundColor: "#ff000082" }
                            : {}
                        }
                      >
                        <td className="text-center align-middle">
                          <input
                            type="checkbox"
                            checked={item?.checked}
                            onChange={(e) => {
                              item["checked"] = e.target.checked;
                              setGridData([...gridData]);
                            }}
                            disabled={item?.transportRate <= 0}
                          />
                        </td>
                        <td className="text-center align-middle">
                          {index + 1}
                        </td>
                        <td>{item?.shipPointName}</td>
                        <td>{item?.deliveryCode}</td>
                        <td>{item?.supplierName}</td>
                        <td>{item?.motherVesselName}</td>
                        <td>{item?.shipToPartnerName}</td>
                        <td>{_dateFormatter(item?.deliveryDate)}</td>
                        <td className="text-right">{item?.quantity}</td>
                        <td className="text-right">{item?.transportRate}</td>
                        <td style={{ width: "100px" }}>
                          <InputField
                            value={item?.transportAmount}
                            name="transportAmount"
                            placeholder="Total Amount"
                            type="number"
                            onChange={(e) => {
                              item.transportAmount = e.target.value;
                              setGridData([...gridData]);
                            }}
                          />
                        </td>
                        <td className="text-right">
                          {item?.godownUnloadLabourRate}
                        </td>
                        <td className="text-right">
                          {item?.quantity * item?.transportRate}
                        </td>
                        <td className="text-right">
                          {+item?.quantity * +item?.godownUnloadLabourRate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <AttachFile obj={{ open, setOpen, setUploadedImage }} />
          </>
        )}
      </Formik>
    </>
  );
}
