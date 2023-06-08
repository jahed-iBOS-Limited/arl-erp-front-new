import axios from "axios";
import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _timeFormatter } from "../../../_helper/_timeFormatter";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const initData = {
  fromDate: "",
  toDate: "",
  reportType: { value: 1, label: "Date Wise Report" },
  supplier: { value: 0, label: "All" },
  customer: "",
  material: "",
};
function ScaleRepot() {
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [materialDDL, getMaterialDDL] = useAxiosGet();
  const [supplierDDL, getSupplierDDLDDL, , setSupplierDDL] = useAxiosGet();
  const [rowData, getRowData, lodar, setRowData] = useAxiosGet();

  useEffect(() => {
    getMaterialDDL(`/mes/MSIL/GateEntryItemDDL?intBusinessUnitId=${selectedBusinessUnit?.value}`);
    getSupplierDDLDDL(
      `/mes/MSIL/GetAllMSIL?PartName=PreRawMaterialSupplierDDL&BusinessUnitId=${selectedBusinessUnit?.value}`,
      (data) => {
        setSupplierDDL([{ value: 0, label: "All" }, ...data])
      }
    );
    getRowData(
      `/mes/MSIL/GetScaleReport?fromDate=${""}&toDate=${""}&intItemid=0&intSupplierId=0`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit]);

  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/mes/MesDDL/GetCustomerDDL?IntBusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Scale Report"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-2">
                      <InputField
                        label="From Date"
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        label="To Date"
                        value={values?.toDate}
                        name="toDate"
                        placeholder="Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="reportType"
                        options={[
                          { value: 1, label: "Date Wise Report" },
                          { value: 3, label: "Supplier Wise Report" },
                          { value: 4, label: "Customer Wise Report" },
                          { value: 5, label: "Material Wise Report" },
                        ]}
                        value={values?.reportType}
                        label="Report Type"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setRowData([]);
                            setFieldValue("reportType", valueOption);
                            setFieldValue("customer", "");
                            setFieldValue("material", "");
                            setFieldValue("supplier", {
                              value: 0,
                              label: "All",
                            });
                          } else {
                            setRowData([]);
                            setFieldValue("reportType", {
                              value: 1,
                              label: "Date Wise Report",
                            });
                            setFieldValue("supplier", "");
                            setFieldValue("customer", "");
                            setFieldValue("material", "");
                          }
                        }}
                      />
                    </div>
                    {values?.reportType?.value === 3 ? (
                      <div className="col-lg-2">
                        <NewSelect
                          name="supplier"
                          // options={supplierDDL || []}
                          // changes from ahsan kabir bhai
                          options={supplierDDL}
                          value={values?.supplier}
                          label="Supplier"
                          onChange={(valueOption) => {
                            setFieldValue("supplier", valueOption);
                          }}
                        />
                      </div>
                    ) : null}

                    {values?.reportType?.value === 4 ? (
                      <div className="col-lg-2">
                        <label>Customer</label>
                        <SearchAsyncSelect
                          selectedValue={values?.customer}
                          handleChange={(valueOption) => {
                            setFieldValue("customer", valueOption);
                          }}
                          loadOptions={loadUserList}
                        />
                      </div>
                    ) : null}

                    {values?.reportType?.value === 5 ? (
                      <div className="col-lg-2">
                        <NewSelect
                          name="material"
                          options={materialDDL || []}
                          value={values?.material}
                          label="Material"
                          onChange={(valueOption) => {
                            setFieldValue("material", valueOption);
                          }}
                        />
                      </div>
                    ) : null}
                    <div>
                      <button
                        style={{ marginTop: "18px" }}
                        type="button"
                        className="btn btn-primary"
                        disabled={
                          values?.reportType?.value === 1 &&
                          (!values?.fromDate || !values?.toDate)
                        }
                        onClick={() => {
                          getRowData(
                            `/mes/MSIL/GetScaleReport?intBusinessUnitId=${
                              selectedBusinessUnit?.value
                            }&intClientTypeId=${
                              values?.reportType?.value === 3
                                ? 1
                                : values?.reportType?.value === 4
                                ? 2
                                : 0
                            }&fromDate=${values?.fromDate ||
                              ""}&toDate=${values?.toDate ||
                              ""}&intItemid=${values?.material?.value ||
                              0}&intSupplierId=${values?.supplier?.value ||
                              values?.customer?.value ||
                              0}`
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                    <div style={{ marginTop: "18px" }} className="ml-5">
                      <ReactHTMLTableToExcel
                        id="scale-report-table-xls-button-att-reports"
                        className="btn btn-primary"
                        table="scale-report-table-to-xlsx"
                        filename={"Scale Report"}
                        sheet={"Scale Report"}
                        buttonText="Export Excel"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 text-center">
                  <h2>{selectedBusinessUnit?.label}</h2>
                  <h6>{selectedBusinessUnit?.businessUnitAddress}</h6>
                </div>

                <div className="loan-scrollable-table">
                  <div className="scroll-table _table" style={{maxHeight:"540px"}}>
                    <table
                      id="scale-report-table-to-xlsx"
                      className="table table-striped table-bordered bj-table bj-table-landing"
                    >
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Weighment No</th>
                          <th>Vehicle Id</th>
                          <th>Transporter Name</th>
                          <th>Customer/Supplier</th>
                          <th>Customer/Supplier Name</th>
                          <th>Drive Name</th>
                          <th>Driver Mobile Number</th>
                          <th>Item Name</th>
                          <th>Incoming Date & Time</th>
                          <th>Outgoing Date & Time</th>
                          <th>First Weight</th>
                          <th>Second Weight</th>
                          <th>Net Weight</th>
                          <th>Invoice No</th>
                          <th>TPS No</th>
                          <th>Trans. Challan No</th>
                          <th>Type of Vehicle</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.length > 0 &&
                          rowData.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.strWeightmenNo}</td>
                              <td>{item?.strVehicleNo}</td>
                              <td></td>
                              <td>{item?.strClientType}</td>
                              <td>{item?.strClientName}</td>
                              <td>{item?.strDriverName}</td>
                              <td>{item?.strDriverMobileNo}</td>
                              <td>{item?.strItemName}</td>
                              <td className="text-center">
                                {_dateFormatter(item?.dteIncomingDate)} &{" "}
                                {_timeFormatter(item?.incomingTime || "")}
                              </td>
                              <td className="text-center">
                                {_dateFormatter(item?.dteOutgoingDate)} &{" "}
                                {_timeFormatter(item?.outgoingTime || "")}
                              </td>
                              <td className="text-center">
                                {item?.numFirstWeight}
                              </td>
                              <td className="text-center">
                                {item?.numSecondWeight}
                              </td>
                              <td className="text-center">
                                {item?.numNetWeight}
                              </td>
                              <td className="text-center">
                                {item?.strInvoiceNo}
                              </td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          ))}
                        <tr>
                          <td></td>
                          <td colSpan="12" className="text-right">
                            <b className="mr-1">Total</b>
                          </td>
                          <td className="text-center">
                            <b>
                              {rowData?.reduce((a, b) => a + b.numNetWeight, 0)}
                            </b>
                          </td>
                          <td colSpan="4"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* <div className="row mt-5">
                  <div className="col-lg-12">
                   
                  </div>
                </div> */}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default ScaleRepot;
