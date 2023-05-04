import { useEffect } from 'react'
import { Grid, Button, Typography, Container } from '@mui/material'
import { Info, Settings, Storage } from '@mui/icons-material'

import Header from './components/Header.tsx'
import Footer from './components/Footer.tsx'

function Home (): JSX.Element {
    useEffect(() => {
        document.title = 'Home - Loqui Chat'
    }, [])

    return (
        <div>
            <Header />

            <main>
                <Container maxWidth="sm">
                    <Typography
                        variant="h2"
                        color="textSecondary"
                        component="h1"
                        gutterBottom
                    >
                        Loqui Chat
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <Button
                                href="/about"
                                variant="contained"
                                color="primary"
                                startIcon={<Info />}
                            >
                                Learn more
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                href="/doc"
                                variant="contained"
                                color="secondary"
                                startIcon={<Settings />}
                            >
                                API documentation
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                href="/db/db.html"
                                variant="contained"
                                startIcon={<Storage />}
                            >
                                Database design
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </main>

            <Footer />
        </div>
    )
}

export default Home;