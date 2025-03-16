import { useState } from "react";
import { BottomWarning } from "../components/BootomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import InputBox from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signup() {

    const [email, setEmail] = useState("");
    const [firstName, setFirstname] = useState("");
    const [lastName, setLastname] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign Up"} />
                <SubHeading label={"Enter your information to create an account"} />
                <InputBox onChange={(e) => setFirstname(e.target.value)} placeholder={"John"} label={"First name"} />
                <InputBox onChange={(e) => setLastname(e.target.value)} placeholder={"Doe"} label={"Last name"} />
                <InputBox onChange={(e) => setEmail(e.target.value)} placeholder={"anygmail@gmail.com"} label={"Email"} />
                <InputBox onChange={(e) => setPassword(e.target.value)} placeholder={"123456"} label={"Password"} />
                <div>
                    <Button onClick={async () => {
                        const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                            email,
                            firstName,
                            lastName,
                            password
                        })
                        localStorage.setItem("token", response.data.token);
                        navigate("/dashboard")
                    }} label={"Sign up"} />
                </div>
                <BottomWarning label={"Already have an account"} buttonText={"Sign in"} to={"/signin"} />
            </div>
        </div>
    </div>
}