// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract TaskContract {

    event AddTask(address recipient, uint taskId);
    event DeleteTask(uint taskId, bool isTaskDeleted);

    struct Task{
        uint id;
        string taskDescription;
        bool isTaskDeleted;
    }

    // Task array to hold struct Task
    Task[] private tasks;

    mapping(uint256 => address) taskToOwner;

    // add a task to the Task array
    function addTask(string memory taskDescription, bool isTaskDeleted) external {
        uint taskId = tasks.length;

        // add task content to Task array
        tasks.push(Task(taskId, taskDescription, isTaskDeleted));

        // assign task id to caller of contract
        taskToOwner[taskId] = msg.sender;

        // emit event for adding the task
        emit AddTask(msg.sender, taskId);
    }

    // delete a tasks associated with a certain owner
    function deleteTask(uint taskId, bool isTaskDeleted) external {
        // check if the sender is the actual task owner
        if (taskToOwner[taskId] == msg.sender) {
            // if so, delete the task
            tasks[taskId].isTaskDeleted = isTaskDeleted;
            emit DeleteTask(taskId, isTaskDeleted);
        }
    }

    // get a list of tasks belonging to a certain owner
    function getMyTask() external view returns (Task[] memory) {
        Task[] memory temporary = new Task[](tasks.length);
        uint counter = 0; // counter denotes how many tasks the owner has
        for (uint i = 0; i < tasks.length; i++) {
            if (taskToOwner[i] == msg.sender && tasks[i].isTaskDeleted == false) {
                temporary[counter] = tasks[i];
                counter++;
            }
        }

        // copy elements in temporary to result
        Task[] memory result = new Task[](counter);
        for (uint i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }
}
