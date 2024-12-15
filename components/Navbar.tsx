import Link from "next/link";
import styles from "@styles/nav.module.css"
import { createClient } from "@/utils/supabase/server";

const Navbar = () => {

    const renderAccountDisplay = async () => {
        const supabase = await createClient()

        // Check if a user's logged in
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if(user){
            return (
                <Link href="/Accounts" className = {styles.accountLink}>Account</Link>
            );
        }
        else{
            return(
                <>
                    <Link href="/Accounts/signup" className = {styles.signup}>Sign Up</Link>
                    <Link href="/Accounts/login" className = {styles.login}>Log In</Link>
                </>
                
            );
        }
    }
    return ( 
        <nav>
            <Link href="/" className = {styles.logo}>Utyper</Link>
            <Link href="/" className = {styles.link}>Normal</Link>
            <Link href="/Targeted" className = {styles.link}>Targeted</Link>
            <Link href="/Settings" className = {styles.link}>Settings</Link>
            {renderAccountDisplay()}

        </nav>
    );
}

export default Navbar;