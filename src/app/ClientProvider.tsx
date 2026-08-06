"use client";
import { useEffect } from "react";
import { useDispatch, Provider } from "react-redux";
import { setDisplayName, setId, setPictureUrl } from "@/stores/userSlice";
import store from "@/stores/store";

interface ClientProviderProps {
  id: string;
  displayName: string;
  pictureUrl: string;
  children: React.ReactNode;
}

function UserProvider({
  id,
  displayName,
  pictureUrl,
  children,
}: ClientProviderProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setId(id));
    dispatch(setDisplayName(displayName));
    dispatch(setPictureUrl(pictureUrl));
  }, [id, displayName, pictureUrl, dispatch]);

  return <>{children}</>;
}

export default function ClientProvider({
  id,
  displayName,
  pictureUrl,
  children,
}: ClientProviderProps) {
  return (
    <Provider store={store}>
      <UserProvider id={id} displayName={displayName} pictureUrl={pictureUrl}>
        {children}
      </UserProvider>
    </Provider>
  );
}
