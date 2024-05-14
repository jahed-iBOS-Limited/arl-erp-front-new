import axios from "axios";
import { Form, Formik } from "formik";
import React, { useState } from "react";
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
import FromDateToDateForm from "../../../../../_helper/commonInputFieldsGroups/dateForm";
import IButton from "../../../../../_helper/iButton";
import { PortAndMotherVessel } from "../../../../../vesselManagement/common/components";

const validationSchema = Yup.object().shape({
  supplier: Yup.object()
    .nullable()
    .required("Supplier is Required"),
  billNo: Yup.string().required("Bill No is Required"),
  billDate: Yup.date().required("Bill Date is Required"),
  paymentDueDate: Yup.date().required("Payment Date is Required"),
});

const headers = [
  "SL",
  "Ghat Name",
  "Lighter Name",
  "Truck to Damp Qty",
  "Truck to Damp Rate",
  "Amount",
  "Other Cost",
  "Total Bill",
];

export default function _Form({
  buId,
  accId,
  btnRef,
  getData,
  initData,
  gridData,
  headerData,
  lighterDDL,
  saveHandler,
  setGridData,
  resetBtnRef,
  shipPointDDL,
  getLighterDDL,
  setUploadedImage,
}) {
  const [open, setOpen] = useState(false);
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
                      <NewSelect
                        name="shipPoint"
                        options={[{ value: 0, label: "All" }, ...shipPointDDL]}
                        value={values?.shipPoint}
                        label="ShipPoint"
                        onChange={(e) => {
                          setFieldValue("shipPoint", e);
                        }}
                        placeholder="ShipPoint"
                      />
                    </div>
                    <PortAndMotherVessel
                      obj={{
                        values,
                        setFieldValue,
                        // allElement: false,
                        onChange: (fieldName, allValues) => {
                          if (fieldName === "motherVessel") {
                            getLighterDDL(
                              `/wms/FertilizerOperation/GetLighterVesselDDL?MotherVesselId=${allValues?.motherVessel?.value}`
                            );
                          }
                        },
                      }}
                    />
                    <div className="col-lg-3">
                      <NewSelect
                        name="lighterVessel"
                        options={lighterDDL}
                        value={values?.lighterVessel}
                        label="Lighter Vessel"
                        onChange={(e) => {
                          setFieldValue("lighterVessel", e);
                        }}
                        placeholder="Lighter"
                        isDisabled={!values?.motherVessel}
                      />
                    </div>

                    <FromDateToDateForm obj={{ values, setFieldValue }} />
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
                    <IButton
                      colSize={"col-lg-3"}
                      onClick={() => {
                        setGridData([]);
                        getData(values, "");
                      }}
                      disabled={!values?.lighterVessel}
                    />
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
                    {/* <div className="col-lg-3">
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
                    </div> */}
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
                {/* <div>
                  <PaginationSearch
                    placeholder="Mother vessel/Lighter Vessel/ShipPoint"
                    paginationSearchHandler={(search) =>
                      getData(values, search)
                    }
                  />
                </div> */}
                <p>
                  Total Qty:{" "}
                  {_fixedPoint(
                    gridData?.reduce(
                      (a, b) =>
                        Number(a) +
                        (b?.isSelected ? Number(b?.truckToDumpQnt || 0) : 0),
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
                      {headers?.map((th, index) => {
                        return <th key={index}> {th} </th>;
                      })}
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
                        <td>{item?.shipPointName}</td>
                        <td>{item?.lighterVesselName}</td>
                        <td className="text-right">{item?.truckToDumpQnt}</td>
                        <td className="text-right">{item?.truckToDumpRate}</td>
                        <td className="text-right">
                          {item?.truckToDumpAmount}
                        </td>
                        <td className="text-right">{item?.dumpOtherCost}</td>

                        <td style={{ width: "200px" }}>
                          <InputField
                            value={item?.billAmount}
                            name="billAmount"
                            placeholder="Total Bill"
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
            <AttachFile obj={{ open, setOpen, setUploadedImage }} />
          </>
        )}
      </Formik>
    </>
  );
}
