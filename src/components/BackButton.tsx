import type { ComponentProps } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function BackButton({ "aria-label": ariaLabel = "Go back", ...props }: ComponentProps<"button">) {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={ariaLabel}
      onClick={() => navigate(-1)}
      {...props}
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
}

export default BackButton;
