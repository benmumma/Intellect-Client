import { AiOutlineReload, AiOutlineSetting } from "react-icons/ai";
import { FaFileExport, FaHome, FaSort, FaShareAlt, FaEdit } from "react-icons/fa";
import { GoPin } from "react-icons/go";
import { MdAddCircle, MdGroup } from "react-icons/md";


const icons = {
    'home':<FaHome />,
    'pin':<GoPin />,
    'edit':<FaEdit />,
    'settings':<AiOutlineSetting />,
    'organize':<FaSort />,
    'create':<MdAddCircle />,
    'share':<FaShareAlt />,
    'shared':<MdGroup />,
    'refresh':<AiOutlineReload />,
    'export':<FaFileExport />,

}

const test = 1;

export default {
    icons,
    test,
  }