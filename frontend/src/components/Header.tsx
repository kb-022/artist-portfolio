// components/Header.tsx
import { Link } from 'react-router-dom';
import {RouterPath} from "../enums/RouterPath.ts";
import logo from "../../public/logo.avif";



const headerRef = "hover:text-gray-600 transition-colors font-semibold";
export default function Header() {
    return (
        <header className="sticky mx-auto flex max-w-7xl flex-wrap items-center justify-between p-4">
            <Link to={RouterPath.HOME} className="text-xl font-bold tracking-tight flex items-center space-x-3 rtl:space-x-reverse">
                <img src={logo} alt="logo" draggable={false} className="h-10 select-none pointer-events-none"/>
                <span className="self-center whitespace-nowrap text-xl font-semibold text-heading">Chris Asmer</span>
            </Link>
            <nav className="flex gap-6">
                <Link to={RouterPath.ABOUT} className={headerRef}>About</Link>
                <Link to={RouterPath.DIGITAL} className={headerRef}>Digital</Link>
                <Link to={RouterPath.TRADITIONAL} className={headerRef}>Traditional</Link>
                <Link to={RouterPath.CONTACT} className={headerRef}>Contact</Link>
            </nav>
        </header>
    );
}