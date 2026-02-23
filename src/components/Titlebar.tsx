import React, { useRef, useEffect, type ReactNode } from "react";
import { drawAngledBayerDitherGradient } from "../helpers/bayerMatrix";
import { Button } from "./Button";
import { Typography } from "./Typography";

interface TitlebarProps {
  children?: ReactNode | ReactNode[]
  title: string
  icon: string
}

function draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
  drawAngledBayerDitherGradient(canvas, canvas.width, canvas.height, '5555ff', '0000aa', 32)

  context.fillStyle = '#555555'
  context.fillRect(0,canvas.height - 2, Math.floor(canvas.width/2)*2, 4)
}

export default function Titlebar(props: TitlebarProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    

    function resizeCanvas() {
      if (!canvas) return;
      if (!context) return;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      draw(canvas, context);
    }

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div>
      <div style={{height: 0, overflow: "visible"}}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "34px", display: "block"}}
        />
      </div>
      <div className="titlebar-content">
        <div className="titlebar-image">
          <img src={props.icon} />
        </div>
        <div className="titlebar-text">
          <Typography shorthand="Bold12" fontShadowColor="black">
            { props.title }
          </Typography>
        </div>
        <Button extraClass="titlebar-button" baseType="panel-d-2">
          <img draggable="false" src="/win-55-ui/window/o.png" />
        </Button>
        <Button extraClass="titlebar-button" baseType="panel-d-2">
          <img draggable="false" src="/win-55-ui/window/_.png" />
        </Button>
        <div style={{width: '2px'}}>{/* Он тут реально! */}</div>
        <Button extraClass="titlebar-button" baseType="panel-d-2">
          <img draggable="false" src="/win-55-ui/window/x.png" />
        </Button>
        <div style={{width: '2px'}}>{/* Он тут реально! */}</div>
      </div>
      
    </div>
  );
}
