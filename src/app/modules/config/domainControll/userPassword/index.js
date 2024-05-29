import { Formik } from 'formik';
import React from 'react'
import { CardHeader, ModalProgressBar, Card, CardHeaderToolbar, CardBody } from '../../../../../_metronic/_partials/controls';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';

const initData = {
    userPassword: '',
    search: ''
}

const UserPassword = () => {
    const [rowData, getRowData, lodar] = useAxiosGet();

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={initData}
                onSubmit={() => { }}
            >
                {({ handleSubmit,
                    resetForm,
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    isValid, }) => (
                    <>
                        <Card>
                            {true && <ModalProgressBar />}
                            <CardHeader title={"User Password"}>
                                <CardHeaderToolbar>
                                </CardHeaderToolbar>
                            </CardHeader>
                            <CardBody>

                                <div className='form-group row mb-4 global-form'>
                                    <div className='col-lg-3'>
                                        <InputField
                                            value={values?.userPassword}
                                            label="Security code"
                                            placeholder="Security code"
                                            type="string"
                                            name="userPassword"
                                            onChange={e => {
                                                setFieldValue("userPassword", e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className='col-lg-3'>
                                        <InputField
                                            value={values?.search}
                                            label="Search"
                                            placeholder="Search (min 3 letter)"
                                            type="string"
                                            name="search"
                                            onChange={e => {
                                                setFieldValue("search", e.target.value)
                                            }}
                                            required
                                            
                                        />
                                    </div>
                                    <div className='col-lg-3'>
                                        <button
                                            type="button"
                                            className="btn btn-primary mt-5"
                                            onClick={() => {
                                                getRowData(`/domain/Information/GetUserPassword?search=${values.search}&securityCode=${values?.userPassword}`)
                                            }}
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                                {lodar && <Loading />}
                                <div className="row">
                                    <div className="col-lg-12">
                                        {rowData?.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "30px" }}>SL</th>
                                                    <th>User Id</th>
                                                    <th>User Name</th>
                                                    <th>BU Name</th>
                                                    <th>User Reference Id</th>
                                                    <th>Email</th>
                                                    <th>Login Id</th>
                                                    <th>Password</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    rowData?.map((user, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{user?.intUserId}</td>
                                                            <td>{user?.strUserName}</td>
                                                            <td>{user?.intDefaultBusinessUnit}</td>
                                                            <td>{user?.intUserReferenceId}</td>
                                                            <td>{user?.strEmailAddress}</td>
                                                            <td>{user?.strLoginId}</td>
                                                            <td>{user?.strPassword}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                        </div>) : null}
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

export default UserPassword