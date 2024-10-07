import React from "react";

const CreateSalaryJournalTable = ({ jvSalaryJournal }) => {
  console.log(jvSalaryJournal);

  return (
    <>
      <h4 className="mb-0 mt-2">JV Report of Salary Journal</h4>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-5">
          <thead className="bg-secondary">
            <tr>
              <th>SL</th>
              <th>Employee Id</th>
              <th>Employee Name</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            <>
              {jvSalaryJournal?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.intId}</td>
                  <td>{item?.strName}</td>
                  <td>{item?.strMessage}</td>
                </tr>
              ))}
            </>
          </tbody>
          <tfoot></tfoot>
        </table>
      </div>
    </>
  );
};
export default CreateSalaryJournalTable;
