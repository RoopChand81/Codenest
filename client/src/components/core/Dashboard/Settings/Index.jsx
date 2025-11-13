import ChangeProfilePicture from "./ChangeProfilePicture"
import DeleteAccount from "./DeleteAccount"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"

const Index=()=> {
  
  return (
    <div className='w-11/12 flex  flex-col py-10'>
      <div className='py-10'>
            <h1 className="mb-14 text-3xl font-medium text-richblack-5">
            Edit Profile
            </h1>
            {/* Change Profile Picture */}
            <ChangeProfilePicture />
            {/* Profile */}
            <EditProfile />
            {/* Password */}
            <UpdatePassword />
            {/* Delete Account */}
            <DeleteAccount />
      </div>
    </div>
  )
}

export default Index;