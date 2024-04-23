import React from 'react';
import { Grid, Typography, Card, Divider } from '@mui/material';
function ReleaseNotesPage() {

    return (
        <Grid sx={{mt:"8%", alignItems:'center', textAlign: { sm: 'left', md: 'center' }}}>
            <Typography variant='h3' fontWeight='bold'>Ananas Code Translator Release Notes</Typography>
        <Card variant='outlined' className='content' sx={{textAlign:'left', padding:'1vw', borderRadius:'.5vw'}}>
            <Typography variant='h4'>April 2024 - Version 1.0</Typography>
            <Divider sx={{borderBottomWidth:'2px', borderColor:'#889194'}} />
            <Typography marginTop='1vw'>This is the first release of the code translation application by our team. We leverage OpenAI GPT 3.5 Turbo model to provide translation service for a variety of different programming languages.</Typography>
        </Card>
        <Card variant='outlined' className='content' sx={{textAlign:'left', padding:'1vw',borderRadius:'.5vw'}}>
            <Typography variant='h4'>Supported Languages</Typography>
            <Divider sx={{borderBottomWidth:'2px', borderColor:'#889194'}} />
            <ul marginTop='1vw'>
                <li><Typography>Python</Typography></li>
                <li><Typography>Java</Typography></li>
                <li><Typography>C++</Typography></li>
                <li><Typography>Ruby</Typography></li>
                <li><Typography>C#</Typography></li>
                <li><Typography>JavaScript</Typography></li>
                <li><Typography>Kotlin</Typography></li>
                <li><Typography>Objective C</Typography></li>
            </ul>
        </Card>
        <Card variant='outlined' className='content' sx={{textAlign:'left', padding:'1vw',borderRadius:'.5vw', marginBottom:'8%'}}>
            <Typography variant='h4'>Highlights</Typography>
            <Divider sx={{borderBottomWidth:'2px', borderColor:'#889194'}} />
            <Typography marginTop='1vw'>For this release, our team has worked on creating the best user experience possible.</Typography>
            <ul marginTop='1vw'>
                <li><Typography>Authentication through Firebase</Typography></li>
                <li><Typography>Connection to Google + Github account </Typography></li>
                <li><Typography>Full account management features - password reset, name change, account deletion </Typography></li>
                <li><Typography>2FA security layer through Firebase</Typography></li>
                <li><Typography>Powered by GPT-3.5 Turbo Model</Typography></li>
                <li><Typography>Full access to translation history</Typography></li>
                <li><Typography>Ability to sort translations chronologically or input/output language</Typography></li>
                <li><Typography>Fast UI optimized for performance</Typography></li>
                <li><Typography>User feedback on per translation basis</Typography></li>
                <li><Typography>Historical user reviews and rating distrubtion</Typography></li>
                <li><Typography>Extensive documentation page + user guide and walkthrough</Typography></li>
            </ul>
        </Card>
        </Grid>
    )

}

export default ReleaseNotesPage;