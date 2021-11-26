import { UserIcon } from '@heroicons/react/solid';
import React from 'react';
import { useTable } from 'react-table';

export default function Table({ columns, data }) {
  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  // Render the UI for your table
  // return (
  // <table {...getTableProps()}>
  //   <thead>
  //     {headerGroups.map((headerGroup) => (
  //       <tr {...headerGroup.getHeaderGroupProps()}>
  //         {headerGroup.headers.map((column) => (
  //           <th {...column.getHeaderProps()}>{column.render('Header')}</th>
  //         ))}
  //       </tr>
  //     ))}
  //   </thead>
  //   <tbody {...getTableBodyProps()}>
  //     {rows.map((row, i) => {
  //       prepareRow(row);
  //       return (
  //         <tr {...row.getRowProps()}>
  //           {row.cells.map((cell) => {
  //             return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
  //           })}
  //         </tr>
  //       );
  //     })}
  //   </tbody>
  // </table>
  /* This example requires Tailwind CSS v2.0+ */

  return (
    <div className='flex flex-col'>
      <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
          <div className='overflow-hidden border-b border-gray-200 shadow sm:rounded-lg'>
            <table
              className='min-w-full divide-y divide-gray-200'
              {...getTableProps()}
            >
              <thead className='bg-gray-50'>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        scope='col'
                        className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'
                        {...column.getHeaderProps()}
                      >
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr key={row + i} {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td
                            className='px-6 py-4 whitespace-nowrap'
                            {...cell.getCellProps()}
                          >
                            <div className='flex items-center'>
                              <div className='flex-shrink-0 w-10 h-10'>
                                {cell.render('Cell')}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>

              {/* <tbody className="bg-white divide-y divide-gray-200" {...getTableBodyProps()}>
                {columns.map((person) => (
                  <tr key={person.email}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <UserIcon className="text-gray-500 bg-gray-300 rounded-full"/>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{person.name}</div>
                          <div className="text-sm text-gray-500">{person.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.title}</div>
                      <div className="text-sm text-gray-500">{person.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{person.role}</td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody> */}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
