import { useState } from "react";
import Box from "@mui/material/Box";
import Column from "./Column/Column";
import Button from "@mui/material/Button";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "react-toastify";

const ListColumn = ({ columns, createNewColumn, createNewCard }) => {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const toggleOpeNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error("Please enter Column Title");
      return;
    }
    // console.log(newColumnTitle);
    // Call API
    const newColumnData = {
      title: newColumnTitle,
    };

    createNewColumn(newColumnData);

    toggleOpeNewColumnForm();
    setNewColumnTitle("");
  };

  // SortableContext yêu cầu item  là một mảng dạng ['id-1','id-2',...] chứ ko phải [{id:'id-1'},{id:'id-2'},...]
  // Nếu ko đúng thì vẫn kéo thả dc nhưng ko có animation
  // https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
  return (
    <SortableContext
      items={columns?.map((column) => column._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          bgcolor: "inherit",
          width: "100%",
          height: "100%",
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          "&::-webkit-scrollbar-track": {
            m: 2,
          },
        }}
      >
        {columns.length > 0 &&
          columns.map((column, index) => (
            <Column
              key={`${index}-${column._id}`}
              column={column}
              createNewCard={createNewCard}
            />
          ))}

        {/* Box add new column */}
        {!openNewColumnForm ? (
          <Box
            sx={{
              minWidth: "250px",
              mx: 2,
              borderRadius: "6px",
              height: "fit-content",
              bgcolor: "#ffffff3d",
            }}
            onClick={toggleOpeNewColumnForm}
          >
            <Button
              sx={{
                color: "white",
                width: "100%",
                justifyContent: "flex-start",
                pl: 2.5,
                py: 1.5,
              }}
              startIcon={<NoteAddIcon />}
            >
              Add new column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: "250px",
              mx: 2,
              p: 1,
              borderRadius: "6px",
              height: "fit-content",
              bgcolor: "#ffffff3d",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <TextField
              label="Enter column title..."
              type="text"
              size="small"
              variant="outlined"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              autoFocus
              sx={{
                width: "100%",
                "& label": { color: "white" },
                "& input": { color: "white" },
                "& label.Mui-focused": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                onClick={addNewColumn}
                variant="contained"
                color="success"
                size="small"
                sx={{
                  boxShadow: "none",
                  border: "0.5px solid",
                  borderColor: (theme) => theme.palette.success.main,
                  "&:hover": {
                    bgcolor: (theme) => theme.palette.success.main,
                  },
                }}
              >
                Add column
              </Button>
              <CloseIcon
                fontSize="small"
                sx={{
                  color: "white",
                  cursor: "pointer",
                  "&:hover": {
                    color: (theme) => theme.palette.warning.light,
                  },
                }}
                onClick={toggleOpeNewColumnForm}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  );
};

export default ListColumn;
