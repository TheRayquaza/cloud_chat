import { useEffect } from 'react';
import { Text, List, ListItem, Link, Button, Grid, GridItem } from '@chakra-ui/react';
import { InfoIcon, SettingsIcon, ExternalLinkIcon, DownloadIcon } from '@chakra-ui/icons';

const About = () => {
    useEffect(() => {
        document.title = 'About';
    }, []);

    return (
        <Grid justifyContent="center" gap={8} padding={8}>
            <GridItem>
                <Text variant="h4" fontSize="3xl" textAlign="left" ml="15%" mb={4}>
                    <InfoIcon boxSize={6} color="blue.500" /> What is the project about?
                </Text>
                <Text variant="body" fontSize="xl" textAlign="left" ml="15%" mb={4}>
                    The goal of the project is to create an online chat that can bring students from Murdoch University together.
                    <br />
                    <br />
                    Since many students from Murdoch are studying abroad, I wanted to create a chat platform focused on sharing languages and cultures within our campus. This chat will help people learn new languages, share their own cultures, and make new friends.
                    <br />
                    <br />
                    The main functionalities of this chat include creating an account, registering for courses, selecting a native language, adding friends based on shared units, and engaging in chat conversations.
                    <br />
                    <br />
                    Additional functionalities such as group chats, document sharing, and calling will be added in the future.
                </Text>
                <Button
                    variant="outline"
                    colorScheme="blue"
                    leftIcon={<ExternalLinkIcon boxSize={4} />}
                    as={Link}
                    href="https://www.github.com/TheRayquaza/loqui_chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    mb={4}
                    ml="15%"
                >
                    See on GitHub
                </Button>

                <Text variant="h4" fontSize="3xl" textAlign="left" ml="15%" mb={4}>
                    <SettingsIcon boxSize={6} color="blue.500" /> Tech used
                </Text>
                <List spacing={4} mb={4} ml="15%">
                    <ListItem display="flex" alignItems="center">
                        <img
                            src="../../assets/node-js.png"
                            alt=""
                            style={{ width: '30px', height: '24px', marginRight: '8px' }}
                        />
                        <Text fontSize="xl">Node JS with Express and Websockets for the server-side</Text>
                    </ListItem>
                    <ListItem display="flex" alignItems="center">
                        <img
                            src="../../assets/react.png"
                            alt=""
                            style={{ width: '30px', height: '24px', marginRight: '8px' }}
                        />
                        <Text fontSize="xl">React app using Vite and Chakra UI for the client-side</Text>
                    </ListItem>
                    <ListItem display="flex" alignItems="center">
                        <img
                            src="../../assets/mariadb.png"
                            alt=""
                            style={{ width: '30px', height: '24px', marginRight: '8px' }}
                        />
                        <Text fontSize="xl">MariaDB for the database</Text>
                    </ListItem>
                    <ListItem display="flex" alignItems="center">
                        <img
                            src="../../assets/ec2.png"
                            alt=""
                            style={{ width: '30px', height: '24px', marginRight: '8px' }}
                        />
                        <Text fontSize="xl">Hosted by an AWS instance (EC2 Amazon)</Text>
                    </ListItem>
                </List>

                <Text variant="h4" fontSize="3xl" textAlign="left" ml="15%" mb={4}>
                    My learning outcomes
                </Text>
                <List spacing={4} mb={4} ml="15%">
                    <ListItem>
                        <Text fontSize="xl">- Learn how to use React for the client-side</Text>
                    </ListItem>
                    <ListItem>
                        <Text fontSize="xl">- Learn how to use Websockets for real-time web applications</Text>
                    </ListItem>
                    <ListItem>
                        <Text fontSize="xl">- Learn how to use MariaDB</Text>
                    </ListItem>
                    <ListItem>
                        <Text fontSize="xl">- Learn how to host a web application on a cloud instance</Text>
                    </ListItem>
                </List>

                <Text variant="h4" fontWeight="light" fontSize="3xl" textAlign="left" ml="15%" mb={4}>
                    <ExternalLinkIcon boxSize={6} color="blue.500" /> The license of the project
                </Text>
                <Text variant="body" fontSize="xl" textAlign="left" ml="15%" mb={4}>
                    I opted for the GPL license for my project, which is hosted on GitHub with public access to ensure it remains open source.
                    <br />
                    <br />
                    The GPL license prohibits cloning the project and applying a new license. It requires that any forks must be released under the same GPL license. This guarantees that any modifications made to my project will remain open source.
                    <br />
                    <br />
                    Additionally, the GPL license facilitates collaboration and accelerates the project's development.
                    <br />
                    <br />
                    By choosing the GPL license, I wanted to ensure that my project is protected, remains open source, and is well-positioned for future growth.
                </Text>
                <Link
                    href="https://www.gnu.org/licenses/gpl-3.0.en.html"
                    textDecoration="none"
                    isExternal
                    ml="15%"
                >
                    <Button variant="outline" size="lg" leftIcon={<DownloadIcon boxSize={4} />}>
                        Learn more about GPL
                    </Button>
                </Link>
            </GridItem>
        </Grid>
    );
};

export default About;
