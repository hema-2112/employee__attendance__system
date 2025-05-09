import React from 'react';
import { useAuth } from '../../context/authContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <div className='flex items-center justify-between h-12 bg-purple-800 text-white px-4'>
            <p>Welcome {user.name}</p>
            <button className='px-4 py-1 bg-purple-900 rounded hover:bg-purple-800' onClick={logout}>Logout</button>
        </div>
    );
};

export default Navbar;
