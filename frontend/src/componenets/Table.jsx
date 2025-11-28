import React, { useState } from "react";
import { dropdownStyle, tableStyles } from "../styles/componentsStyle";
// import { school } from "../utils/school";
  
function  Table({
  columns,          // array of column definitions { key, label, render? }
  records,          // array of row objects
  actions = [],     // optional array of actions [{ label, onClick?, className?, renderText?(record) }]
  recordsPerPage = 10,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [RPP, setRPP] = useState(recordsPerPage)
  // Pagination
  // const totalPages = Math.ceil(records.length / recordsPerPage);
  // const startIndex = (currentPage - 1) * recordsPerPage;
  // const currentRecords = records.slice(startIndex, startIndex + recordsPerPage);

  const totalPages = Math.ceil(records.length / RPP);
  const startIndex = (currentPage - 1) * RPP;
  const currentRecords = records.slice(startIndex, startIndex + RPP);

  return (
    <>
      <div className={tableStyles.wrapper}>
        <table className={tableStyles.table}>
          <thead className={tableStyles.thead}>
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={tableStyles.th}>
                  {col.label}
                </th>
              ))}
              {actions.length > 0 && <th className={tableStyles.th}>Actions</th>}
            </tr>
          </thead>
          <tbody className={tableStyles.tbody}>
            {currentRecords.map((record, rowIndex) => (
              <tr key={rowIndex} className={tableStyles.bodyRow}>
                {columns.map((col, i) => (
                  // <td key={i} className={tableStyles.td}>
                    col.render ? (
                        // Check if col.render returned a <td> with colSpan
                        React.isValidElement(col.render(record[col.key], record)) &&
                        col.render(record[col.key], record).type === "td" ? (
                          col.render(record[col.key], record)
                        ) : (
                          <td key={i} className={tableStyles.td}>
                            {col.render(record[col.key], record)}
                          </td>
                        )
                      ) : (
                        <td key={i} className={tableStyles.td}>
                          {record[col.key]}
                        </td>
                      )
                  // </td>
                ))}

                {actions?.length > 0 && (
                  <td className="px-4 py-2 space-x-2 text-center">
                    {(typeof actions === "function" ? actions(record) : actions).map((action, ai) => {
                      if (action?.renderText && action?.renderText(record)) {
                        return (
                          <span
                            key={ai}
                            className="text-gray-500 font-medium italic"
                          >
                            {action?.renderText(record)}
                          </span>
                        );
                      }

                      return (
                        <button
                          key={ai}
                          className={action?.className}
                          onClick={() => action.onClick(record)}
                        >
                          {action?.label}
                        </button>
                      );
                    })}
                  </td>
                )}
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (actions.length ? 1 : 0)}
                  className="px-4 py-4 text-center text-gray-500"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {records.length > recordsPerPage && (
        <div className="grid grid-cols-2 items-center justify-between mt-4 text-sm">
          <div className="flex flex-nowrap gap-2 items-center">
            <span className="text-nowrap">
              Page {currentPage} of {totalPages}
            </span>
            <select name="" id="" onChange={(e) => setRPP(e.target.value)} className={dropdownStyle.base+" max-w-[60px]"} style={{ padding: 5}}>
              {[10,20,30,40,60,80,100].map( item => (
                <option value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="space-x-2 ms-auto">
            <button
              className={tableStyles.prevBtn}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              className={tableStyles.nextBtn}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Table;
