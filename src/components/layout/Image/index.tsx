import { Image as PrimeImage, ImageProps } from "primereact/image";

export default function Image({ ...rest }: ImageProps) {
  return <PrimeImage {...rest} />;
}
