import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Theme, toggleTheme } from '../../../redux/ThemeSlice';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';




const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: 0,
      top: 5,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }));

  interface Navbarprops{
    name:string
  }
const Navbar:React.FC<Navbarprops> = ({name}) => {
    const theme = useSelector(Theme);
    const dispatch = useDispatch();

    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    };

    
function formatDate(date:Date) {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const ordinalSuffix = (n:number) => {
        const s = ["th", "st", "nd", "rd"],
            v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    return `${ordinalSuffix(day)} ${month} ${year}`;
}


  return (
    <div className=" flex flex-row justify-between items-center">
    <div>
        <h1 className='dark:text-white'>
            {name}
        </h1>
        <p className='dark:text-white'>
            {formatDate(new Date())}
        </p>
    </div>
    <div className="flex flex-row dark:text-white">
        
        <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" className="sr-only peer" checked={theme === 'dark'} onChange={handleToggleTheme}/>
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Dark Mode</span>
        </label>


        <IconButton aria-label="cart">
            <StyledBadge badgeContent={4} color="secondary">
                <NotificationsNoneIcon  fontSize='large' />
            </StyledBadge>
        </IconButton>

        <div className="flex justify-between items-center">
            <img src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png" alt="user image" className="h-10 w-10 rounded-full bg-slate-50 border-2"/>
            <h1>Sai Tharak</h1>
        </div>
    </div>
</div>
  )
}

export default Navbar
