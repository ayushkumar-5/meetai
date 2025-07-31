
import React from "react";
import { createAvatar } from "@dicebear/core";
import { identicon } from "@dicebear/collection"; // Replace with a collection of your choice
// You can import 'avataaars', 'bottts', 'micah', etc. from @dicebear/collection

interface GeneratedAvatarProps {
  seed: string; // Unique identifier for the avatar (username, email, etc)
  size?: number; // Size in px
  className?: string;
}

const GeneratedAvatar: React.FC<GeneratedAvatarProps> = ({
  seed,
  size = 64,
  className = "",
}) => {
  // Generate SVG string based on the seed
  const avatar = React.useMemo(
    () => createAvatar(identicon, { seed, size }).toString(),
    [seed, size]
  );

  return (
    <span
      className={className}
      style={{ display: "inline-block", width: size, height: size }}
      // Render the SVG as inner HTML
      dangerouslySetInnerHTML={{ __html: avatar }}
    />
  );
};

export default GeneratedAvatar;
