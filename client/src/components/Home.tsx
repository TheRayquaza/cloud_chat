import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { GridItem, Button, Container, Flex } from '@chakra-ui/react';
import { Text } from '@chakra-ui/layout';

import { InfoIcon, SettingsIcon } from '@chakra-ui/icons';
import { Storage } from '@mui/icons-material';

const Home = () => {
    useEffect(() => {
        document.title = 'Home';
    }, []);

    const navigate = useNavigate();

    return (
        <Container py={8}>
            <Text fontSize="3xl" variant="h2" align="center" color="primary" mb={6}>
                Welcome to Loqui Chat
            </Text>
            <br/>
            <br/>
            <Flex direction="row" gap={2} justifyContent="center">
                <GridItem>
                    <Button
                        onClick={() => navigate('/about')}
                        variant="outline"
                        size="lg"
                        width="full"
                        colorScheme="blue"
                        leftIcon={<InfoIcon />}
                        mb={2}
                    >
                        Learn more
                    </Button>
                </GridItem>
                <GridItem>
                    <Button
                        onClick={() => window.location.assign('https://doc.loqui-chat.xyz')}
                        variant="outline"
                        size="lg"
                        width="full"
                        colorScheme="green"
                        leftIcon={<SettingsIcon />}
                        mb={2}
                    >
                        API documentation
                    </Button>
                </GridItem>
                <GridItem>
                    <Button
                        onClick={() => navigate('/db')}
                        variant="outline"
                        size="lg"
                        width="full"
                        colorScheme="yellow"
                        leftIcon={<Storage />}
                    >
                        Database design
                    </Button>
                </GridItem>
            </Flex>
        </Container>
    );
};

export default Home;