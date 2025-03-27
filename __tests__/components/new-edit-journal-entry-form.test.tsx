import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewEditJournalEntryForm from "@/components/my-journal/new-edit-journal-entry-form";

describe("NewEditJournalEntryForm", () => {
  describe("Rendering", () => {
    it("renders new entry form correctly", () => {
      render(<NewEditJournalEntryForm editing={false} />);

      expect(screen.getByLabelText("Title")).toBeInTheDocument();
      expect(screen.getByText("Category")).toBeInTheDocument();
      expect(screen.getByTestId("category-tag-icon")).toBeInTheDocument();
      expect(screen.getByLabelText("Your Thoughts")).toBeInTheDocument();
      expect(screen.getByText("Create Entry")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
    });
  });
});
