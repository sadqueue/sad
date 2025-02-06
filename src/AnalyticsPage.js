import React, { useMemo } from "react";
import { useTable, useSortBy, useFilters } from "react-table";
import { testArr7pm } from "./data/data"; // Import your dataset

const AnalyticsPage = () => {
  const data = useMemo(() => {
    return testArr7pm.map((entry) => {
      const split = entry[0].split(";");
      const timestamps = split[0].split(",");
      const admissions = split[1].split(",");

      return {
        S2_timestamp: timestamps[0],
        S3_timestamp: timestamps[1],
        S4_timestamp: timestamps[2],
        N1_timestamp: timestamps[3],
        S2_admissions: admissions[0],
        S3_admissions: admissions[1],
        S4_admissions: admissions[2],
        N1_admissions: admissions[3],
        orderOfAdmissions: split[2],
        notes: entry[1],
      };
    });
  }, []);

  const columns = useMemo(
    () => [
      { Header: "S2 Timestamp", accessor: "S2_timestamp" },
      { Header: "S3 Timestamp", accessor: "S3_timestamp" },
      { Header: "S4 Timestamp", accessor: "S4_timestamp" },
      { Header: "N1 Timestamp", accessor: "N1_timestamp" },
      { Header: "S2 Admissions", accessor: "S2_admissions" },
      { Header: "S3 Admissions", accessor: "S3_admissions" },
      { Header: "S4 Admissions", accessor: "S4_admissions" },
      { Header: "N1 Admissions", accessor: "N1_admissions" },
      { Header: "Order of Admissions", accessor: "orderOfAdmissions" },
      { Header: "Notes", accessor: "notes" },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useFilters, useSortBy);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admissions Analytics</h1>
      <table {...getTableProps()} className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-100">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="border border-gray-300 px-4 py-2 cursor-pointer"
                >
                  {column.render("Header")}
                  <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="hover:bg-gray-50">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="border border-gray-300 px-4 py-2">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AnalyticsPage;
