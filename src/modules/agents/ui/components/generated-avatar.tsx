import React from "react";
import { createAvatar } from "@dicebear/core";
import { identicon, bottts, avataaars, micah } from "@dicebear/collection";

interface GeneratedAvatarProps {
  seed: string;
  size?: number;
  className?: string;
  variant?: "identicon" | "bottts" | "avataaars" | "micah"; // Add more as needed
}

const GeneratedAvatar: React.FC<GeneratedAvatarProps> = ({
  seed,
  size = 64,
  className = "",
  variant = "identicon", // default variant
}) => {
  // Select avatar style based on the variant
  const avatarStyle = React.useMemo(() => {
    switch (variant) {
      case "bottts":
        return bottts;
      case "avataaars":
        return avataaars;
      case "micah":
        return micah;
      case "identicon":
      default:
        return identicon;
    }
  }, [variant]);

  // Generate avatar SVG string
  const avatar = React.useMemo(
    () => createAvatar(avatarStyle, { seed, size }).toString(),
    [avatarStyle, seed, size]
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
