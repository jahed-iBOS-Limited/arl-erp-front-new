import { Card, CardContent, Grid } from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { initData } from "./helper";

export default function SalesKPILanding() {
  // redux
  const {
    profileData: { accountId },
    selectedBusinessUnit: { value: buUnId },
  } = useSelector((state) => state.authData, shallowEqual);

  // api action
  // For rgr
  const [rgrSalesKPI, getRGRSalesKPI, getRGRSalesKPILoading] = useAxiosGet();
  // For NRR
  const [nrrSalesKPI, getNRRSalesKPI, getNRRSalesKPILoading] = useAxiosGet();

  // For ARPC
  const [arpcSalesKPI, getARPCSalesKPI, getARPCSalesKPILoading] = useAxiosGet();

  // For CAC
  const [cacSalesKPI, getCACSalesKPI, getCACSalesKPILoading] = useAxiosGet();

  // save handler/handle submit
  const saveHandler = (values, cb) => {
    let parmas = `AccountId=${accountId}&BUnitId=${buUnId}&FromMonth=${getLastDateOfMonth(
      values?.startMonth
    )}`;

    getRGRSalesKPI(`/oms/KPIsforRevenue/GetRevenueGrowthRate?${parmas}`);
    getNRRSalesKPI(`/oms/KPIsforRevenue/getNetRevenueRetention?${parmas}`);
    getARPCSalesKPI(
      `/oms/KPIsforRevenue/getAverageRevenuePerCustomer?${parmas}`
    );
    getCACSalesKPI(
      `/oms/KPIsforRevenue/getCustomerAcquisitionCostByChannel?${parmas}`
    );
  };

  // is loading
  const isLoading =
    getRGRSalesKPILoading ||
    getNRRSalesKPILoading ||
    getARPCSalesKPILoading ||
    getCACSalesKPILoading;

  function getLastDateOfMonth(monthYear) {
    if (!monthYear) return null;

    // Extract the year and month from the input
    const [year, month] = monthYear.split("-").map(Number);

    /// Generate the last day of the month in UTC
    const lastDate = new Date(Date.UTC(year, month, 0)); // 'month' is 1-based

    return lastDate.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
  }

  const GenericCardBody = ({ obj: { title, data } }) => {
    return (
      <CardContent>
        <h4
          style={{
            marginBottom: "8px",
            color: "#5b5d5e",
          }}
        >
          {title || ""}
        </h4>

        <div className="d-flex flex-row justify-content-between">
          <h6 style={{ color: "#6c6f72" }}>Target</h6>
          <h6 className="text-primary">
            {data?.target ? Number(data?.target).toFixed(2) : 0}
          </h6>
        </div>
        <div className="d-flex flex-row justify-content-between">
          <h6 style={{ color: "#6c6f72" }}>Actual</h6>
          <h6 className="text-primary">
            {data?.actual ? Number(data?.actual).toFixed(2) : 0}
          </h6>
        </div>
      </CardContent>
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
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
          {isLoading && <Loading />}
          <IForm title="Sales KPI" isHiddenReset isHiddenBack isHiddenSave>
            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <label>Start Month</label>
                  <InputField
                    value={values?.startMonth}
                    name="startMonth"
                    placeholder="From Date"
                    type="month"
                    onChange={(e) => {
                      setFieldValue("startMonth", e?.target?.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <button
                    className="btn btn-primary mt-5"
                    type="submit"
                    onSubmit={() => handleSubmit()}
                  >
                    View
                  </button>
                </div>
              </div>

              <Grid container spacing={2}>
                {/* First Card */}
                <Grid item xs={12} md={6} lg={3}>
                  <Card variant="outlined">
                    <GenericCardBody
                      obj={{
                        title: "Revenue Growth Rate",
                        data: rgrSalesKPI,
                      }}
                    />
                  </Card>
                </Grid>

                {/* Second Card */}
                <Grid item xs={12} md={6} lg={3}>
                  <Card variant="outlined">
                    <GenericCardBody
                      obj={{
                        title: "Net Revenue Retention",
                        data: nrrSalesKPI,
                      }}
                    />
                  </Card>
                </Grid>

                {/* Third Card */}
                <Grid item xs={12} md={6} lg={3}>
                  <Card variant="outlined">
                    <GenericCardBody
                      obj={{
                        title: "Average Revenue Per Customer",
                        data: arpcSalesKPI,
                      }}
                    />
                  </Card>
                </Grid>

                {/* Fourth Card */}
                <Grid item xs={12} md={6} lg={3}>
                  <Card variant="outlined">
                    <GenericCardBody
                      obj={{
                        title: "Customer Acquisition Cost",
                        data: cacSalesKPI,
                      }}
                    />
                  </Card>
                </Grid>
              </Grid>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
