// src/components/PrivateRoute.jsx
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute
