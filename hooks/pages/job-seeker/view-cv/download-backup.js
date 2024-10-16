import React, { useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const Download = () => {
  const tableListStyle = {
    listStyle: "disc",
  };

  // useEffect(() => {
  //   const input = document.getElementById("divToPrint");
  //   html2canvas(input).then((canvas) => {
  //     var imgData = canvas.toDataURL("image/png");
  //     var imgWidth = 210;
  //     var pageHeight = 210;
  //     var imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     var heightLeft = imgHeight;

  //     var doc = new jsPDF({ compress: true });
  //     var position = 0;

  //     doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;

  //     while (heightLeft >= 40) {
  //       position = heightLeft - imgHeight;
  //       doc.addPage();
  //       doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;
  //     }
  //     doc.save("download.pdf");
  //   });
  // }, []);

  return (
    <div
      id="divToPrint"
      style={{
        background: "#fff",
        width: "1000px",
        margin: "20px auto",
        padding: "30px 40px",
      }}
    >
      <table
        align="center"
        cellPadding="0"
        cellSpacing="0"
        height="100%"
        width="100%"
        style={{ backgroundColor: "#ffffff" }}
      >
        <tbody>
          <tr>
            <td style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/img/user.png"
                style={{ width: "150px", height: "150px", borderRadius: "8px" }}
              />
              <div className="tablerow" style={{ marginLeft: "10px" }}>
                <h3>UserName</h3>
                <p>Business Analyst</p>
              </div>
            </td>
            <td></td>
          </tr>
          <tr style={{ verticalAlign: "top" }}>
            <td
              align="left"
              style={{
                textAlign: "left",
                width: "700px",
                paddingRight: "20px",
              }}
            >
              <table
                width="100%"
                cellSpacing="0"
                cellPadding="0"
                style={{ marginTop: "30px", marginBottom: "10px" }}
              >
                <tbody>
                  <tr>
                    <td>
                      <h5
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "2px",
                          marginBottom: "8px",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20px"
                          viewBox="0 0 448 512"
                          style={{ marginRight: "10px" }}
                        >
                          <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" />
                        </svg>
                        <span
                          style={{
                            fontSize: "28px",
                            color: "#000",
                            fontWeight: "500",
                          }}
                        >
                          Profile
                        </span>
                      </h5>
                      <div style={{ paddingLeft: "30px" }}>
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry standard dummy text ever since the 1500s,
                          when an unknown printer took a galley of type and
                          scrambled it to make a type specimen book. It has
                          survived not only five centuries, but also the leap
                          into electronic typesetting, remaining essentially
                          unchanged.
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                width="100%"
                cellSpacing="0"
                cellPadding="0"
                style={{ marginTop: "30px", marginBottom: "10px" }}
              >
                <tbody>
                  <tr>
                    <td>
                      <h5
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "2px",
                          marginBottom: "8px",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20px"
                          viewBox="0 0 512 512"
                          style={{ marginRight: "10px" }}
                        >
                          <path d="M128 480h256V80c0-26.5-21.5-48-48-48H176c-26.5 0-48 21.5-48 48v400zm64-384h128v32H192V96zm320 80v256c0 26.5-21.5 48-48 48h-48V128h48c26.5 0 48 21.5 48 48zM96 480H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48h48v352z" />
                        </svg>
                        <span
                          style={{
                            fontSize: "28px",
                            color: "#000",
                            fontWeight: "500",
                          }}
                        >
                          Employment History
                        </span>
                      </h5>
                      <div style={{ paddingLeft: "30px" }}>
                        <span
                          style={{
                            fontSize: "20px",
                            color: "#000",
                            fontWeight: "500",
                            lineHeight: "1",
                          }}
                        >
                          Business Analyst at GEO Corp.
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            color: "#ccc",
                            lineHeight: "1",
                            display: "block",
                            marginBottom: "10px",
                          }}
                        >
                          Oct-2020 - Oct-2022
                        </span>
                        <ul style={{ paddingLeft: "30px" }}>
                          <li style={tableListStyle}>An item</li>
                          <li style={tableListStyle}>A second item</li>
                          <li style={tableListStyle}>A third item</li>
                          <li style={tableListStyle}>A fourth item</li>
                          <li style={tableListStyle}>And a fifth one</li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{ paddingLeft: "30px" }}>
                        <span
                          style={{
                            fontSize: "20px",
                            color: "#000",
                            fontWeight: "500",
                            lineHeight: "1",
                          }}
                        >
                          Business Analyst at Sisco Corp.
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            color: "#ccc",
                            lineHeight: "1",
                            display: "block",
                            marginBottom: "10px",
                          }}
                        >
                          Oct-2020 - Oct-2022
                        </span>
                        <ul style={{ paddingLeft: "30px" }}>
                          <li style={tableListStyle}>An item</li>
                          <li style={tableListStyle}>A second item</li>
                          <li style={tableListStyle}>A third item</li>
                          <li style={tableListStyle}>A fourth item</li>
                          <li style={tableListStyle}>And a fifth one</li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                width="100%"
                cellSpacing="0"
                cellPadding="0"
                style={{ marginTop: "30px", marginBottom: "10px" }}
              >
                <tbody>
                  <tr>
                    <td>
                      <h5
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "2px",
                          marginBottom: "8px",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20px"
                          viewBox="0 0 512 512"
                          style={{ marginRight: "10px" }}
                        >
                          <path d="M128 480h256V80c0-26.5-21.5-48-48-48H176c-26.5 0-48 21.5-48 48v400zm64-384h128v32H192V96zm320 80v256c0 26.5-21.5 48-48 48h-48V128h48c26.5 0 48 21.5 48 48zM96 480H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48h48v352z" />
                        </svg>
                        <span
                          style={{
                            fontSize: "28px",
                            color: "#000",
                            fontWeight: "500",
                          }}
                        >
                          Education
                        </span>
                      </h5>
                      <div style={{ paddingLeft: "30px" }}>
                        <span
                          style={{
                            fontSize: "20px",
                            color: "#000",
                            fontWeight: "500",
                            lineHeight: "1",
                          }}
                        >
                          bachelor of finance
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            color: "#ccc",
                            lineHeight: "1",
                            display: "block",
                            marginBottom: "10px",
                          }}
                        >
                          Oct-2020 - Oct-2022
                        </span>
                        <ul style={{ paddingLeft: "30px" }}>
                          <li style={tableListStyle}>An item</li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{ paddingLeft: "30px" }}>
                        <span
                          style={{
                            fontSize: "20px",
                            color: "#000",
                            fontWeight: "500",
                            lineHeight: "1",
                          }}
                        >
                          High School Diploma
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            color: "#ccc",
                            lineHeight: "1",
                            display: "block",
                            marginBottom: "10px",
                          }}
                        >
                          Oct-2020 - Oct-2022
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                width="100%"
                cellSpacing="0"
                cellPadding="0"
                style={{ marginTop: "30px", marginBottom: "10px" }}
              >
                <tbody>
                  <tr>
                    <td>
                      <h5
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "2px",
                          marginBottom: "8px",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20px"
                          viewBox="0 0 576 512"
                          style={{ marginRight: "10px" }}
                        >
                          {" "}
                          <path d="M576 240c0-23.63-12.95-44.04-32-55.12V32.01C544 23.26 537.02 0 512 0c-7.12 0-14.19 2.38-19.98 7.02l-85.03 68.03C364.28 109.19 310.66 128 256 128H64c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h33.7c-1.39 10.48-2.18 21.14-2.18 32 0 39.77 9.26 77.35 25.56 110.94 5.19 10.69 16.52 17.06 28.4 17.06h74.28c26.05 0 41.69-29.84 25.9-50.56-16.4-21.52-26.15-48.36-26.15-77.44 0-11.11 1.62-21.79 4.41-32H256c54.66 0 108.28 18.81 150.98 52.95l85.03 68.03a32.023 32.023 0 0 0 19.98 7.02c24.92 0 32-22.78 32-32V295.13C563.05 284.04 576 263.63 576 240zm-96 141.42l-33.05-26.44C392.95 311.78 325.12 288 256 288v-96c69.12 0 136.95-23.78 190.95-66.98L480 98.58v282.84z" />
                        </svg>
                        <span
                          style={{
                            fontSize: "28px",
                            color: "#000",
                            fontWeight: "500",
                          }}
                        >
                          References
                        </span>
                      </h5>
                      <div style={{ paddingLeft: "30px" }}>
                        <span
                          style={{
                            fontSize: "20px",
                            color: "#000",
                            fontWeight: "500",
                            lineHeight: "1",
                          }}
                        >
                          Devin from GEO Corp.
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            <td align="left" style={{ textAlign: "left", width: "300px" }}>
              <table
                width="100%"
                cellSpacing="0"
                cellPadding="0"
                style={{ marginTop: "30px", marginBottom: "10px" }}
              >
                <tbody>
                  <tr>
                    <td>
                      <h5
                        style={{
                          fontSize: "24px",
                          color: "#000",
                          fontWeight: "500",
                        }}
                      >
                        Detail
                      </h5>
                      <div style={{ paddingLeft: "0px" }}>
                        <p>Laos, Phon-Hong, Neque</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                width="100%"
                cellSpacing="0"
                cellPadding="0"
                style={{ marginTop: "30px", marginBottom: "10px" }}
              >
                <tbody>
                  <tr>
                    <td>
                      <h5
                        style={{
                          fontSize: "24px",
                          color: "#000",
                          fontWeight: "500",
                        }}
                      >
                        Skills
                      </h5>
                      <div style={{ paddingLeft: "0px" }}>
                        <ul>
                          <li
                            style={{ fontWeight: "500", marginBottom: "8px" }}
                          >
                            An item
                            <div className="progress" style={{ height: "5px" }}>
                              <div
                                className="progress-bar"
                                role="progressbar"
                                aria-valuenow="70"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style={{ width: "70%" }}
                              >
                                <span className="sr-only">70% Complete</span>
                              </div>
                            </div>
                          </li>
                          <li
                            style={{ fontWeight: "500", marginBottom: "8px" }}
                          >
                            An item
                            <div className="progress" style={{ height: "5px" }}>
                              <div
                                className="progress-bar"
                                role="progressbar"
                                aria-valuenow="70"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style={{ width: "70%" }}
                              >
                                <span className="sr-only">70% Complete</span>
                              </div>
                            </div>
                          </li>
                          <li
                            style={{ fontWeight: "500", marginBottom: "8px" }}
                          >
                            An item
                            <div className="progress" style={{ height: "5px" }}>
                              <div
                                className="progress-bar"
                                role="progressbar"
                                aria-valuenow="70"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style={{ width: "70%" }}
                              >
                                <span className="sr-only">70% Complete</span>
                              </div>
                            </div>
                          </li>
                          <li
                            style={{ fontWeight: "500", marginBottom: "8px" }}
                          >
                            An item
                            <div className="progress" style={{ height: "5px" }}>
                              <div
                                className="progress-bar"
                                role="progressbar"
                                aria-valuenow="70"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style={{ width: "70%" }}
                              >
                                <span className="sr-only">70% Complete</span>
                              </div>
                            </div>
                          </li>
                          <li
                            style={{ fontWeight: "500", marginBottom: "8px" }}
                          >
                            An item
                            <div className="progress" style={{ height: "5px" }}>
                              <div
                                className="progress-bar"
                                role="progressbar"
                                aria-valuenow="70"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style={{ width: "70%" }}
                              >
                                <span className="sr-only">70% Complete</span>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                width="100%"
                cellSpacing="0"
                cellPadding="0"
                style={{ marginTop: "30px", marginBottom: "10px" }}
              >
                <tbody>
                  <tr>
                    <td>
                      <h5
                        style={{
                          fontSize: "24px",
                          color: "#000",
                          fontWeight: "500",
                        }}
                      >
                        Language
                      </h5>
                      <div style={{ paddingLeft: "0px" }}>
                        <ul>
                          <li
                            style={{ fontWeight: "500", marginBottom: "8px" }}
                          >
                            An item
                            <div className="progress" style={{ height: "5px" }}>
                              <div
                                className="progress-bar"
                                role="progressbar"
                                aria-valuenow="70"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style={{ width: "70%" }}
                              >
                                <span className="sr-only">70% Complete</span>
                              </div>
                            </div>
                          </li>
                          <li
                            style={{ fontWeight: "500", marginBottom: "8px" }}
                          >
                            An item
                            <div className="progress" style={{ height: "5px" }}>
                              <div
                                className="progress-bar"
                                role="progressbar"
                                aria-valuenow="70"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style={{ width: "70%" }}
                              >
                                <span className="sr-only">70% Complete</span>
                              </div>
                            </div>
                          </li>
                          <li
                            style={{ fontWeight: "500", marginBottom: "8px" }}
                          >
                            An item
                            <div className="progress" style={{ height: "5px" }}>
                              <div
                                className="progress-bar"
                                role="progressbar"
                                aria-valuenow="70"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style={{ width: "70%" }}
                              >
                                <span className="sr-only">70% Complete</span>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Download;
