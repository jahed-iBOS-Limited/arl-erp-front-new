/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import { PortAndMotherVessel } from "../../../common/components";

const initData = {
  port: "",
  motherVessel: "",
  year: "",
};

const ServiceChargeAndIncomeElementLanding = () => {
  const history = useHistory();
  const [rowData, getRowData, isLoading] = useAxiosGet();

  // get user profile data from store
  // const {
  //   profileData: { userId },
  //   selectedBusinessUnit: { value: buId, label: buName },
  // } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values) => {
    const url = ``;

    getRowData(url, (resData) => {});
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <ICustomCard
              title={"Service Charge and Income Element"}
              createHandler={() => {
                history.push(
                  "/vessel-management/configuration/ServiceChargeAndIncomeElement/config"
                );
              }}
            >
              {isLoading && <Loading />}

              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <PortAndMotherVessel obj={{ values, setFieldValue }} />
                    <YearMonthForm
                      obj={{ values, setFieldValue, month: false }}
                    />
                    <IButton
                      onClick={() => {
                        getData(values);
                      }}
                    />
                  </div>
                </div>
                {rowData?.length > 0 && (
                  <div className="loan-scrollable-table inventory-statement-report">
                    <div
                      style={{ maxHeight: "500px" }}
                      className="scroll-table _table"
                    >
                      <table
                        className={
                          "table table-striped table-bordered bj-table bj-table-landing "
                        }
                      >
                        <thead>
                          <tr>
                            <th style={{ minWidth: "30px" }} rowSpan={2}>
                              SL
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.map((item, i) => {
                            return (
                              <tr key={i}>
                                <td className="text-center">{i + 1}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default ServiceChargeAndIncomeElementLanding;
