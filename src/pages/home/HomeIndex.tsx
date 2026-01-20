import { Library } from "lucide-react";
import { Link } from "react-router";

export function Home() {
    return (
        <>
            <header className="m-4 flex flex-col  justify-center gap-4">
                <Link to={"/"} className="self-start text-sm">
                    <h1 className="flex items-center text-slate-700 md:text-4xl gap-1"><Library color="orange" /> <span>Sluk</span></h1>
                    <p className="hidden md:inline-block text-xs text-slate-500">Sule lamido university library.</p>
                </Link>
            </header>
        </>
    )
}
