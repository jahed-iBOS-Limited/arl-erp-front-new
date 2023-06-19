import { Form, Formik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { _fixedPoint } from "../../../../../_helper/_fixedPoint";
import IView from "../../../../../_helper/_helperIcons/_view";
import InputField from "../../../../../_helper/_inputField";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import NewSelect from "../../../../../_helper/_select";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import AttachFile from "../../../../../vesselManagement/common/attachmentUpload";

const validationSchema = Yup.object().shape({
  billNo: Yup.string().required("Bill No is Required"),
  billDate: Yup.date().required("Bill Date is Required"),
  paymentDueDate: Yup.date().required("Payment Date is Required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  gridData,
  setGridData,
  resetBtnRef,
  getData,
  portDDL,
  setImages,
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
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setGridData([]);
            setImages([]);
          });
        }}
      >
        {({ handleSubmit, resetForm, values, setFieldValue }) => (
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
                              `/wms/FertilizerOperation/GetMotherVesselProgramInfo?PortId=${e.value}`
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

                    <div className="col-auto mr-auto">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setGridData([]);
                          getData(values);
                        }}
                        disabled={!values?.motherVessel}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3">
                      <InputField
                        value={values?.billNo}
                        label="Bill No"
                        name="billNo"
                        placeholder="Bill No"
                      />
                    </div>
                    <div className="col-3">
                      <InputField
                        value={values?.billDate}
                        label="Bill Date"
                        type="date"
                        name="billDate"
                        placeholder="Bill Date"
                      />
                    </div>
                    <div className="col-3">
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
                    <div className="col-3">
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
                <p>
                  Total Qty:{" "}
                  {_fixedPoint(
                    gridData?.reduce(
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
                    gridData?.reduce(
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
                      <th>CNF Name</th>
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
                              item["isSelected"] = e.target.checked;
                              setGridData([...gridData]);
                            }}
                          />
                        </td>
                        <td className="text-center align-middle">
                          {index + 1}
                        </td>
                        <td>{item?.motherVesselName}</td>
                        <td>{item?.cnfname}</td>
                        <td className="text-right">{item?.programQnt || 0}</td>
                        <td className="text-right">{item?.cnfrate || 0}</td>

                        <td style={{ width: "200px" }}>
                          <InputField
                            value={item?.billAmount}
                            name="billAmount"
                            placeholder="Total Amount"
                            type="number"
                            onChange={(e) => {
                              item.billAmount = e?.target?.value;
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
