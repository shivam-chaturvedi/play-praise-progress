import { Moon, Sun, Palette, Waves, Sunset, Trees } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, customTheme, setTheme, setCustomTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-background">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background border-border">
        <div className="px-2 py-1.5 text-sm font-semibold">Theme Mode</div>
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={theme === "light" ? "bg-accent" : ""}
        >
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={theme === "dark" ? "bg-accent" : ""}
        >
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className={theme === "system" ? "bg-accent" : ""}
        >
          <Palette className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <div className="px-2 py-1.5 text-sm font-semibold">Color Theme</div>
        <DropdownMenuItem 
          onClick={() => setCustomTheme("default")}
          className={customTheme === "default" ? "bg-accent" : ""}
        >
          <div className="mr-2 h-4 w-4 rounded-full bg-primary" />
          Default (Electric Blue)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setCustomTheme("ocean")}
          className={customTheme === "ocean" ? "bg-accent" : ""}
        >
          <Waves className="mr-2 h-4 w-4 text-blue-500" />
          Ocean
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setCustomTheme("sunset")}
          className={customTheme === "sunset" ? "bg-accent" : ""}
        >
          <Sunset className="mr-2 h-4 w-4 text-orange-500" />
          Sunset
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setCustomTheme("forest")}
          className={customTheme === "forest" ? "bg-accent" : ""}
        >
          <Trees className="mr-2 h-4 w-4 text-green-500" />
          Forest
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}