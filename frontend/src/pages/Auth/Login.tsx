import { handleLogin } from "@/api/authAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Login(){

    const navigate = useNavigate();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [account, setAccount] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const timeoutRef = useRef<number | null>(null);

    const setUserData = useUserStore((state) => state.setUserData);


    const {mutate: loginMutation, isPending, isSuccess } = useMutation({
        mutationKey: ["login"],
        mutationFn: handleLogin,
        onSuccess(data) {
            console.log(data);
            toast.success("Successfully Logged In.")
            setUserData({
                id: data.user_id,
                username: data.username,
                email: data.email,
                token: data.token,
                position: data.position,
                role: data.role,
                first_name: data.first_name,
                last_name: data.last_name,
                isLogged: true,
            });
            localStorage.setItem('user-token', data.token)
            navigate(`/dashboard`, { replace: true });
        },
        onError(error) {
            console.log(error);
            
            toast.error("Could not log in.")
        },
    })
    
    const verifyUser = () => {
        
        if (username && password ) {

            loginMutation({username, password})
        }
        else{
            setIsError(true);
            setAccount(false);
        }
    }


    const handleClick = () => {
        // clear previous timeout if any
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        console.log("Hey");
        
        timeoutRef.current = setTimeout(verifyUser, 1000);
    };

    // cleanup on unmount
    useEffect(() => {
        return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);


    return (
        <div className="h-screen w-full bg-primary2 ">
            <div className="h-screen w-full dark:bg-slate-950 dark:bg-grid-white/[0.0] relative flex items-center justify-center">
                
                <div
                    className={cn(
                    "absolute inset-0",
                    "bg-size-[20px_20px]",
                    "bg-[radial-gradient(#d4d4d4_1px,transparent_1px)]",
                    "dark:bg-[radial-gradient(#111B45_1px,transparent_1px)]",
                    )}
                />
                {/* Radial gradient */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background mask-[radial-gradient(ellipse_at_center,transparent_0%,black)] dark:bg-background"></div>

                <div className="p-5 border mt-10 border-border dark:border-border rounded-lg bg-background dark:bg-background md:min-w-96 mx-10 z-40">
                    <div>
                        <h1 className="font-bold text-4xl">Login</h1>
                        <h1 className="max-md:text-sm my-4 text-muted-foreground">Enter your credentials to access your account</h1>
                        {/* <h1 className="max-md:text-sm">Don't have an account? <Button variant={'link'} className="p-0"><Link to={`/signup`}>Sign Up</Link></Button></h1> */}
                    </div>
                    <div className="mt-4 mb-2">
                        <form method="post" className="">
                            <div className="">
                                {/* <label htmlFor="email" className="my-3 pb-3 font-bold text-lg">Email</label> */}
                                <Input className={` ` + ( !account && !username ? `border-red-700 dark:border-red-500` : null )} placeholder="Username" type="text" id="username" required name="username" value={username} onChange={(e) => (setUsername(e.target.value))} />
                            </div>
                            <div className="pt-5">
                                {/* <label htmlFor="password" className="my-3 pb-3 font-bold text-lg">Password</label> */}
                                <Input className={` ` + ( !account && !password ? `border-red-700 dark:border-red-500` : null )} placeholder="Password" type="password" id="password" required name="password" value={password} onChange={(e) => (setPassword(e.target.value))} />
                                {/* <span className="w-full flex justify-end">
                                    <Link to={`/forgot-password`} className="w-fit"><p className=" text-gray-500 max-md:text-sm">Forgot your password?</p></Link>
                                </span> */}
                            </div>
                            <div className={`text-red-700 dark:text-red-500 p-1 text-sm rounded-lg mt-4 text-center ` + ( !isError ? `hidden` : null )} >
                                <h5 className="">We couldn't find an account with those credentials.</h5>
                            </div>
                            <div className="">
                                <Button onClick={handleClick} disabled={isPending ? true : false} type="button" className={`w-full mt-6 text-white ` + (isSuccess ? ` bg-green-700` : ``)}>{!isSuccess ? "Login" : "Successful Login"}</Button>
                            </div>
                        </form>
                    </div>
                    <div className="mt-5">
                        <h1 className="max-md:text-sm text-muted-foreground"><strong>Username:</strong> demo</h1>
                        <h1 className="max-md:text-sm text-muted-foreground"><strong>Password:</strong> demo12345</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}