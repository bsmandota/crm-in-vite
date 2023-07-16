import {useState, useEffect } from 'react';
import { fetchTicket } from '../api/tickets';
import MaterialTable from "@material-table/core";
import Sidebar from "../components/Sidebar";
import Widget from "../components/widget";
import ticketStatusCount from "./Admin";
import ExportPdf from "@material-table/exporters/pdf";
import ExportCsv from "@material-table/exporters/csv";
import { Modal, ModalHeader, ModalTitle } from "react-bootstrap";
const columns = [
  { title: "ID", field: "id" },
  { title: "TITLE", field: "title" },
  { title: "DESCRIPTION", field: "description" },
  { title: "REPORTER", field: "reporter" },
  { title: "ASSIGNEE", field: "assignee" },
  { title: "PRIORITY", field: "ticketPriority" },
  {
    title: "STATUS",
    field: "status",
    lookup: {
      OPEN: "OPEN",
      IN_PROGRESS: "IN_PROGRESS",
      CLOSED: "CLOSED",
      BLOCKED: "BLOCKED",
    },
  },
];
function Engineer() {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [ticketStatusCount, setTicketStatusCount] = useState({});
  const [ticketUpdationModal, setTicketUpdationModal] = useState(false);
  const closeTicketUpdationModal = () => setTicketUpdationModal(false);
useEffect(() => {
  fetchTickets();
}, []);
const fetchTickets = () => {
  fetchTicket()
    .then((response) => {
      console.log(response);
      setTicketDetails(response.data);
      updateTicketCount(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};
const updateTicketCount = (tickets) => {
  //filling this empty object with the ticket counts
  //Segrating the tickets in 4 properties according to the status of the tickets
  const data = {
    total: 0,
    open: 0,
    closed: 0,
    progress: 0,
    blocked: 0,
  };
  tickets.forEach((x) => {
    data.total += 1;
    if (x.status === "OPEN") {
      data.open += 1;
    } else if (x.status === "CLOSED") {
      data.closed += 1;
    } else if (x.status === "IN_PROGRESS") {
      data.progress += 1;
    } else if (x.status === "BLOCKED") {
      data.blocked += 1;
    }
  });

  setTicketStatusCount(Object.assign({}, data));
  return data;
};
// 2. -> Storing the curr ticket details in a state
const editTicket = (ticketDetail) => {
  const ticket = {
    assignee: ticketDetail.assignee,
    description: ticketDetail.description,
    title: ticketDetail.title,
    id: ticketDetail.id,
    reporter: ticketDetail.reporter,
    status: ticketDetail.status,
    ticketPriority: ticketDetail.ticketPriority,
  };
  setTicketUpdationModal(true);
  // setSelectedCurrTicket(ticket);
};
  return (
    <div className="vh-100% admin-bg">
      <Sidebar />
      <div className="mx-4 p-5">
        <div className="container mx-2">
          <h2 className="text-center text-primary">Hello, {localStorage.getItem("userId")}</h2>
          <p className="text-center lead text-muted">
            Take a Quick review to your Engineer Stats
          </p>
        </div>
        {/* Widgets */}
        <div className="row pr-4">
          <Widget
            color="primary"
            title=" Open"
            icon="envelope-open"
            ticketCount={ticketStatusCount.open}
            totalCount={ticketStatusCount.total}
          />
          <Widget
            color="warning"
            title=" Progress"
            icon="hourglass-split"
            ticketCount={ticketStatusCount.progress}
            totalCount={ticketStatusCount.total}
          />
          <Widget
            color="success"
            title=" Closed"
            icon="check2-square"
            ticketCount={ticketStatusCount.closed}
            totalCount={ticketStatusCount.total}
          />
          <Widget
            color="dark"
            title=" Blocked"
            icon="slash-circle"
            ticketCount={ticketStatusCount.blocked}
            totalCount={ticketStatusCount.total}
          />
        </div>
        <hr />
        <div className="">
          <MaterialTable
            title="Tickets Assigned to You"
            // 1. -> Grabbing the specific ticket from the row
            onRowClick={(event, rowData) => editTicket(rowData)}
            columns={columns}
            data={ticketDetails}
            options={{
              filtering: true,
              headerStyle: {
                backgroundColor: "#01579B",
                color: "#fff",
              },
              rowStyle: (ticketDetails, index) => {
                if (index % 2 === 0) {
                  return { backgroundColor: "#ddd" };
                } else {
                  return { backgroundColor: "#fff" };
                }
              },
              exportMenu: [
                {
                  label: "Export Pdf",
                  exportFunc: (cols, data) =>
                    ExportPdf(cols, data, "ticketRecords"),
                },
                {
                  label: "Export Csv",
                  exportFunc: (cols, data) =>
                    ExportCsv(cols, data, "ticketRecords")
                      .then((response) => console.log(response))
                      .catch((error) => console.log(error)),
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}
export default Engineer;
