import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useResponsiveScalars } from "@/hooks/useResponsiveScalars";
import { useTranslation } from "react-i18next";

export function LanguageSwitch() {
  const { theme, setTheme } = useTheme();
  const { textScalar } = useResponsiveScalars(); // we can use iScalar for icon sizing
  const { i18n } = useTranslation();


  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem("lang", lng)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="z-50 ring-0 relative"
      onClick={() => changeLanguage(i18n.language === 'en' ? "ar" : "en")}
      style={{
        fontSize: `${8 * textScalar}px`,
      }}
    >
      {
        i18n.language === 'en' ?
        <h1 className="max-[2500px]:text-sm">AR</h1>
        :
        <h1 className="max-[2500px]:text-sm">EN</h1>
      }
        
    </Button>
  );
}
