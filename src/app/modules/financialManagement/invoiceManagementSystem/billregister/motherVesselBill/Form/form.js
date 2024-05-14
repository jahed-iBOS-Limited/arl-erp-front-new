import Axios from "axios";
import { Form, Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
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
import NewSelect from "../../../../../_helper/_select";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";

const validationSchema = Yup.object().shape({
  supplier: Yup.object()
    .nullable()
    .required("Supplier is Required"),
  billNo: Yup.string().required("Bill No is Required"),
  billDate: Yup.date().required("Bill Date is Required"),
  paymentDueDate: Yup.date().required("Payment Date is Required"),
});

export default function _Form({
  accId,
  buId,
  initData,
  btnRef,
  saveHandler,
  gridData,
  setFileObjects,
  fileObjects,
  setGridData,
  resetBtnRef,
  headerData,
  getData,
  portDDL,
}) {
  const [open, setOpen] = React.useState(false);
  const [motherVesselDDL, getMotherVesselDDL] = useAxiosGet();
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
            setFileObjects([]);
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
                      <NewSelect
                        label="Port"
                        placeholder="Port"
                        value={values?.port}
                        name="port"
                        options={portDDL || []}
                        onChange={(e) => {
                          if (e) {
                            setFieldValue("port", e);
                            setFieldValue("motherVessel", "");
                            getMotherVesselDDL(
                              `/wms/FertilizerOperation/GetMotherVesselProgramInfo?PortId=${e.value}&businessUnitId=${buId}`
                            );
                          }
                        }}
                        isDisabled={false}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        label="Mother Vessel Name"
                        placeholder="Mother Vessel Name"
                        value={values?.motherVessel}
                        name="motherVessel"
                        options={motherVesselDDL || []}
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
                          // setGridData([]);
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

                    <div className="col-auto mr-auto">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setGridData([]);
                          getData(values, "");
                        }}
                        disabled={!values?.motherVessel}
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
                }}
              >
                <div>
                  <PaginationSearch
                    placeholder="Mother vessel/Lighter Vessel/ShipPoint"
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
                        Number(a) +
                        (b?.isSelected ? Number(b?.decProgramQnt || 0) : 0),
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
                        (b?.isSelected ? Number(b?.numBillAmount || 0) : 0),
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
                              ? gridData?.every((item) => item?.isSelected)
                              : false
                          }
                          onChange={(e) => {
                            setGridData(
                              gridData?.map((item) => {
                                return {
                                  ...item,
                                  isSelected: e?.target?.checked,
                                };
                              })
                            );
                          }}
                        />
                      </th>
                      <th>SL</th>
                      <th>Mother Vessel Name</th>
                      <th>Program No</th>
                      <th>Program Quantity</th>
                      <th>Freight Rate (USD)</th>
                      <th>Freight Rate (BDT)</th>
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
                              item["isSelected"] = e.target.checked;
                              setGridData([...gridData]);
                            }}
                          />
                        </td>
                        <td className="text-center align-middle">
                          {index + 1}
                        </td>
                        <td>{item?.strMotherVesselName}</td>
                        <td>{item?.strProgramNo}</td>
                        <td className="text-right">
                          {item?.decProgramQnt || 0}
                        </td>
                        <td className="text-right">
                          {item?.numFreightRate || 0}
                        </td>
                        <td className="text-right">
                          {item?.numFreightRateDbt || 0}
                        </td>

                        <td style={{ width: "200px" }}>
                          <InputField
                            value={item?.numBillAmount}
                            name="numBillAmount"
                            placeholder="Total Amount"
                            type="number"
                            onChange={(e) => {
                              item.numBillAmount = e?.target?.value;
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
            <DropzoneDialogBase
              filesLimit={5}
              acceptedFiles={["image/*"]}
              fileObjects={fileObjects}
              cancelButtonText={"cancel"}
              submitButtonText={"submit"}
              maxFileSize={100000000000000}
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
          </>
        )}
      </Formik>
    </>
  );
}
