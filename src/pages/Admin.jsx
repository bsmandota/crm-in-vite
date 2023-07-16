import MaterialTable from "@material-table/core";
import Sidebar from "../components/Sidebar";
import { Modal, Button } from "react-bootstrap";
import  {fetchTicket, ticketUpdation } from "../api/tickets";
import fetchUser,{userUpdation} from '../api/users';
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { useEffect, useState } from "react";
import Widget from "../components/widget";
const columns = [
  { title: "ID", field: "id" },  
  { title: "TITLE", field: "title" },
  { title: "DESCRIPTION", field: "description" },
  { title: "REPORTER", field: "reporter" },
  { title: "ASSIGNEE", field: "assignee" },
  { title: "PRIORITY", field: "ticketPriority" },
  { title: "STATUS", field: "status",
    lookup: {
      OPEN: "OPEN",
      IN_PROGRESS: "IN_PROGRESS",
      CLOSED: "CLOSED",
      BLOCKED: "BLOCKED",
    },
  },
];
const userColumns = [
  { title: "ID", field: "userId" },
  { title: "NAME", field: "name" },
  { title: "EMAIL", field: "email" },
  { title: "ROLE", field: "userTypes" },
  { title: "STATUS", field: "userStatus" },
  {
    lookup: {
      APPROVED: "APPROVED",
      REJECTED: "REJECTED",
      PENDING:"PENDING"
    },
  },
];



export default function Admin() {

  const [ticketDetails, setTicketDetails] = useState([]);
  const [ticketStatusCount, setTicketStatusCount] = useState({});
  const [ticketUpdationModal, setTicketUpdationModal] = useState(false);
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({});
  const [userDetails, setUserDetails] = useState([]);
  const [selectedCurrUser, setSelectedCurrUser]= useState({})
  const [userUpdationModal, setUserUpdationModal] = useState(false);

  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data);
  const closeTicketUpdationModal = () => setTicketUpdationModal(false);
  const updateSelectedCurrUser = (data) => setSelectedCurrUser(data);
  const closeUserUpdationModal = () => setUserUpdationModal(false);

  useEffect(() => {
    fetchTickets();
    fetchUsers("");
  }, []);
  const fetchTickets = () => {
      fetchTicket()
        .then((response) => {
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
    setSelectedCurrTicket(ticket);
  };

  const fetchUsers = () => {
      fetchUser("")
      .then((response) => {
        // console.log(response.data)
        setUserDetails(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const editUser=(userDetail)=>{
    console.log(userDetail);
    const user={
      userId: userDetail.userId,
      name: userDetail.name,
      email: userDetail.email,
      userStatus: userDetail.userStatus,
      userTypes: userDetail.userTypes
    }
    setUserUpdationModal(true);
    setSelectedCurrUser(user);
  }
  

  const onUserUpdate = (e) => {
    console.log(selectedCurrUser);
    if (e.target.name === "userStatus")
      selectedCurrUser.userStatus = e.target.value;
    if (e.target.name === "userTypes")
      selectedCurrUser.userTypes = e.target.value;
      updateSelectedCurrUser(Object.assign({}, selectedCurrUser));
    }
  const onTicketUpdate = (e) => {
    if (e.target.name === "ticketPriority")
      selectedCurrTicket.ticketPriority = e.target.value;
    if (e.target.name === "assignee")
      selectedCurrTicket.assignee = e.target.value;
    if (e.target.name === "status")
     selectedCurrTicket.status = e.target.value;
    if (e.target.name === "description")
      selectedCurrTicket.description = e.target.value;
    updateSelectedCurrTicket(Object.assign({}, selectedCurrTicket));
  };
  // 4. Call the api with the new updated Data
  const updateTicket = (e) => {
    e.preventDefault();
    ticketUpdation(selectedCurrTicket.id, selectedCurrTicket)
      // .then((response)=>{
      //   console.log("succeed",response)
      .then(setTicketUpdationModal(false), fetchTickets())
      // })
      .catch(function (error) {
        console.log(error);
      });
  };
  const updateUser = (e) => {
    e.preventDefault();
    userUpdation(selectedCurrUser.userId, selectedCurrUser)
      // .then((response)=>{
      //   console.log("succeed",response)
      .then(setUserUpdationModal(false), fetchUsers())
      // })
      .catch(function (error) {
        console.log(error);
      });
  };
  
  return (
    <div className=" vh-100% admin-bg">
      {/**SideBar */}
      <Sidebar />
      {/* Title-> Tether-X */}
      <div className=" d-inline-block fw-bold px-3 py-1 mx-5 my-1 rounded bg-secondary h5">
        TETHER-X
      </div>

      {/* Welcome Text */}
      <div className="mx-4 p-5">
        <div className="container">
          <h2 className="text-center fw-bolder text-secondary">
            Welcome, {localStorage.getItem("name")}!
          </h2>
          <p className="lead text-center">
            Take a Quick Tour to your Admin Stats below!
          </p>
        </div>
        {/* Widgets */}
        <div className="row m-2">
        <Widget color = "primary" title = " Open" icon = "envelope-open" ticketCount={ticketStatusCount.open} totalCount={ticketStatusCount.total} />
        <Widget color="warning" title=" Progress" icon="hourglass-split" ticketCount={ticketStatusCount.progress} totalCount={ticketStatusCount.total} />
        <Widget color="success" title=" Closed" icon="check2-square" ticketCount={ticketStatusCount.closed} totalCount={ticketStatusCount.total} />
        <Widget color="dark" title=" Blocked" icon="slash-circle" ticketCount={ticketStatusCount.blocked} totalCount={ticketStatusCount.total} />
        </div>
        {/* Modal - Tickets */}
        {ticketUpdationModal && (
          <Modal
            show={ticketUpdationModal}
            backdrop="static"
            onHide={closeTicketUpdationModal}
            centered >
            <Modal.Header closeButton>
              <Modal.Title>Update Ticket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form
                /*submit the details and we  will call the API */
                onSubmit={updateTicket}
              >
                <div className="p-1">
                  <h5 className="card-subtitle mb-2 text-danger">
                    User ID: {selectedCurrTicket.id}
                  </h5>
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Title
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedCurrTicket.title}
                    className="form-control"
                  />
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Reporter
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedCurrTicket.reporter}
                    className="form-control"
                  />
                </div>
                {/* 3. -> grabbing the new updated values from inputs using onChange */}
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Assignee
                  </label>
                  <input
                    type="text"
                    name="assignee"
                    value={selectedCurrTicket.assignee}
                    className="form-control"
                    onChange={onTicketUpdate}
                  />
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Priority
                  </label>
                  <input
                    type="number"
                    name="ticketPriority"
                    value={selectedCurrTicket.ticketPriority}
                    enabled="true"
                    className="form-control"
                    onChange={onTicketUpdate}
                  />
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Status
                  </label>
                  <select
                    className="form-control"
                    name="status"
                    value={selectedCurrTicket.status}
                    onChange={onTicketUpdate}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Description
                  </label>
                  <textarea
                    type="text-area"
                    value={selectedCurrTicket.description}
                    className="md-textarea form-control"
                    name="description"
                    onChange={onTicketUpdate}
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={closeTicketUpdationModal}
                  >
                    Cancel
                  </Button>
                  <Button variant="danger" className="m-1" type="submit">
                    Update
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        )}
        {/* Modal - Users */}
        {userUpdationModal && (
              <Modal
                  show ={userUpdationModal}
                  backdrop="static"
                  onHide={closeUserUpdationModal}
                  
                  centered >
                    <Modal.Header closeButton>
                      <Modal.Title>Update User Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <form
                        /*submit the details and we  will call the API */
                        onSubmit={updateUser}
                      >
                        <div className="p-1">
                          <h5 className="card-subtitle mb-2 text-danger">
                            User ID: {selectedCurrUser.userId}
                          </h5>
                        </div>
                        <div className="input-group mb-2">
                          <label className="label input-group-text label-md">
                            Name
                          </label>
                          <input
                            type="text"
                            disabled
                            value={selectedCurrUser.name}
                            className="form-control"
                          />
                        </div>
                        <div className="input-group mb-2">
                          <label className="label input-group-text label-md">
                            Email
                          </label>
                          <input
                            type="text"
                            disabled
                            value={selectedCurrUser.email}
                            className="form-control"
                          />
                        </div>
                        {/* 3. -> grabbing the new updated values from inputs using onChange */}
                        <div className="input-group mb-2">
                          <label className="label input-group-text label-md">
                            User Type
                          </label>
                          <input
                            type="text"
                            value={selectedCurrUser.userTypes}
                            name="userTypes"
                            className="form-control"
                            onChange={onUserUpdate}
                          />
                        </div>
                        <div className="input-group mb-2">
                          <label className="label input-group-text label-md">
                            User Status
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="userStatus"
                            value={selectedCurrUser.userStatus}
                            onChange={onUserUpdate}
                          >
                          </input>
                        </div>
                        
                        <div className="d-flex justify-content-end">
                          <Button
                            variant="secondary"
                            className="m-1"
                            onClick={closeUserUpdationModal}
                          >
                            Cancel
                          </Button>
                          <Button variant="danger" className="m-1" type="submit">
                            Update
                          </Button>
                        </div>
                      </form>
                    </Modal.Body>
                  </Modal>
        )}
        <div className=" m-2">
          {/* Material-Table - Tickets */}
          <MaterialTable
            title="TICKETS"
            // 1. -> Grabbing the specific ticket from the row
            onRowClick={(event, rowData) => editTicket(rowData)}
            columns={columns}
            data={ticketDetails}
            options={{
              filtering: true,
              headerStyle: {
                backgroundColor: "#aaa",
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
          {/* Material-Table - USERS */}
          <MaterialTable
            title="USERS"
            // 1. -> Grabbing the specific ticket from the row
            onRowClick={(event, rowData) => editUser(rowData)}
            columns={userColumns}
            data={userDetails}
            options={{
              filtering: true,
              headerStyle: {
                backgroundColor: "#aaa",
                color: "#fff",
              },
              rowStyle: (userDetails, index) => {
                if (index % 2 === 0) {
                  return { backgroundColor: "#ddd" };
                }
              },
              exportMenu: [
                {
                  label: "Export Pdf",
                  exportFunc: (cols, data) =>
                    ExportPdf(cols, data, "userRecords"),
                },
                {
                  label: "Export Csv",
                  exportFunc: (cols, data) =>
                    ExportCsv(cols, data, "userRecords")
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );

}