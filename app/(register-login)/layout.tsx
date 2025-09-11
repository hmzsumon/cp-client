import React from "react";

const RegisterLoginLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <div className="">{children}</div>
    </div>
  );
};

export default RegisterLoginLayout;
