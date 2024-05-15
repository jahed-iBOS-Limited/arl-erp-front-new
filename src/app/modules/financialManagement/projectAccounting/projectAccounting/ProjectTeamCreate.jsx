import * as yup from "yup";
import React, { useState } from "react";
import NewSelect from "../../../_helper/_select";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import axios from "axios";

import Loading from "../../../_helper/_loading";
import { CardHeader, Card } from "@material-ui/core";
import { Form, Formik } from "formik";
import {
  CardBody,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import ButtonStyleOne from "../../../_helper/button/ButtonStyleOne";
import { IInput } from "../../../_helper/_input";
import {
  PlusOutlined,
  DeleteOutlined,
  CloseOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { shallowEqual, useSelector } from "react-redux";
import { createRole, getRoleDDL, saveTeam } from "./projectApi";
import { useEffect } from "react";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import FormikError from "../../../_helper/_formikError";
import { toast } from "react-toastify";

// validation schema
const validationSchema = yup.object().shape({
  intTeamId: yup
    .string()
    .required("Team is required")
    .typeError("Team is required"),
  intRoleId: yup
    .string()
    .required("Role Name is required")
    .typeError("Role Name is required"),
});

const createRolePayload = {
  intRoleId: 0,
  intAccountId: 0,
  intBusinessUnitId: 0,
  strRoleName: "",
  isActive: true,
  intCreatedBy: 0,
};
const initData = {
  // intProjectDescriptionId: 0,
  intTeamId: "",
  intRoleId: "",
};

const Team = ({
  project,
  setProject,
  setResponsible,
  projectTeam,
  isEdit = false,
}) => {
  // const [loading, setLoading] = useState(false);
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state.authData,
    shallowEqual
  );
  const [addRole, setAddRole] = useState(false);
  const [allTeam, setAllTeam] = useState([]);
  const [newRole, setNewRole] = useState("");

  // console.log(projectTeam)
  const [, getData] = useAxiosGet();

  useEffect(() => {
    if (isEdit) {
      const modifiedData = projectTeam?.map((item) => ({
        isEdit: true,
        ...item,
      }));

      setAllTeam(modifiedData || []);
    }
    // eslint-disable-next-line
  }, [isEdit, projectTeam]);

  const [, postData, loading] = useAxiosPost();

  // eslint-disable-next-line
  const [roleDDL, setRoleDDL] = useState([]);

  // role DDL
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getData(
        `/fino/ProjectAccounting/RoleDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`,
        (response) => {
          // console.log("get", data);

          setRoleDDL(response);
        }
      );
    }
    // eslint-disable-next-line
  }, [selectedBusinessUnit?.value, profileData?.accountId]);

  // setting  DDL
  // useEffect(() => {
  //   if (selectedBusinessUnit?.value && profileData?.accountId) {
  //     getEmployeeDDL(
  //       profileData?.accountId,
  //       selectedBusinessUnit.value,
  //       setTeamDDL
  //     );
  //     getRoleDDL(
  //       profileData?.accountId,
  //       selectedBusinessUnit.value,
  //       setRoleDDL
  //     );
  //   }
  // }, [selectedBusinessUnit?.value, profileData?.accountId]);

  // remove team member method
  const removeTeam = (TeamIndex) => {
    const updateTeam = allTeam.filter((team, index) => index !== TeamIndex);
    setAllTeam(updateTeam);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        const isDuplicate = allTeam.some((item) =>
          item?.isEdit
            ? item?.intTeamMemberId === values.intTeamId?.value
            : item?.intTeamId?.value === values.intTeamId?.value
        );
        isDuplicate && toast.warning("Duplicate Detected");
        !isDuplicate && setAllTeam((prev) => [...prev, values]);
        resetForm();
      }}
    >
      {({
        errors,
        touched,
        handleChange,
        setFieldValue,
        resetForm,
        values,
        handleSubmit,
      }) => (
        <>
          <Form className="form form-label-right">
            <Card>
              {true && <ModalProgressBar />}
              <div className="d-flex justify-content-between align-items-center">
                <CardHeader title={"Create Team"}>
                  <CardHeaderToolbar></CardHeaderToolbar>
                </CardHeader>
                <ButtonStyleOne
                  type="button"
                  label={"Save"}
                  style={{ marginRight: "15px", padding: "5px 15px" }}
                  disabled={
                    (project?.intProjectId || project?.id) && !loading
                      ? false
                      : true
                  }
                  onClick={() =>
                    saveTeam(
                      profileData,
                      selectedBusinessUnit,
                      project,
                      allTeam,
                      postData,
                      isEdit,
                      setProject
                    )
                  }
                />
              </div>
              <CardBody className="pt-0 px-4">
                {loading && <Loading />}
                <div className="row global-form">
                  {/* team */}
                  <div
                    className="col-md-3 col-lg-3"
                    style={{ marginTop: "5px" }}
                  >
                    <span style={{ paddingRight: "10px" }}>Team Member</span>
                    <SearchAsyncSelect
                      menuPosition="fixed"
                      name="intTeamId"
                      selectedValue={values?.intTeamId}
                      handleChange={(valueOption) => {
                        setFieldValue("intTeamId", valueOption);
                      }}
                      loadOptions={(value) => {
                        if (value?.length < 2) return [];
                        return axios
                          .get(
                            `/fino/ProjectAccounting/EmployeeDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&search=${value}`
                          )
                          .then((response) => {
                            return response.data;
                          });
                      }}
                      placeholder="Search by Employee Name (min 3 letter)"
                    />
                    <FormikError
                      errors={errors}
                      touched={touched}
                      name="intTeamId"
                    />
                  </div>

                  <div
                    className="col-md-3 col-lg-3"
                    style={{ marginTop: "4px" }}
                  >
                    <div className="d-flex justify-content-between  ">
                      <div>Role</div>
                      {!addRole ? (
                        <div
                          onClick={() => setAddRole((prevState) => !prevState)}
                        >
                          <PlusOutlined
                            className="text-primary px-3"
                            style={{ fontSize: "12px", cursor: "pointer" }}
                          />
                          Add new
                        </div>
                      ) : (
                        <div className="d-flex justify-content-end  ">
                          <div>
                            <SaveOutlined
                              onClick={() => {
                                createRole(
                                  profileData,
                                  newRole,
                                  setNewRole,
                                  selectedBusinessUnit,
                                  getRoleDDL,
                                  setRoleDDL,
                                  setAddRole,
                                  createRolePayload
                                );
                              }}
                              className="text-primary px-3"
                              style={{ fontSize: "12px", cursor: "pointer" }}
                            />
                          </div>
                          <div>
                            <CloseOutlined
                              onClick={() => {
                                setAddRole(false);
                                setNewRole("");
                                values.intRoleId = "";
                              }}
                              className="text-primary px-3"
                              style={{ fontSize: "12px", cursor: "pointer" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    {!addRole ? (
                      <NewSelect
                        menuPosition="fixed"
                        name="intRoleId"
                        options={[...roleDDL]}
                        value={values?.intRoleId}
                        label="Role"
                        isHiddenLabel={true}
                        onChange={(valueOption) => {
                          setFieldValue("intRoleId", valueOption);
                        }}
                        placeholder="Role"
                        errors={errors}
                        touched={touched}
                      />
                    ) : (
                      <IInput
                        value={values?.intRoleId || ""}
                        name="intRoleId"
                        placeholder="Enter new role"
                        onChange={(e) => {
                          setNewRole(e.target.value);
                          handleChange(e);
                        }}
                      />
                    )}
                  </div>

                  <div className="col-md-3">
                    <div className="d-flex align-items-center flex align-items-end justify-content-start">
                      <ButtonStyleOne
                        type="button"
                        onClick={handleSubmit}
                        label="Add"
                        style={{ marginTop: "19px" }}
                        disabled={addRole}
                      />
                    </div>
                  </div>
                </div>

                <div className="row" id="pdf-section">
                  <div className="col-lg-12">
                    <div className="print_wrapper">
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered mt-3 global-table table-font-size-sm">
                          {allTeam?.length > 0 && (
                            <thead>
                              <tr>
                                <th style={{ width: "50px" }}>SL</th>

                                <th style={{ width: "100px" }}>
                                  <div className="text-left ml-1">
                                    Team Memeber
                                  </div>
                                </th>

                                <th
                                  className="text-left"
                                  style={{ width: "100px" }}
                                >
                                  <div className="text-left ml-1">Role</div>
                                </th>
                                <th style={{ width: "150px" }}>Action</th>
                              </tr>
                            </thead>
                          )}
                          <tbody>
                            {allTeam?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-left">
                                  {item?.isEdit
                                    ? item?.strTeamMember
                                    : item?.intTeamId?.label}
                                </td>
                                <td className="text-left">
                                  {item?.isEdit
                                    ? item?.strRole || "N/A"
                                    : item?.intRoleId?.label}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  <div className="text-center">
                                    <span onClick={() => {}}>
                                      <DeleteOutlined
                                        onClick={() => removeTeam(index)}
                                      />
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div></div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default Team;
