import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { Card, CardBody, CardHeader, ModalProgressBar } from '../../../../../_metronic/_partials/controls';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import Loading from '../../../_helper/_loading';
import { familyInfoReportExcel } from './helper';

const initData = {
    businessUnit: "",
    employeeType: "",
    searchValue: "",
};

const FamilyInfoReport = () => {
    const [rowData, getRowData, lodar] = useAxiosGet();

    useEffect(() => {
        getRowData(
            `/hcm/FamilyInfo/GetFamilyInfo?strPartName=ManagementAndNonManagementEmployeeSpouseAndChild`
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Formik enableReinitialize={true} initialValues={initData} onSubmit={() => { }}>
                {({ values, setFieldValue, errors, touched }) => (
                    <>
                        <Card>
                            {true && <ModalProgressBar />}
                            <CardHeader title={"Family Info Report"}></CardHeader>
                            <CardBody>
                                {lodar && <Loading />}
                                <div className="">
                                    <div className="row">
                                        <div className="col-lg-3"></div>
                                        <div className="col-lg-3"></div>
                                        <div className="col-lg-3"></div>
                                        <div className="col-lg-3 d-flex justify-content-end mt-2">
                                            {
                                                rowData?.length > 0 ? (
                                                    <button className="btn btn-primary" onClick={()=>{familyInfoReportExcel(rowData)}}>Export Excel</button>
                                                ) : null
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className='row mt-3 mb-3'>
                                    <div className="col-md-3 input-group">
                                        <input
                                            type="text" className="form-control"
                                            placeholder="Search here..."
                                            name="searchValue"
                                            value={values?.searchValue}
                                            onChange={(e) => {
                                                setFieldValue("searchValue", e.target.value);
                                                if (e.target.value === "") {
                                                    getRowData(
                                                        `/hcm/FamilyInfo/GetFamilyInfo?strPartName=ManagementAndNonManagementEmployeeSpouseAndChild`
                                                    );
                                                } else {
                                                    setFieldValue(e.target.value);
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 13) {
                                                    if (values?.searchValue === "") {
                                                        getRowData(
                                                            `/hcm/FamilyInfo/GetFamilyInfo?strPartName=ManagementAndNonManagementEmployeeSpouseAndChild`
                                                        );
                                                    } else {
                                                        getRowData(
                                                            `/hcm/FamilyInfo/GetFamilyInfo?strPartName=ManagementAndNonManagementEmployeeSpouseAndChild&search=${values?.searchValue}`
                                                        );
                                                    }
                                                }
                                            }}
                                        />
                                        <div className="input-group-append">
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={() => {
                                                    getRowData(
                                                        `/hcm/FamilyInfo/GetFamilyInfo?strPartName=ManagementAndNonManagementEmployeeSpouseAndChild&search=${values?.searchValue}`
                                                    );
                                                }}
                                            >
                                                <i className="fas fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="loan-scrollable-table">
                                            <div style={{ maxHeight: "400px" }} className='scroll-table _table'>
                                                <table  className="table table-striped table-bordered bj-table bj-table-landing">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ minWidth: "40px" }} >SL</th>
                                                            <th style={{ minWidth: "100px" }}>Enroll</th>
                                                            <th style={{ minWidth: "120px" }}>Name</th>
                                                            <th style={{ minWidth: "100px" }}>Designation</th>
                                                            <th style={{ minWidth: "100px" }}>Management Status</th>
                                                            <th style={{ minWidth: "100px" }}>Department</th>
                                                            <th style={{ minWidth: "90px" }}>Date Of Joining</th>
                                                            {/* here */}
                                                            <th style={{ minWidth: "100px" }}>Date Of Confirmation</th>
                                                            <th style={{ minWidth: "100px" }}>Employement Type</th>
                                                            <th style={{ minWidth: "90px" }}>Basic salary</th>
                                                            <th style={{ minWidth: "100px" }}>Work Group</th>
                                                            <th style={{ minWidth: "100px" }}>work Place</th>
                                                            <th style={{ minWidth: "90px" }}>Email</th>
                                                            <th style={{ minWidth: "90px" }}>Cell No</th>
                                                            <th style={{ minWidth: "90px" }}>SBU</th>
                                                            <th style={{ minWidth: "90px" }}>Marital Status</th>
                                                            <th style={{ minWidth: "90px" }}>Date Of Birth</th>
                                                            <th style={{ minWidth: "90px" }}>Relation With Employee</th>
                                                            <th style={{ minWidth: "120px" }}>Family Person Name</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            rowData?.length > 0 && rowData?.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td className="text-center">{item?.employeeId}</td>
                                                                    <td>{item.employeeName}</td>
                                                                    <td>{item?.designation}</td>
                                                                    <td>{item?.managementStatus}</td>
                                                                    <td>{item?.department}</td>
                                                                    <td className='text-center'>{_dateFormatter(item?.dateOfJoining)}</td>
                                                                    <td className='text-center'>{_dateFormatter(item?.confirmationDate)}</td>
                                                                    <td>{item?.employmentType}</td>
                                                                    <td className='text-center' >{item?.basicSalary}</td>
                                                                    <td>{item?.workplaceGroup}</td>
                                                                    <td>{item?.workplace}</td>
                                                                    <td>{item?.strEmail}</td>
                                                                    <td>{item?.personalContactNo}</td>
                                                                    <td>{item?.strSBUName}</td>
                                                                    <td>{item?.maritalStatus}</td>

                                                                    <td className='text-center'>{_dateFormatter(item?.dateOfBirth)}</td>
                                                                    <td>{item?.relation}</td>
                                                                    <td>{item?.familyPersonName}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </>
                )}
            </Formik>
        </>
    )
}

export default FamilyInfoReport