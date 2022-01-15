import React, { memo } from "react";
import {  useDrop } from "react-dnd";

export const GridContainer = memo(function GridContainer({ accept,  value, onDrop }) {
    const [collected, drop] = useDrop({
        accept,
        drop:onDrop,
    });
    let style ={
        backgroundColor :  "white"
    }
    if(value ==2) {
        style ={
            backgroundColor : "black"
        }
    }
    if(value ==3) {
        style ={
            backgroundColor : "blue",
         }
    }

    return (<div ref={drop} role="Dustbin" style={style} className='box'></div>);
});


export default GridContainer;