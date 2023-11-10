import { useEffect, useState, useCallback } from 'react'
import getBlockchain from './ethereum.js';
import { ethers } from 'ethers';
import classes from './App.module.css';

function App() {
  const [coffeeContract, setCoffeeContract] = useState(undefined);
  const [address, setAddress] = useState('');
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);

  useEffect(() => {
    const init = async () => {
      const { coffeeContract, signerAddress } = await getBlockchain();
      setCoffeeContract(coffeeContract);
      setAddress(signerAddress);
    };

    init();
  }, []);

const onNameChange = (event) => {
  setName(event.target.value);
}

const onMessageChange = (event) => {
  setMessage(event.target.value);
}

const buyCoffee = async (value) => {
  try {
      console.log("buying coffee..")
      const coffeeTxn = await coffeeContract.buyCoffee(
        name ? name : "anonimus",
        message ? message : "Enjoy your coffee!",
        {value: ethers.utils.parseEther(value)}
      );

      await coffeeTxn.wait();

      console.log("mined ", coffeeTxn.hash);

      console.log("coffee purchased!");

  } catch (error) {
    console.log(error);
  }

   // Clear the form fields.
   setName("");
   setMessage("");
};

// Function to fetch all memos stored on-chain.
const getMemos = useCallback(async () => {
  try {
    if (address && coffeeContract) {
      console.log(address);
      console.log(coffeeContract.address)
      console.log(coffeeContract)
      console.log("fetching memos from the blockchain..");
      const memos = await coffeeContract.getMemos();
      console.log("fetched!");
      setMemos(memos);

    } else {
      setMemos([]);
    }
    
  } catch (error) {
    console.log(error);
  }
},[coffeeContract, address]);

useEffect(() => {
  getMemos();

  // Create an event handler function for when someone sends
  // us a new memo.
  const onNewMemo = (from, timestamp, name, message) => {
    console.log("Memo received: ", from, timestamp, name, message);
    setMemos((prevState) => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message,
        name
      }
    ]);
  };

  // Listen for new memo events.
  if (address && coffeeContract) {
    coffeeContract.on("NewMemo", onNewMemo);
  }

  return () => {
    if (coffeeContract) {
      coffeeContract.off("NewMemo", onNewMemo);
    }
  }
}, [address, coffeeContract, getMemos]);

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000); // Convert to milliseconds

  const day = date.getDate().toString().padStart(2, '0'); 
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const year = date.getFullYear();

  return `${day}:${month}:${year}.`;
}

return (
  <div className={classes.container}>
    <main className={classes.main}>
      <h1 className={classes.title}>Buy Marin a Coffee!</h1>
      {address && (
        <div className={classes.form__container}>
          <form className={classes.form}>
            <div>
              <label> Name </label>
              <br/>
              
              <input
                  id="name"
                  type="text"
                  placeholder="anonimus"
                  onChange={onNameChange}
                  className={classes.input}
              />
            </div>
            <br/>

            <div>
              <label> Send Marin a message </label>
              <br/>

              <textarea
                  rows={5}
                  placeholder="Enjoy your coffee!"
                  id="message"
                  onChange={onMessageChange}
                  required
                  className={classes.textarea}
              >
              </textarea>
            </div>

          <div style={{display : 'flex'}}>
            <div>
              <button type="button" onClick={() => buyCoffee("0.001")}>
                Send 1 Coffee for 0.001ETH
              </button>
            </div>
            <div>
              <button type="button" onClick={() => buyCoffee("0.005")} style={{ marginLeft : '1vw', backgroundColor : '#174458'}}>
                Send 1 Large Coffee for 0.005ETH
              </button>
            </div>
          </div>

          </form>
        </div>
      )}
    </main>

    {address && (  <h1 className={classes.title}>Messages received</h1> )}

    {address && (memos.slice().reverse().map((memo, idx) => {
      return (
        <div key={idx} style={{border:"2px solid #1b82b1", borderRadius:"5px", padding: "5px", margin: "1vh 0", width : '50%'}}>
          <p>Message : <strong>{memo.message}</strong></p>
          <p>From: <strong>{memo.name}</strong> at {formatDate(memo.timestamp)}</p>
        </div>
      )
    }))}
  </div>
)
}

export default App;