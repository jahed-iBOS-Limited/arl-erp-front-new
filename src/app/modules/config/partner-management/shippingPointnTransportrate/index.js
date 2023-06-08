import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../_helper/_select";
import IForm from "./../../../_helper/_form";
const initData = {
  partner: "",
  shipPoint: "",
};
export default function ShippingPointnTransportRate() {
  const [soldToPartnerDDL, getSoldToPartnerDDL] = useAxiosGet();
  const [showReport, setShowReport] = useState(false);
  const [permittedShipPoint, getPermittedShipPoint] = useAxiosGet();

  const {
    selectedBusinessUnit: { value: buId },
    profileData: { accountId: accId, userId },
  } = useSelector((state) => state.authData, shallowEqual);

  useEffect(() => {
    getSoldToPartnerDDL(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    getPermittedShipPoint(
      `/oms/ShipPoint/GetShipPointPermission?BusinessUnitId=${buId}&UserId=${userId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={() => {}}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <>
          <IForm
            title="Shipping Point & Transport Rate"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="shipPoint"
                    options={permittedShipPoint}
                    value={values?.shipPoint}
                    label="Select ShipPoint"
                    onChange={(valueOption) => {
                      setFieldValue("shipPoint", valueOption);
                      setShowReport(false);
                    }}
                    placeholder="Ship Point"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="partner"
                    options={[{ value: 0, label: "All" }, ...soldToPartnerDDL]}
                    value={values?.partner}
                    label="Sold to Partner"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("partner", valueOption);
                        setShowReport(false);
                      } else {
                        setFieldValue("partner", "");
                        setShowReport(false);
                      }
                    }}
                    placeholder="Sold to Partner"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div>
                  <button
                    onClick={() => {
                      setShowReport(true);
                    }}
                    style={{ marginTop: "18px" }}
                    type="button"
                    disabled={!values?.shipPoint || !values?.partner}
                    class="btn btn-primary"
                  >
                    Show Report
                  </button>
                </div>
              </div>
              {showReport && (
                <PowerBIReport
                  reportId={`ce54df06-aefd-469e-815f-1f701c8dc61b`}
                  groupId={`e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`}
                  parameterValues={[
                    { name: "BusinessUnitId", value: `${buId}` },
                    {
                      name: "intShipPointId",
                      value: `${values?.shipPoint?.value}`,
                    },
                    {
                      name: "soldToPartnerId",
                      value: `${values?.partner?.value}`,
                    },
                  ]}
                  parameterPanel={false}
                />
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
