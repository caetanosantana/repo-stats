import { LucideIcon } from 'lucide-react';
import { AvatarUsuario } from "./AvatarUsuario";

interface ListaUsersProps {
  titulo: string;
  usuarios: {
    user: {
      id: number;
      name?: string | null;
      login: string;
      followers: number;
      email?: string | null; 
    };
    starred_at: string;
  }[];
  icon: LucideIcon; 
}

export function ListaUsers({ titulo, usuarios, icon: Icon }: ListaUsersProps) {
  return (
    <div className="space-y-2 grid justify-items-center">
        <div className='flex gap-2 items-center'>
          <Icon className="h-6 w-6"/>
          <h1 className='font-bold text-xl'>{titulo}</h1>
        </div>
        <ul className="space-y-2">
          {usuarios.map(({ user }) => (
            <li key={user.id} className="flex items-center">
            <AvatarUsuario
                id={user.id}
                name={user.name || 'Usuário sem nome'}
                login={user.login}
                followers={user.followers}
                email={user.email || 'Usuário sem email'}
              />
          </li>
          ))}
      </ul>
    </div>
  )
}