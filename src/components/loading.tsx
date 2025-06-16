import { Loader } from 'lucide-react'
import React from 'react'

function Loading() {
    return (
        <div className='min-h-screen flex justify-center items-center flex-grow-1 w-full min-w-screen'>
            <Loader className='animate-spin w-10 h-10' />
        </div>
    )
}

export default Loading
