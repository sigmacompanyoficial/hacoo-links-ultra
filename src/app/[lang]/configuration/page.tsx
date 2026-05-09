import ProfileSettings from "../profile/ProfileSettings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración — Hacoo Ultra",
  description: "Ajusta tus preferencias, cambia tu correo o contraseña y gestiona tu cuenta en Hacoo Ultra.",
};

export default function ConfigurationPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#080808]">
      <ProfileSettings />
    </main>
  );
}
