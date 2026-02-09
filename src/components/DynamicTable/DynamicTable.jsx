import styles from "./DynamicTable.module.css";

function DynamicTable({
  data = [],
  columns = [],
  headings = [], // Alternative prop for table headers
  columnData = [], // Alternative prop for table data
  noDataMessage,
  loading = false,
  error = '',
  onRefresh,
  showActions = false
}) {
  // Use either data/columns or columnData/headings
  const tableData = columnData.length > 0 ? columnData : data;
  const tableHeadings = headings.length > 0 ? headings : columns.map(col => ({
    title: col.label,
    accessor: col.key
  }));

  const noData = !tableData || tableData.length === 0;

  // Handle custom rendering for both column formats
  const renderCell = (row, column, accessor) => {
    // If using columnData/headings format (objects with direct values)
    if (columnData.length > 0 && row[accessor] !== undefined) {
      return row[accessor];
    }
    // If using data/columns format
    if (column.render) {
      return column.render(row[column.key], row);
    }
    return row[column.key];
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
        {onRefresh && (
          <button onClick={onRefresh} className={styles.refreshButton}>
            Refresh
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.Dynamic}>
        <thead>
          <tr>
            {tableHeadings.map((heading, index) => (
              <th key={index}>{heading.title}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {noData ? (
            <tr>
              <td colSpan={tableHeadings.length} className={styles.noDataBox}>
                {noDataMessage ? noDataMessage : "No Data Found"}
              </td>
            </tr>
          ) : (
            tableData.map((row, rowIndex) => (
              <tr key={row._id || row.sr || rowIndex}>
                {tableHeadings.map((heading, colIndex) => (
                  <td key={colIndex}>
                    {renderCell(row, columns[colIndex], heading.accessor)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DynamicTable;
