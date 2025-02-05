import React from 'react'

const ErrorCarregamento = ({error}) => {
    return (
        <p className="absolute right-0 left-0  top-[50%] -translate-y-[50%] text-center py-8 text-red-500">{error}</p>
    )
}

export default ErrorCarregamento