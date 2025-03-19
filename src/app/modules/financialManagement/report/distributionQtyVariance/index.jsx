import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _getCurrentMonthYearForInput } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
const initData = {
  distributionChannel: "",
  region: "",
  area: "",
  territory: "",
  monthYear: _getCurrentMonthYearForInput(),
};
export default function DistributionQtyVariance() {
  const [channelDDL, getChannelDDL, channelDDLloader] = useAxiosGet();
  const [regionDDL, getRegionDDL, regionLoading, setRegionDDL] = useAxiosGet();
  const [areaDDL, getAreaDDL, areaLoading, setAreaDDl] = useAxiosGet();

  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();
  const [
    territoryDDL,
    getTerritoryDDL,
    territoryLoading,
    setTerritoryDDL,
  ] = useAxiosGet();
  const saveHandler = (values, cb) => {};

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getChannelDDL(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const getData = (values) => {
    const [year, month] = values?.monthYear.split("-").map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0));
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];
    getTableData(
      `/fino/Report/GetDistributionVarianceReport?partName=Quantity&businessUnitId=${selectedBusinessUnit?.value}&distributionId=${values?.distributionChannel?.value}&regionId=${values?.region?.value}&areaId=${values?.area?.value}&territoryId=${values?.territory?.value}&fromDate=${formattedStartDate}&toDate=${formattedEndDate}`
    );
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
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
          {(channelDDLloader ||
            regionLoading ||
            areaLoading ||
            territoryLoading ||
            tableDataLoader) && <Loading />}
          <IForm
            title="Distribution Quantity Variance"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-2">
                    <NewSelect
                      name="distributionChannel"
                      options={channelDDL || []}
                      value={values?.distributionChannel}
                      label="Distribution Channel"
                      onChange={(valueOption) => {
                        setTableData([]);
                        if (valueOption) {
                          setFieldValue("distributionChannel", valueOption);
                          setFieldValue("region", "");
                          setFieldValue("area", "");
                          setFieldValue("territory", "");
                          getRegionDDL(
                            `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${valueOption?.value}`,
                            (res) => {
                              const newDDL = res?.map((item) => ({
                                ...item,
                                value: item?.regionId,
                                label: item?.regionName,
                              }));
                              setRegionDDL(newDDL);
                            }
                          );
                        } else {
                          setFieldValue("distributionChannel", "");
                          setFieldValue("region", "");
                          setFieldValue("area", "");
                          setFieldValue("territory", "");
                          setRegionDDL([]);
                        }
                      }}
                      placeholder="Distribution Channel"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="region"
                      options={regionDDL || []}
                      value={values?.region}
                      label="Region"
                      onChange={(valueOption) => {
                        setTableData([]);
                        if (valueOption) {
                          setFieldValue("region", valueOption);
                          setFieldValue("area", "");
                          setFieldValue("territory", "");
                          const regionId = valueOption?.label
                            ? `&regionId=${valueOption?.value}`
                            : "";
                          getAreaDDL(
                            `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${values?.distributionChannel?.value}${regionId}`,
                            (res) => {
                              const newDDL = res?.map((item) => ({
                                ...item,
                                value: item?.areaId,
                                label: item?.areaName,
                              }));
                              setAreaDDl(newDDL);
                            }
                          );
                        } else {
                          setFieldValue("region", "");
                          setFieldValue("area", "");
                          setFieldValue("territory", "");
                          setAreaDDl([]);
                        }
                      }}
                      placeholder="Region"
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.distributionChannel}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="area"
                      options={areaDDL || []}
                      value={values?.area}
                      label="Area"
                      onChange={(valueOption) => {
                        setTableData([]);
                        if (valueOption) {
                          setFieldValue("area", valueOption);
                          setFieldValue("territory", "");
                          const areaId = valueOption?.label
                            ? `&areaId=${valueOption?.value}`
                            : "";
                          getTerritoryDDL(
                            `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${values?.distributionChannel?.value}&regionId=${values?.region?.value}${areaId}`,
                            (res) => {
                              const newDDL = res?.map((item) => ({
                                ...item,
                                value: item?.territoryId,
                                label: item?.territoryName,
                              }));
                              setTerritoryDDL(newDDL);
                            }
                          );
                        } else {
                          setFieldValue("area", "");
                          setFieldValue("territory", "");
                          setTerritoryDDL([]);
                        }
                      }}
                      placeholder="Area"
                      isDisabled={!values?.region}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="territory"
                      options={territoryDDL || []}
                      value={values?.territory}
                      label="Territory"
                      onChange={(valueOption) => {
                        setTableData([]);
                        if (valueOption) {
                          setFieldValue("territory", valueOption);
                        } else {
                          setFieldValue("territory", "");
                        }
                      }}
                      placeholder="Territory"
                      isDisabled={!values?.area}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Month-Year</label>
                    <InputField
                      value={values?.monthYear}
                      name="monthYear"
                      placeholder="From Date"
                      type="month"
                      onChange={(e) => {
                        setTableData([]);
                        setFieldValue("monthYear", e?.target?.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ marginTop: "18px" }}
                      onClick={() => {
                        getData(values);
                      }}
                      disabled={
                        !values?.distributionChannel ||
                        !values?.region ||
                        !values?.area ||
                        !values?.territory ||
                        !values?.monthYear
                      }
                    >
                      View
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th rowSpan="2">SL</th>
                          <th rowSpan="2">Item Code</th>
                          <th rowSpan="2">Item Name</th>
                          <th rowSpan="2">Uom</th>
                          <th colSpan="2">Plan Quantity</th>
                          <th colSpan="2">Actual Quantity</th>
                          <th colSpan="2">Variance Quantity</th>
                        </tr>
                        <tr>
                          <th>Via Trans Shipment</th>
                          <th>Direct</th>
                          <th>Via Trans Shipment</th>
                          <th>Direct</th>
                          <th>Via Trans Shipment</th>
                          <th>Direct</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">{item?.itemCode}</td>
                            <td>{item?.itemName}</td>
                            <td>{item?.uomName}</td>
                            <td className="text-right">
                              {item?.planQtyTransShipment}
                            </td>
                            <td className="text-right">
                              {item?.planQtyDirect}
                            </td>
                            <td className="text-right">
                              {item?.actualQtyTransShipment}
                            </td>
                            <td className="text-right">
                              {item?.actualQtyDirect}
                            </td>
                            <td className="text-right">
                              {item?.varianceQtyTransShipment}
                            </td>
                            <td className="text-right">
                              {item?.varianceQtyDirect}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
