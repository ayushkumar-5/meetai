
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    // The error is that the native <button> element does not accept a 'variant' prop.
    // If you want to use the 'variant' prop, you should use the imported Button component instead.
    <Button variant="custom">Click me</Button>
  );
}
