import React from 'react'


const layout = ({ children }: { children: React.ReactNode }) => {


    return (
        <div className="container mx-auto min-h-screen" >
            {children}
        </div>
    )
}

export default layout