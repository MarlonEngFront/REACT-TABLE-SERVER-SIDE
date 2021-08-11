import React from 'react';
import classes from './BookingTable.module.css';
import {useTable, usePagination, useFilters, useGlobalFilter} from 'react-table';

function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter
  }) {
    const count = preGlobalFilteredRows.length;
    console.log("GLOBAL FILTER");
    return (
      <span>
        Search:{" "}
        <input
            value={globalFilter || ""}
            onChange={e => {
            setGlobalFilter(e.target.value || undefined); }}
            placeholder={`${count} records...`}
        />
      </span>
    );
  }

const DefaultColumnFilter=({column: { filterValue, preFilteredRows, setFilter }})=>{
    const count = preFilteredRows.length;
    console.log("DEFAULT COLUMN FILTER");

    return (
        <input
            value={filterValue || ""}
            className="form-control"
            onChange={e => {
                setFilter(e.target.value || undefined);
             }}
            placeholder={`Search ${count} records...`}
        />
    );
}

const BookingTable = ({tableData, fetchData, openEventInfo, pageCount: controlledPageCount, 
    showSpinner, loginUser})=>{
        console.log("inside boking table")
        const filterTypes=React.useMemo(
            ()=>({
                text: (rows, id, filterValue)=>{
                    return rows.filter(row=>{
                        const rowValue = row.values[id]
                        return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                    })
                },
            }),
            []
        )

        const defaultColumn=React.useMemo(
            ()=>({
                Filter: DefaultColumnFilter
            }),
            []
        )

        const columns=React.useMemo(
            ()=>[
                {
                    Header: 'CaseNo',
                    accessor: 'ev_subject',
                },                   {
                    Header: 'Start Time',
                    accessor: 'start_date_time',
                },
                {
                    Header: 'End Time',
                    accessor: 'end_date_time',
                },
            ],
            []
        )

        const data=tableData.resources.map(datum=>{
            return {
                ev_subject: datum.dbRequest_Case_NO,
                start_date_time: datum.dbRequest_starttime,
                end_date_time: datum.dbRequest_endtime,
            }
        })

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            prepareRow,
            page,
            rows,
            canPreviousPage,
            canNextPage,
            pageOptions,
            pageCount,
            gotoPage,
            nextPage,
            previousPage,
            setPageSize,
            state: { pageIndex, pageSize, globalFilter },
            preGlobalFilteredRows,
            setGlobalFilter,    
        } = useTable(
                {
                    columns,
                    data,
                    initialState: { pageIndex: 0 },
                    manualPagination: true,
                    pageCount: controlledPageCount,
                    defaultColumn,
                    filterTypes,
                },
                useFilters, 
                useGlobalFilter,
                usePagination,
            )

        React.useEffect(() => {
            fetchData( pageIndex, pageSize )
          }, [pageIndex, pageSize ])

        return (
            <>
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
                <table {...getTableProps()} className={classes['data-table']}>
                    <thead>
                        {headerGroups.map(headerGroup=>{
                            return (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column=>{
                                        return (
                                            <th {...column.getHeaderProps()}>
                                                {column.render('Header')}
                                            </th>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </thead>

                    <tbody {...getTableBodyProps()} >
                        {page.map((row, i)=>{
                            prepareRow(row)
                            return (
                                <tr
                                    {...row.getRowProps()}
                                    onClick={()=>openEventInfo(row)}
                                >
                                    {row.cells.map(cell=>{
                                        return (
                                            <td {...cell.getCellProps()}>
                                                {cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <div>
                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {'<<'}
                    </button>{' '}
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {'<'}
                    </button>{' '}
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        {'>'}
                    </button>{' '}
                    <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {'>>'}
                    </button>{' '}

                    <span>
                        Page{' '}
                        <strong>{pageIndex+1} of {pageCount}</strong>{' '}
                    </span>

                    <select
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}
                    >
                        {[5, 10, 20, 30].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </>
        )
    }

    export default BookingTable;