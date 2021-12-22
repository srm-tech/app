import React from 'react';
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';

import {
  DefaultColumnFilter,
  fuzzyTextFilterFn,
} from '@/components/table/filters';
// import { ListCollectionsCursor } from 'mongoose/node_modules/mongodb';

type TableProps = {
  columns: any;
  data: any;
  loading?: boolean;
};

// ------------main table component----------------------------------------------------
export default function Table({ columns, data, loading }: TableProps) {
  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: 30,
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <>
      <div>
        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column) => (
            <div key={`filter-${column.id}`}>
              {column.render('Header')}
              {column.canFilter ? column.render('Filter') : null}
            </div>
          ))
        )}
      </div>

      <table
        className='min-w-full divide-y divide-gray-200'
        {...getTableProps()}
      >
        <thead className='bg-gray-50'>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => (
              // Apply the header row props
              <tr
                key={`row-${headerGroup.toString()}`}
                {...headerGroup.getHeaderGroupProps()}
              >
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column) => (
                    // Apply the header cell props
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      key={`col-${column.toString()}`}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {
                        // Render the header
                        column.render('Header')
                      }
                      {/* Add a sort direction indicator */}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <>
                              {' '}
                              <small>&#x25B2;</small>
                            </>
                          ) : (
                            <>
                              {' '}
                              <small>&#x25BC;</small>
                            </>
                          )
                        ) : (
                          ''
                        )}
                      </span>
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        {/* Apply the table body props */}

        <tbody {...getTableBodyProps()}>
          {
            // Loop over the table rows
            page.map((row, index) => {
              // Prepare the row for display
              prepareRow(row);
              return (
                // Apply the row props
                <tr
                  key={`row-${row.toString()}`}
                  {...row.getRowProps()}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  {
                    // Loop over the rows cells
                    row.cells.map((cell) => {
                      // Apply the cell props
                      return (
                        <td
                          className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'
                          key='cell-{cell.toString()}'
                          {...cell.getCellProps()}
                        >
                          {
                            // Render the cell contents
                            cell.render('Cell')
                          }
                        </td>
                      );
                    })
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>

      <div className='pagination flex justify-between items-center mt-2'>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <nav
          className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
          aria-label='Pagination'
        >
          <span>
            Page:{' '}
            <input
              className='bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium'
              type='number'
              defaultValue={pageIndex + 1}
              min={1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: '100px' }}
            />
          </span>
          <select
            className='bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium'
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 30, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </nav>
        <nav
          className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
          aria-label='Pagination'
        >
          {/* <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '} */}
          <button
            className='bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium'
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {'Back'}
          </button>{' '}
          <button
            className='bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium'
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {'Next'}
          </button>{' '}
          {/* <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '} */}
        </nav>
      </div>
    </>
  );
}
