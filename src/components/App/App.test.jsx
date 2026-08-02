import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App.jsx";
import { ThemeProvider } from "../ThemeContext.jsx";

vi.stubGlobal(
  "Audio",
  class {
    constructor() {
      this.src = "";
    }
    play() {
      return Promise.resolve();
    }
    pause() {}
    cloneNode() {
      return new Audio();
    }
  }
);

describe("App", () => {
  it("renders the loading screen", () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    expect(screen.getByText(/loading the cards/i)).toBeInTheDocument();
  });
});
