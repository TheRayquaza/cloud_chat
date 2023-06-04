import { Box, Heading } from '@chakra-ui/react';

const Db = () => {
    return (
        <Box>
            <Heading as="h1" size="xl">Db design</Heading>
            <Box mt={4}>
                <img src="/assets/db_design.png" alt="Database Design" />
            </Box>
        </Box>
    );
};

export default Db;