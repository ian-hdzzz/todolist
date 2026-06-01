// Slide 25 — Patrón de servicio: el componente no sabe nada de Firebase
// Slide 26 — Tipado con TypeScript

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

interface LoginDto {
  email: string;
  password: string;
}

export const login = async (data: LoginDto) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );
  return userCredential.user;
};
