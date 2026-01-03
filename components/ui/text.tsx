import { Text as RNText } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const textVariants = cva("text-foreground", {
  variants: {
    variant: {
      default: "",
      h1: "text-4xl font-bold",
      h2: "text-3xl font-bold",
      h3: "text-2xl font-semibold",
      h4: "text-xl font-semibold",
      large: "text-lg",
      small: "text-sm",
      muted: "text-muted text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface TextProps extends VariantProps<typeof textVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Text({ children, variant, className }: TextProps) {
  return (
    <RNText className={cn(textVariants({ variant }), className)}>
      {children}
    </RNText>
  );
}
