import React from "react";

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <div>
        {/* <PublicNavbar /> */}
        <h2>Public Navbar</h2>
      </div>

      <div className="wrapper flex flex-col h-full pb-10 ">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-2 hidden md:block ">
            {/* <SidebarDesktop /> */}
            <h2>Sidebar</h2>
          </div>
          <div className="col-span-2  md:hidden">
            {/* <SidebarMobile /> */}
            <h2>Sidebar Mobile</h2>
          </div>
          <div className="col-span-12 md:col-span-10">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default PublicLayout;
