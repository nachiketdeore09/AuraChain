import React from 'react';
import {Link} from 'react-router-dom';

import { useTranslation } from 'react-i18next';

const DropdownMenu = ({isOpen, toggle}) => {

    const { t } = useTranslation();

    return (
        <div className={isOpen ? 'grid grid-rows-1 text-center items-center bg-white dark:bg-gray-800' : 'hidden'} >
            <div className='flex justify-around mb-3'>
                <div className='flex flex-col'>
                    <Link className="p-2 text-gray-800 hover:text-orange dark:text-gray-200" to='/activities'>{t('Navbar.Articles')}</Link>
                    <Link className="p-2 text-gray-800 hover:text-orange dark:text-gray-200" to='/workshop'>{t('Navbar.Meditation')}</Link>
                </div>

            </div>   
        </div>
    )
}

export default DropdownMenu
