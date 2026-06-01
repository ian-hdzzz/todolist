import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { createUser } from "./userApi";

export const loginUser = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<void> => {
  // 1. El backend crea el usuario en Firebase y en la BD
  await createUser({ name, email, password, role: "USER" });
  // 2. Iniciar sesión en el frontend con Firebase
  await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => signOut(auth);
