import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CompanyAvatarProps {
  name: string;
  logoSquare?: string;
  className?: string;
}

export function CompanyAvatar({ name, logoSquare, className }: CompanyAvatarProps) {
  // Get initials for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Avatar className={className}>
      {logoSquare && (
        <AvatarImage src={logoSquare} alt={`${name} logo`} />
      )}
      <AvatarFallback className="bg-primary/10">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
