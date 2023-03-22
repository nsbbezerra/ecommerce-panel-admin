import { Avatar as PrimeAvatar, AvatarProps } from "primereact/avatar";

type Props = AvatarProps;

export default function Avatar({ ...rest }: Props) {
  return <PrimeAvatar {...rest} />;
}
