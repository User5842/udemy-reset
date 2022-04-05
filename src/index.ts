import "./styles/index.css";
import { udemyPage } from "./utils/constants";

const resetProgress = document.getElementById("reset") as HTMLButtonElement;

resetProgress.addEventListener("click", () => {
  chrome.tabs
    .query({ active: true, currentWindow: true })
    .then(([tab]) => tab.id as number)
    .then((tabId) => {
      chrome.scripting
        .executeScript({
          target: { tabId },
          func: resetUdemyCurriculumProgress,
        })
        .catch((error) => {
          throw error;
        });
    })
    .catch(console.error);
});

function resetUdemyCurriculumProgress() {
  /**
   * Get all of the individual sections inside of the Course Content pane.
   */
  let sections;

  try {
    sections = document
      .querySelector(udemyPage.courseContent)
      ?.querySelectorAll(udemyPage.section) as NodeListOf<HTMLDivElement>;
  } catch {
    throw new Error("Did you make sure to open the course content panel?");
  }

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
