import React, { memo } from "react"
import { useDrag } from "react-dnd";


const ObstructionContainer = memo(function ObstructionContainer({ type, isDropped, id }) {
    const [collected, drag] = useDrag(() => ({
        type,
        canDrag: !isDropped,
        item: { id },
    }), [type]);
    return (<div ref={drag} role="Box" style={{ opacity: isDropped ? .4 : 1   }} className='black-box'>
			{/* {isDropped ? <s>{id}</s> : id} */}
		</div>);
});



export default ObstructionContainer;