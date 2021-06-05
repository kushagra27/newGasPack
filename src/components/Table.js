import React from "react";
import { useTable, useSortBy } from 'react-table'

const defaultPropGetter = () => ({})

const Table = ({ 
    columns, 
    data,
    getCellProps = defaultPropGetter, 
    getRowProps = defaultPropGetter,
    getColumnProps = defaultPropGetter
  }) => {
    // console.log(columns)
    // console.log(data)
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      footerGroups,
      rows,
      prepareRow,
    } = useTable(
      {
        columns,
        data,
      },
      useSortBy
    )
  
    // We don't want to render all 2000 rows for this example, so cap
    // it at 20 for this use case
    // const firstPageRows = rows.slice(0, 20)
  
    return (
      <>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
            prepareRow(row)
            return (
                // Merge user row props in
                <tr {...row.getRowProps(getRowProps(row))}>
                {row.cells.map(cell => {
                    return (
                    <td
                        // Return an array of prop objects and react-table will merge them appropriately
                        {
                          ...cell.getCellProps([
                            getCellProps(cell),
                            getColumnProps(cell.column)
                          ])
                        }
                        
                    >
                        {cell.render('Cell')}
                    </td>
                    )
                })}
                </tr>
            )
            })}
            {/* { footer } */}
          </tbody>
          <tfoot>
            {footerGroups.map(group => (
            <tr {...group.getFooterGroupProps()}>
                {group.headers.map(column => (
                <td {...column.getFooterProps()}>{column.render('Footer')}</td>
                ))}
            </tr>
            ))}
        </tfoot>
        </table>
        <br />
        <div>Showing the first 20 results of {rows.length} rows</div>
      </>
    )
  }

  export default Table