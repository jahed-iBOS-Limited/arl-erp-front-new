import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import IEdit from "../../../_helper/_helperIcons/_edit";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import {
  fetchSCFLimitData,
  landingInitData,
  scfLimitLandingTableHeader,
} from "./helper";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export default function SCFLimitLandingPage() {
  // hooks
  const history = useHistory();
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  // state
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // api action
  const [
    scfLimitLandingData,
    getScfLimitLandingData,
    getScfLimitLandingDataLoading,
  ] = useAxiosGet();

  // use effect
  useEffect(() => {
    fetchSCFLimitData({
      pageSize,
      pageNo,
      selectedBusinessUnit,
      getScfLimitLandingData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // submit handler
  const saveHandler = (values, cb) => {};

  // is loading
  const isLoading = getScfLimitLandingDataLoading;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(landingInitData);
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
          <IForm
            title="SCF Limit"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push("/financial-management/scf/scflimit/create");
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              {/* SCF Limit Landing Table */}
              {scfLimitLandingData?.data?.length > 0 ? (
                <div className="table-responsive my-2">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        {scfLimitLandingTableHeader?.map((item, index) => (
                          <th key={index}>{item}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {scfLimitLandingData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td>{item?.sl}</td>
                          <td>{item?.businessPartnerName}</td>
                          <td>{item?.bankName}</td>
                          <td>{item?.accountNumber}</td>
                          <td className="text-right">{item?.limit}</td>
                          <td className="text-right">{item?.utilizeAmount}</td>
                          <td>{item?.tenorDays}</td>
                          <td>{item?.sanctionReference}</td>
                          <td>{_dateFormatter(item?.limitExpiryDate)}</td>
                          <td className="text-right">{item?.interestRate}</td>
                          <td>{item?.remarks}</td>
                          <td>
                            <IEdit
                              onClick={(e) =>
                                history.push({
                                  pathname: `/financial-management/scf/scflimit/edit/${item?.id}`,
                                  state: item,
                                })
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <></>
              )}

              {/* SCF Landing Pagination Table */}
              {scfLimitLandingData?.data?.length > 0 ? (
                <PaginationTable
                  count={scfLimitLandingData?.totalCount || 0}
                  setPositionHandler={(pageNo, pageSize) => {
                    fetchSCFLimitData({
                      pageSize,
                      pageNo,
                      selectedBusinessUnit,
                      getScfLimitLandingData,
                    });
                  }}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              ) : (
                <></>
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
