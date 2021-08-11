import React from "react";
import styled from "styled-components";
import Table from "./table";
import axios from "axios";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id"
      },
      {
        Header: "Email",
        accessor: "email"
      },
      {
        Header: "First Name",
        accessor: "first_name"
      },
      {
        Header: "Last Name",
        accessor: "last_name"
      }
    ],
    []
  );

  // We'll start our table without any data
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(0);

  // const fetchIdRef = React.useRef(0);

  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
    // This will get called when the table needs new data
    // You could fetch your data from literally anywhere,
    // even a server. But for this example, we'll just fake it.

    // Give this fetch an ID
    // const fetchId = ++fetchIdRef.current;

    // Set the loading state
    setLoading(true);

    axios
      .get(`https://reqres.in/api/users?page=${pageIndex + 1}`)
      .then((res) => {
        setTimeout(() => {
          setData(res.data.data);
          setPageCount(res.data.total_pages);
          setLoading(false);
          setPageSize(res.data.per_page);
          console.log(res.data.data);
        }, 1000);
      });
  }, []);

  return (
    <Styles>
      <Table
        columns={columns}
        data={data}
        fetchData={fetchData}
        loading={loading}
        pageCount={pageCount}
        pageSize={pageSize}
      />
    </Styles>
  );
}

export default App;
