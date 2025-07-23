import { useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import useOnClickOutside from "../../../hooks/useOnClickOutside"
import { logout } from "../../../services/operations/authAPI"

export default function ProfileDropdown({setMobileMenuOpen}) {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useOnClickOutside(ref, () => setOpen(false))

  if (!user) return null

  return (
    <div className="relative z-[1000]" ref={ref}>

      <button
        className="flex items-center gap-x-1"
        onClick={() => setOpen((prev) => !prev)}
      >
        <img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[30px] rounded-full object-cover"
        />
        <AiOutlineCaretDown className="text-sm text-richblack-100" />
      </button>

      {/* Dashboard and LogOut give */}
      {open && (
        <div
          className="absolute lg:right-0 top-full mt-2 w-[180px] flex flex-col rounded-md border border-richblack-700 bg-richblack-800 shadow-lg"
        >
          {/* Dashboard Option  */}
          <Link
            to="/dashboard/my-profile"
            onClick={() => {
              setOpen(false);
              setMobileMenuOpen(false);
            }}
            className="flex w-full items-center gap-x-1 px-4 py-2 text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
          >
            <VscDashboard className="text-lg" />
            Dashboard
          </Link>

          {/* Lagout option  */}
          <div
            onClick={() => {
              dispatch(logout(navigate))
              setOpen(false)
              setMobileMenuOpen(false)
            }}
            className="flex w-full items-center gap-x-1 px-4 py-2 text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25 cursor-pointer"
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>

        </div>
      )}
    </div>
  )
}
