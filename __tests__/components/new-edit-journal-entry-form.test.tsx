import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewEditJournalEntryForm from "@/components/my-journal/new-edit-journal-entry-form";
// import { Plus, Edit } from "lucide-react";

const mockJournalEntry = {
  title: "Existing Entry",
  category: "2", // Work
  content: "This is an existing journal entry content",
};

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

    it("renders edit form correctly with existing values", () => {
      render(
        <NewEditJournalEntryForm
          editing={true}
          journalEntry={mockJournalEntry}
        />
      );

      expect(
        screen.getByDisplayValue(mockJournalEntry.title)
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(mockJournalEntry.content)
      ).toBeInTheDocument();
      expect(screen.getByText("Save Changes")).toBeInTheDocument();
    });
  });
});
