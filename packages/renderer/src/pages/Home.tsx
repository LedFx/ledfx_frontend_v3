import styles from '@/styles/app.module.scss'
import { Button, TextField , Stack, Typography } from '@mui/material'
import { useStore } from '../store/useStore'
import pkg from '../../../../package.json'
import Box from '@mui/material/Box'
import { Link as RouterLink } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

const ipcRenderer = window.ipcRenderer || false

const Home = () => {
  // @not_matt 
  // - `text` is a local state
  // - only available inside this component
  // - it is not persistant
  const [text, setText] = useState('Text')

  const snackbar = useStore((state) => state.ui.snackbar)
  const devices = useStore((state) => state.api.devices)
  const virtuals = useStore((state) => state.api.virtuals)
  const effects = useStore((state) => state.api.effects)
  const connections = useStore((state) => state.api.connections)
  const settings = useStore((state) => state.api.settings)
  const getSettings = useStore((state) => state.api.getSettings)
  const getDevices = useStore((state) => state.api.getDevices)
  const addDevice = useStore((state) => state.api.addDevice)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    enqueueSnackbar(snackbar.message, { variant: snackbar.variant })
  }, [snackbar])

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        overflowX: 'hidden',
      }}
      className={styles.app}>
      <header
        className={styles.appHeader}
        style={{
          minHeight:
            ipcRenderer && pkg.env.VITRON_CUSTOM_TITLEBAR
              ? 'calc(100vh - 30px)'
              : '100vh',
        }}>
        <p>Welcome to LedFx v3</p>
        <Typography>CORE: {`${import.meta.env.VITE_CORE_PROTOCOL || 'http'}://${import.meta.env.VITE_CORE_HOST || 'localhost'}:${import.meta.env.VITE_CORE_PORT || '8080'}`}</Typography>
        <Stack spacing={1}>
          <Button onClick={() => enqueueSnackbar('I love hooks')}>Notification</Button>
          <Button onClick={() => getSettings()}>getSettings</Button>          
          <Button onClick={() => getDevices()}>getDevices</Button>  
          <TextField 
            variant="outlined"
            value={text}
            onChange={(e)=>setText(e.target.value)}
          />        
          <Button onClick={() => addDevice({
              "type": "UDP Stream",
              "base_config": {                
                "name": text, // @not_matt here we are passing the current `text` into the function addDevice
                "pixel_count": 64
              },
              "impl_config": {
                "ip": "192.168.0.69"
              }
            }).then(()=>getDevices())}>addDevice</Button>          
          <Button component={RouterLink} to='/Example' size={'large'}>Basic Examples</Button>
        </Stack>
        <hr />
        {JSON.stringify(devices)}
        <hr />
        {JSON.stringify(virtuals)}
        <hr />
        {JSON.stringify(effects)}
        <hr />
        {JSON.stringify(connections)}
        <hr />
        {JSON.stringify(settings)}
        <hr />
      </header>
    </Box>
  )
}

export default Home
