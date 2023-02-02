import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import Task from "./Task";
import "./App.css";
import { TaskContractAddress } from "./config";
import { ethers } from "ethers";
import TaskAbi from "./abi/TaskContract.json";

const App = () => {
  // hold our tasks
  const [tasks, setTasks] = useState([]);

  // text input from text field
  const [input, setInput] = useState("");

  // ensure current account is selected
  const [currentAccount, setCurrentAccount] = useState("");

  // ensure correct test network is selected
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("MetaMask not detected");
      }

      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain: " + chainId);

      const goerliChainId = "0x5";
      if (chainId !== goerliChainId) {
        alert("You are not connected to Goerli network");
        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found account: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log("Error connecting to MetaMask", err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    let task = {
      taskDescription: input,
      isTaskDeleted: false,
    };
    try {
      const { ethereum } = windows;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi,
          signer
        );
        TaskContract.addTask(task.tastText, task.isTaskDeleted)
          .then((response) => {
            setTasks([...task, task]);
          })
          .catch((error) => {
            console.log("Error occurred while adding new task");
          });
      } else {
        console.log("Ethereum object does not exist!");
      }
    } catch (error) {
      console.log("Error adding the task");
    }
    setInput("");
  };

  const deleteTask = (id) => async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi,
          signer
        );
        let deleteTaskTx = await TaskContract.deleteTask(id, true);
        let allTasks = await TaskContract.getMytask();
        setTasks(allTasks);
      } else {
        console.log("Ethereum object does not exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTasks = async () => {
    {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const TaskContract = new ethers.Contract(
            TaskContractAddress,
            TaskAbi,
            signer
          );
          let allTasks = await TaskContract.getMytask();
          setTasks(allTasks);
        } else {
          console.log("Ethereum object does not exist!");
        }
      } catch (error) {
        console.log(error);
      }
    }

    // whenever the app is rendered,
    // the functions within useEffect are called
    useEffect(() => {
      getAllTasks();
      connectWallet();
    }, []);

    return (
      <div>
        {currentAccount === "" ? (
          <center>
            <button className="button" onClick={connectWallet}>
              Connect Wallet
            </button>
          </center>
        ) : correctNetwork ? (
          <div className="App">
            <h2>Task Management App</h2>
            <form>
              <TextField
                id="outlined-basic"
                label="Make Todo"
                variant="outlined"
                style={{ margin: "0px 5px" }}
                size="small"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={addTask}>
                Add Task
              </Button>
            </form>
            <ul>
              {tasks.map((item) => {
                const { id, taskDescription } = item;
                <Task
                  key={id}
                  taskDescription={taskDescription}
                  onClick={deleteTask(id)}
                ></Task>;
              })}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center mb-20 for-bold text-2xl gap-y-3">
            <div>
              Please connect to the Goerli testnet and reload the screen
            </div>
          </div>
        )}
      </div>
    );
  };
};

export default App;
