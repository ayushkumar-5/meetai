import React from "react";
import { createAvatar } from "@dicebear/core";
import {
  identicon,
  bottts,
  micah,
  avataaars,
} from "@dicebear/collection"; // Updated: using 'bottts'

interface GeneratedAvatarProps {
  seed: string;
  size?: number;
  className?: string;
  variant?: "identicon" | "bottts" | "micah" | "avataaars"; // Updated variant type
}

const GeneratedAvatar: React.FC<GeneratedAvatarProps> = ({
  seed,
  size = 64,
  className = "",
  variant = "identicon",
}) => {
  // Select the correct style based on variant
  const style = {
    identicon,
    bottts,
    micah,
    avataaars,
  }[variant];

  // Generate SVG string
  const avatar = React.useMemo(
    () => createAvatar(style, { seed, size }).toString(),
    [seed, size, style]
  );

  return (
    <span
      className={className}
      style={{ display: "inline-block", width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: avatar }}
    />
  );
};

export default GeneratedAvatar;
