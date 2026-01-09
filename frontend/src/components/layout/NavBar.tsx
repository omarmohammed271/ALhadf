import { ModeToggle } from "../mode-toggle";
import logo from "@/assets/img/Digiations.png"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useResponsiveScalars } from "@/hooks/useResponsiveScalars";
import { LanguageSwitch } from "../ui/LanguageSwitch";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import UserDropDown from "@/components/UserDropDown/UserDropDown";
import { useUserStore } from "@/store/authStore";
import { Notifications } from "../Notifications/Notifications";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUnreadAlertsCount } from "@/api/serviceAPI";


function NavBar(){

    const navigate = useNavigate();
    const location = useLocation();

    const userData = useUserStore((state) => state.userData);
    
    useEffect(() => {
        
        if (userData.isLogged != true) {
            navigate("/auth/login", { replace: true });
        }
        
    }, [navigate]);
    
    return location.pathname.startsWith('/auth') ? <AuthNavBar /> : <BaseNavBar />
}

function BaseNavBar(){

    const { textScalar } = useResponsiveScalars();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const userData = useUserStore((state) => state.userData);
    
    const { data: unreadAlerts, isPending: alertsPending } = useQuery({
        queryKey: ["userAlerts", userData?.id],
        queryFn: getUnreadAlertsCount,
        enabled: !!userData?.id,
    });

    const unreadCount = (unreadAlerts as any)?.count ?? 0;
    

    return(
        <div className="px-3 justify-between z-50 h-fit border-border backdrop-blur-md py-1 flex w-full min-[2000px]:py-px items-center">

            {/* Digiations Logo */}
            <Link to={'/'}>
                <div className="">
                <img
                    src={logo}
                    alt="Digiation"
                    style={{
                    width: `${7 * textScalar}rem`, // logo scales with barScalar
                    }}/>
                </div>
            </Link>

            {/* ----- If there is only procurement dashboard ----- */}
            <div className="text-muted-foreground max-md:hidden font-medium" 
            style={{
                fontSize: `${1 * textScalar}rem`,
                }}>
                {t("dashboards.er")}
            </div>
            

            <div className="flex space-x-4 z-30 items-center">
                {/* <FullscreenToggle /> */}
                {/* <Link to={location.pathname == '/data-input' ? '/dashboard' : '/data-input'}>
                    <h1 className="font-bold text-primary">{location.pathname == '/data-input' ? 'Dashboard' : 'Data Input'}</h1>
                </Link> */}

                <LanguageSwitch />
                <ModeToggle />

                <Link to={`/user-notifications/`}>
                    <Bell className="h-5 w-5" />

                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                    )}
                </Link>
                <UserDropDown />
            </div>

        </div>
    )
}

function AuthNavBar(){

    const { textScalar } = useResponsiveScalars();
    
    return(
        <div className="start-0 inset-0 absolute w-full z-50 py-10 h-fit">
            <div className="justify-between border-border px-20 container backdrop-blur-md py-1 flex mx-auto items-center">

                {/* Digiations Logo */}
                <Link to={'/'}>
                    <div className="">
                    <img
                        src={logo}
                        alt="Digiation"
                        style={{
                        width: `${7 * textScalar}rem`, // logo scales with barScalar
                        }}/>
                    </div>
                </Link>

                <div>
                </div>


                <div className="flex space-x-4 z-30 items-center">
                    {/* <LanguageSwitch /> */}
                    <ModeToggle />
                </div>

            </div>
        </div>
    )
}

export default NavBar