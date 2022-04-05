import "./styles/index.css";
import { udemyPage } from "./utils/constants";

let resetProgress = document.getElementById("reset") as HTMLButtonElement;

resetProgress.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const tabId = tab.id as number;

  chrome.scripting.executeScript({
    target: { tabId },
    func: resetUdemyCurriculumProgress,
  });
});

function resetUdemyCurriculumProgress() {
  /**
   * Get all of the individual sections inside of the Course Content pane.
   */
  const sections = document
    .querySelector(udemyPage.courseContent)
    ?.querySelectorAll(udemyPage.section) as NodeListOf<HTMLDivElement>;

  sections?.forEach((section) => {
    /**
     * Check if the individual panel is open/closed.
     */
    const sectionPanel = section.previousSibling as HTMLSpanElement;
    const sectionPanelOpen =
      sectionPanel.getAttribute(udemyPage.checked) === "checked";

    /**
     * If the panel is closed, open it.
     */
    if (!sectionPanelOpen) {
      section.click();
    }

    /**
     * Get the individual lessons inside of each section.
     */
    const lessons = section
      .closest("[data-purpose]")
      ?.querySelector(udemyPage.lessons)
      ?.childNodes as NodeListOf<HTMLLIElement>;

    /**
     * For each lesson, check if the completion button is checked. If it is,
     * un-check it.
     */
    lessons.forEach((lesson) => {
      const completionButton = lesson.querySelector(
        udemyPage.lessonProgress
      ) as HTMLInputElement;

      if (completionButton.checked) {
        completionButton.click();
      }
    });
  });
}
