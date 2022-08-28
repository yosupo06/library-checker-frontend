import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Menu from "@mui/material/Menu";
import { GitHub } from "@mui/icons-material";
import React, { ReactElement, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { LangContext } from "../../contexts/LangContext";
import { styled } from "@mui/system";
import { useUserInfo } from "../../api/library_checker_client";
import { Box } from "@mui/material";

const NavbarLink = styled(Link)({
  color: "inherit",
  textDecoration: "none",
  textTransform: "none",
});

const NavbarButton = styled(Button)({
  textDecoration: "none",
  textTransform: "none",
});

const LangSelect = () => {
  const lang = useContext(LangContext);

  return (
    <Select
      value={lang?.state.lang}
      variant="outlined"
      onChange={(e) =>
        lang?.dispatch({
          type: "change",
          payload: (e.target.value as string) === "ja" ? "ja" : "en",
        })
      }
      sx={{
        ml: "auto",
        mr: 0.2,
      }}
    >
      <MenuItem value="en">
        <img src="/flag_us.svg" alt="us" height="15px"></img>
      </MenuItem>
      <MenuItem value="ja">
        <img src="/flag_ja.svg" alt="ja" height="15px"></img>
      </MenuItem>
    </Select>
  );
};

const ToolsMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <NavbarButton color="inherit" onClick={handleClick}>
        Tools
      </NavbarButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>
          <NavbarLink to={`/tool/statementviewer`}>Statement Viewer</NavbarLink>
        </MenuItem>
      </Menu>
    </Box>
  );
};

const UserMenu = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    auth?.dispatch({ type: "logout" });
    handleClose();
  };

  if (!auth || !auth.state.user) {
    return [
      <NavbarButton color="inherit" onClick={() => navigate("/register")}>
        Register
      </NavbarButton>,
      <NavbarButton color="inherit" onClick={() => navigate("/login")}>
        Login
      </NavbarButton>,
    ];
  }
  return [
    <NavbarButton color="inherit" onClick={handleClick}>
      {auth.state.user}
    </NavbarButton>,
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem>
        <NavbarLink to={`/user/${auth.state.user}`}>Profile</NavbarLink>
      </MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>,
  ];
};

const NavBar: React.FC = () => {
  const auth = useContext(AuthContext);

  const userName = auth?.state.user ?? "";
  const userInfoQuery = useUserInfo(userName, {
    enabled: userName !== "",
  });

  const isDeveloper =
    userInfoQuery.isFetched && userInfoQuery.data?.getUser()?.getIsDeveloper();

  let elements: ReactElement[] = [];

  elements.push(
    <Button color="inherit">
      <NavbarLink
        to="/"
        sx={{
          fontSize: "16px",
          fontWeight: "bolder",
        }}
      >
        Library Checker
      </NavbarLink>
    </Button>
  );

  elements.push(
    <Button color="inherit">
      <NavbarLink to="/submissions">Submissions</NavbarLink>
    </Button>
  );

  elements.push(
    <Button color="inherit">
      <NavbarLink to="/ranking">Ranking</NavbarLink>
    </Button>
  );

  elements.push(
    <Button color="inherit">
      <NavbarLink to="/help">Help</NavbarLink>
    </Button>
  );

  if (isDeveloper) {
    elements.push(<ToolsMenu />);
  }

  elements.push(LangSelect());

  elements = elements.concat(UserMenu());

  elements.push(
    <Button
      color="inherit"
      href="https://github.com/yosupo06/library-checker-problems"
      target="_blank"
      rel="noopener"
    >
      <GitHub />
    </Button>
  );

  return (
    <AppBar position="static">
      <Toolbar>{elements}</Toolbar>
    </AppBar>
  );
};

export default NavBar;
