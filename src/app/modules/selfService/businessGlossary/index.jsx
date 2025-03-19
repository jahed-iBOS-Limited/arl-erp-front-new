import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import AllReportSearchInput from "./allReportSearchInput";
// import { allSheetData } from "./data";
import ICustomCard from "../../_helper/_customCard";
import Loading from "../../_helper/_loading";
import "./style.scss";
import { fetchEmpBasicInfo } from "./utility";
import { _dateFormatter } from "../../_helper/_dateFormate";
function BusinessGlossaryReport() {
  const [renderList, setRenderList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    try {
      fetchEmpBasicInfo("", setRenderList, setLoading);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const searchHandler = (value) => {
    fetchEmpBasicInfo(value, setRenderList, setLoading);
  };

  return (
    <div className='AllReportWrapper'>
      {loading && <Loading />}
      <ICustomCard title='Business Glossary Report'>
        <Formik
          enableReinitialize={true}
          initialValues={{}}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
              <Form className='form form-label-left'>
                <div className='row'>
                  <div className='col-lg-9 mt-1'>
                    <AllReportSearchInput
                      placeholder='Report Search'
                      paginationSearchHandler={(value) => {
                        searchHandler(value);
                      }}
                      setSearchInput={setSearchInput}
                      searchInput={searchInput}
                      searchHandlerCB={(searchInput) => {
                        searchHandler(searchInput);
                      }}
                    />
                  </div>
                  {/* <div onClick={() => {
                    setListRender(!listRender)
                  }}>Click</div> */}
                </div>
                <div className='row mt-1'>
                  <div className='col-lg-12'>
                    <>
                      {" "}
                      <div className='table-responsive'>
                        <table className='table table-striped table-bordered global-table mt-0'>
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>SL</th>
                              <th>Date</th>
                              <th>Business Category</th>
                              <th>SBU</th>
                              <th>Section</th>
                              <th>Business Defination</th>
                              <th>Business Term</th>
                              <th>Data Domain</th>
                              <th>Glossary Sources</th>
                              <th>Linkage To Data</th>
                              <th>Related Terms</th>
                              <th>Source</th>
                              <th>Term Steward ship</th>
                            </tr>
                          </thead>
                          <tbody>
                            {renderList?.map((itm, idx) => {
                              
                              return (
                                <>
                                  <tr key={idx + 1}>
                                    <td>{idx + 1}</td>
                                    <td>{_dateFormatter(itm?.dteCreateDate)}</td>
                                    <td>{itm?.strBusinessCategory}</td>
                                    <td>{itm?.strSbu}</td>
                                    <td>{itm?.strSection}</td>
                                    <td>{itm?.strBusinessDefination}</td>
                                    <td>{itm?.strBusinessTerm}</td>
                                    <td>{itm?.strDataDomain}</td>
                                    <td>{itm?.strGlossarySources}</td>
                                    <td>{itm?.strLinkageToData}</td>
                                    <td>{itm?.strRelatedTerms}</td>
                                    <td>{itm?.strSource}</td>
                                    <td>{itm?.strTermStewardship}</td>
                                  </tr>
                                </>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </div>
  );
}

export default BusinessGlossaryReport;

// <>
//   <ul className='list-group'>
//     {(rowsPerPage > 0
//       ? renderList.slice(
//           page * rowsPerPage,
//           page * rowsPerPage + rowsPerPage
//         )
//       : renderList
//     ).map((itm, idx) => {
//       let url = `reportformatlink(url)`;
//       let sl = page * rowsPerPage + idx + 1;
//       return (
//         <>
//           <li>
//             <p>
//               {" "}
//               <span>{sl}) </span>
//               {itm?.standardreportname}
//             </p>
//             <div className='buttomBox'>
//               {itm?.[`${url}`] && (
//                 <div
//                   className='box link'
//                   onClick={() => {
//                     // new tab open
//                     window.open(
//                       itm?.[`${url}`],
//                       "_blank"
//                     );
//                   }}
//                 >
//                   {itm?.[`${url}`]}
//                 </div>
//               )}
//               {itm?.process && (
//                 <div className='box'>{itm?.process}</div>
//               )}
//               {itm?.datasource && (
//                 <div className='box'>
//                   {itm?.datasource}
//                 </div>
//               )}
//             </div>
//           </li>
//         </>
//       );
//     })}
//   </ul>
// </>
