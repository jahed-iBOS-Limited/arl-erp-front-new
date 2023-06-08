import React, { useState, useRef, useEffect } from "react";
import ReactToPrint from "react-to-print";
import { APIUrl } from "../../../../../App";
import { getAllTableData } from "../helper";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";

function EmployeeInfoView({ id }) {
  const printRef = useRef();
  const [gridData, setGridData] = useState();

  

  useEffect(() => {
    getAllTableData(id, setGridData);
  }, [id]);

  return (
    <>
      <div className="row">
        <div className="col-lg-12 d-flex justify-content-end">
          <ReactToPrint
            trigger={() => (
              <button
                type="button"
                className="btn btn-primary sales_invoice_btn mt-2"
              >
                <i style={{ fontSize: "18px" }} className="fas fa-print"></i>
                Print
              </button>
            )}
            content={() => printRef.current}
          />
        </div>
      </div>
      <div className="employee-information-css" ref={printRef}>
        <div className="row">
          <div className="col-lg-12 text-center headingOne">
            Employee Information
          </div>

          {/* Basic Information Start */}
          <div className="col-lg-12 heading">Basic Information</div>
          <div className="row col-lg-12 first-div">
            <div className="col-lg-8 div-one">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                <tr>
                  <td>
                    <div className="pl-1">Name (Full Name)</div>
                  </td>
                  <td>{gridData?.basicInfo?.empFullName}</td>
                  <td>
                    <div className="pl-1">Emp. Code</div>
                  </td>
                  <td>{gridData?.basicInfo?.empCode}</td>
                  <td className="text-center">Present Address</td>
                </tr>
                <tr>
                  <td>
                    <div className="pl-1">Business Unit</div>
                  </td>
                  <td>{gridData?.basicInfo?.businessUnitName}</td>
                  <td>
                    <div className="pl-1">SBU</div>
                  </td>
                  <td>{gridData?.basicInfo?.sbuName}</td>
                  <td rowSpan="2">{gridData?.basicInfo?.presentAddress}</td>
                </tr>
                <tr>
                  <td>
                    <div className="pl-1">Cost Center</div>
                  </td>
                  <td>{gridData?.basicInfo?.costCenterName}</td>
                  <td>
                    <div className="pl-1">Workplace</div>
                  </td>
                  <td>{gridData?.basicInfo?.workPlaceName}</td>
                </tr>
                <tr>
                  <td>
                    <div className="pl-1">Department</div>
                  </td>
                  <td>{gridData?.basicInfo?.departmentName}</td>
                  <td>
                    <div className="pl-1">Position/Rank</div>
                  </td>
                  <td>{gridData?.basicInfo?.positionName}</td>
                  <td className="text-center">Parmanent Address</td>
                </tr>
                <tr>
                  <td>
                    <div className="pl-1">Designation</div>
                  </td>
                  <td>{gridData?.basicInfo?.designationName}</td>
                  <td>
                    <div className="pl-1">Line Manager</div>
                  </td>
                  <td>{gridData?.basicInfo?.lineManagerName}</td>
                  <td rowSpan="2">{gridData?.basicInfo?.permanentAddress}</td>
                </tr>
                <tr>
                  <td>
                    <div className="pl-1">Contact Number</div>
                  </td>
                  <td>{gridData?.basicInfo?.contactNumber}</td>
                  <td>
                    <div className="pl-1">E-Mail Address</div>
                  </td>
                  <td>{gridData?.basicInfo?.emailAddress}</td>
                </tr>
              </table>
            </div>
            {/* Please Check The Image First */}
            <div className="col-lg-4 css-div-two div-two">
              <img
                src={`${APIUrl}/domain/Document/DownlloadFile?id=${gridData?.basicInfo?.documentId}`}
                className="img-emp-basic-info-report"
                alt={"pp"}
              />
            </div>
          </div>
          {/* Basic Information End */}

          {/* Administrative Information Start */}
          <div className="row col-lg-12 ">
            <div className="col-lg-12 mt-3 heading">
              Administrative Information
            </div>
            <div className="col-lg-12">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                <tr>
                  <td>
                    <div className="pl-1">Payroll Group</div>
                  </td>
                  <td>{gridData?.administrativeInfo?.payrollGroup }</td>
                  <td>
                    <div className="pl-1">Calender Type</div>
                  </td>
                  <td>{gridData?.administrativeInfo?.calendarType}</td>
                  <td>
                    <div className="pl-1">Calender/Roster Name</div>
                  </td>
                  <td>{gridData?.administrativeInfo?.calendarName }</td>
                  <td>
                    <div className="pl-1">Employee Group</div>
                  </td>
                  <td>{gridData?.administrativeInfo?.employeeGroup }</td>
                </tr>
                <tr>
                  <td>
                    <div className="pl-1">Organization Structure</div>
                  </td>
                  <td>{gridData?.administrativeInfo?.orgStructure }</td>
                  <td>
                    <div className="pl-1">Remuneration Type</div>
                  </td>
                  <td>{gridData?.administrativeInfo?.remunerationType }</td>
                  <td>
                    <div className="pl-1">Date of Joining</div>
                  </td>
                  <td>
                    {_dateFormatter(
                      gridData?.administrativeInfo?.dteJoiningDate
                    )}
                  </td>
                </tr>
              </table>
            </div>
          </div>
          {/* Administrative Information End */}

          {/* Remuneration Information Start */}
          <div className="row col-lg-12 mx-0">
            <div className="col-lg-12 mt-3 px-0 heading">
              Remuneration Information
            </div>
            <table className="table table-striped table-bordered bj-table bj-table-landing sales_order_landing_table">
              <thead>
                <tr>
                  <th style={{ width: "20px" }}>SL</th>
                  <th>Valid From</th>
                  <th>Valid To</th>
                  <th>Basic Salary</th>
                  <th>Net Payable</th>
                  <th>Gross Amount</th>
                  <th>Currency</th>
                  <th>Consolidated Salary?</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.remunarationInfo &&
                  gridData?.remunarationInfo?.map((item, key) => (
                    <tr key={key}>
                      <td className="text-center">{key + 1} </td>
                      <td className="text-center">
                        {_dateFormatter(item?.validFrom)}{" "}
                      </td>
                      <td className="text-center">
                        {_dateFormatter(item?.validTo)}{" "}
                      </td>
                      <td className="text-right">
                        <div className="pr-1">{item?.basicSalary}</div>
                      </td>
                      <td className="text-right">
                        <div className="pr-1">{item?.netPayable}</div>{" "}
                      </td>
                      <td className="text-right">
                        <div className="pr-1">{item?.grossAmount}</div>{" "}
                      </td>
                      <td>{item?.currencyName} </td>
                      <td className="text-right">
                        <div className="pr-1">{item?.consolidatedSalary} </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* Remuneration Information End */}

          {/* Bank Information Start */}
          <div className="row col-lg-12 mx-0">
            <div className="col-lg-12 mt-3 px-0 heading">Bank Information</div>
            <table className="table table-striped table-bordered bj-table bj-table-landing sales_order_landing_table">
              <thead>
                <tr>
                  <th style={{ width: "20px" }}>SL</th>
                  <th>Account/Beneficiary</th>
                  <th>Account Number</th>
                  <th>Country</th>
                  <th>Bank Name</th>
                  <th>Bank Branch</th>
                  <th>Default Bank?</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.bankInfo &&
                  gridData?.bankInfo?.map((item, key) => (
                    <tr key={key}>
                      <td className="text-center">{key + 1} </td>
                      <td>{item?.accountName} </td>
                      <td>{item?.accountNumber} </td>
                      <td> {item?.countryName}</td>
                      <td>{item?.bankName} </td>
                      <td>{item?.bankBranchName} </td>
                      <td>{item?.isDefaultBank} </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* Bank Information End */}

          {/* Personal Information Start */}
          <div className="row col-lg-12 ">
            <div className="col-lg-12 mt-3 heading">Personal Information</div>
            <div className="col-lg-12">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                <tr>
                  <td>
                    <div className="pl-1">Employee Nick Name</div>
                  </td>
                  <td>{gridData?.personalInfo?.empNickName}</td>
                  <td>
                    <div className="pl-1">Nationality</div>
                  </td>
                  <td>{gridData?.personalInfo?.nationality}</td>
                  <td>
                    <div className="pl-1">Date of Birth</div>
                  </td>
                  <td>
                    {_dateFormatter(gridData?.personalInfo?.dteDateofBirth)}
                  </td>
                  <td>
                    <div className="pl-1">Place of Birth</div>
                  </td>
                  <td>{gridData?.personalInfo?.birthPlace}</td>
                </tr>
                <tr>
                  <td>
                    <div className="pl-1">Gender</div>
                  </td>
                  <td>{gridData?.personalInfo?.gender}</td>
                  <td>
                    <div className="pl-1">Blood Group</div>
                  </td>
                  <td>{gridData?.personalInfo?.bloodGroup}</td>
                  <td>
                    <div className="pl-1">Identification Type</div>
                  </td>
                  <td>{gridData?.personalInfo?.identificationType}</td>
                  <td>
                    <div className="pl-1">Identification No</div>
                  </td>
                  <td>{gridData?.personalInfo?.identificationNo}</td>
                </tr>
                <tr>
                  <td>
                    <div className="pl-1">Religion</div>
                  </td>
                  <td>{gridData?.personalInfo?.religion}</td>
                  <td>
                    <div className="pl-1">Height (CM)</div>
                  </td>
                  <td>{gridData?.personalInfo?.height}</td>
                  <td>
                    <div className="pl-1">Weight (KG)</div>
                  </td>
                  <td>{gridData?.personalInfo?.weight}</td>
                  <td>
                    <div className="pl-1">Employee TIN No</div>
                  </td>
                  <td>{gridData?.personalInfo?.empTINNo}</td>
                </tr>
                <tr>
                  <td>
                    <div className="pl-1">Alternative Contact No</div>
                  </td>
                  <td>{gridData?.personalInfo?.alternateContact}</td>
                  <td>
                    <div className="pl-1">Residence Contact No.</div>
                  </td>
                  <td>{gridData?.personalInfo?.residenceContact}</td>
                  <td>
                    <div className="pl-1">Marital Status</div>
                  </td>
                  <td>{gridData?.personalInfo?.maritalStatus}</td>
                  <td>
                    <div className="pl-1">Date of Marriage</div>
                  </td>
                  <td>
                    {_dateFormatter(gridData?.personalInfo?.dteMarriageDate)}
                  </td>
                </tr>
              </table>
            </div>
          </div>
          {/* Personal Information End */}

          {/* Family Information Start */}
          <div className="row col-lg-12 mx-0">
            <div className="col-lg-12 mt-3 px-0 heading">
              Family Information
            </div>
            <table className="table table-striped table-bordered bj-table bj-table-landing sales_order_landing_table">
              <thead>
                <tr>
                  <th style={{ width: "20px" }}>SL</th>
                  <th>Relation With Employee</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Date Of Birth</th>
                  <th>Occupation</th>
                  <th>Identification Type</th>
                  <th>Identification Number</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.familyInfo &&
                  gridData?.familyInfo?.map((item, key) => (
                    <tr key={key}>
                      <td className="text-center">{key + 1} </td>
                      <td>{item?.relationWithEmp} </td>
                      <td>{item?.familyPersonName} </td>
                      <td> {item?.gender}</td>
                      <td>{_dateFormatter(item?.dateofBirth)} </td>
                      <td>{item?.occupasion} </td>
                      <td>{item?.identificationType} </td>
                      <td>{item?.identificationTypeNo} </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* Family Information End */}

          {/* Others Contact Information Start */}
          <div className="row col-lg-12 mx-0">
            <div className="col-lg-12 mt-3 px-0 heading">
              Others Contact Information
            </div>
            <table className="table table-striped table-bordered bj-table bj-table-landing sales_order_landing_table">
              <thead>
                <tr>
                  <th style={{ width: "20px" }}>SL</th>
                  <th>Contact Type</th>
                  <th>Contact Person</th>
                  <th>Relationship with Employee</th>
                  <th>Contact No.</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.othersContactInfo &&
                  gridData?.othersContactInfo?.map((item, key) => (
                    <tr key={key}>
                      <td className="text-center">{key + 1} </td>
                      <td>{item?.contactType} </td>
                      <td>{item?.contactPerson} </td>
                      <td> {item?.relationWithEmp}</td>
                      <td>{item?.contactNo} </td>
                      <td>{item?.address} </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* Others Contact Information End */}

          {/* Educational Information Start */}
          <div className="row col-lg-12 mx-0">
            <div className="col-lg-12 mt-3 px-0 heading">
              Educational Information
            </div>
            <table className="table table-striped table-bordered bj-table bj-table-landing sales_order_landing_table">
              <thead>
                <tr>
                  <th style={{ width: "20px" }}>SL</th>
                  <th>Level of Education</th>
                  <th>Exam/Degree</th>
                  <th>Major/Group</th>
                  <th>Duration (Years)</th>
                  <th>Institution</th>
                  <th>Passing Year</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.educationalInfo &&
                  gridData?.educationalInfo?.map((item, key) => (
                    <tr key={key}>
                      <td className="text-center">{key + 1} </td>
                      <td>{item?.educationLevel} </td>
                      <td>{item?.degree} </td>
                      <td> {item?.group}</td>
                      <td className="text-center">{item?.duration} </td>
                      <td>{item?.institute} </td>
                      <td className="text-center">{item?.passingYear} </td>
                      <td className="text-center">{item?.result} </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* Educational Information End */}

          {/* Work Experience Start */}
          <div className="row col-lg-12 mx-0">
            <div className="col-lg-12 mt-3 px-0 heading">Work Experience</div>
            <table className="table table-striped table-bordered bj-table bj-table-landing sales_order_landing_table">
              <thead>
                <tr>
                  <th style={{ width: "20px" }}>SL</th>
                  <th>Company Name</th>
                  <th>Designation/Rank</th>
                  <th>Department</th>
                  <th>Service Length</th>
                  <th>Area of Experiences (Skill)</th>
                  <th>Responsibilities</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.workExperience &&
                  gridData?.workExperience?.map((item, key) => (
                    <tr key={key}>
                      <td className="text-center">{key + 1} </td>
                      <td>{item?.compnayName} </td>
                      <td>{item?.designation} </td>
                      <td> {item?.department}</td>
                      {/* Need to updated it */}
                      <td>
                        {_dateFormatter(item?.fromServiceLength)}
                        {"-"}
                        {_dateFormatter(item?.toServiceLength)}
                      </td>
                      <td>{item?.areaOfExperiences} </td>
                      <td>{item?.responsibilities} </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* Work Experience End */}

          {/* Training/Certification Information Start */}
          <div className="row col-lg-12 mx-0">
            <div className="col-lg-12 mt-3 px-0 heading">
              Training/Certification Information{" "}
            </div>
            <table className="table table-striped table-bordered bj-table bj-table-landing sales_order_landing_table">
              <thead>
                <tr>
                  <th style={{ width: "20px" }}>SL</th>
                  <th>Trainning Title</th>
                  <th>Issuing Organization</th>
                  <th>Trainning Year</th>
                  <th>Duration (days)</th>
                  <th>Issue Date</th>
                  <th>Trainning Covered On</th>
                  <th>Credential Id</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.traningInfo &&
                  gridData?.traningInfo?.map((item, key) => (
                    <tr key={key}>
                      <td className="text-center">{key + 1} </td>
                      <td>{item?.traningTitle} </td>
                      <td>{item?.issuingOrganization} </td>
                      <td> {item?.trainingYear}</td>
                      <td>{item?.durationDays} </td>
                      {/* Need to change */}
                      <td>
                        {item?.monthOfIssue} {item?.yearOfIssue}{" "}
                      </td>
                      <td>{item?.trainingCovered} </td>
                      <td>{item?.credentialId} </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* Training/Certification Information End */}

          {/* Nominee Information Start */}
          <div className="row col-lg-12 mx-0">
            <div className="col-lg-12 mt-3 px-0 heading">
              Nominee Information
            </div>
            <table className="table table-striped table-bordered bj-table bj-table-landing sales_order_landing_table">
              <thead>
                <tr>
                  <th style={{ width: "20px" }}>SL</th>
                  <th>Name Nominee</th>
                  <th>Relationship with Employee</th>
                  <th>Address</th>
                  <th>Percentage (%)</th>
                  <th>Identification Type</th>
                  <th>Identification No.</th>
                  <th>Conutact No</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.nomineeInfo &&
                  gridData?.nomineeInfo?.map((item, key) => (
                    <tr key={key}>
                      <td className="text-center">{key + 1} </td>
                      <td>{item?.nomineeName} </td>
                      <td>{item?.relationWithEmp} </td>
                      <td> {item?.address}</td>
                      <td>{item?.percentage} </td>
                      <td>{item?.identificationType} </td>
                      <td>{item?.identificationNo} </td>
                      <td>{item?.contactNo} </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* Nominee Information End */}
        </div>
      </div>
    </>
  );
}

export default EmployeeInfoView;
