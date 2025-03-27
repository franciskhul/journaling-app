import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewEditJournalEntryForm from "@/components/my-journal/new-edit-journal-entry-form";

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

  describe("Form Validation", () => {
    it("shows validation errors when submitting empty form", async () => {
      render(<NewEditJournalEntryForm editing={false} />);

      fireEvent.click(screen.getByRole("button", { name: /create entry/i }));

      await waitFor(() => {
        expect(screen.getByText("Title is required")).toBeInTheDocument();
        expect(
          screen.getByText("Please select a category")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Content must be at least 4 characters")
        ).toBeInTheDocument();
      });
    });

    it("validates title length less than 201", async () => {
      render(<NewEditJournalEntryForm editing={false} />);

      const titleInput = screen.getByLabelText("Title");
      await fireEvent.change(titleInput, {
        target: { value: "a".repeat(201) },
      });
      await fireEvent.blur(titleInput);
      await fireEvent.click(
        screen.getByRole("button", { name: /create entry/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText("Title must be less than 200 characters")
        ).toBeInTheDocument();
      });
    });

    it("validates content length", async () => {
      render(<NewEditJournalEntryForm editing={false} />);

      const contentInput = screen.getByLabelText("Your Thoughts");
      await fireEvent.change(contentInput, {
        target: { value: "a".repeat(3) },
      });
      await fireEvent.blur(contentInput);
      await fireEvent.click(
        screen.getByRole("button", { name: /create entry/i })
      );

      expect(
        await screen.findByText("Content must be at least 4 characters")
      ).toBeInTheDocument();

      await fireEvent.change(contentInput, {
        target: { value: "a".repeat(5001) },
      });

      await fireEvent.click(
        screen.getByRole("button", { name: /create entry/i })
      );

      expect(
        await screen.findByText("Content is too long")
      ).toBeInTheDocument();
    });
  });

  describe("Category Selection", () => {
    it("allows selecting a category", async () => {
      render(<NewEditJournalEntryForm editing={false} />);

      const categorySelector = screen.getByLabelText("Category");
      await fireEvent.click(categorySelector);

      await waitFor(() => {
        expect(screen.getByText("Personal")).toBeInTheDocument();
      });

      await fireEvent.click(screen.getByText("Work"));

      await waitFor(() => {
        const categoryButton = screen.getByRole("combobox");
        expect(categoryButton).toHaveTextContent(/work/i);
      });
    });
  });
});
