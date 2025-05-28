import AdminHeader from '@components/layout/Header/AdminHeader';

const Layout = ({children}: React.PropsWithChildren) => {
  return (
    <div className="flex h-screen w-full flex-col text-white">
      <AdminHeader />
      {children}
    </div>
  );
};

export default Layout;
