import { Formik } from "formik";
import React from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../../_helper/_loading";

export default function EditForm({ obj }) {
  const { setOpen, singleData, preValues, getData } = obj;
  const [, postData, loading] = useAxiosPost();

  const saveHandler = (values) => {
    const payload = [
      {
        ...singleData,

        commissionDate: values?.commissionDate,
        bpcommissionRate: values?.bpcommissionRate || 0,
        bacommissionRate: values?.bacommissionRate || 0,
        cpcommissionRate: values?.cpcommissionRate || 0,
        firstSlabCommissionRate: values?.firstSlabCommissionRate || 0,
        secondSlabCommissionRate: values?.secondSlabCommissionRate || 0,
        thirdSlabCommissionRate: values?.thirdSlabCommissionRate || 0,
        offerQntFrom: values?.offerQntFrom,
        offerQntTo: values?.offerQntTo,
        achievementFrom: values?.achievementFrom,
        achievementTo: values?.achievementTo,
        commissionRate: values?.commissionRate,
      },
    ];
    postData(
      `/oms/CustomerSalesTarget/SavePartySalesCommissionConfiguration`,
      payload,
      () => {
        getData(0, 15, preValues);
        setOpen(false);
      },
      true
    );
  };

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...singleData,
          commissionDate: _dateFormatter(singleData?.commissionDate),
        }}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, resetForm }) => (
          <ICustomCard
            title="Sales Commission Modify"
            saveHandler={() => {
              saveHandler(values, () => {});
            }}
          >
            <div className="table-responsive">
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Area Name</th>
                    {[35, 36, 37, 38, 39, 40].includes(
                      preValues?.commissionType?.value
                    ) ? (
                      <>
                        <th>Offer Qnt From</th>
                        <th>Offer Qnt To</th>
                        <th>Achievement From</th>
                        <th>Achievement To</th>
                        <th>Commission Rate</th>
                      </>
                    ) : (
                      <>
                        <th>BP Rate/bag</th>
                        <th>BA Rate/bag</th>
                        <th>CP Rate/bag</th>
                      </>
                    )}

                    {[17, 18, 25, 27].includes(
                      preValues?.commissionType?.value
                    ) && (
                      <>
                        <th>1-99%</th>
                        <th>100-999%</th>
                        <th> {">"}999% </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <InputField
                        value={values?.commissionDate}
                        name="commissionDate"
                        placeholder="Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("commissionDate", e?.target?.value);
                        }}
                      />
                    </td>{" "}
                    <td>{values?.areaName}</td>
                    {[35, 36, 37, 38, 39, 40].includes(
                      preValues?.commissionType?.value
                    ) ? (
                      <>
                        <td>
                          <InputField
                            value={values?.offerQntFrom}
                            name="offerQntFrom"
                            placeholder="offerQntFrom"
                            type="text"
                            onChange={(e) => {
                              setFieldValue(
                                "offerQntFrom",
                                Number(e?.target?.value)
                              );
                            }}
                          />
                        </td>
                        <td>
                          <InputField
                            value={values?.offerQntTo}
                            name="offerQntTo"
                            placeholder="BA"
                            type="text"
                            onChange={(e) => {
                              setFieldValue(
                                "offerQntTo",
                                Number(e?.target?.value)
                              );
                            }}
                          />
                        </td>
                        <td>
                          <InputField
                            value={values?.achievementFrom}
                            name="achievementFrom"
                            placeholder="CP"
                            type="text"
                            onChange={(e) => {
                              setFieldValue(
                                "achievementFrom",
                                Number(e?.target?.value)
                              );
                            }}
                          />
                        </td>
                        <td>
                          <InputField
                            value={values?.achievementTo}
                            name="achievementTo"
                            placeholder="CP"
                            type="text"
                            onChange={(e) => {
                              setFieldValue(
                                "achievementTo",
                                Number(e?.target?.value)
                              );
                            }}
                          />
                        </td>
                        <td>
                          <InputField
                            value={values?.commissionRate}
                            name="commissionRate"
                            placeholder="CP"
                            type="text"
                            onChange={(e) => {
                              setFieldValue(
                                "commissionRate",
                                Number(e?.target?.value)
                              );
                            }}
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <InputField
                            value={values?.bpcommissionRate}
                            name="bpcommissionRate"
                            placeholder="BP"
                            type="text"
                            onChange={(e) => {
                              setFieldValue(
                                "bpcommissionRate",
                                e?.target?.value
                              );
                            }}
                          />
                        </td>
                        <td>
                          <InputField
                            value={values?.bacommissionRate}
                            name="bacommissionRate"
                            placeholder="BA"
                            type="text"
                            onChange={(e) => {
                              setFieldValue(
                                "bacommissionRate",
                                e?.target?.value
                              );
                            }}
                          />
                        </td>
                        <td>
                          <InputField
                            value={values?.cpcommissionRate}
                            name="cpcommissionRate"
                            placeholder="CP"
                            type="text"
                            onChange={(e) => {
                              setFieldValue(
                                "cpcommissionRate",
                                e?.target?.value
                              );
                            }}
                          />
                        </td>
                      </>
                    )}
                    {[17, 18, 25, 27].includes(
                      preValues?.commissionType?.value
                    ) && (
                      <>
                        <td>
                          <InputField
                            value={values?.firstSlabCommissionRate}
                            name="firstSlabCommissionRate"
                            type="text"
                            onChange={(e) => {
                              setFieldValue(
                                "firstSlabCommissionRate",
                                e?.target?.value
                              );
                            }}
                          />
                        </td>
                        <td>
                          <InputField
                            value={values?.secondSlabCommissionRate}
                            name="secondSlabCommissionRate"
                            type="text"
                            onChange={(e) => {
                              setFieldValue(
                                "secondSlabCommissionRate",
                                e?.target?.value
                              );
                            }}
                          />
                        </td>
                        <td>
                          <InputField
                            value={values?.thirdSlabCommissionRate}
                            name="thirdSlabCommissionRate"
                            type="text"
                            onChange={(e) => {
                              setFieldValue(
                                "thirdSlabCommissionRate",
                                e?.target?.value
                              );
                            }}
                          />
                        </td>
                      </>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
