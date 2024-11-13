import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTheme } from "@/components/theme-provider"
import { handleLoginSubmit } from './loginHandler';
import { Button } from "@/components/ui/button";
import LoginbgLight from "../../../assets/loginbglight.jpg";
import LoginbgDark from "../../../assets/loginbgdark.jpg";
import { Input } from '@/components/ui/input';
import logo from "../../../assets/logo.png";
import { Moon, Sun } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import Laugh from "../../../assets/laugh.gif"


const LoginPage = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [formState, setFormState] = useState('login'); // 'login', 'signup', 'forgot'
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [loginData, setLoginData] = useState({ userName: '', password: '' });
  const [signupData, setSignupData] = useState({ userName: '', secretKey: '', fullName: '', password: '' });
  const [forgotData, setForgotData] = useState({ email: '' });

  const toggleForm = (state) => {
    setFormState(state);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const receivedData = await handleLoginSubmit(loginData);
      const activeTabsObject = {
        Task: { StatusId: [2], activeDivId: 1 },
        Activity: { StatusId: [2], activeDivId: 1 },
        Document: { StatusId: 1, activeDivId: 1 },
        Template: { StatusId: 1, activeDivId: 1 },
      };
      const activeTabsString = JSON.stringify(activeTabsObject);
      localStorage.setItem('activeTabs', activeTabsString);
      const CheckBoxusers = { Users: [receivedData.loginDetails.UserId] };
      localStorage.setItem("Users", JSON.stringify(CheckBoxusers));
      const company = { Company: [] };
      localStorage.setItem("Company", JSON.stringify(company));
      const TaskType = { TaskType: [] };
      localStorage.setItem("TaskType", JSON.stringify(TaskType));
      sessionStorage.setItem("UserData", JSON.stringify(receivedData))
      if (receivedData) {
        navigate("/dashboard/home")
      }
    } catch (error) {
      console.error("Error in login process:", error);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });
      if (response.ok) {
        console.log('Signup successful');
        setSignupData({ userName: '', secretKey: '', fullName: '', password: '' });
        setFormState('login');
      } else {
        const errorData = await response.json();
        console.error('Signup error:', errorData);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block w-2/5 bg-neutral-900 text-white relative p-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${theme === 'dark' ? LoginbgDark : LoginbgLight})` }}>
        <div className="absolute top-0 left-0 p-6 flex gap-3 justify-center align-items-center">
          <img src={logo} alt='logo' className='size-10' /><h1 className="text-4xl font-bold text-gray-100 dark:text-white">COSEC</h1>
        </div>

        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-4xl font-bold text-neutral-800 dark:text-white">From Tasks to Triumphs, Flawlessly!</h1>
          <p className="mt-1 text-neutral-800 dark:text-white">Engage with our platform and explore endless possibilities.</p>
        </div>
      </div>

      <div className="w-full md:w-3/5 flex flex-col justify-center p-10 relative rounded-lg">
        <div className="absolute top-4 right-4 text-neutral-500 font-normal">
          <Popover>
            <PopoverTrigger className="text-sm"> Having Trouble? <a href="" className="text-sm text-blue-400 hover:underline font-bold">Get Help</a> </PopoverTrigger>
            <PopoverContent className="w-20"> <img src={Laugh} /> </PopoverContent>
          </Popover>
        </div>

        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl  text-center mb-2 font-bold"> {formState === 'forgot' ? "Forgot Password" : formState === 'signup' ? "Create an Account" : "Login to your Account"} </h2>
          <p className="text-sm text-neutral-500 text-center mb-8"> {formState === 'forgot' ? "Oops, things happen! Don’t worry, we’ll help you sort it out." : formState === 'signup' ? "You think too much, Hurry Up!!, Welcome aboard." : "Save time and login quickly!"}</p>
          <form onSubmit={formState === 'login' ? handleLogin : formState === 'signup' ? handleSignupSubmit : handleForgotSubmit}>
            {formState === 'login' ? (
              <>
                <div className="mb-4">
                  <label htmlFor="userName" className="block mb-1 text-sm font-medium ">UserName</label>
                  <Input type="text" id="userName" className="w-full" placeholder="Enter your userName" value={loginData.userName} onChange={(e) => setLoginData({ ...loginData, userName: e.target.value })} />
                </div>

                <div className="mb-4 relative">
                  <label htmlFor="password" className="block mb-1 text-sm font-medium ">Password</label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} id="password" className="w-full" placeholder="Enter your password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-neutral-500" onClick={togglePasswordVisibility} >
                      {showPassword ? "🙈" : "🙉"}
                    </span>
                  </div>
                </div>
                <Button className="w-full  py-2 rounded-lg" type="submit">Sign In</Button>
                <div className="mt-4 text-center">
                  <button className="text-sm hover:underline" onClick={() => toggleForm('forgot')}>
                    Forgot Password?
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <button className="text-sm hover:underline" onClick={() => toggleForm('signup')}>
                    Don't have an account? Sign Up
                  </button>
                </div>
              </>
            ) : formState === 'signup' ? (
              <>
                <div className="mb-4 relative">
                  <label htmlFor="secretKey" className="block mb-1 text-sm font-medium text-neutral-900">Secret Key</label>
                  <div className="flex items-center">
                    <Input type="text" id="secretKey" className="w-full pr-10" placeholder="Enter the API key" value={signupData.secretKey} onChange={(e) => setSignupData({ ...signupData, secretKey: e.target.value })} />
                    <span className="absolute right-3 top-10 transform -translate-y-1/2 cursor-pointer text-neutral-500">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-neutral-500 cursor-pointer ml-2">
                              ❕
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p >API key will be provided by your organization Admin</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="fullName" className="block mb-1 text-sm font-medium text-neutral-900">Full Name</label>
                  <Input type="text" id="fullName" className="w-full" placeholder="Enter your full name" value={signupData.fullName} onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })} />
                </div>

                <div className="mb-4">
                  <label htmlFor="userName" className="block mb-1 text-sm font-medium text-neutral-900">UserName</label>
                  <Input type="text" id="userName" className="w-full" placeholder="Enter your userName" value={signupData.userName} onChange={(e) => setSignupData({ ...signupData, userName: e.target.value })} />
                </div>

                {/* Password */}
                <div className="mb-4 relative">
                  <label htmlFor="password" className="block mb-1 text-sm font-medium text-neutral-900">Password</label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} id="password" className="w-full" placeholder="Enter your password" value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-neutral-500" onClick={togglePasswordVisibility}>
                      {showPassword ? "🙈" : "🙉"}
                    </span>
                  </div>
                </div>

                <Button className="w-full bg-neutral-900 text-white py-2 rounded-lg" type="submit">Sign Up</Button>
                <div className="mt-4 text-center">
                  <button className="text-sm text-neutral-900 hover:underline" onClick={() => toggleForm('login')}>
                    Back to Login
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="email" className="block mb-1 text-sm font-medium text-neutral-900">Email</label>
                  <Input type="email" id="email" className="w-full" placeholder="Enter your email" value={forgotData.email} onChange={(e) => setForgotData({ ...forgotData, email: e.target.value })} />
                </div>
                <Button className="w-full bg-neutral-900 text-white py-2 rounded-lg" type="submit">Change Password</Button>
                <div className="mt-4 text-center">
                  <button className="text-sm text-neutral-900 hover:underline" onClick={() => toggleForm('login')}>
                    Back to Login
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-neutral-500">
          <p>&copy; 2024 Ezeelink. All rights reserved.</p>
          <p>
            <a href="#" className="hover:underline">Terms & Conditions</a> |
            <a href="#" className="hover:underline ml-2">Privacy Policy</a>
          </p>
        </div>

        <div className='absolute bottom-2 right-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
