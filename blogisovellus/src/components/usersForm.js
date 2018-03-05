import React from 'react'

const UsersForm=({users})=>{
    return (
        <div>
            <table>
            {users.map(u=>
            <tr>
                <td>
                    {u.name}
                    </td>
                    <td>
                        {u.blogs.length}
                        </td>
            </tr>
            )}
            </table>
        </div>
    )
}
export default UsersForm