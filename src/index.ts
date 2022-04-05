import "./styles/index.css";

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
  const udemyPage = {
    checkbox: "[data-type='checkbox']",
    checked: "data-checked",
    curriculum: "[data-purpose='curriculum-section-container']",
    lessons: ".unstyled-list",
    lessonProgress: "[data-purpose='progress-toggle-button']",
    panel: "[data-css-toggle-id]",
  };

  function getLessonList(module: HTMLDivElement) {
    const { childNodes } = module.querySelector(
      udemyPage.lessons
    ) as HTMLDivElement;
    return childNodes;
  }

  function getModules() {
    const { childNodes } = document.querySelector(
      udemyPage.curriculum
    ) as HTMLDivElement;
    return childNodes;
  }

  function getModuleData(module: HTMLDivElement) {
    return {
      sectionCheckbox: module.querySelector(
        udemyPage.checkbox
      ) as HTMLSpanElement,
      sectionPanel: module.querySelector(udemyPage.panel) as HTMLDivElement,
    };
  }

  function isModuleOpen(panel: HTMLSpanElement) {
    return panel.getAttribute(udemyPage.checked) === "checked";
  }

  // TODO: Look up error handling for the case no selector exists
  const lessonModules = getModules();

  lessonModules.forEach((module) => {
    const { sectionCheckbox, sectionPanel } = getModuleData(
      <HTMLDivElement>module
    );

    if (!isModuleOpen(sectionCheckbox)) {
      sectionPanel.click();
    }

    const lessonList = getLessonList(
      <HTMLDivElement>module
    ) as NodeListOf<HTMLLIElement>;

    lessonList.forEach((lesson) => {
      const button = lesson.querySelector(
        udemyPage.lessonProgress
      ) as HTMLInputElement;

      if (button.checked) {
        button.click();
      }
    });
  });
}
