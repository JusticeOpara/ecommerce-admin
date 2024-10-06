import React from 'react'

export default function AuthLayout ({ childern }: {childern : React.ReactNode}) {
  return (
    <div className=' w-full h-full flex items-center justify-center'>
        {childern}
        </div>
  )
}
