import { Typography, List, ListItem, ListItemText, Link, Button, Grid, Container } from "@mui/material";

const About = () : JSX.Element => {
    return (
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} md={8}>
                    <Typography variant="h4" component="h2">
                        <i className="fa fa-question-circle"></i> What is the project about ?
                    </Typography>
                    <Typography variant="body1">
                        The goal of the project is to make a chat online that can gather student from Murdoch.
                        <br/><br/>
                        Since a lot of student from Murdoch are abroad, I wanted to create a chat around sharing languages and cultures within our campus.
                        This chat will help people to learn new languages, share their own cultures and make new friends.
                        <br/><br/>
                        The main functionalities of this chat will be simply : to create an account, register the courses you are in, select you native language,
                        add friends based on your units and of course speak in a chat with a friend.
                        <br/><br/>
                        More functionalities will be added such as creating a chat with multiple persons, adding documents in the chat, calling ...
                        <br/>
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        href="https://www.github.com/TheRayquaza/cloud_chat"
                    >
                        See on Github
                    </Button>
                    <br/><br/>

                    <Typography variant="h4" component="h2">
                        <i className="fa fa-flask"></i> Tech used
                    </Typography>
                    <Typography variant="body1">
                        <List>
                            <ListItem>
                                <i className="fab fa-node"></i>
                                <ListItemText primary="Node JS with Express and Websockets for the server side" />
                            </ListItem>
                            <ListItem>
                                <i className="fab fa-html5"></i>
                                <ListItemText primary="React app using Vite and Material-UI for the client side" />
                            </ListItem>
                            <ListItem>
                                <i className="fa fa-database"></i>
                                <ListItemText primary="MariaDB for the database" />
                            </ListItem>
                            <ListItem>
                                <i className="fa fa-cloud"></i>
                                <ListItemText primary="Hosted by an AWS instance (EC2 Amazon)" />
                            </ListItem>
                        </List>
                    </Typography>

                    <Typography variant="h4" component="h2">
                        <i className="fa fa-flask"></i> My learning outcomes
                    </Typography>
                    <Typography variant="body1">
                        <List>
                            <ListItem>
                                <ListItemText primary="Learn how to use React for the client side" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Learn how to use Web sockets for a real time web application" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Learn how to use MariaDB" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Learn how to host a web application on a cloud instance" />
                            </ListItem>
                        </List>
                    </Typography>


                    <Container maxWidth="md">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} lg={6}>
                            <Typography variant="h4" fontWeight="light">
                                The license of the project
                            </Typography>
                            <Typography variant="body1" fontStyle="italic" color="text.secondary" mb={4}>
                                I opted for the GPL license for my project, which is hosted on GitHub with public access to ensure it remains open source. <br /><br />
                                The GPL license does not allowed to clone the project and apply a new license. Indeed, it requires that any forks must be released under the same GPL license. This guarantees that any modifications made to my project will remain open source. <br /><br />
                                Additionally, the GPL license facilitates collaboration and will accelerate my project's development. <br /><br />
                                By choosing the GPL license, I wanted to make sure that my project will be protected, will remain open source, and will stay well-positioned for future growth.
                            </Typography>
                            <Link href="https://www.gnu.org/licenses/gpl-3.0.en.html" underline="none">
                                <Button variant="outlined" sx={{ px: 5, borderRadius: '2rem', textTransform: 'none', boxShadow: 'none' }}>
                                    Learn more about GPL
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                    </Container>
                </Grid>
            </Grid>
    );
}

export default About;