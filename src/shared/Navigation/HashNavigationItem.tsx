import {FC} from "react";
import { Link } from "react-router-dom";

interface Props{
    href: string;
    name: string;
}

const HashNavigationItem: FC<Props> = ({
    href,
    name
}) => {
    return (
        <li
            className={`menu-item flex-shrink-0 menu-megamenu menu-megamenu--large`}
        >
            <div className="h-20 flex-shrink-0 flex items-center">
                <a
                    className="inline-flex items-center text-sm lg:text-[15px] font-medium text-slate-700 dark:text-slate-300 py-2.5 px-4 xl:px-5 rounded-full hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 "
                    href={href}
                >
                    {name}
                </a>
            </div>

        </li>
    );
}

export default HashNavigationItem;