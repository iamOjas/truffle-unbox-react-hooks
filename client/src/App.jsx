import React, {
  Component,
  useEffect,
  useState
} from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

var App = () => {
  const [storageValue, setStorageValue] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [Contract, setContract] = useState(undefined);
  const [value, setValue] = useState("Type Anything");

  useEffect(() => {
    const init = async() => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        console.log(deployedNetwork);
        const instance = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        // this.setState({ web3, accounts, contract: instance }, this.runExample);
        setWeb3(web3);
        setAccounts(accounts);
        setContract(instance);

      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
    init();
  }, [])

  useEffect(() => {
    const init = async() => {
        // Stores a given value, 5 by default.
        
        await Contract.methods.set(value).send({
          from: accounts[0]
        });

        // Get the value from the contract to prove it worked.
        const response = await Contract.methods.get().call();

        // Update state with the result.

        setStorageValue(response)
      }
      if (typeof web3 !== 'undefined' && typeof accounts !== 'undefined' && typeof Contract !== 'undefined') {
      init();
    }

  }, [web3, accounts, Contract])

  if(typeof web3 === 'undefined'){
    return <div> Loading Web3, accounts, and contract... </div>;
  }

  async function handleSubmit(event){
    event.preventDefault();

    await Contract.methods.set(value).send({
      from: accounts[0]
    });

    // Get the value from the contract to prove it worked.
    const response = await Contract.methods.get().call();

    // Update state with the result.

    setStorageValue(response)
  }
  

  return(
    <div className="App" >
    <h1> {storageValue} </h1>
    <form onSubmit = {handleSubmit} >
      <input type="text" 
      onChange = {(event)=>{setValue(event.target.value)}}      
      />
      <button type="submit">Submit</button>
    </form>
  </div>
  )

}

export default App;