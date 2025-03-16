import { AppBar } from "../components/AppBar"
import { Balance } from "../components/Balance"
import { Users } from "../components/User"

export const Dashboard = () => {
    return <div>
        <AppBar />
        <div className="m-8">
            <Balance label={"10,000"} />
            <Users />
        </div>
    </div>
}