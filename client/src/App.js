import Generate from "./artifacts/contracts/Generate.sol/Generate.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import './App.css';
import GenerateCertificate from "./components/GenerateCertificate"

function App() {

  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect( () => {

    const provider = new ethers.BrowserProvider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
          window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = (await signer).address;
        setAccount(address);
        // console.log(address);
        let contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

        const contract = new ethers.Contract(
          contractAddress,
          Generate.abi,
          signer
        );
        // console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);
  return (
    <div className="App">
        <h1 style={{ color: "black" }}>Generate Certificate</h1>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>

        <p style={{ color: "black" }}>
          School Account : {account ? account : "Not connected"}
        </p>
        <GenerateCertificate
          account={account}
          provider={provider}
          contract={contract}
        ></GenerateCertificate>
        {/* <Display contract={contract} account={account} provider={provider}></Display> */}
      </div>
  );
}

export default App;
