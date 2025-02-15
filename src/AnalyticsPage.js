import React, { useMemo, useState } from "react";
import { useTable, useSortBy } from "react-table";
import { testArr7pm, testArr5pm } from "./data/data"; // Import both datasets
import "./AnalyticsPage.css";

const AnalyticsPage = () => {
  const [selectedTime, setSelectedTime] = useState("7PM"); // Default selection
  const [inputValue, setInputValue] = useState("");

  // 7PM Data Processing
  const data7pm = useMemo(() => {
    return (
      testArr7pm &&
      testArr7pm.map((entry) => {
        const split = entry[0].split(";");
        const timestamps = split[0].split(",");
        const admissions = split[1].split(",");

        return {
          date: entry[1],
          S2_timestamp: timestamps[0],
          S3_timestamp: timestamps[1],
          S4_timestamp: timestamps[2],
          N1_timestamp: timestamps[3],
          S2_admissions: admissions[0],
          S3_admissions: admissions[1],
          S4_admissions: admissions[2],
          N1_admissions: admissions[3],
          orderOfAdmissions: split[2],
        };
      })
    );
  }, []);

  // 5PM Data Processing (Roles: S1, S2, S3, S4)
  const data5pm = useMemo(() => {
    return (
      testArr5pm &&
      testArr5pm.map((entry) => {
        const split = entry[0].split(";");
        const timestamps = split[0].split(",");
        const admissions = split[1].split(",");

        return {
          date: entry[1],
          S1_timestamp: timestamps[0],
          S2_timestamp: timestamps[1],
          S3_timestamp: timestamps[2],
          S4_timestamp: timestamps[3],
          S1_admissions: admissions[0],
          S2_admissions: admissions[1],
          S3_admissions: admissions[2],
          S4_admissions: admissions[3],
          orderOfAdmissions: split[2],
        };
      })
    );
  }, []);

  // Select the correct dataset based on dropdown selection
  const data = selectedTime === "7PM" ? data7pm : data5pm;

  // Columns for 7PM and 5PM
  const columns7pm = useMemo(
    () => [
      { Header: "Date", accessor: "date" },
      { Header: "S2 Timestamp", accessor: "S2_timestamp" },
      { Header: "S3 Timestamp", accessor: "S3_timestamp" },
      { Header: "S4 Timestamp", accessor: "S4_timestamp" },
      { Header: "N1 Timestamp", accessor: "N1_timestamp" },
      { Header: "S2 Admissions", accessor: "S2_admissions" },
      { Header: "S3 Admissions", accessor: "S3_admissions" },
      { Header: "S4 Admissions", accessor: "S4_admissions" },
      { Header: "N1 Admissions", accessor: "N1_admissions" },
      { Header: "Order of Admissions", accessor: "orderOfAdmissions" },
    ],
    []
  );

  const columns5pm = useMemo(
    () => [
      { Header: "Date", accessor: "date" },
      { Header: "S1 Timestamp", accessor: "S1_timestamp" },
      { Header: "S2 Timestamp", accessor: "S2_timestamp" },
      { Header: "S3 Timestamp", accessor: "S3_timestamp" },
      { Header: "S4 Timestamp", accessor: "S4_timestamp" },
      { Header: "S1 Admissions", accessor: "S1_admissions" },
      { Header: "S2 Admissions", accessor: "S2_admissions" },
      { Header: "S3 Admissions", accessor: "S3_admissions" },
      { Header: "S4 Admissions", accessor: "S4_admissions" },
      { Header: "Order of Admissions", accessor: "orderOfAdmissions" },
    ],
    []
  );

  // Select the correct columns based on dropdown selection
  const columns = selectedTime === "7PM" ? columns7pm : columns5pm;

  // React Table Hooks
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  return (
    <div>
      <div className="header">
        <h1 className="title">S.A.D.Q.</h1>
        <h2 className="subtitle">Standardized Admissions Distribution Queue</h2>
      </div>

      {/* Dropdown Selector for 5PM / 7PM */}
      <div className="flex-container-just1item">
        <select
          id="timesdropdownanalytics"
          className={"timesdropdownanalytics"}
          value={selectedTime}
          name="timesdropdown"
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <option value="7PM">7PM Data</option>
          <option value="5PM">5PM Data</option>
        </select>
      </div>

      {/* Table Display */}
      <div className="container">
        <h3>{selectedTime} Admissions Analytics</h3>

        <table {...getTableProps()} className="analyticstable">
          <thead className="analyticsthead">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="analyticstr">
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className="analyticsth">
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
                <tr {...row.getRowProps()} className="analyticstr">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="analyticstd">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Manny Easter Egg */}
        <div className="flex flex-col items-center p-4">
          <input
            type="text"
            placeholder="Type here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border p-2 rounded-lg text-lg"
          />
          {inputValue.toLowerCase() === "manny" && (
            <div className="mt-4 text-2xl">
              ❤️🥰 I love you, Manny! Thanks for always being there for me. You are my forever and ever Valentines! Love love love you so much! 🥰❤️
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
