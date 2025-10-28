import Typography from "@mui/material/Typography";

interface ITextProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  mb?: number;
  text?: string;
}

export default function Text({ variant, mb, text }: ITextProps) {
  return (
    <Typography
      variant={variant}
      sx={{ textAlign: "center", mb: mb, color: "inherit" }}
    >
      {text}
    </Typography>
  );
}
