// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "node:path";
import AutoImport from "unplugin-auto-import/vite";

/**
 * Modo de deploy:
 * - Se DEPLOY_TARGET === 'infinity'  => base = '/'   (para domínio próprio / InfinityFree)
 * - Caso contrário (padrão)         => base = process.env.BASE_PATH || '/JokaTech/' (para GitHub Pages)
 *
 * Você pode também usar BASE_PATH direto (ex.: em CI) para forçar um base custom.
 */
const deployTarget = process.env.DEPLOY_TARGET || "";
const base =
  deployTarget === "infinity" ? "/" : process.env.BASE_PATH || "/JokaTech/";

const isPreview = !!process.env.IS_PREVIEW;

export default defineConfig({
  // expõe constantes para o código (útil se o app precisa conhecer o base em runtime)
  define: {
    __BASE_PATH__: JSON.stringify(base),
    __IS_PREVIEW__: JSON.stringify(isPreview),
    __READDY_PROJECT_ID__: JSON.stringify(process.env.PROJECT_ID || ""),
    __READDY_VERSION_ID__: JSON.stringify(process.env.VERSION_ID || ""),
    __READDY_AI_DOMAIN__: JSON.stringify(process.env.READDY_AI_DOMAIN || ""),
  },

  plugins: [
    react(),
    AutoImport({
      imports: [
        {
          react: [
            "React",
            "useState",
            "useEffect",
            "useContext",
            "useReducer",
            "useCallback",
            "useMemo",
            "useRef",
            "useImperativeHandle",
            "useLayoutEffect",
            "useDebugValue",
            "useDeferredValue",
            "useId",
            "useInsertionEffect",
            "useSyncExternalStore",
            "useTransition",
            "startTransition",
            "lazy",
            "memo",
            "forwardRef",
            "createContext",
            "createElement",
            "cloneElement",
            "isValidElement",
          ],
        },
        {
          "react-router-dom": [
            "useNavigate",
            "useLocation",
            "useParams",
            "useSearchParams",
            "Link",
            "NavLink",
            "Navigate",
            "Outlet",
          ],
        },
        {
          "react-i18next": ["useTranslation", "Trans"],
        },
      ],
      dts: true,
    }),
  ],

  // importante: base ajustado dinamicamente acima
  base,

  build: {
    // sourcemap útil para debug; pode desligar em produção (false)
    sourcemap: true,
    // saída (você pode trocar para "dist" se preferir)
    outDir: "out",
    // mantém assets dentro de "assets" (padrão do Vite) — útil para subir ao htdocs
    assetsDir: "assets",
    // se quiser controlar chunking/hashing adicione opções aqui
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 3000,
    host: "0.0.0.0",
  },
});
