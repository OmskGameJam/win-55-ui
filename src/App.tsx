import './App.css'
import { Box } from './components/Box'
import Titlebar from './components/Titlebar';
import { Button } from './components/Button';
import { BaseDropdown } from './components/BaseDropdown';
import { useSineWave } from './helpers/useSineWave';
import { BaseInput } from './components/BaseInput';
import { useState } from 'react';
import { Typography } from './components/Typography';



function App() {

  const {values} = useSineWave(5)
  
  const boxStyle = {
    width: 2*48+48,
    height: 2*24+48,
    marginBottom: 10,
    marginLeft: 8
  }

  const windowStyle = {
    width: 3*48+160,
    height: 3*24+48,
    marginBottom: 10,
    marginLeft: 8
  }

  const [textInputState, setTextInputState] = useState('oleg')

  return (
    <Typography fontShadowColor='#555'>
      <h1>Kitchen sink</h1>
      <div>
        <h2>The quick brown fox jumps over the lazy dog</h2>
        <h2>ABCDE</h2>
      </div>
      <div>
        <h2>Text input</h2>
        <BaseInput value={textInputState} onChange={setTextInputState} extraStyles={{width: '512px'}}/>
      </div>
      <div>
        <h2>
          Sized boxes
        </h2>
        <Box extraStyles={{...boxStyle, width: 2*48+values[0].cos*30, height: 2*24+values[0].sin*30}} type='panel-d-1'></Box> <br />
        <Box extraStyles={{...boxStyle, width: 2*48+values[1].cos*30, height: 2*24+values[1].sin*30}} type='panel-d-2'></Box> <br />
        <Box extraStyles={{...boxStyle, width: 2*48+values[2].cos*30, height: 2*24+values[2].sin*30}} type='border-groove'></Box> <br />
        <Box extraStyles={{...boxStyle, width: 2*48+values[3].cos*30, height: 2*24+values[3].sin*30}} type='indent'></Box> <br />
        <Box extraStyles={{...boxStyle, width: 2*48+values[4].cos*30, height: 2*24+values[4].sin*30}} type='textarea'></Box> <br />
      </div>

      <div>
        <h2>
          Window
        </h2>
        <Box extraStyles={windowStyle} type='panel-d-2'>
          <Titlebar title='Oleg' icon='/win-55-ui/icons/program.png' />
        </Box>
      </div>
      
      <Button extraStyles={{margin: '8px'}} onClick={() => alert('Click!')}>
        Oleg
      </Button>

      <div>
        <h2>Basic dropdown</h2>
        <div style={{marginLeft: '8px'}}>
          <BaseDropdown 
            trigger={<Button>This is a dropdown</Button>}
            items={[
              <Button>Item 1</Button>,
              <Button>Item 2</Button>,
              <Button>Item 3</Button>,
              <Button>Item 4</Button>,
            ]}
          />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <BaseDropdown 
            trigger={<Button>This is also a dropdown</Button>}
            items={[
              <Button>Item 1</Button>,
              <Button>Item 2</Button>,
              <Button>Item 3</Button>,
              <Button>Item 4</Button>,
            ]}
          />
        </div>
      </div>
    </Typography>
  )
}

export default App
