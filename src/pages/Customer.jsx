import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Widget from "../components/widget";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import MaterialTable from "@material-table/core";
import { Modal, Button } from "react-bootstrap";
import { ticketCreation } from "../api/tickets";
import { fetchTicket } from "../api/tickets";
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
function Customer() {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [ticketStatusCount, setTicketStatusCount] = useState({});
  const [ticketUpdationModal, setTicketUpdationModal] = useState(false);
  const closeTicketUpdationModal = () => setTicketUpdationModal(false);
  const [createTicketModal, setCreateTicketModal] = useState(false);
  const closeCreateTicketModal = () => setCreateTicketModal(false);

  const createTicket = (e) => {
    e.preventDefault();
    closeCreateTicketModal();
    const data = {
      title: e.target.title.value,
      description: e.target.description.value,
    };
    ticketCreation(data)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  };

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
    <div className="vh-100%">
      <Sidebar />
      <div className=" d-inline-block fw-bold px-3 py-1 mx-5 my-1 rounded bg-secondary h5">
        TETHER-X
      </div>
      {/* Welcome Text */}
      <div className="mx-4 p-5">
        <div className="container">
          <h3 className="text-center fw-bolder text-primary">
            Welcome, {localStorage.getItem("name")}!
          </h3>
          <p className=" lead text-center">
            Take a Quick Tour to your Raised Tickets below!
          </p>
        </div>

        {/* Widgets */}
        <div className="row m-2">
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
        <div className="container m-2">
          <MaterialTable
            title="TICKETS RAISED BY YOU"
            // 1. -> Grabbing the specific ticket from the row
            // onRowClick={(event, rowData) => editTicket(rowData)}
            columns={columns}
            data={ticketDetails}
            options={{
              filtering: true,
              headerStyle: {
                backgroundColor: "#198754",
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
                },
              ],
            }}
          />
          <div className="label text-center m-2">
            Facing any issue? raise a ticket!
          </div>
          <button
            onClick={() => setCreateTicketModal(true)}
            className="btn btn-lg btn-primary h5 w-100 text-center"
          >
            Raise a ticket
          </button>
        </div>
      </div>
      {/* Modal - Create Ticket */}
      {createTicketModal} &&(
      <Modal
        show={createTicketModal}
        onHide={closeCreateTicketModal}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={createTicket}>
            <div className="input-group mb-2">
              <label className="label input-group-text label-md">Title</label>
              <input
                type="text"
                name="title"
                // value={selectedCurrTicket.title}
                className="form-control"
              />
            </div>
            <div className="input-group mb-2">
              <label className="label input-group-text label-md">
                Description
              </label>
              <textarea
                type="text-area"
                // value={selectedCurrTicket.description}
                className="md-textarea form-control"
                name="description"
                // onChange={onTicketUpdate}
              />
            </div>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="m-1"
                onClick={() => setCreateTicketModal(false)}
              >
                Cancel
              </Button>
              <Button variant="success" className="m-1" type="submit">
                Update
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      )
    </div>
  );
}
export default Customer;