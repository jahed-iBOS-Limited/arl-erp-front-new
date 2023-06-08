/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import ICustomTable from "../../../../_helper/_customTable";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { getProfileOverviewDataById } from "../helper";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

export function ProfileOverviewTable() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    getProfileOverviewDataById(
      params?.profileOverId,
      location?.state?.buId,
      location?.state?.workPlaceId,
      setRowDto,
      setLoading
    );
  }, [params, location]);

  const header = [
    "SL",
    "EmployeeId",
    "Employee Name",
    "Designation Name",
    "Department Name",
    "Email",
    "Workplace Group Name",
    "Workplace Name",
    "BusinessUnit Name",
  ];

  const modifyHeader = [
    "SL",
    "EmployeeId",
    "Employee Name",
    "Designation Name",
    "Department Name",
    "Supervisor",
    "Line Manager",
    "Workplace Group Name",
    "Workplace Name",
    "BusinessUnit Name",
  ];

  return (
    <IForm
      title={params?.title}
      isDisabled={isDisabled}
      getProps={setObjprops}
      isHiddenReset={true}
      isHiddenSave={true}
    >
      {(isDisabled || loading) && <Loading />}
      <div className="mt-5">
        <div className="text-right">
          <ReactHTMLTableToExcel
            id="test-table-xls-button-att-reports"
            className="btn btn-primary"
            table="employee-overview-table-to-xlsx"
            filename={params?.title}
            sheet={params?.title}
            buttonText="Export Excel"
          />
        </div>
        <div>
          <ICustomTable
            ths={
              params?.profileOverId === "17" || params?.profileOverId === "18"
                ? modifyHeader
                : header
            }
            id={"employee-overview-table-to-xlsx"}
          >
            {rowDto?.length > 0 &&
              rowDto.map((item, i) => (
                <tr>
                  <td>{item?.Serial}</td>
                  <td className="text-center">{item?.EmployeeId}</td>
                  <td>{item?.EmployeeFullName}</td>
                  <td>{item?.DesignationName}</td>
                  <td>{item?.DepartmentName}</td>
                  {!(
                    params?.profileOverId === "17" ||
                    params?.profileOverId === "18"
                  ) && <td>{item?.Email}</td>}
                  {(params?.profileOverId === "17" ||
                    params?.profileOverId === "18") && (
                    <>
                      <td>{item?.Supervisor}</td>
                      <td>{item?.LineManager}</td>
                    </>
                  )}

                  <td>{item?.WorkplaceGroupName}</td>
                  <td>{item?.WorkplaceName}</td>
                  <td>{item?.BusinessUnitName}</td>
                </tr>
              ))}
          </ICustomTable>
        </div>
      </div>
    </IForm>
  );
}
