// next-themes モジュールが公式に型を提供していないため、手動で定義する型ファイル
declare module "next-themes" {
    import { ComponentType } from "react";
  
    // ThemeProvider に渡せる props（属性）の型を定義
    interface ThemeProviderProps {
      attribute?: string;                   
      defaultTheme?: string;                 
      enableSystem?: boolean;                
      disableTransitionOnChange?: boolean;  
      children?: React.ReactNode;            
    }
  
    // useTheme フックの戻り値の型を定義
    interface UseThemeReturn {
      theme: string | undefined;
      setTheme: (theme: string) => void;
      resolvedTheme: string | undefined;
      themes: string[];
      forcedTheme: string | undefined;
      systemTheme: 'dark' | 'light' | undefined;
    }

    // ThemeProvider をその型でエクスポート
    export const ThemeProvider: ComponentType<ThemeProviderProps>;

    // useTheme フックをエクスポート
    export function useTheme(): UseThemeReturn;

  }
  