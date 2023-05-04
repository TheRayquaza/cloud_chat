import {useEffect} from 'react'
import {Grid, Button, Typography, Container} from '@mui/material'
import {Info, Settings, Storage} from '@mui/icons-material'

function Home(): JSX.Element {
    useEffect(() => {
        document.title = 'Home - Loqui Chat'
    }, [])

    return (
        <Container sx={{py: 8}}>
            <Typography variant="h2" align="center" color="primary" sx={{mb: 6}}>
                Welcome to Loqui Chat
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                    <Button
                        href="/about"
                        variant="contained"
                        size="large"
                        fullWidth
                        color="secondary"
                        startIcon={<Info/>}
                        sx={{mb: 2}}
                    >
                        Learn more
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Button
                        href="/doc"
                        variant="contained"
                        size="large"
                        fullWidth
                        color="primary"
                        startIcon={<Settings/>}
                        sx={{mb: 2}}
                    >
                        API documentation
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Button
                        href="/db/db.html"
                        variant="contained"
                        size="large"
                        fullWidth
                        color="error"
                        startIcon={<Storage/>}
                    >
                        Database design
                    </Button>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Home;
