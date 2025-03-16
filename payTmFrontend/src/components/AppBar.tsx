import { Logo } from "../Logo/Logo";

export function AppBar() {
    return <div className="shadow h-14 flex justify-between">
        <div className="flex justify-evenly">
            <Logo />
            <div className="text pt-3 text-xl font-extrabold font-sans">
                paytM App
            </div>
        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                Hello
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    U   
                </div>
            </div>
        </div>
    </div >
}