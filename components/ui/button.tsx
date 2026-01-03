import { cva, type VariantProps } from "class-variance-authority";
import { Pressable, Text } from "react-native";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "flex flex-row items-center justify-center rounded-xl",
  {
    variants: {
      variant: {
        default: "bg-primary",
        secondary: "bg-secondary",
        destructive: "bg-destructive",
        outline: "border border-border bg-transparent",
        ghost: "bg-transparent",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-9 px-4",
        lg: "h-14 px-8",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const buttonTextVariants = cva("font-semibold", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-foreground",
      ghost: "text-foreground",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      lg: "text-lg",
      icon: "text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
}

export function Button({
  children,
  variant,
  size,
  className,
  textClassName,
  onPress,
  disabled,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        buttonVariants({ variant, size }),
        disabled && "opacity-50",
        className
      )}
    >
      {typeof children === "string" ? (
        <Text className={cn(buttonTextVariants({ variant, size }), textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
