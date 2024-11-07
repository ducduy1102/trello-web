import Typography from "@mui/material/Typography";
import { Card as MuiCard } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import GroupIcon from "@mui/icons-material/Group";
import CommentIcon from "@mui/icons-material/Comment";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CardItem = ({ card }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id, data: { ...card } });

  // touchAction: "none" Dành cho sensor dafult dạng PointerSensor
  // Nếu use CSS.Transform như docs sẽ lỗi kiểu stretch
  const dndKitCardStyles = {
    touchAction: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  const showCardAction = () => {
    return (
      !!card?.memberIds.length ||
      !!card?.comments.length ||
      !!card?.attachments.length
    );
  };

  return (
    <MuiCard
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      sx={{
        cursor: "pointer",
        boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
        overflow: "unset",
      }}
    >
      {card?.cover && (
        <CardMedia
          sx={{ height: 140 }}
          image={
            card?.cover ||
            "https://images.unsplash.com/photo-1719937206158-cad5e6775044?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          title={card?.title || "Card title"}
        />
      )}

      <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
        <Typography>{card?.title || "Card title"}</Typography>
      </CardContent>
      {showCardAction() && (
        <CardActions sx={{ p: "0 4px 8px 4px" }}>
          {!!card?.memberIds.length && (
            <Button size="small" startIcon={<GroupIcon />}>
              {card?.memberIds.length}
            </Button>
          )}

          {card?.comments.length > 0 && (
            <Button size="small" startIcon={<CommentIcon />}>
              {card?.comments.length}
            </Button>
          )}

          {card?.attachments.length > 0 && (
            <Button
              size="small"
              startIcon={<AttachmentIcon sx={{ rotate: "-45deg" }} />}
            >
              {card?.attachments.length}
            </Button>
          )}
        </CardActions>
      )}
      {/* <Button size="small" startIcon={<GroupIcon />}>
          {card?.memberIds.length > 0 ? card?.memberIds.length : 0}
        </Button>

        <Button size="small" startIcon={<CommentIcon />}>
          {card?.comments.length > 0 ? card?.comments.length : 0}
        </Button>

        <Button
          size="small"
          startIcon={<AttachmentIcon sx={{ rotate: "-45deg" }} />}
        >
          {card?.attachments.length > 0 ? card?.attachments.length : 0} 
        </Button> */}
    </MuiCard>
  );
};

export default CardItem;
