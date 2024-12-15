import Navbar from "./Navbar";

type LayoutProps = {
    children: React.ReactNode;
};
const Layout = ({ children }: LayoutProps) => {
    return ( 
        <div className="content">
            <Navbar/>
            {children}

        </div>
    );
}

export default Layout;