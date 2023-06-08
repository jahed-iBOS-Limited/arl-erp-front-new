/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Loading from "../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  ModalProgressBar,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";
import { Formik, Form } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import IViewModal from "../../../../_helper/_viewModal";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import ChangeDateModal from "./ChangeDateModal";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import { getPlApplicationList } from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const initData = {
  employee: "",
};
export function PLDateChange() {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const getData = () => {
    getPlApplicationList(
      selectedBusinessUnit?.value,
      0,
      setLoading,
      setGridData
    );
  };

  const cb = () => {
    getData();
    setModalView(false);
  };

  useEffect(() => {
    getData();
  }, [selectedBusinessUnit]);

  const loadEmpList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=${profileData?.accountId}&search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="PL Date Change"></CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row">
                    <div className="col-lg-3">
                      <label>Employee</label>
                      <SearchAsyncSelect
                        selectedValue={values?.employee}
                        handleChange={(valueOption) => {
                          setFieldValue("employee", valueOption);
                          getPlApplicationList(
                            valueOption?.value ? 0 : selectedBusinessUnit?.value,
                            valueOption?.value || 0,
                            setLoading,
                            setGridData
                          );
                        }}
                        loadOptions={loadEmpList}
                        placeholder="Search by Enroll/ID No/Name (min 3 letter)"
                      />
                    </div>
                  </div>
                  <div className="row cash_journal">
                    {loading && <Loading />}
                    <div className="col-lg-12">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "20px" }}>SL</th>
                            <th>Enroll</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Designation</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th style={{ width: "150px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.length > 0 &&
                            gridData?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <div className="pl-2">{item?.employeeId}</div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {item?.employeeName}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {item?.departmentName}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {item?.designationName}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {_dateFormatter(item?.plFromDate)}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {_dateFormatter(item?.plToDate)}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    <ButtonStyleOne
                                      type="button"
                                      label="Change Date"
                                      onClick={(e) => {
                                        setCurrentItem(item);
                                        setModalView(true);
                                      }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
      <IViewModal
        show={modalView}
        onHide={() => setModalView(false)}
        title={"Change Date"}
        btnText="Close"
      >
        <ChangeDateModal
          userId={profileData?.userId}
          cb={cb}
          currentItem={currentItem}
        />
      </IViewModal>
    </div>
  );
}
