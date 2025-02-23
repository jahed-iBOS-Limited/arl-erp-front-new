import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import IEdit from "../../../_helper/_helperIcons/_edit";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import { landingInitData, scfLimitLandingTableHeader } from "./helper";

export default function SCFLimitLandingPage() {
  // hooks
  const history = useHistory();

  // state
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(0);

  // api action
  const [
    scfLimitLandingData,
    getScfLimitLandingData,
    getScfLimitLandingDataLoading,
    setScfLimitLandingData,
  ] = useAxiosGet();

  // use effect
  useEffect(() => {
    setScfLimitLandingData([{ id: 1 }]);
  }, []);

  // submit handler
  const saveHandler = (values, cb) => {};

  // pagination handler
  const setPositionHandler = () => {};

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
              {scfLimitLandingData?.length > 0 ? (
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
                      {scfLimitLandingData?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{index + 1}</td>
                          <td>{index + 1}</td>
                          <td>{index + 1}</td>
                          <td>{index + 1}</td>
                          <td>{index + 1}</td>
                          <td>{index + 1}</td>
                          <td>{index + 1}</td>
                          <td>{index + 1}</td>
                          <td>{index + 1}</td>
                          <td>{index + 1}</td>
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
              {scfLimitLandingData?.length > 0 ? (
                <PaginationTable
                  count={0}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
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
