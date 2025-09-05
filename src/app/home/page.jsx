import React, { Suspense } from 'react'
import Home from '@/components/home/home.jsx'
const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <Home />
    </Suspense>
  )
}

export default page