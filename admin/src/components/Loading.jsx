import React from 'react'

const Loading = () => {
    return (
        <div className="absolute right-0 left-0  top-[50%] -translate-y-[50%] text-center">
            <div className="loading flex items-center justify-center">
                <span>F</span>
                <span>J</span>
                <span>U</span>
            </div>
            <div className="carregando">Carregando...</div> 
        </div>
    )
}

export default Loading