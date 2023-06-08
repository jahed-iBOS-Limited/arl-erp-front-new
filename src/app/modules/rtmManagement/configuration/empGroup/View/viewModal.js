import React, { useEffect, useState } from "react";
import { getEmployeeGroupNameById } from "../helper";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";

export default function EmployeeGroupViewForm() {
  // eslint-disable-next-line no-unused-vars
  const history = useHistory();
  const params = useParams();
  const [singleData, setSingleData] = useState("");

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    if (params?.id) {
      getEmployeeGroupNameById(params?.id, setSingleData);
    }
  }, [profileData, selectedBusinessUnit, params]);

  const backHandler = () => {
    history.goBack();
  };

  console.log("id", params?.id);
  console.log("singleData", singleData);
  return (
    <>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title={"View Employee Group"}>
          <CardHeaderToolbar>
            <button onClick={backHandler} className="btn btn-light">
              Back
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="mt-0">
            <div className="row">
              <div className="col-lg-12">
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>Employee Group</th>
                      <th>Business Unit Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {singleData?.length > 0 &&
                      singleData?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="pl-2">
                              {item?.employeeGroupName}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.businessUnitName}</div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
