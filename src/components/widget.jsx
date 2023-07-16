import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
const bootstrapColors = {
  primary: "#007bff",
  secondary: "#6c757d",
  success: "#198754",
  danger: "#dc3545",
  warning: "#ffc107",
  info: "#17a2b8",
  light: "#f8f9fa",
  dark: "#343a40",
};

export default function Widget(props) {
  const { color, title, icon, ticketCount, totalCount } = props;
  const pathColor = bootstrapColors[color];
    return(
        <div className="col-lg-3 col-md-6 my-2 ">
            <div style={{border:0}} className={`card shadow text-center `}>
              <h4 className={`card-top shadow m-0 py-3 bg-${color} text-white d-flex rounded-top justify-content-evenly`} style={{cursor:"pointer"}}>
                <i className={`bi bi-${icon} text-white bolder`} >{title}</i>
              </h4>
              <div style={{border:0}} className={`row py-3 bg-${color} d-flex justify-content-center align-items-center mx-0 rounded-bottom bg-opacity-50`}>
                <div className={`col text-${color} fw-bold display-6 m-2 `}>
                  {ticketCount}
                </div>
                <div className="col m-2">
                  <div className="w-50">
                    <CircularProgressbar
                      value={ticketCount}
                      maxValue={totalCount}
                      styles={buildStyles({ pathColor})}
                      backgroundPadding={50}
                      strokeWidth={15}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
    )
}