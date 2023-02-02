import "./Task.css";
import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Task = ({ taskDescription, onClick }) => {
  return (
    <List className="todo_list">
      <ListItem>
        <ListItemText primary={taskDescription} />
      </ListItem>
      <DeleteIcon
        fontSize="large"
        style={{ opacity: 0.7 }}
        onClick={onClick}
      ></DeleteIcon>
    </List>
  );
};

export default Task;
