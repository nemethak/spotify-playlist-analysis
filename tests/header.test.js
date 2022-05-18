import { Header } from "../components/header";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("Header", () => {
    it("renders the correct version for the index page", () => {
      render(<Header currentPage="index" userId="test"/>);
      expect(screen.getByTestId("title")).toBeInTheDocument();
      expect(screen.getByTestId("dropdown")).toBeInTheDocument();
      expect(screen.getByTestId("profile-image")).toBeInTheDocument();
      expect(screen.getByTestId("history")).toBeInTheDocument();
      expect(screen.getByTestId("history")).toHaveAttribute('href', '/history/test')
      expect(screen.getByTestId("sign-out")).toBeInTheDocument();
    });
    it("renders the correct version for the history page", () => {
      render(<Header currentPage="history"/>);
      expect(screen.getByTestId("title")).toBeInTheDocument();
      expect(screen.getByTestId("dropdown")).toBeInTheDocument();
      expect(screen.getByTestId("profile-image")).toBeInTheDocument();
      expect(screen.getByTestId("index")).toBeInTheDocument();
      expect(screen.getByTestId("sign-out")).toBeInTheDocument();
    });
  });