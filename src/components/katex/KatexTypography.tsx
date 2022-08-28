import React, { useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";

interface Props {
  variant?:
    | "body1"
    | "body2"
    | "button"
    | "caption"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "inherit"
    | "overline"
    | "subtitle1"
    | "subtitle2";
  paragraph?: boolean;
}

const KatexTypography: React.FC<Props> = (props) => {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (ref.current) {
      const renderMathInElement = require('katex/contrib/auto-render');
      console.log(renderMathInElement);
      renderMathInElement(ref.current, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\[", right: "\\]", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
        ],
      });
    }
  });
  return (
    <Typography
      ref={ref}
      children={props.children}
      variant={props.variant}
      paragraph={props.paragraph}
    />
  );
};

export default KatexTypography;
