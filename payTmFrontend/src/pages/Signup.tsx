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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        // Basic validation
        if (!email || !firstName || !lastName || !password) {
            setError("All fields are required");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                email,
                firstName,
                lastName,
                password,
            });

            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");

        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Something went wrong");
            } else {
                setError("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label="Sign Up" />
                    <SubHeading label="Enter your information to create an account" />

                    <InputBox onChange={(e) => setFirstname(e.target.value)} placeholder="John" label="First name" />
                    <InputBox onChange={(e) => setLastname(e.target.value)} placeholder="Doe" label="Last name" />
                    <InputBox onChange={(e) => setEmail(e.target.value)} placeholder="anygmail@gmail.com" label="Email" />
                    <InputBox type="password" onChange={(e) => setPassword(e.target.value)} placeholder="******" label="Password" />

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <div className="mt-3">
                        <Button
                            onClick={handleSignup}
                            label={loading ? "Signing up..." : "Sign up"}
                            disabled={loading}
                        />
                    </div>

                    <BottomWarning label="Already have an account" buttonText="Sign in" to="/signin" />
                </div>
            </div>
        </div>
    );
}
