import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import SearchAsyncSelect from "../../../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../../_helper/_fixedPoint";
import IView from "../../../../../_helper/_helperIcons/_view";
import InputField from "../../../../../_helper/_inputField";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import PaginationSearch from "../../../../../_helper/_search";
import AttachFile from "../../../../../_helper/commonInputFieldsGroups/attachemntUpload";
import FromDateToDateForm from "../../../../../_helper/commonInputFieldsGroups/dateForm";
import IButton from "../../../../../_helper/iButton";
import { PortAndMotherVessel } from "../../../../../vesselManagement/common/components";
import NewSelect from "../../../../../_helper/_select";
import { GetBillTypeDDL } from "../../helper";

const validationSchema = Yup.object().shape({
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
  saveHandler,
  setGridData,
  resetBtnRef,
  setUploadedImage,
}) {
  const [open, setOpen] = React.useState(false);
  // const [lighterCarrierDDL, getLighterCarrierDDL] = useAxiosGet();
  const [billTypeDDL, setBillTypeDDL] = useState([]);

  const dispatch = useDispatch();
  const loadOptions = async (v) => {
    await [];
    if (v.length < 3) return [];
    return axios
      .get(
        `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${0}`
      )
      .then((res) => {
        const updateList = res?.data.map((item) => ({
          ...item,
        }));
        return [...updateList];
      });
  };

  useEffect(() => {
    if (buId && accId) {
      GetBillTypeDDL(setBillTypeDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                    <PortAndMotherVessel
                      obj={{
                        values,
                        setFieldValue,
                        onChange: (fieldName, allValues) => {
                          // if (fieldName === "port") {
                          //   getLighterCarrierDDL(
                          //     `/wms/FertilizerOperation/GetLighterCarrierDDL?BusinessUnitId=${buId}&PortId=${allValues?.port?.value}`
                          //   );
                          // }
                        },
                      }}
                    />
                    {/* <div className="col-lg-3">
                      <NewSelect
                        label="Carrier Name"
                        placeholder="Carrier Name"
                        value={values?.carrierName}
                        name="carrierName"
                        options={
                          lighterCarrierDDL?.map((itm) => ({
                            ...itm,
                            value: itm?.carrierId,
                            label: itm?.carrierName,
                          })) || []
                        }
                        onChange={(e) => {
                          setFieldValue("carrierName", e);
                        }}
                        isDisabled={false}
                      />
                    </div> */}

                    <div className="col-lg-3">
                      <NewSelect
                        name="billType"
                        options={billTypeDDL || []}
                        value={values?.billType}
                        label="Bill Type"
                        onChange={(valueOption) => {
                          setFieldValue("billType", valueOption);
                        }}
                        placeholder="Bill Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Carrier Name</label>
                      <SearchAsyncSelect
                        selectedValue={values?.carrierName}
                        handleChange={(valueOption) => {
                          setFieldValue("carrierName", valueOption);
                        }}
                        placeholder={"Search Carrier Name"}
                        loadOptions={loadOptions}
                      />
                    </div>

                    <FromDateToDateForm obj={{ values, setFieldValue }} />
                    <IButton
                      colSize={"col-lg-3"}
                      onClick={() => {
                        setGridData([]);
                        getData(values, "");
                      }}
                      disabled={!values?.motherVessel || !values?.carrierName}
                    />
                  </div>
                  {gridData?.length > 0 && (
                    <>
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
                    </>
                  )}
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
                        Number(a) +
                        (b.checked ? Number(b.surveyQuantity || 0) : 0),
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
                        (b.checked ? Number(b.carrierTotalAmount || 0) : 0),
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
                      <th>Mother Vessel</th>
                      <th>Lighter Vessel</th>
                      <th>Lighter Destination</th>
                      <th>Carrier Agent Name</th>
                      <th>Quantity</th>
                      <th>Rate</th>
                      <th>Bill Amount</th>
                      <th>Standerd Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.map((item, index) => {
                      const backgroundColor = {
                        backgroundColor:
                          item?.standardAmount > item?.carrierTotalAmount
                            ? "#7edb7ec7"
                            : item?.standardAmount < item?.carrierTotalAmount
                            ? "#fa030373"
                            : "#f8fa0373",
                      };
                      return (
                        <tr key={index} style={backgroundColor}>
                          <td className="text-center align-middle">
                            <input
                              type="checkbox"
                              // value = {item?.checked ? true:false}
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
                          <td>{item?.motherVesselName}</td>
                          <td>{item?.lighterVesselName}</td>
                          <td>{item?.lighterDestinationName}</td>
                          <td>{item?.carrierAgentName}</td>

                          <td className="text-right">{item?.surveyQuantity}</td>
                          <td className="text-right">
                            {item?.lighterFreightProvisionRate}
                          </td>
                          {/* <td className="text-right">{item?.carrierRate}</td> */}
                          <td style={{ width: "100px" }}>
                            <InputField
                              value={item?.carrierTotalAmount}
                              name="carrierTotalAmount"
                              placeholder="Total Amount"
                              type="number"
                              onChange={(e) => {
                                item.carrierTotalAmount = e.target.value;
                                setGridData([...gridData]);
                              }}
                            />
                          </td>
                          <td className="text-right">{item?.standardAmount}</td>
                        </tr>
                      );
                    })}
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
