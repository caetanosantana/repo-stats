// components/shared/UserAvatar.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "./ui/card";

interface AvatarUsuarioProps {
  id: number;
  name?: string;
  login: string;
  followers: number;
  email: string;
}

export function AvatarUsuario({ id, name, login, followers, email }: AvatarUsuarioProps) {
  return (
    <Card className="w-64 p-4">
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src={`https://avatars.githubusercontent.com/u/${id}?v=4`} alt={name || login} />
        <AvatarFallback>{(name || login).charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{name || login}</p>
        <p className="text-sm text-gray-500">{followers || 0} seguidores</p>
        <p className="text-xs text-gray-400">Email: {email ||'sem email'}</p>
      </div>
    </div>
    </Card>
  );
}
