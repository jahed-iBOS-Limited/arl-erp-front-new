import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { useLocation } from "react-router";
import InputField from "../../../../_helper/_inputField";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import TextArea from "../../../../_helper/TextArea";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const initData = {
  orderRequirement: "",
};

export default function CreateEditJobOrder() {
  const location = useLocation();
  const salesQuotationId = location?.state?.quotationId;
  const [objProps, setObjprops] = useState({});
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const [
    jobOrderData,
    getJobOrderData,
    jobOrderDataLoader,
    setJobOrderData,
  ] = useAxiosGet();

  const [, saveJobOrder, jobOrderLoader] = useAxiosPost();

  const getData = () => {
    getJobOrderData(
      `/oms/SalesQuotation/ViewForeignSalesQuotation?QuotationId=${salesQuotationId}&accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`,
      (data) => {
        setJobOrderData(data.Data);
      }
    );
  };

  useEffect(() => {
    if (salesQuotationId) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, salesQuotationId]);

  const saveHandler = (values, cb) => {
    if (!jobOrderData?.HeaderData?.BatchNo) {
      return toast.warn("Please enter batch no");
    }
    console.log("jobOrderData", jobOrderData);

    const payload = {
      actionBy: profileData?.userId,
      batchNo: jobOrderData?.HeaderData?.BatchNo,
      jobOrderReq: jobOrderData?.JobOrderReq,
      rowData: jobOrderData?.RowData,
    };

    saveJobOrder(
      `/oms/SalesQuotation/UpdateJobOrderSheet`,
      payload,
      null,
      true
    );
  };

  const rowDtoHandler = (index, fieldName, inputValue) => {
    const updatedJobOrderData = { ...jobOrderData };
    updatedJobOrderData.RowData[index][fieldName] = inputValue;
    setJobOrderData(updatedJobOrderData);
  };

  const selfLifeHandler = (MfgDate, BestBefore, itemIndex) => {
    if (!MfgDate || !BestBefore) {
      const updatedJobOrderData = { ...jobOrderData };
      updatedJobOrderData.RowData[itemIndex]["SelfLife"] = 0;
    }

    const diffTime = Math.abs(new Date(BestBefore) - new Date(MfgDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // set self life
    const updatedJobOrderData = { ...jobOrderData };
    updatedJobOrderData.RowData[itemIndex]["SelfLife"] = diffDays;
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          getData();
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(jobOrderDataLoader || jobOrderLoader) && <Loading />}
          <IForm customTitle="Job Order" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <label>Batch No</label>
                  <InputField
                    value={jobOrderData?.HeaderData?.BatchNo}
                    type="text"
                    name="batchNo"
                    onChange={(e) => {
                      const updatedJobOrderData = { ...jobOrderData };
                      updatedJobOrderData.HeaderData.BatchNo = e.target.value;
                      setJobOrderData(updatedJobOrderData);
                    }}
                  />
                </div>
              </div>
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing mr-1">
                <thead>
                  <tr>
                    <th className="text-center">Sl</th>
                    <th>PRODUCT CODE</th>
                    <th>DESCRIPTION OF GOODS</th>
                    <th>PACKING SIZE</th>
                    {jobOrderData?.Head?.map((item, index) => {
                      return <th>{item?.HeaderName.toUpperCase()}</th>;
                    })}
                    <th>TOTAL PCS</th>
                    <th>FOB RATE PCS BDT</th>
                    <th>TOTAL AMOUNT FOB BDT</th>
                    <th>MFG DATE</th>
                    <th>BEST BEFORE</th>
                    <th>SELF LIFE</th>
                    <th>SAMPLE FOR FOREIGN CUSTOMS</th>
                    <th>SAMPLE FOR BD CUSTOMS</th>
                  </tr>
                </thead>
                <tbody>
                  {jobOrderData.RowData?.map((item, rowDataIndex) => (
                    <tr>
                      <td>{rowDataIndex + 1}</td>
                      <td>{item?.ItemCode.toUpperCase()}</td>
                      <td>{item?.ItemName.toUpperCase()}</td>
                      <td>{item?.PackingDetails.toUpperCase()}</td>
                      {item?.Headings?.map((itm, index) => (
                        <td>{itm?.HeaderValue}</td>
                      ))}
                      <td>{item?.TotalPieces}</td>
                      <td className="text-right">
                        {item?.FobRatePerPieceBDT
                          ? _formatMoney(item?.FobRatePerPieceBDT)
                          : ""}
                      </td>
                      <td className="text-right">
                        {item?.TotalFobAmountBDT
                          ? _formatMoney(item?.TotalFobAmountBDT)
                          : ""}
                      </td>
                      <td>
                        <InputField
                          value={_dateFormatter(item?.MfgDate)}
                          type="date"
                          name="MfgDate"
                          onChange={(e) => {
                            selfLifeHandler(
                              e.target.value,
                              item?.BestBefore,
                              rowDataIndex
                            );
                            rowDtoHandler(
                              rowDataIndex,
                              "MfgDate",
                              e.target.value
                            );
                          }}
                        />
                      </td>
                      <td>
                        <InputField
                          value={_dateFormatter(item?.BestBefore)}
                          type="date"
                          name="BestBefore"
                          onChange={(e) => {
                            selfLifeHandler(
                              item?.MfgDate,
                              e.target.value,
                              rowDataIndex
                            );
                            rowDtoHandler(
                              rowDataIndex,
                              "BestBefore",
                              e.target.value
                            );
                          }}
                        />
                      </td>
                      <td>
                        <InputField
                          value={item?.SelfLife}
                          type="number"
                          name="SelfLife"
                          disabled={true}
                        />
                      </td>
                      <td>
                        <InputField
                          value={item?.ForeignCustomsSample}
                          type="number"
                          name="ForeignCustomsSample"
                          onChange={(e) => {
                            rowDtoHandler(
                              rowDataIndex,
                              "ForeignCustomsSample",
                              e.target.value
                            );
                          }}
                        />
                      </td>
                      <td>
                        <InputField
                          value={item?.BdCustomsSample}
                          type="number"
                          name="BdCustomsSample"
                          onChange={(e) => {
                            rowDtoHandler(
                              rowDataIndex,
                              "BdCustomsSample",
                              e.target.value
                            );
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="form-group  global-form row">
                <div className="col-lg-12">
                  <h3>Order Execution Requirements</h3>
                </div>
                <div className="col-lg-3">
                  <label>Requirements Name</label>
                  <TextArea
                    value={values?.orderRequirement}
                    type="textArea"
                    name="orderRequirement"
                    onChange={(e) => {
                      setFieldValue("orderRequirement", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (values?.orderRequirement) {
                        const newObj = {
                          AutoId: 0,
                          Sl: jobOrderData?.JobOrderReq?.length + 1,
                          OrderRequirement: values?.orderRequirement,
                          QuotationId:
                            jobOrderData?.RowData[0]?.SalesQuotationId,
                        };
                        const newJobOrderData = { ...jobOrderData };
                        newJobOrderData.JobOrderReq = [
                          ...jobOrderData?.JobOrderReq,
                          newObj,
                        ];
                        setJobOrderData(newJobOrderData);
                        setFieldValue("orderRequirement", "");
                      } else {
                        toast.warning("Please enter order Requirement");
                      }
                    }}
                    style={{ marginTop: "18px" }}
                    className="btn btn-primary"
                  >
                    Add
                  </button>
                </div>
              </div>

              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing mr-1">
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: "60px" }}>
                      Sl
                    </th>
                    <th>Order Execution Requirements</th>
                    <th
                      style={{
                        width: "80px",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {jobOrderData?.JobOrderReq?.map((item, index) => (
                    <tr>
                      <td>{item?.Sl}</td>
                      <td>{item?.OrderRequirement}</td>
                      <td className="text-center">
                        <span>
                          <IDelete
                            remover={() => {
                              const filterArr = jobOrderData?.JobOrderReq?.filter(
                                (itm, idx) => idx !== index
                              );
                              const newJobOrderData = { ...jobOrderData };
                              newJobOrderData.JobOrderReq = filterArr;
                              setJobOrderData(newJobOrderData);
                            }}
                          />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
