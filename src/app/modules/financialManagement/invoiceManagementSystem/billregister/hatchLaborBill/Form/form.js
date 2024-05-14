import axios from "axios";
import { Form, Formik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import SearchAsyncSelect from "../../../../../_helper/SearchAsyncSelect";
import { _fixedPoint } from "../../../../../_helper/_fixedPoint";
import FormikError from "../../../../../_helper/_formikError";
import IView from "../../../../../_helper/_helperIcons/_view";
import InputField from "../../../../../_helper/_inputField";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import NewSelect from "../../../../../_helper/_select";
import AttachFile from "../../../../../_helper/commonInputFieldsGroups/attachemntUpload";

const validationSchema = Yup.object().shape({
  billNo: Yup.string().required("Bill No is Required"),
  billDate: Yup.date().required("Bill Date is Required"),
  paymentDueDate: Yup.date().required("Payment Date is Required"),
});

export default function _Form({
  accId,
  buId,
  headerData,
  initData,
  btnRef,
  saveHandler,
  gridData,
  setGridData,
  resetBtnRef,
  getData,
  setImages,
  vesselDDL,
}) {
  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setGridData([]);
            setImages([]);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          setFieldValue,
          errors,
          touched,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-12">
                  <div className="row align-items-end">
                    <div className="col-lg-3">
                      <NewSelect
                        label="Port"
                        placeholder="Port"
                        value={values?.port}
                        name="port"
                        options={[]}
                        onChange={(e) => {
                          if (e) {
                            setFieldValue("port", e);
                            setFieldValue("motherVessel", "");
                          }
                        }}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        label="Mother Vessel Name"
                        placeholder="Mother Vessel Name"
                        value={values?.motherVessel}
                        name="motherVessel"
                        options={vesselDDL || []}
                        onChange={(e) => {
                          setFieldValue("motherVessel", e);
                        }}
                        isDisabled={false}
                      />
                    </div>

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
                          return axios
                            .get(
                              `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${headerData
                                ?.sbu?.value || 0}`
                            )
                            .then((res) => {
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
                    <div className="col-lg-3">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        placeholder="From Date"
                        name="fromDate"
                        type="date"
                        touched={touched}
                        onChange={(e) => {
                          setGridData([]);
                          setFieldValue("fromDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        placeholder="To Date"
                        name="CtoDate"
                        type="date"
                        touched={touched}
                        onChange={(e) => {
                          setGridData([]);
                          setFieldValue("toDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-auto mr-auto">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setGridData([]);
                          getData(values);
                        }}
                        disabled={
                          !values?.motherVessel ||
                          !values?.supplier ||
                          !values?.fromDate ||
                          !values?.toDate
                        }
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
                        value={values?.billDate}
                        label="Bill Date"
                        type="date"
                        name="billDate"
                        placeholder="Bill Date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.paymentDueDate}
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
                <p>
                  Total Qty:{" "}
                  {_fixedPoint(
                    gridData
                      ?.filter((item) => item?.hatchLabourRate > 0)
                      ?.reduce(
                        (a, b) =>
                          Number(a) +
                          (b?.isSelected ? Number(b?.programQnt || 0) : 0),
                        0
                      ),
                    true
                  )}
                </p>
                <p>
                  Total Amount:{" "}
                  {_fixedPoint(
                    gridData
                      ?.filter((item) => item?.hatchLabourRate > 0)
                      ?.reduce(
                        (a, b) =>
                          Number(a) +
                          (b?.isSelected ? Number(b?.billAmount || 0) : 0),
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
                              ? gridData
                                  ?.filter(
                                    (element) => element?.hatchLabourRate > 0
                                  )
                                  .every((item) => item?.isSelected)?.length
                              : false
                          }
                          onChange={(e) => {
                            setGridData(
                              gridData?.map((item) => {
                                return {
                                  ...item,
                                  isSelected:
                                    item?.hatchLabourRate > 0
                                      ? e?.target?.checked
                                      : false,
                                };
                              })
                            );
                          }}
                        />
                      </th>
                      <th>SL</th>
                      <th>Mother Vessel Name</th>
                      <th>Hatch Labor</th>
                      <th>Quantity</th>
                      <th>Rate</th>
                      <th>Bill Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center align-middle">
                          <input
                            type="checkbox"
                            checked={item?.isSelected}
                            onChange={(e) => {
                              item["isSelected"] =
                                item?.hatchLabourRate > 0
                                  ? e.target.checked
                                  : false;
                              setGridData([...gridData]);
                            }}
                            disabled={item?.hatchLabourRate <= 0}
                          />
                        </td>
                        <td className="text-center align-middle">
                          {index + 1}
                        </td>
                        <td>{item?.motherVesselName}</td>
                        <td>{item?.hatchLabour}</td>
                        <td className="text-right">{item?.receiveQnt}</td>
                        <td className="text-right">
                          {item?.hatchLabourRate || 0}
                        </td>

                        <td style={{ width: "200px" }}>
                          <InputField
                            value={item?.totalAmount}
                            name="totalAmount"
                            placeholder="Total Amount"
                            type="number"
                            onChange={(e) => {
                              item.totalAmount = e?.target?.value;
                              setGridData([...gridData]);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <AttachFile
              obj={{
                open,
                setOpen,
                setUploadedImage: setImages,
              }}
            />
          </>
        )}
      </Formik>
    </>
  );
}
