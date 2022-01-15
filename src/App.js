import './App.css';
import 'react-rangeslider/lib/index.css'
import React, { useState, useEffect, useCallback } from 'react';
import Slider from 'react-rangeslider';
import GridContainer from './components/GridContainer';
import ObstructionContainer from './components/ObstructionContainer';

function App() {
    const [rows, setRows] = useState(1)
    const [columns, setColumns] = useState(1)
    const [obstructions, setObstructions] = useState(1)
    const [section, setSection] = useState(1)
    const [dustbins, setDustbins] = useState([])
    const [boxes, setBoxes] = useState([])
    const [isSimulate, setIsSimulate] = useState(false)
    const [simmulationStarted, setSimulationStarted] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)

    const getDynamicColumns = (number) => {
        let str = "";
        while (number > 0) {
            str = str + "auto "
            number = number - 1
        }
        return str
    }

    const createGird = () => {
        let tmpArray = {}
        for (let i = 0; i < rows; i++) {
            tmpArray[i] = []
            for (let j = 0; j < columns; j++) {
                tmpArray[i][j] = {
                    accept: "box",
                    value: 1,
                    visited: false
                }
            }
        }
     
        setDustbins(tmpArray)
    }

    const createObstractionGrid = () => {
        let tmpArray = []
        let count = 0
        while (count < obstructions) {
            tmpArray.push({
                type: "box",
                isDropped: false,
                id:count,
                isSelected: false    
            })

            count = count + 1
        }

        setBoxes(tmpArray)
    }


    useEffect(() => {
        if(section > 1){
            createObstractionGrid()
            createGird()
        }
    }, [section])

    const handleDrop = useCallback((row, col, item, value) => {
        if(value == 2){
            return
        }
        const { id } = item;
        let tmp1 = [...boxes]
        tmp1[id].isDropped = true
        setBoxes(tmp1)
        let tmp2 = {...dustbins}
        tmp2[row][col].value = 2
        setDustbins(tmp2)

    }, [boxes,dustbins]);


    const onBackClick = () =>{
        createObstractionGrid()
        createGird()
        setSimulationStarted(false)
        setIsSimulate(false)
        setSelectedIndex(-1)
        setSection(section-1)
    }

    const canSimulationStart = () => {
        let flag = false;
        boxes.map(item=>{
            if(item.isDropped){
                flag  = true
            }
        })
        return flag
    }

    const simulate = (box) => {
        setSimulationStarted(true)
        let row = box[0]
        let col = box[1]
        let tmp = {...dustbins}
        setInterval(() => {
            if(row < rows && col < columns){
                if(tmp[row][col].value !== 3) {
                    if(tmp[row][col].value !== 2){
                        tmp[row][col].value = 3
                            setDustbins(tmp)
                            simulate([row+1,col])
                    }else{
                        if(col > 0 && col-1 >= 0 ){
                                simulate([row-1,col-1])
                        }
                        if(col < tmp[row].length  && col+1 <= tmp[row].length ){
                                simulate([row-1,col+1])
                        }
                    }
                } 
            }else{
                clearInterval()
            }
        }, 1000)
        
    }

    console.log("x")

    return (
        <div className="App">
            <div className='container'>
                {section === 1 &&
                    <div className='row section'>
                        <div className='col-6'>
                            <div className='gridContainer p-5'>
                                <h1>Waterflow Simulator</h1>
                                <h5>Grid Creation</h5>
                                <br />
                                <div className='row'>
                                    <div className='col-12'>
                                        <div className='slider'>
                                            <h6>Number of rows</h6>
                                            <Slider
                                                min={1}
                                                max={10}
                                                value={rows}
                                                onChange={(value) => { setRows(value) }}
                                            />
                                            <div className='value'>{rows}</div>
                                        </div>
                                    </div>
                                    <div className='col-12'>
                                        <div className='slider'>
                                            <h6>Number of columns</h6>
                                            <Slider
                                                min={1}
                                                max={10}
                                                value={columns}
                                                onChange={(value) => { setColumns(value) }}
                                            />
                                            <div className='value'>{columns}</div>
                                        </div>
                                    </div>
                                    <div className='col-12'>
                                        <div className='slider'>
                                            <h6>Number of obstructions</h6>
                                            <Slider
                                                min={1}
                                                max={10}
                                                value={obstructions}
                                                onChange={(value) => { setObstructions(value) }}
                                            />
                                            <div className='value'>{obstructions}</div>
                                        </div>
                                    </div>
                                    <div className='col-12'>
                                        <div className='slider'>
                                            <button className='primary' onClick={() => { setSection(section + 1) }}>Next</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                {
                    section === 2 &&
                    <div className='row section justify-content-center'>
                        <div className='col-10'>
                            <div className='gridContainer p-5'>
                                <h1>Waterflow Simulator</h1>
                                <br />
                                
                                    {
                                    !isSimulate
                                        ?
                                    <h5>{"Drag the obstractions and plcae it inside the grid."}</h5>
                                        :
                                    isSimulate && !simmulationStarted 
                                        ?
                                    <h5>{"Select the waterflow start point by clicking on any of the blue boxes."}</h5>
                                        :
                                    <>{""}</>
                                    }
                                <br />
                                <div className='row'>
                                    <div className='col-8 d-flex align-items-end'>
                               
                                    {
                                        isSimulate
                                        &&
                                        <div className='white-box-container' style={{ gridTemplateColumns: getDynamicColumns(columns) }}>
                                            {
                                                [...Array(columns).keys()].map((item,index)=>{
                                                    if(selectedIndex >= 0){
                                                        return(
                                                            <div 
                                                                key={index} 
                                                                disabled={simmulationStarted}
                                                                onClick={()=>{
                                                                    selectedIndex === index ? simulate([0,index]):setSelectedIndex(index)
                                                                }}
                                                                className={`blue-box ${ selectedIndex === index   ? 'selectedPoint' : 'unSelectedPoint'}`}
                                                            />
                                                        )
                                                    }else{
                                                        return(
                                                            <div 
                                                                key={index} 
                                                                onClick={()=>{setSelectedIndex(index)}}
                                                                className={'blue-box'}
                                                            />
                                                        )

                                                    }
                                                })
                                            }
                                        </div>    
                                    }
                                    </div>
                                </div> 
                                <div className='row'>
                                    <div className='col-8'>
                                        <div className='white-box-container' style={{ gridTemplateColumns: getDynamicColumns(columns) }}>
                                            {
                                                Object.keys(dustbins).map((item,row)=>{
                                                    return dustbins[row].map(({ accept,  value},  col) => (
                                                        <GridContainer accept={accept}  value={value} onDrop={(item) => handleDrop(row, col, item, value)} key={row+col} />
                                                    ))
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className='col-4'>
                                        <div className='black-box-container' style={{ gridTemplateColumns: "auto auto" }}>
                                            {
                                                boxes.map(({  type, isDropped , id}, index) => (
                                                    <ObstructionContainer 
                                                        type={type} 
                                                        isDropped={isDropped || simmulationStarted}
                                                        key={index} 
                                                        id={id} 
                                                    />
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    {
                                        !simmulationStarted &&
                                        <div className='col-4 pt-2 justify-conent-between'>
                                            {
                                                !simmulationStarted &&
                                                <button className='primary' onClick={() => {onBackClick() }}>Back</button>
                                            }
                                            &emsp;
                                            {
                                                !isSimulate &&
                                                <button   
                                                    disabled={!canSimulationStart()}
                                                    onClick={() => {setIsSimulate(true)}}
                                                >
                                                    Start Simulation
                                                </button>
                                            }
                                            {
                                                isSimulate && selectedIndex > -1 && !simmulationStarted &&
                                                <button onClick={()=>setSelectedIndex(-1)}>
                                                    Reset
                                                </button>
                                            }
                                        </div> 
                                    }
                                    <div className='col-8'>
                               
                                    {
                                        simmulationStarted
                                        &&
                                        <div className='white-box-container' style={{ gridTemplateColumns: getDynamicColumns(columns) }}>
                                            {
                                                dustbins[rows-1].map(({value},row)=>{
                                                    if(value == 3){
                                                       return <div key={row} className={'selectedPoint result-box'}/>
                                                    }else{
                                                        return <div key={row} className={'unselectedPoint result-box'}/>
                                                    }
                                                    
                                                })
                                            }
                                        </div>    
                                    }
                                    </div>
                                </div>
                               
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default App;
