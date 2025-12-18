import "./style.css";
import ReactDOM from "react-dom/client";
import App from "./App";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",

  async main(ctx) {
    console.log("[Hober] Content script starting...");

    const ui = await createShadowRootUi(ctx, {
      name: "hober-ui",
      position: "overlay",
      zIndex: 2147483647,
      onMount: (container) => {
        console.log("[Hober] Shadow root mounted, container:", container);
        const app = document.createElement("div");
        app.id = "hober-root";
        container.append(app);

        const root = ReactDOM.createRoot(app);
        root.render(<App />);
        console.log("[Hober] React app rendered");
        return root;
      },
      onRemove: (root) => {
        console.log("[Hober] Unmounting");
        root?.unmount();
      },
    });

    ui.mount();
    console.log("[Hober] UI mounted");
  },
});
