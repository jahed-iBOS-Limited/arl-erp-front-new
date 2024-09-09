import React from "react";

const CreateSalaryJournalTable = ({ jvSalaryJournal }) => {
  console.log(jvSalaryJournal);

  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-5">
          <thead className="bg-secondary">
            <tr>
              <th>SL</th>
              <th>Employee Name</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            <>
              {jvSalaryJournal?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
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
