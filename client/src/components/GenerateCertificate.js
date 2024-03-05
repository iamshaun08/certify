import { useState } from "react";
import "./Display.css"
import { QRCodeCanvas } from "qrcode.react";


const GenerateCertificate = ({ account, provider, contract }) => {

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await contract.generateCertificate(e.target.name.value, e.target.reg.value, e.target.year.value);
      alert("Certificate generated successfully!");
      await getHash();
    } catch (error) {
      console.log(error);
    }
  };

  // const handleVerify = async (e) => {
  //   e.preventDefault();

  //   try {
  //     var verification;
  //     await verify(e.target.hash.value).then((value) => {
  //       verification = value;
  //     });
  //     if (verification == "true") alert("Certificate verified");
  //     else alert("Certificate not verified");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const verify = async (hash) => {
    const hsh = await contract.verify(hash);
    if (hsh === true) {
      alert("Certificate verified!");
    } else {
      alert("Certificate not verified!");
    }
  }

  const getHash = async () => {
    let dataArray;
    dataArray = await contract.getCertificates();

    const tableBody = document.querySelector("#certificates tbody");
    const tableHead = document.querySelector("#certificates thead");
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
    while (tableHead.firstChild) {
      tableHead.removeChild(tableHead.firstChild);
    }
    const row = tableHead.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);
    const cell6 = row.insertCell(5);

    cell1.textContent = "Name";
    cell2.textContent = "Reg";
    cell3.textContent = "Validity";
    cell4.textContent = "View";
    cell5.textContent = "Revoke";
    cell6.textContent = "Verify";

    dataArray.forEach(item => {

      const row = tableBody.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);
      const cell5 = row.insertCell(4);
      const cell6 = row.insertCell(5);

      cell1.textContent = item[0];
      cell2.textContent = item[1];
      cell3.textContent = item[2];

      const button2 = document.createElement('button');
      button2.textContent = "Verify";
      button2.addEventListener('click', function () {
        verify(item[5]);
      });
      cell6.appendChild(button2);

      const button1 = document.createElement('button');
      button1.textContent = "View";
      button1.addEventListener('click', function () {
        setUrl(item[5]);
      });
      cell4.appendChild(button1);

      const button = document.createElement('button');
      button.textContent = "Revoke";
      // button.disabled = contract.verify(item[5]);
      button.addEventListener('click', function () {
        contract.revoke(item[5]);
      });
      cell5.appendChild(button);
    });
  }

  const [url, setUrl] = useState("");

  const downloadQRCode = (e) => {
    e.preventDefault();
    setUrl("");
    const canvas = document.getElementById("qrCode");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "QR.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={url}
      size={300}
      bgColor={"#ffffff"}
      level={"H"}
    />
  );

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="name" className="name">
          Enter name:
        </label>&nbsp;
        <input
          disabled={!account}
          type="text"
          id="name"
          name="name" required
        /><br></br><br></br>
        <label htmlFor="reg" className="reg">
          Enter reg:
        </label>&nbsp;
        <input
          disabled={!account}
          type="text"
          id="reg"
          name="reg" required
        /><br></br><br></br>
        <label htmlFor="year" className="year">
          Enter validity:
        </label>&nbsp;
        <input
          disabled={!account}
          type="text"
          id="year"
          name="year" required
        /><br></br><br></br>

        <button type="submit" className="upload">
          Upload Certificate
        </button>
      </form>
      <div id="qrcode"></div>
      <div>
        <br></br>
        <br></br>
        <button onClick={getHash}>Get Certificates</button>
        <br></br>
        <br></br>

        <table id="certificates">
          <thead>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>

      <br></br><br></br>
      {/* <form className="form" onSubmit={handleVerify}>
        <label htmlFor="hash" className="hash">
          Enter hash:
        </label>&nbsp;
        <input
          disabled={!account}
          type="text"
          id="hash"
          name="hash" required
        />&nbsp;
        <button type="submit" className="verify">
          Verify
        </button>
      </form> */}
      <br></br>
      <div hidden={!url} className="qrcode__container">
        <div>{qrcode}</div>
        <br></br>
        <button onClick={downloadQRCode} disabled={!url}>Download</button>
      </div>
    </div>
  );
};

export default GenerateCertificate;