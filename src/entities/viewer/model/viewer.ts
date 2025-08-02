import { useUser } from "@clerk/clerk-react";

export const useViewer = () => {
  const { user, isSignedIn } = useUser();

  return {
    viewer: user,
    isSignedIn,
  };
};
