import { Tooltip as PrimeTooltip, TooltipProps } from "primereact/tooltip";

type Props = TooltipProps;

export default function Tooltip({ ...rest }: Props) {
  return <PrimeTooltip {...rest} />;
}
