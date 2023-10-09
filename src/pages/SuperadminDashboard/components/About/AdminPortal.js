import React from 'react'
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'

const AdminPortal = () => {
    const [searchParams] = useSearchParams();
  const navigate = useNavigate();
 
  useEffect(() => {
    const currentParams = Object.fromEntries([...searchParams]);
    console.log({ currentParams });
    if(currentParams?.userId&&currentParams?.token ){
       // sessionStorage.setItem('userId',currentParams?.userId)
        sessionStorage.setItem('token', currentParams?.token)
        sessionStorage.setItem('AdminPortal', true)
        sessionStorage.setItem('role', 'admin')
      navigate("/")
    }
    else {
        alert("Something went wrong , Can't open the admin portal!")
        return false
    }
  },[])
  return (
    <div>AdminPortal Openning...</div>
  )
}

export default AdminPortal