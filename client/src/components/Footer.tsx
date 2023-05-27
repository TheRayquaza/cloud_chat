import { Grid, Text, Container } from '@chakra-ui/react';

const Footer = () => {
    return (
        <Container mt="auto">
            <Grid justifyContent="center">
                <Text variant="body2" color="gray.500" align="center">
                    © Mateo LELONG - 34732205
                </Text>
            </Grid>
        </Container>
    );
};

export default Footer;
