import { Formik } from "formik";
import React, { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
// import { DownloadFile } from "../../../_chartinghelper/fileDownload";
import IDelete from "../../../_chartinghelper/icons/_delete";
import ICon from "../../../_chartinghelper/icons/_icon";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";
import { _dateFormatter } from "../../../_chartinghelper/_dateFormatter";
import IViewModal from "../../../_chartinghelper/_viewModal";
import { editVoyageRow } from "../../helper";
import { removeCharterer } from "../utils";
import ChartererSection from "./chartererSection";
import VoyageCharterer from "./voyageCharterer";

// Validation schema For Charterer Update API
export const validationSchema = Yup.object().shape({
  brokerCommission: Yup.string().required("Broker Commission is required"),
  addressCommission: Yup.string().required("Address Commission is required"),
  demurrageRate: Yup.string().required("Demurrage Rate is required"),
  freightPercentage: Yup.string().required("Freight Percentage is required"),
  startPort: Yup.object().shape({
    value: Yup.string().required("This Field is required"),
    label: Yup.string().required("This Field is required"),
  }),
  endPort: Yup.object().shape({
    value: Yup.string().required("This Field is required"),
    label: Yup.string().required("This Field is required"),
  }),
});

export default function ChartererRow({
  chartererRowData,
  setChartererRowData,
  viewType,
  values,
  getByIdCalled,

  /* DDL */
  businessPartnerTypeDDL,
  brokerDDL,
  portDDL,
  chartererDDL,
  cargoDDL,
}) {
  const [cargoListModal, setCargoListModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [chartererHeaderData, setChartererHeaderData] = useState([]);
  const [loading, ] = useState(false);

  /* New Init Data For New Formik */
  const makeInitData = (chartererHeaderData) => {
    return {
      // ...chartererHeaderData,
      charterName: {
        value: chartererHeaderData?.charterId,
        label: chartererHeaderData?.charterName,
      },
      brokerName: {
        value: chartererHeaderData?.brokerId,
        label: chartererHeaderData?.brokerName,
      },
      startPort:
        {
          value: chartererHeaderData?.loadPortId,
          label: chartererHeaderData?.loadPortName,
        } || "",
      endPort:
        {
          value: chartererHeaderData?.dischargePortId,
          label: chartererHeaderData?.dischargePortName,
        } || "",
      cpDate: _dateFormatter(chartererHeaderData?.cpDate),
      layCanFrom: _dateFormatter(chartererHeaderData?.layCanFrom),
      layCanTo: _dateFormatter(chartererHeaderData?.layCanTo),
      brokerCommission: chartererHeaderData?.brokerCommission,
      addressCommission: chartererHeaderData?.addressCommission,
      freightPercentage: chartererHeaderData?.freightPercentage,

      demurrageRate: chartererHeaderData?.demurrageRate || 0,
      despatchRate: chartererHeaderData?.dispatchRate || 0,
      deadFreightDetention: chartererHeaderData?.deadFreight || 0,
      detention: chartererHeaderData?.detention || 0,
      cargoName: "",
    };
  };

  /* CargoList Setter */
  const setCargoListHandler = (values, cargoList) => {
    setChartererHeaderData({
      ...chartererHeaderData,
      addressCommission: values?.addressCommission,
      apamount: 0,
      brokerCommission: values?.brokerCommission,
      brokerId: values?.brokerName?.value,
      brokerName: values?.brokerName?.label,
      charterId: values?.charterName?.value,
      charterName: values?.charterName?.label,
      cpDate: values?.cpDate,
      loadPortId: values?.startPort?.value,
      loadPortName: values?.startPort?.label,
      dischargePortId: values?.endPort?.value,
      dischargePortName: values?.endPort?.label,
      deadFreight: values?.deadFreightDetention,
      demurrageRate: values?.demurrageRate,
      dispatchRate: values?.despatchRate,
      layCanFrom: values?.layCanFrom,
      layCanTo: values?.layCanTo,
      voyageId: chartererHeaderData?.voyageId,
      voyageRowId: chartererHeaderData?.voyageRowId,
      totalCargoAmount:
        cargoList?.reduce((acc, obj) => acc + +obj?.totalFreight, 0) || 0,
      objVoyageChtrList: cargoList,
    });
  };

  const saveHandler = (values) => {
    if (chartererHeaderData?.objVoyageChtrList?.length === 0) {
      toast.warn("Please add at least one cargo", { toastId: 1234 });
      return;
    }

    const payload = {
      voyageRowId: chartererHeaderData?.voyageRowId,
      voyageId: chartererHeaderData?.voyageId,
      charterId: values?.charterName?.value,
      charterName: values?.charterName?.label,
      cpDate: values?.cpDate,
      loadPortId: values?.startPort?.value,
      loadPortName: values?.startPort?.label,
      dischargePortId: values?.endPort?.value,
      dischargePortName: values?.endPort?.label,
      layCan: "",
      brokerId: values?.brokerName?.value,
      brokerName: values?.brokerName?.label,
      brokerCommission: +values?.brokerCommission,
      addressCommission: +values?.addressCommission,
      totalCargoAmount: +chartererHeaderData?.totalCargoAmount,
      deadFreight: +values?.deadFreightDetention,
      demurrageRate: +values?.demurrageRate,
      dispatchRate: +values?.despatchRate,
      layCanFrom: values?.layCanFrom,
      layCanTo: values?.layCanTo,
      objCargoList: chartererHeaderData?.objVoyageChtrList,

      // new two fields
      freightPercentage: parseFloat(values?.freightPercentage) || 0,
      detention: +values?.detention || 0,

      lsmgoPrice: 0,
      lsifoPrice: 0,
      iloch: 0,
      cveday: 0,
      dailyHire: 0,
      apamount: 0,
      totalHireAmount: 0,
    };

    editVoyageRow(payload, getByIdCalled, () => {
      setCargoListModal(false);
    });
  };

  return (
    <>
      {loading && <Loading />}
      <div className="voyageStatement mt-2">
        {chartererRowData?.length > 0 && (
          <>
            <h6 className="">
              <strong>Charterer List</strong>
            </h6>
            <ICustomTable
              ths={[
                { name: "SL" },
                { name: "Charterer Name" },
                // {
                //   name:
                //     values?.voyageType?.value === 1
                //       ? "Delivery Position"
                //       : "Load Port",
                // },
                // {
                //   name:
                //     values?.voyageType?.value === 1
                //       ? "Delivery Position"
                //       : "Load Port",
                // },
                { name: "Broker Commission (%)" },
                { name: "Address Commission (%)" },
                { name: "Action" },
              ]}
            >
              {chartererRowData?.map((item, index) => (
                <tr key={index}>
                  <td className="text-center" style={{ maxWidth: "30px" }}>
                    {index + 1}
                  </td>
                  <td>{item?.charterName}</td>
                  {/* <td>{item?.loadPortName}</td>
                  <td>{item?.dischargePortName}</td> */}
                  <td className="text-right">{item?.brokerCommission}</td>
                  <td className="text-right">{item?.addressCommission}</td>
                  <td className="text-center d-flex justify-content-center align-items-center">
                    {viewType !== "view" ? (
                      <p
                        className="mb-0"
                        setChartererRowData
                        onClick={() => {
                          removeCharterer(
                            index,
                            chartererRowData,
                            setChartererRowData
                          );
                        }}
                      >
                        <IDelete />
                      </p>
                    ) : null}

                    {item?.objCargoList?.length > 0 ||
                    item?.objVoyageChtrList?.length > 0 ? (
                      <ICon
                        title="View Cargo List"
                        onClick={() => {
                          setModalData(
                            item?.objCargoList || item?.objVoyageChtrList || []
                          );
                          setChartererHeaderData(item);
                          setCargoListModal(true);
                        }}
                      >
                        <i className="fa fa-eye fa-lg ml-2" />
                      </ICon>
                    ) : (
                      <button
                        style={{ opacity: "0%" }}
                        type="button"
                        className="ml-3 btn btn-info px-3 py-1"
                      >
                        Cargo
                        <i className="fa fa-eye ml-1" />
                      </button>
                    )}
                    {/* <ICon
                      title="Download Cp Clause"
                      onClick={() => {
                        DownloadFile(
                          `https://erp.ibos.io/domain/Document/DownlloadFile?id=637847414667067245_CP CLAUSE.docx`,
                          "CP Clause",
                          setLoading
                        );
                      }}
                    >
                      <i className="fas ml-2 fa-file-download"></i>
                    </ICon> */}
                  </td>
                </tr>
              ))}
            </ICustomTable>

            <IViewModal
              show={cargoListModal}
              onHide={() => setCargoListModal(false)}
            >
              {viewType && chartererHeaderData?.voyageId ? (
                <>
                  <Formik
                    enableReinitialize={true}
                    initialValues={makeInitData(chartererHeaderData)}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                      saveHandler(values);
                    }}
                  >
                    {({
                      handleSubmit,
                      resetForm,
                      values,
                      errors,
                      touched,
                      setFieldValue,
                      isValid,
                      setErrors,
                      setTouched,
                    }) => (
                      <>
                        <form className="marine-modal-form-card pb-6">
                          <div className="marine-form-card-heading">
                            <p>{"Charterer Details"}</p>
                            <div>
                              {viewType === "edit" ? (
                                <button
                                  type="submit"
                                  className={"btn btn-primary ml-2 px-3 py-2"}
                                  onClick={handleSubmit}
                                >
                                  Update
                                </button>
                              ) : null}
                            </div>
                          </div>

                          <ChartererSection
                            values={values}
                            businessPartnerTypeDDL={businessPartnerTypeDDL}
                            setFieldValue={setFieldValue}
                            viewType={viewType}
                            errors={errors}
                            touched={touched}
                            brokerDDL={brokerDDL}
                            portDDL={portDDL}
                            chartererDDL={chartererDDL}
                            chartererRowData={chartererRowData}
                            setChartererRowData={setChartererRowData}
                            componentType={viewType === "edit"}
                          />

                          <VoyageCharterer
                            portDDL={portDDL}
                            values={values}
                            setFieldValue={setFieldValue}
                            viewType={viewType}
                            errors={errors}
                            touched={touched}
                            cargoList={chartererHeaderData?.objVoyageChtrList}
                            cargoDDL={cargoDDL}
                            setCargoList={(data) => {
                              setCargoListHandler(values, data);
                            }}
                            chartererRowData={chartererRowData}
                            setChartererRowData={setChartererRowData}
                            componentType={viewType === "edit"}
                            setErrors={setErrors}
                            setTouched={setTouched}
                          />
                        </form>
                      </>
                    )}
                  </Formik>
                </>
              ) : null}

              {!viewType || !chartererHeaderData?.voyageId ? (
                <div className="voyageStatement mt-2">
                  {modalData?.length > 0 && (
                    <>
                      <h6 className="">Cargo List</h6>
                      <ICustomTable
                        ths={[
                          { name: "SL" },
                          { name: "Cargo Name" },
                          { name: "Load Port" },
                          { name: "Discharge Port" },
                          { name: "Cargo Qty" },
                          { name: "Freight/MT" },
                          { name: "Freight Value" },
                        ]}
                      >
                        {modalData?.map((item, index) => (
                          <tr key={index}>
                            <td
                              className="text-center"
                              style={{ maxWidth: "30px" }}
                            >
                              {index + 1}
                            </td>
                            <td>{item?.cargoName}</td>
                            <td>{item?.cargoLoadPortName}</td>
                            <td>{item?.cargoDischargePortName}</td>
                            <td className="text-right">{item?.cargoQty}</td>
                            <td className="text-right">{item?.freightRate}</td>
                            <td className="text-right">{item?.totalFreight}</td>
                          </tr>
                        ))}
                        <tr className="font-weight-bold">
                          <td colSpan={4} className="text-right">
                            Total
                          </td>
                          <td>
                            <p className="text-right">
                              {modalData?.reduce(
                                (acc, cur) => acc + Number(cur?.cargoQty),
                                0
                              )}
                            </p>
                          </td>
                          <td>
                            <p className="text-right">
                              {modalData?.reduce(
                                (acc, cur) => acc + Number(cur?.freightRate),
                                0
                              )}
                            </p>
                          </td>
                          <td className="text-right">
                            {modalData?.reduce(
                              (acc, cur) => acc + cur?.totalFreight,
                              0
                            )}
                          </td>
                        </tr>
                      </ICustomTable>
                    </>
                  )}
                </div>
              ) : null}
            </IViewModal>
          </>
        )}
      </div>
    </>
  );
}
