import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Box } from './components/Box'
import Titlebar from './components/Titlebar';
import { Button } from './components/Button';



function App() {
  const [sinValue, setSinValue] = useState<number>(0);
  const [cosValue, setCosValue] = useState<number>(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const sin = Math.sin(now / 1000); // scale time for smoother wave
      const cos = Math.cos(now / 3000); // scale time for smoother wave

      setSinValue(sin);
      setCosValue(cos)

      frameRef.current = requestAnimationFrame(update);
    };

    frameRef.current = requestAnimationFrame(update);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

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

  return (
    <>
      <h1>Kitchen sink</h1>

      <div>
        <h2>
          Sized boxes
        </h2>
        <Box extraStyles={boxStyle} type='panel-d-1'></Box> <br />
        <Box extraStyles={boxStyle} type='panel-d-2'></Box> <br />
        <Box extraStyles={boxStyle} type='border-groove'></Box> <br />
        <Box extraStyles={boxStyle} type='indent'></Box> <br />
        <Box extraStyles={boxStyle} type='textarea'></Box> <br />
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
      
    </>
  )
}

export default App
