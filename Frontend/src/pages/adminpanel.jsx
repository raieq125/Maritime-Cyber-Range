import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/Toast'
const adminpanel = () => {

   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(false);
   const navi = useNavigate();
   const showToast = useToast();
   const fetchUsers = async () => {
      try {
         const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/admin/alluser`, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
            credentials: 'include',
         })
         if (!response.ok) {
            showToast('Error Fetching Users', 'error');
            return;
         }
         const data = await response.json();
         setUsers(data.data);
      } catch (error) {
         showToast('Error Fetching Users', 'error');
      }
   };
   const deleteUser = async (userId) => {
      setLoading(true);
      const response  = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/users/admin/user/${userId}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
         },
         credentials: 'include',
      })
      if (!response.ok) {
         setLoading(false);
         showToast('Error Deleting User', 'error');
         return;
      }
      showToast('User Deleted Successfully', 'success');
      setLoading(false);
      fetchUsers();
   
   };
   const handleclick = () => {
      navi('/signup');
   }

   useEffect(() => {
      fetchUsers();

   }, []);

   return (
      <div>
         <script src="https://cdn.tailwindcss.com"></script>
         <link rel="stylesheet" href="https://cdn.tailgrids.com/tailgrids-fallback.css" />
         <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>


         <section className="bg-white py-20 lg:py-[120px]">
            <h3 className='text-center text-4xl mb-10' style={{ color: '#034587' }}>Admin Panel</h3>
            <div className="container">
               <div className="flex flex-wrap -mx-4">
                  <div className="w-full px-4">
                     <div className="max-w-full overflow-x-auto">
                        {users.length === 0 ? ( <h3 className='text-center text-4xl mb-10' style={{ color: '#034587' }}>No Users Registered Yet</h3>) :
                           (<table className="table-auto w-full">
                              <thead>
                                 <tr className="bg-blue-500 text-center">
                                    <th
                                       className="
                           w-1/6
                           min-w-[160px]
                           text-lg
                           font-semibold
                           text-white
                           py-4
                           lg:py-7
                           px-3
                           lg:px-4
                           border-l border-transparent
                           "
                                    >
                                       ID
                                    </th>
                                    <th
                                       className="
                           w-1/6
                           min-w-[160px]
                           text-lg
                           font-semibold
                           text-white
                           py-4
                           lg:py-7
                           px-3
                           lg:px-4
                           border-l border-transparent
                           "
                                    >
                                       Users
                                    </th>
                                    <th
                                       className="
                           w-1/6
                           min-w-[160px]
                           text-lg
                           font-semibold
                           text-white
                           bg
                           py-4
                           lg:py-7
                           px-3
                           lg:px-4
                           "
                                    >
                                       Score
                                    </th>

                                    <th
                                       className="
                           w-1/6
                           min-w-[160px]
                           text-lg
                           font-semibold
                           text-white
                           py-4
                           lg:py-7
                           px-3
                           lg:px-4
                           "
                                    >
                                       Remove

                                    </th>
                                    <th
                                       className="
                           w-1/6
                           min-w-[160px]
                           text-lg
                           font-semibold
                           text-white
                           py-4
                           lg:py-7
                           px-3
                           lg:px-4
                           "
                                    >
                                       Add_User
                                    </th>


                                 </tr>
                              </thead>
                              <tbody>
                                 {users.map((user, index) => (
                                    <tr key={index}>
                                       <td className="text-center text-dark font-medium text-base py-5 px-2 bg-blue-400 border-b border-l border-[#E8E8E8]">{index+1}</td> {/* Replace 'id' with the actual property name */}
                                       <td className="text-center text-dark font-medium text-base py-5 px-2  bg-white border-b border-l border-[#E8E8E8]">{user.username}</td> {/* Replace 'name' with the actual property name */}
                                       <td className="text-center text-dark font-medium text-base py-5 px-2  bg-white border-b border-l border-[#E8E8E8]">{user.score}</td>
                                       {/* Add more td elements for other properties */}
                                       <td>
                                          <button className="
                              border border-primary
                              py-2
                              px-6
                              inline-block
                              rounded
                              hover:bg-red-700 hover:text-white
                              bg-red-600 text-white
                              " onClick={() => deleteUser(user._id)} disabled={loading}>{loading ? 'Loading...' : 'Delete'}</button> {/* Replace 'id' with the actual property name */}
                                       </td>
                                       <td
                                          className="
                           text-center text-dark
                           font-medium
                           text-base
                           py-5
                           px-2
                           bg-white
                           border-b border-r border-[#E8E8E8]
                           "
                                       >
                                          <button
                                             className="
                              border border-primary
                              py-2
                              px-6
                              text-white
                              inline-block
                              rounded
                              hover:bg-blue-800 hover:text-white
                              bg-blue-700
                              " onClick={handleclick}
                                          >
                                             ADD
                                          </button>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>)}
                     </div>
                  </div>
               </div>
            </div>
         </section>

      </div>
   )
}

export default adminpanel