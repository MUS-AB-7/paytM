import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate, NavigateFunction } from "react-router-dom";

// Updated type to include balance
type UserDto = {
  _id: string;
  firstName: string;
  lastName: string;
  balance: number; // new
};

type UserProps = {
  user: UserDto;
};

export const Users = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [filter, setFilter] = useState<string>("");
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    axios
      .get<{ users: UserDto[] }>(
        `http://localhost:3000/api/v1/user/bulk?filter=${encodeURIComponent(filter)}`
      )
      .then((response) => setUsers(response.data.users || []))
      .catch(() => setUsers([]));
  }, [filter]);

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          onChange={(e) => setFilter(e.target.value)}
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        />
      </div>
      <div>
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          users.map((user) => <User key={user._id} user={user} navigate={navigate} />)
        )}
      </div>
    </>
  );
};

function User({ user, navigate }: UserProps & { navigate: NavigateFunction }) {
  return (
    <div className="flex justify-between my-2 p-2 border rounded">
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center items-center mr-2">
            {user.firstName[0].toUpperCase()}
          </div>
          <div>
            {user.firstName} {user.lastName}
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Balance: ₹{user.balance} {/* show actual balance */}
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <Button
          onClick={() =>
            navigate(`/send?id=${user._id}&name=${encodeURIComponent(user.firstName)}`)
          }
          label="Send Money"
        />
      </div>
    </div>
  );
}
