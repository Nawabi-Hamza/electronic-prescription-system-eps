import React, { useState } from "react";
import { dropdownStyle, tableStyles } from "../styles/componentsStyle";

// Helper to generate stable unique keys
const getKey = (record, index) => {
  try {
    return "row-" + btoa(JSON.stringify(record)).substring(0, 12);
  } catch {
    return "row-" + index;
  }
};

function Table({
  columns,
  records,
  actions = [],
  recordsPerPage = 10,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [RPP, setRPP] = useState(recordsPerPage);

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
                <th key={col.key || i} className={tableStyles.th}>
                  {col.label}
                </th>
              ))}
              {actions.length > 0 && <th className={tableStyles.th}>Actions</th>}
            </tr>
          </thead>

          <tbody className={tableStyles.tbody}>
            {currentRecords.map((record, rowIndex) => {
              const rowKey = getKey(record, rowIndex);

              return (
                <tr key={rowKey} className={tableStyles.bodyRow}>
                  {columns.map((col, i) => {
                    const cellKey = `${rowKey}-col-${col.key || i}`;

                    return col.render ? (
                      React.isValidElement(col.render(record[col.key], record)) &&
                      col.render(record[col.key], record).type === "td" ? (
                        React.cloneElement(
                          col.render(record[col.key], record),
                          { key: cellKey }
                        )
                      ) : (
                        <td key={cellKey} className={tableStyles.td}>
                          {col.render(record[col.key], record)}
                        </td>
                      )
                    ) : (
                      <td key={cellKey} className={tableStyles.td}>
                        {record[col.key]}
                      </td>
                    );
                  })}

                  {actions?.length > 0 && (
                    <td className="px-4 py-2 space-x-2 text-center">
                      {(typeof actions === "function" ? actions(record) : actions).map((action, ai) => {
                        const actionKey = `${rowKey}-action-${ai}`;

                        if (action?.renderText && action?.renderText(record)) {
                          return (
                            <span
                              key={actionKey}
                              className="text-gray-500 font-medium italic"
                            >
                              {action?.renderText(record)}
                            </span>
                          );
                        }

                        return (
                          <button
                            key={actionKey}
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
              );
            })}

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
            <select
              onChange={(e) => setRPP(Number(e.target.value))}
              className={dropdownStyle.base + " max-w-[60px]"}
              style={{ padding: 5 }}
            >
              {[10, 20, 30, 40, 60, 80, 100].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
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
