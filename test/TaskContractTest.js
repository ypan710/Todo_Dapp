const { expect } = require("chai");
const { ethers } = require("hardhat");
const { task } = require("hardhat/config");

// test code
// the purpose of describe() is to indicate the component to be tested
// and the nested describe methods indicate which methods needs to be tested
// the purpose of it() is to identify each individual test

describe("Task Contract", function () {
  let TaskContract;
  let taskContract;
  let owner;

  const NUM_TOTAL_TASKS = 5;
  let totalTasks;

  // it will run before each it() or describe()
  // adds 5 dummy tasks in our application so we can test the functionalities such as add task, get all tasks, and delete task
  beforeEach(async function () {
    TaskContract = await ethers.getContractFactory("TaskContract");
    [owner] = await ethers.getSigners();
    taskContract = await TaskContract.deploy();
    totalTasks = [];
    for (let i = 0; i < NUM_TOTAL_TASKS; i++) {
      let task = {
        taskDescription: "Task number: " + i,
        " is deleted": false,
      };
      await taskContract.addTask(task.taskDescription, task.isTaskDeleted);
      totalTasks.push(task);
    }
  });

  // test the addTask functionality after adding one more total task in our contract by testing the calculations of the 6th tasks to have ID = 5 as ID starts from 0
  describe("Add task", function () {
    it("should emit AddTask Event", async function () {
      let task = {
        taskDescription: "new task",
        isTaskDeleted: false,
      };
      await expect(
        await taskContract.addTask(task.taskDescription, task.isTaskDeleted)
      )
        .to.emit(taskContract, "AddTask")
        .withArgs(owner.address, NUM_TOTAL_TASKS);
    });
  });

  describe("Get all tasks", function () {
    it("Should return the correct number of total tasks", async function () {
      const allMyTasks = await taskContract.getMyTask();
      expect(allMyTasks.length).to.be.equal(NUM_TOTAL_TASKS);
    });
  });

  describe("Delete task", function () {
    it("Should emit DeleteTask event", async function () {
      const TASK_ID = 0;
      const TASK_DELETED = true;
      await expect(taskContract.deleteTask(TASK_ID, TASK_DELETED))
        .to.emit(taskContract, "DeleteTask")
        .withArgs(TASK_ID, TASK_DELETED);
    });
  });
});

// after(); // it will run after each it() or describe()

// it(); // it is the test case
