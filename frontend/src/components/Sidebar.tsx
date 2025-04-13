import {
  AddBox,
  GroupAdd,
  Home,
  LinkRounded,
  Message,
  People,
  Person,
} from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import { NavLink } from "react-router-dom";

const SidebarContainer = styled("div")(({ theme }) => ({
  width: 280,
  height: "100vh",
  position: "fixed",
  left: 0,
  top: 70,
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down("md")]: {
    width: 72,
    "& .MuiListItemText-root": { display: "none" },
  },
}));

const menuItems = [
  { icon: <Home />, text: "Home", path: "/" },
  { icon: <AddBox />, text: "Create Post", path: "/create-post" },
  { icon: <Person />, text: "My Profile", path: "/profile" },
  { icon: <Message />, text: "Chats", path: "/chats" },
  {
    icon: <LinkRounded />,
    text: "Connections",
    path: "/connections",
  },
  {
    icon: <GroupAdd />,
    text: "Connection Requests",
    path: "/connections-requests",
  },
  { icon: <People />, text: "Search & Suggestions", path: "/suggestions" },
];

export function Sidebar() {
  return (
    <SidebarContainer>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                borderRadius: 2,
                mx: 1,
                "&.active": {
                  bgcolor: "action.selected",
                  "& .MuiListItemIcon-root": {
                    color: "primary.main",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 44 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </SidebarContainer>
  );
}
