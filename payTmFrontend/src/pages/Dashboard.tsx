import { useEffect, useState } from "react";
import { AppBar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/User";
import axios from "axios";

export const Dashboard = () => {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:3000/api/v1/account/balance", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => setBalance(res.data.balance))
      .catch((err) => {
        console.error("Error fetching balance:", err);
        setBalance(0);
      });
  }, []);

  return (
    <div>
      <AppBar />
      <div className="m-8">
        <Balance label={balance !== null ? balance.toString() : "Loading..."} />
        <Users />
      </div>
    </div>
  );
};
