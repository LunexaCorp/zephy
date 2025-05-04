import React from 'react'

export const DataItem = ({ label, value }) => {
  return (
    <>
      <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </>
  )
}
