import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LayoutDashboard, LogOut, NotebookPen, User, Users } from 'lucide-react'; // Adjust the import based on your icon location
import { Button } from '../ui/button';
import { useUserStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

const UserDropDown: React.FC = () => {

    const userData = useUserStore((state) => state.userData);
    const setUserData = useUserStore((state) => state.setUserData);
    const navigate = useNavigate();

    // Logout
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant={'ghost'} className='ring-0 border-0 outline-0 cursor-pointer flex items-center'>
                    <User className='size-5' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='border-border'>
                <div className='p-2 gap-y-2'>
                    <h1 className='font-bold'>{userData.username}</h1>
                    <h1 className='text-[13px] text-muted-foreground'>{userData.email}</h1>
                    <h1 className='text-[10px] mt-3 select-none bg-primary/60 px-2 rounded-2xl w-fit'>{userData.position}</h1>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/data-input', {replace: true})}><NotebookPen /> Data-Input</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard', {replace: true})}><LayoutDashboard /> Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/user-management', {replace: true})}><Users /> Users</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {setUserData({...userData, isLogged: false}); navigate('/auth/login', {replace: true})}}><LogOut /> Logout</DropdownMenuItem>
                {/* Add more menu items as needed */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropDown;