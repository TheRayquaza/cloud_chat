import {Button} from "@mui/material";

const Logout = () => {

    const handleLogout = () => {
        localStorage.removeItem("id");
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("logged_in");
        document.location.assign("/");
    };

    return (
        <div style={{display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"}}>
            <h1>Logout Page</h1>
            <Button
                variant="contained"
                color="primary"
                onClick={handleLogout}
            >
                Logout
            </Button>
        </div>
    );
};

export default Logout;