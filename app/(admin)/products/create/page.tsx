"use client"

import ProductForm from '@/app/components/ProductForm'
import React from 'react'

export default function Create() {
  return (
    <div>
      <ProductForm onSubmit={(values) =>{
        console.log(values)
      }}/>
    </div>
  )
}
