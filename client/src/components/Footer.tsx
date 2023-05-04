import { Container, Grid, Typography } from '@mui/material'

function Footer (): JSX.Element {
  return (
        <Container maxWidth="xl">
            <Grid container justifyContent="center">
                <Grid item>
                    <Typography variant="body2" color="textSecondary" align="center">
                        © Mateo LELONG - 34732205
                    </Typography>
                </Grid>
            </Grid>
        </Container>
  )
}

export default Footer
