import SvgColor from 'src/components/svg-color';
import { FaFilePdf } from "react-icons/fa";
import { IoMdChatboxes } from "react-icons/io";
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title : 'pdf bot' , 
    path : '/pdf',
    icon : <FaFilePdf className='w-[25px] h-[25px]'/>,
  },
  {
    title : 'chat with library' , 
    path : '/chat',
    icon : <IoMdChatboxes  className='w-[25px] h-[25px]'/>,
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
  {
    title: 'demo',
    path: '/demo',
    icon: icon('ic_cart'),
  },
];

export default navConfig;
