import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import IForm from "../../../../_helper/_form";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
const initData = {};
export default function FuelRateConfig() {
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [
    fuelRateConfigData,
    getFuelRateConfigData,
    fuelRateConfigDataLoader,
  ] = useAxiosGet();
  const setPositionHandler =(pageNo,pageSize)=>{
    getFuelRateConfigData(
        `/mes/VehicleLog/GetFuelRateConfigLanding?pageNumber=${pageNo}&pageSize=${pageSize}&viewOrder=asc`
      );
  }
  useEffect(() => {
    getFuelRateConfigData(
      `/mes/VehicleLog/GetFuelRateConfigLanding?pageNumber=${pageNo}&pageSize=${pageSize}&viewOrder=asc`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          {fuelRateConfigDataLoader && <Loading />}
          <IForm
            title="Fuel Rate Config Landing"
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
                      history.push(
                        "/transport-management/configuration/fuelrateconfig/create"
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Fuel Name</th>
                      <th>Fuel Rate</th>
                      <th>Is Active</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fuelRateConfigData?.data?.length > 0 &&
                      fuelRateConfigData?.data?.map((item, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td className="text-center">{item?.strFuelName}</td>
                          <td className="text-center">{item?.numRate}</td>
                          <td className="text-center">
                            {item?.isActive ? "True" : "False"}
                          </td>
                          <td className="text-center">
                            <span
                              onClick={() => {
                                history.push(
                                  `/transport-management/configuration/fuelrateconfig/edit/${item.intFuelRateId}`,
                                  item
                                );
                              }}
                            >
                              <IEdit />
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {fuelRateConfigData?.data?.length > 0 && (
                  <PaginationTable
                    count={fuelRateConfigData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                  />
                )}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
