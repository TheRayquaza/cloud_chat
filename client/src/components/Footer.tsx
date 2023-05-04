import { Grid, Typography, Container } from '@mui/material';

const Footer = (): JSX.Element => {
    return (
        <Container sx={{ mt: 'auto' }}>
            <Grid container justifyContent="center">
                <Grid item>
                    <Typography variant="body2" color="textSecondary" align="center">
                        © Mateo LELONG - 34732205
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Footer;
