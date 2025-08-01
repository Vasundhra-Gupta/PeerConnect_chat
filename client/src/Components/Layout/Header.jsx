import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Button, Logout } from '@/Components';
import { useUserContext, useSideBarContext, useSearchContext } from '@/Context';
import { IMAGES } from '@/Constants/constants';
import { icons } from '@/Assets/icons';

export default function Header() {
    const { user } = useUserContext();
    const { setShowSideBar } = useSideBarContext();
    const navigate = useNavigate();
    const { search, setSearch } = useSearchContext();

    return (
        <header className="fixed top-0 z-[1] w-full bg-[#f6f6f6] border-b-[0.09rem] border-[#e0e0e0] text-black h-[55px] px-4 font-medium flex items-center justify-between gap-6">
            <div className="flex items-center justify-center gap-4">
                {/* hamburgur menu btn */}
                <Button
                    btnText={
                        <div className="size-[18px] group-hover:fill-[#4977ec] fill-[#2b2b2b]">
                            {icons.hamburgur}
                        </div>
                    }
                    title="Show Sidebar"
                    onClick={() => setShowSideBar((prev) => !prev)}
                    className="lg:hidden group cursor-pointer"
                />

                {/* logo */}
                <Link
                    to={'/'}
                    className="flex items-center justify-center gap-3 font-medium text-[17px]"
                >
                    <div className="overflow-hidden size-[30px]">
                        <img src={IMAGES.logoSvg} alt="peer connect logo" />
                    </div>
                    <div className="hidden sm:block hover:text-[#4977ec] transition-all duration-200">
                        PeerConnect
                    </div>
                </Link>
            </div>

            {/* search bar */}
            <div className="relative group w-[50%] max-w-[600px]">
                <input
                    type="text"
                    placeholder="Search here"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="placeholder:text-[14px] font-normal placeholder:text-gray-400 border-gray-200 border-b-[0.15rem] border-[0.06rem] focus:border-b-[#4977ec] w-full indent-9 pr-3 py-1 bg-[#fbfbfb] focus:bg-white rounded-md focus:outline-none"
                />
                <div className="size-[16px] fill-gray-500 group-focus-within:fill-[#4977ec] absolute top-[50%] translate-y-[-50%] left-2">
                    {icons.search}
                </div>

                <Button
                    btnText={
                        <div className="size-[16px] stroke-gray-600">
                            {icons.cross}
                        </div>
                    }
                    title="Close"
                    onClick={() => setSearch('')}
                    className="p-1 rounded-full cursor-pointer bg-transparent hover:bg-gray-100 flex items-center justify-center absolute right-1 top-[50%] translate-y-[-50%]"
                />
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
                {/* add post btn */}
                <NavLink
                    to={'/add'}
                    className={({ isActive }) =>
                        `${isActive ? 'text-[#4977ec] fill-[#4977ec]' : 'text-[#2b2b2b] fill-[#2b2b2b]'} flex flex-col w-[60px] cursor-pointer items-center group gap-[2px] justify-center`
                    }
                >
                    <Button
                        btnText={
                            <div className="size-3 group-hover:fill-[#4977ec] fill-inherit">
                                {icons.edit}
                            </div>
                        }
                        title="Add Post"
                        className="flex items-center justify-center group"
                    />
                    <p className="text-xs group-hover:text-[#4977ec] font-normal">
                        Compose
                    </p>
                </NavLink>

                {/* projects btn */}
                <NavLink
                    to={'/projects'}
                    className={({ isActive }) =>
                        `${isActive ? 'text-[#4977ec] fill-[#4977ec]' : 'text-[#2b2b2b] fill-[#2b2b2b]'} flex-col w-[60px] hidden sm:flex cursor-pointer items-center group gap-[2px] justify-center`
                    }
                >
                    <Button
                        btnText={
                            <div className="size-3 group-hover:fill-[#4977ec] fill-inherit">
                                {icons.projects}
                            </div>
                        }
                        title="Add Post"
                        className="flex items-center justify-center"
                    />
                    <p className="text-xs group-hover:text-[#4977ec] font-normal">
                        Projects
                    </p>
                </NavLink>

                {/* chats btn */}
                <NavLink
                    to={'/chat'}
                    className={({ isActive }) =>
                        `${isActive ? 'text-[#4977ec] fill-[#4977ec]' : 'text-[#2b2b2b] fill-[#2b2b2b]'} flex-col w-[60px] hidden sm:flex cursor-pointer items-center group gap-[2px] justify-center`
                    }
                >
                    <Button
                        btnText={
                            <div className="size-[14px] group-hover:fill-[#4977ec] fill-[#2b2b2b]">
                                {icons.chat}
                            </div>
                        }
                        title="Messaging"
                        className="flex items-center justify-center group"
                    />
                    <p className="text-xs group-hover:text-[#4977ec] font-normal">
                        Messaging
                    </p>
                </NavLink>

                {/* login/logout btn */}
                <div className="hidden lg:flex ml-2">
                    {user ? (
                        <div className="w-full h-full py-3 flex items-center justify-end gap-5">
                            <Logout />

                            <Link to={`/channel/${user?.user_id}`}>
                                <div className="size-[34px] rounded-full overflow-hidden">
                                    <img
                                        src={user?.user_avatar}
                                        alt="user avatar"
                                        className="size-full object-cover border-[0.09rem] border-[#e0e0e0] hover:brightness-90 rounded-full"
                                    />
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <Button
                            onClick={() => navigate('/login')}
                            btnText="Login"
                            title="Login"
                            defaultStyles={true}
                            className="w-[75px] h-[32px] text-white text-[15px]"
                        />
                    )}
                </div>
            </div>
        </header>
    );
}
