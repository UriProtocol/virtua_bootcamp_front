
const Layout = ({ children }: {children: React.ReactNode}) => {
    return (
        <div>
            <div className="text-gray-900 antialiased">
                    {children}
            </div>
        </div>
    )
}

export default Layout
