import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    useEffect(() => {
      const checkSession = async () => {
        const session = await getSession();
        if (!session) {
          router.push("/signin");
        }
      };

      checkSession();
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
