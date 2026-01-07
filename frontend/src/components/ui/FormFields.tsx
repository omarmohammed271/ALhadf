
  /* ================================================= */
  /* Helpers */
  /* ================================================= */

import { Input } from "./input";

  
export function Field({
    label,
    description,
    children,
    full,
    className
  }: {
    label: string;
    description: string;
    children: React.ReactNode;
    full?: boolean;
    className?: string;
  }) {
    return (
      <div className={full ? "md:col-span-2 space-y-2" : "space-y-2"}>
        <label className=" font-medium ">{label}</label>
        <div className={`my-2 w-fit ` + className}>
        {children}
        </div>
        <p className=" text-muted-foreground">{description}</p>
      </div>
    );
  }
  
export function ReadOnlyField({ label }: { label: string }) {
    return (
      <div className="space-y-2">
        <label className="font-medium">{label}</label>
        <Input className="mt-2" disabled placeholder="Derived by system" />
      </div>
    );
  }
