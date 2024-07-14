import SvgColor from 'src/components/svg-color';
import { FaFilePdf } from "react-icons/fa";
import { IoMdChatboxes } from "react-icons/io";
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    
    title: 'buy',
    path: '/buy',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
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
];

export default navConfig;
