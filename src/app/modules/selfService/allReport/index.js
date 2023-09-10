import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import AllReportSearchInput from "./allReportSearchInput";
import { allSheetData } from "./data";
import "./style.scss";
import { convertKeysSpace, searchMatch } from "./utility";
import ICustomCard from "./../../_helper/_customCard";
function AllReport() {


  const [allList, setAllList] = useState([]);
  const [renderList, setRenderList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    try {
      const _allSheetData = JSON.parse(JSON.stringify(allSheetData));
      const _list = [];
      // for in loop
      for (const key in _allSheetData) {
        const _data = _allSheetData?.[key];
        _data.forEach((item) => {
          const newObj = convertKeysSpace(item);
          if (newObj?.standardreportname) {
            _list.push(newObj);
          }
        });
      }
      const uniqueCombinations = [
        ...new Map(
          _list.map((item) => [
            `${item?.datasource}-${item?.standardreportname}-${item?.process}`,
            item,
          ])
        ).values(),
      ];
      setAllList(uniqueCombinations || []);
      setRenderList(uniqueCombinations || []);
    } catch (error) {}
  }, []);

  const searchHandler = (value) => {
    const result = searchMatch(allList, value);
    setRenderList(result);
  };
  return (
    <div className='AllReportWrapper'>
      <ICustomCard title='SSOT Report'>
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
                                <th>Standard Report Name</th>
                                <th>Report Format Link (URL)</th>
                                <th>Process</th>
                                <th>Data Source</th>
                              </tr>
                            </thead>
                            <tbody>
                              {renderList?.map((itm, idx) => {
                                let url = `reportformatlink(url)`;
                                return (
                                  <>
                                    <tr key={idx + 1}>
                                      <td>{idx + 1}</td>
                                      <td>{itm?.standardreportname}</td>
                                      <td
                                        onClick={() => {
                                          // new tab open
                                          window.open(
                                            itm?.[`${url}`],
                                            "_blank"
                                          );
                                        }}
                                      >
                                        <sapn className='link'>
                                          {itm?.[`${url}`]}
                                        </sapn>
                                      </td>
                                      <td>{itm?.process}</td>
                                      <td>{itm?.datasource}</td>
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

export default AllReport;

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
