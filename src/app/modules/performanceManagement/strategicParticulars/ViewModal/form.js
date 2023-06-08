/* eslint-disable no-unused-vars */
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useHistory, useLocation } from "react-router-dom";
import "antd/dist/antd.css";
import { IInput } from "../../../_helper/_input";

const reports = [
  {
    bscperspectiveId: 2,

    heading: "Process",

    strategicParticularid: 27,

    strategicParticularName: "Accomplish any project assigned by supervisor",

    strategicParticularsTypeId: 1,

    strategicParticularsTypeName: "Objective",

    freqId: 3,

    freqName: "Quarterly",
  },
  {
    bscperspectiveId: 1,

    heading: "Finance",

    strategicParticularid: 71,

    strategicParticularName: "demo strategic particulars",

    strategicParticularsTypeId: 2,

    strategicParticularsTypeName: "Action Plan",

    freqId: 4,

    freqName: null,
  },

  {
    bscperspectiveId: 1,

    heading: "Finance",

    strategicParticularid: 72,

    strategicParticularName: "Particulars Name",

    strategicParticularsTypeId: 2,

    strategicParticularsTypeName: "Action Plan",

    freqId: 4,

    freqName: null,
  },

  {
    bscperspectiveId: 1,

    heading: "Finance",

    strategicParticularid: 74,

    strategicParticularName: "42",

    strategicParticularsTypeId: 2,

    strategicParticularsTypeName: "Action Plan",

    freqId: 4,

    freqName: null,
  },

  {
    bscperspectiveId: 1,

    heading: "Finance",

    strategicParticularid: 85,

    strategicParticularName: "fgbfgbd",

    strategicParticularsTypeId: 2,

    strategicParticularsTypeName: "Action Plan",

    freqId: 4,

    freqName: null,
  },

  {
    bscperspectiveId: 1,

    heading: "Finance",

    strategicParticularid: 86,

    strategicParticularName: "jhhbmjhcmjhm",

    strategicParticularsTypeId: 5,

    strategicParticularsTypeName: "Milestone",

    freqId: 3,

    freqName: null,
  },

  {
    bscperspectiveId: 1,

    heading: "Finance",

    strategicParticularid: 88,

    strategicParticularName: "demo strategic particulars",

    strategicParticularsTypeId: 2,

    strategicParticularsTypeName: "Action Plan",

    freqId: 3,

    freqName: null,
  },

  {
    bscperspectiveId: 1,

    heading: "Finance",

    strategicParticularid: 118,

    strategicParticularName: "demo strategic particulars",

    strategicParticularsTypeId: 2,

    strategicParticularsTypeName: "Action Plan",

    freqId: 2,

    freqName: null,
  },

  {
    bscperspectiveId: 1,

    heading: "Finance",

    strategicParticularid: 119,

    strategicParticularName: "demo strategic particulars",

    strategicParticularsTypeId: 2,

    strategicParticularsTypeName: "Action Plan",

    freqId: 2,

    freqName: null,
  },

  {
    bscperspectiveId: 1,

    heading: "Finance",

    strategicParticularid: 120,

    strategicParticularName: "demo strategic particulars",

    strategicParticularsTypeId: 2,

    strategicParticularsTypeName: "Action Plan",

    freqId: 2,

    freqName: null,
  },

  {
    bscperspectiveId: 1,

    heading: "Finance",

    strategicParticularid: 124,

    strategicParticularName: "demo strategic particulars",

    strategicParticularsTypeId: 2,

    strategicParticularsTypeName: "Action Plan",

    freqId: 2,

    freqName: null,
  },
];

// Validation schema
const validationSchema = Yup.object().shape({});

export default function _Form({
  btnRef,
  resetBtnRef,
  initData,
  saveHandler,
  target,
  rowDto,
  rowDtoHandler,
  strObjList,
  strTarget,
}) {
  const history = useHistory();

  const location = useLocation();
  const { state } = location;

  // Table
  let sameKey;
  let _sameKey;
  const columns = [
    {
      title: "BSC",
      dataIndex: "heading",
      key: "heading",
      render: (value, row, index) => {
        const obj = {
          children: <div className="test-rotate font-weight-bold"> {value} </div>,
          props: {
            className: `bg-${row.bscperspectiveId}`,
          },
        };
        if (!(_sameKey !== value)) {
          obj.props.rowSpan = 0;
          return obj;
        }
        const count = reports.filter(
          (item) => item.bscperspectiveId === row.bscperspectiveId
        ).length;
        _sameKey = value;

        obj.props.rowSpan = count;
        return obj;
      },
    },

    {
      title: "Strategic Particulars Name",
      dataIndex: "strategicParticularName",
      key: "strategicParticularName",
      render: (v, r, index) => {
        return <div className="text-left font-weight-bold">{v}</div>;
      },
    },
    {
      title: "Perspective",
      dataIndex: "strategicParticularsTypeName",
      key: "strategicParticularsTypeName",
      render: (v, r, index) => {
        return <div className="text-left">{v}</div>;
      },
    },
  ];

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            history.push("");
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              {/* <div className="individual-kpi-table str-view-table mt-3">
                <Table
                  columns={columns}
                  dataSource={reports?.map((d, i) => ({ key: i, ...d }))}
                  pagination={false}
                  bordered={true}
                />
              </div> */}
              {/* Target and Achievement Form */}
              <div className="mt-2">
                <p style={{ marginBottom: ".05em" }}>
                  <b>Particulars Name : </b> {state?.objective}
                </p>
                <p style={{ marginBottom: ".05em" }}>
                  <b>Type : </b> {state?.strategicParticularsTypeName}
                </p>
                <p style={{ marginBottom: ".05em" }}>
                  <b>BSC Perspective : </b> {state?.heading}
                </p>
              </div>
              <div className="mt-5">
                {strTarget.length > 0 && (
                  <div className="row">
                    <table className="table table-striped table-bordered">
                      <thead className="str-view-table-head">
                        <tr>
                          <th>Year Name</th>
                          <th>Frequency</th>
                          <th>Target</th>
                          <th>Achievement</th>
                        </tr>
                      </thead>
                      <tbody className="str-view-table-body">
                        {strTarget?.map((itm, idx) => (
                          <tr key={idx}>
                            <td>{itm.strYearName}</td>
                            <td>
                              <div style={{ paddingLeft: "6px" }}>
                                {itm.strTargetFrequency}
                              </div>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {itm.numTarget}
                            </td>
                            <td
                              style={{ width: "50px" }}
                              className="text-center disable-border disabled-feedback str-achievement"
                            >
                              <IInput
                                key={itm.id}
                                type="number"
                                min="0"
                                step="any"
                                required
                                placeholder={itm.numAchivement}
                                name={itm.intRowId}
                                onChange={(e) =>
                                  rowDtoHandler(
                                    "achievement",
                                    e.target.value,
                                    idx,
                                    itm?.intRowId
                                  )
                                }
                                value={rowDto?.[idx]?.achievement}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}
